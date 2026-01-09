/* =========================
  ResumeFinal - FINAL JS
  - Full single-file module
  - Loads data, displays CV, shows modal preview (scrollable)
  - Converts profile image to embedded DataURL so html2canvas/html2pdf includes it (CORS-safe if possible)
  - Creates high-quality PDF, uploads to Firebase Storage at:
      ResumePdf/Portfolio/{CNIC}/Resume-Cv.pdf
  - Checks paymentStatus before download
  - Auto-downloads PDF (no extra popup)
  - Keeps all your original DB paths and structure
  - Drop this file in your page (keep your HTML the same)
=========================*/

/*  IMPORTANT NOTES (read if profile image still missing in PDF)
  - If the Firebase Storage bucket does not have CORS configured, converting remote images may fail.
    The easiest fix (server side) is to configure bucket CORS using gsutil (one command).
    I include client-side fallbacks but bucket CORS is the robust fix.
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getDatabase, ref as dbRef, child, get, update } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";

/* ---------------------------
   Firebase config (keep as-is)
----------------------------*/
const firebaseConfig = {
  apiKey: "AIzaSyCmL8qcjg4S6NeY3erraq_XhlDJ7Ek2s_E",
  authDomain: "palestine-web.firebaseapp.com",
  databaseURL: "https://palestine-web-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "palestine-web",
  storageBucket: "palestine-web.appspot.com",
  messagingSenderId: "35190212487",
  appId: "1:35190212487:web:0a699bb1fa7b1a49113522",
  measurementId: "G-8TE04Z9ZFW"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

/* ---------------------------
   DOM elements (your HTML)
----------------------------*/
const cvSheet = document.getElementById('cv');                 // main CV element
const profileImage = document.getElementById('profileImage');  // <img> in sidebar
const sidebarName = document.getElementById('sidebarName');
const sidebarRole = document.getElementById('sidebarRole');
const skillListEl = document.getElementById('skillList');
const langListEl = document.getElementById('langList');
const hobbyListEl = document.getElementById('hobbyList');
const personalListEl = document.getElementById('personalList');
const fullNameEl = document.getElementById('fullName');
const resumeprofessionEl = document.getElementById('Resumeprofession');
const aboutpera = document.getElementById('Aboutpera');
const educationList = document.getElementById('educationList');
const experienceList = document.getElementById('experienceList');
const projectsRow = document.getElementById('projectsRow');
const referencesRow = document.getElementById('referencesRow');

const overlay = document.getElementById('overlay');
const displayDownloadBtn = document.getElementById('displayDownloadBtn');
const displayBtn = document.getElementById('displayBtn');
const downloadBtn = document.getElementById('downloadBtn');
const closeModal = document.getElementById('closeModal');
const modalViewer = document.getElementById('modalViewer');

/* ---------------------------
   Limits & constants
----------------------------*/
const LIMITS = { education:3, experience:4, skills:10, languages:10, hobbies:10, projects:3, references:2 };
const CV_PAGE_PX = { width: 794, height: 1123 }; // used for jsPDF/html2pdf sizing
let CNIC = localStorage.getItem('Cnic') || prompt('Enter CNIC:');
if(!CNIC) CNIC = 'unknown';
localStorage.setItem('Cnic', CNIC);

/* ---------------------------
   Helpers
----------------------------*/
function safeText(v){ return (v===undefined||v===null||v==='')? '' : String(v).trim(); }
function mapHobbyIcon(h){ const k=(h||'').toLowerCase(); if(k.includes('travel'))return '✈️';if(k.includes('photo'))return '📸';if(k.includes('music'))return '🎧';if(k.includes('game'))return '🎮';if(k.includes('read'))return '📚';if(k.includes('fit'))return '🏋️'; return '⭐'; }

/* ---------------------------
   Fetch user data
----------------------------*/
async function fetchUser(){
  const root = dbRef(db);
  const snap = await get(child(root, `resContainer9/${CNIC}`));
  return snap.exists() ? snap.val() : {};
}

/* ---------------------------
   Render function (fast)
   - keeps structure intact
----------------------------*/
function render(data){
  const personal = data.Personal || {};
  const imageUrl = safeText(personal.ImageUrl) || '/assets/default-profile.png';

  // Set image src quickly (we'll convert to dataURL at PDF time)
  profileImage.src = imageUrl;
  profileImage.alt = safeText(personal.Name) || 'Profile';

  sidebarName.textContent = safeText(personal.Name) || safeText(personal.Fname) || '';
  fullNameEl.textContent = safeText(personal.Name)||'';
  resumeprofessionEl.textContent = safeText(personal.Resumeprofession)||'';
  aboutpera.textContent = safeText(personal.Aboutpera)||'';
  // Personal list
  personalListEl.innerHTML = '';
  [['Father',personal.Fname],['CNIC',personal.Cnic],['Phone',personal.Phone],['Bsnumber',personal.Bsnumber],['Email',personal.Email],['Address',personal.Caddres]]
    .forEach(([label, val])=>{
      if(safeText(val)) personalListEl.insertAdjacentHTML('beforeend', `<div class="personal-item"><strong style="min-width:70px">${label}:</strong><span>${safeText(val)}</span></div>`);
  });

  // Skills
  skillListEl.innerHTML = '';
  Object.values(data.Skills || {}).slice(0, LIMITS.skills).forEach(s=>{
    const name = (typeof s === 'string')? s : (s.name || '');
    const pct = s.level || s.percent || '0%';
    skillListEl.insertAdjacentHTML('beforeend', `<div class="skill-row"><div class="skill-meta"><div>${name}</div><div>${pct}</div></div><div class="skill-bar-wrap"><div class="skill-bar" style="width:${pct}"></div></div></div>`);
  });

  // Languages (using Paddres as you used previously)
  langListEl.innerHTML = '';
  (safeText(personal.Paddres)||'').split(',').map(x=>x.trim()).filter(Boolean).slice(0,LIMITS.languages).forEach(l=>{
    langListEl.insertAdjacentHTML('beforeend', `<div class="chip">${l}</div>`);
  });

  // Hobbies
  hobbyListEl.innerHTML = '';
  (safeText(personal.Qual)||'').split(',').map(x=>x.trim()).filter(Boolean).slice(0,LIMITS.hobbies).forEach(h=>{
    hobbyListEl.insertAdjacentHTML('beforeend', `<div class="chip">${mapHobbyIcon(h)} ${h}</div>`);
  });

  // Education
  educationList.innerHTML = '';
  Object.values(data.Education || {}).filter(e=>e && (e.Name || e.Degree)).slice(0, LIMITS.education).forEach(ed=>{
    const c = document.createElement('div'); c.className = 'item';
    if(ed.Startyear || ed.Endyear) c.insertAdjacentHTML('beforeend', `<div class="line">${ed.Startyear||''}${ed.Startyear||ed.Endyear?' - ':''}${ed.Endyear||''}</div>`);
    ['Name','Degree','Field','Subfield','Gpa'].forEach(f => { if(ed[f]) c.insertAdjacentHTML('beforeend', `<div class="line">${f==='Gpa' ? 'GPA: '+ed[f] : ed[f]}</div>`); });
    educationList.appendChild(c);
  });

  // Experience
  experienceList.innerHTML = '';
  const expData = Array.isArray(data.Experience) ? data.Experience : Object.values(data.Experience || {});
  expData.slice(0, LIMITS.experience).forEach(ex=>{
    const c = document.createElement('div'); c.className = 'item';
    if(ex.durationNumber || ex.durationUnit) c.insertAdjacentHTML('beforeend', `<div class="line">${ex.durationNumber||''}${ex.durationNumber||ex.durationUnit?' - ':''}${ex.durationUnit||''}</div>`);
    ['organizationName','organizationPosition','Department','details'].forEach(f => { if(ex[f]) c.insertAdjacentHTML('beforeend', `<div class="${f==='details'?'sub':'line'}">${ex[f]}</div>`); });
    experienceList.appendChild(c);
  });

  // Projects
  projectsRow.innerHTML = '';
  const projects = Array.isArray(data.Project) ? data.Project : Object.values(data.Project || {});
  projects.slice(0, LIMITS.projects).forEach(p=>{
    const b = document.createElement('div'); b.className = 'col-box';
    b.innerHTML = `<div style="font-weight:700">${safeText(p.category)||''}</div><div>${safeText(p.projectName)||''}</div>${p.projectUrl?`<div style="margin-top:6px;font-size:10px"><a href="${p.projectUrl}" target="_blank">${p.projectUrl}</a></div>`:''}`;
    projectsRow.appendChild(b);
  });
  while(projectsRow.children.length < 2){
    const filler = document.createElement('div'); filler.className = 'col-box'; filler.style.visibility = 'hidden';
    projectsRow.appendChild(filler);
  }

  // References
  referencesRow.innerHTML = '';
  const refs = [];
  if(data.JobReference){
    if(data.JobReference.Reference1) refs.push(data.JobReference.Reference1);
    if(data.JobReference.Reference2) refs.push(data.JobReference.Reference2);
  }
  refs.slice(0, LIMITS.references).forEach(r=>{
    const b = document.createElement('div'); b.className = 'col-box';
    b.innerHTML = `<div style="font-weight:700">${safeText(r.Name)||''}</div><div class="sub">${safeText(r.Post)||''}</div><div style="margin-top:6px;font-size:11px">${safeText(r.PhoneNumber)||''}${r.Email?' • '+safeText(r.Email):''}</div>`;
    referencesRow.appendChild(b);
  });
  while(referencesRow.children.length < 2){
    const filler = document.createElement('div'); filler.className = 'col-box'; filler.style.visibility = 'hidden';
    referencesRow.appendChild(filler);
  }

  // animate skill bars
  requestAnimationFrame(()=>document.querySelectorAll('.skill-bar').forEach(b=>{
    const w = b.style.width; b.style.width = '0%';
    setTimeout(()=>{ b.style.width = w; }, 60);
  }));
}

/* ---------------------------
   Wait for images to load (generic)
   Returns when all <img> inside container have loaded or errored
----------------------------*/
function waitForImages(container){
  const imgs = Array.from(container.querySelectorAll('img'));
  return Promise.all(imgs.map(img=>{
    if(img.complete && img.naturalWidth !== 0) return Promise.resolve();
    return new Promise((resolve) => { img.onload = img.onerror = () => resolve(); });
  }));
}

/* ---------------------------
   Convert given image element remote src -> embedded dataURL
   This helps html2canvas include the image even when bucket CORS is strict,
   by drawing the image to an offscreen canvas after loading.
   Returns the dataURL (or original src on failure).
----------------------------*/
async function convertImgToDataURL(imgEl, timeoutMs = 7000){
  const src = imgEl.src || '';
  if(!src) return src;

  // If already data URL, return
  if(src.startsWith('data:')) return src;

  // Attempt 1: set crossOrigin Anonymous and load -> draw to canvas
  try {
    // create a temporary image with crossOrigin
    const tempImg = new Image();
    tempImg.crossOrigin = 'Anonymous';
    const loadPromise = new Promise((resolve, reject) => {
      let done = false;
      const t = setTimeout(()=>{ if(!done){ done=true; reject(new Error('img load timeout')); } }, timeoutMs);
      tempImg.onload = ()=>{ if(done) return; done=true; clearTimeout(t); resolve(); };
      tempImg.onerror = ()=>{ if(done) return; done=true; clearTimeout(t); reject(new Error('img load error')); };
    });
    tempImg.src = src;
    await loadPromise;

    // draw to canvas
    const canvas = document.createElement('canvas');
    canvas.width = tempImg.naturalWidth || tempImg.width || CV_PAGE_PX.width;
    canvas.height = tempImg.naturalHeight || tempImg.height || canvas.width;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(tempImg, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    return dataUrl;
  } catch (err) {
    console.warn('convertImgToDataURL attempt1 failed:', err);
  }

  // Attempt 2: fetch blob and read as dataURL (might still be blocked by CORS)
  try {
    const controller = new AbortController();
    const id = setTimeout(()=>controller.abort(), timeoutMs);
    const res = await fetch(src, { method:'GET', mode:'cors', signal: controller.signal });
    clearTimeout(id);
    if(!res.ok) throw new Error('fetch failed status '+res.status);
    const blob = await res.blob();
    // read blob as dataURL
    const reader = new FileReader();
    const dataUrl = await new Promise((resolve, reject) => {
      reader.onload = ()=>resolve(reader.result);
      reader.onerror = ()=>reject(new Error('FileReader error'));
      reader.readAsDataURL(blob);
    });
    return dataUrl;
  } catch (err) {
    console.warn('convertImgToDataURL attempt2 failed:', err);
  }

  // fallback: return original src (html2canvas may fail if it's cross-origin)
  return src;
}

/* ---------------------------
   Create PDF, upload to Storage, return download URL
   - embeds profile image as dataURL before rendering to ensure inclusion
   - high scale to keep text crisp
----------------------------*/
async function createAndUploadPdf(){
  // 1) Ensure profile image is converted to dataURL if possible
  try {
    if(profileImage && profileImage.src){
      const dataUrl = await convertImgToDataURL(profileImage);
      // Replace src with dataUrl for rendering if conversion succeeded
      if(dataUrl && dataUrl.startsWith('data:')) {
        profileImage.dataset.originalSrc = profileImage.src;
        profileImage.src = dataUrl;
      } else {
        // keep original if conversion not possible
        console.warn('Image conversion returned non-data URL, keeping original src.');
      }
    }
  } catch(e){ console.warn('Image conversion error', e); }

  // 2) Wait for all images to load (including replaced dataURL)
  await waitForImages(cvSheet);

  // 3) PDF options - high quality
  const opt = {
    margin: 0,
    filename: 'Resume-Cv.pdf',
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { scale: 3, useCORS: true, scrollY: 0, windowHeight: cvSheet.scrollHeight },
    jsPDF: { unit: 'px', format: [CV_PAGE_PX.width, CV_PAGE_PX.height], orientation: 'portrait' }
  };

  // 4) Generate blob
  const pdfBlob = await html2pdf().set(opt).from(cvSheet).outputPdf('blob');

  // 5) Upload to Firebase Storage
  const storagePath = `ResumePdf/Portfolio/${CNIC}/Resume-Cv.pdf`;
  const fileRef = storageRef(storage, storagePath);
  await uploadBytes(fileRef, pdfBlob);

  // 6) Get downloadable URL
  const downloadURL = await getDownloadURL(fileRef);

  // 7) Save link to DB under resContainer9/{CNIC}/PDF (so your app can reuse)
  const rootRef = dbRef(db);
  const updatePath = {};
  updatePath[`resContainer9/${CNIC}/PDF`] = downloadURL;
  try { await update(rootRef, updatePath); } catch(e){ console.warn('Failed to update DB with PDF link', e); }

  // 8) Restore original profileImage.src if we changed it (clean up)
  if(profileImage && profileImage.dataset && profileImage.dataset.originalSrc){
    profileImage.src = profileImage.dataset.originalSrc;
    delete profileImage.dataset.originalSrc;
  }

  return downloadURL;
}

/* ---------------------------
   Download flow with payment check
   - checks resContainer9/{CNIC}/Access.paymentStatus === 'Verified'
   - if not verified -> redirect to payment page
   - if verified -> generate/upload PDF (if not already) and trigger download without extra popup
----------------------------*/
async function downloadFlow(){
  try {
    // 1) Payment status
    const root = dbRef(db);
    const accessSnap = await get(child(root, `resContainer9/${CNIC}/Access`));
    const status = accessSnap.exists() ? (accessSnap.val()?.paymentStatus || accessSnap.val()?.PaymentStatus || 'pending') : 'pending';
    if(status !== 'Verified'){
      // redirect to payment
      window.location.href = '/personal-portfolio-html-template/Login/payment.html';
      return;
    }

    // 2) Check if PDF already exists in DB
    const pdfSnap = await get(child(root, `resContainer9/${CNIC}/PDF`));
    let url = pdfSnap.exists() ? pdfSnap.val() : null;

    // 3) If no url saved, create/upload PDF
    if(!url){
      url = await createAndUploadPdf();
    }

    // 4) Trigger automatic download (open in new tab or download link)
    // We prefer to use a temporary blob link so that users get the immediate PDF we just created
    try {
      // try to fetch the URL and create blob link to force download
      const resp = await fetch(url, { mode: 'cors' });
      if(resp.ok){
        const blob = await resp.blob();
        const tempUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = tempUrl;
        a.download = `Resume-Cv-${CNIC}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(tempUrl);
        return;
      }
    } catch(e){
      // fallback to direct open
      console.warn('Could not fetch uploaded PDF blob, falling back to direct link', e);
    }

    // fallback: open the downloadURL in new tab (user can save)
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.download = `Resume-Cv-${CNIC}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();

  } catch (err) {
    console.error('Download flow failed', err);
    alert('Failed to generate/download PDF. Check console.');
  }
}

/* ---------------------------
   Modal display (clone) — scrollable panel
   - clone CV into modalViewer, ensure images are copied
----------------------------*/
displayDownloadBtn.addEventListener('click', ()=> {
  overlay.style.display = 'block';
});

closeModal.addEventListener('click', ()=> {
  overlay.style.display = 'none';
  modalViewer.style.display = 'none';
  modalViewer.innerHTML = '';
});

displayBtn.addEventListener('click', async () => {
  try {
    modalViewer.innerHTML = '';
    const clone = cvSheet.cloneNode(true);

    // copy profile image src explicitly (clone sometimes loses current src)
    const orig = cvSheet.querySelector('#profileImage');
    const cloneImg = clone.querySelector('#profileImage');
    if(orig && cloneImg) cloneImg.src = orig.src;

    // style to fit inside modal
    clone.style.width = '100%';
    clone.style.height = 'auto';
    clone.style.transform = 'scale(0.85)';
    clone.style.transformOrigin = 'top center';
    clone.style.margin = '0 auto 20px auto';

    modalViewer.appendChild(clone);
    await waitForImages(clone);

    modalViewer.style.display = 'block';
    overlay.style.display = 'block';
  } catch (e) {
    console.error('Error showing modal preview', e);
    alert('Preview failed. Check console.');
  }
});

/* ---------------------------
   Download button handler
----------------------------*/
downloadBtn.addEventListener('click', async () => {
  await downloadFlow();
});

/* ---------------------------
   Initialize: load data & render
----------------------------*/
(async function init(){
  try {
    const data = await fetchUser();
    render(data);
  } catch (e){
    console.error('Failed to load CV data', e);
  }
})();
