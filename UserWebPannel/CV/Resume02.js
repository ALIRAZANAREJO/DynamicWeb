// ResumeFinal.js
import { initializeApp } from "https://wwwimg.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";

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

// Elements
const cvSheet = document.getElementById('cv');
const profileImage = document.getElementById('profileImage');
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
const modalViewer = document.getElementById('modalViewer');
const displayDownloadBtn = document.getElementById('displayDownloadBtn');
const displayBtn = document.getElementById('displayBtn');
const downloadBtn = document.getElementById('downloadBtn');
const closeModal = document.getElementById('closeModal');

// Limits
const LIMITS = { education:5, experience:5, skills:10, languages:10, hobbies:10, projects:3, references:2 };

// CNIC
let CNIC = localStorage.getItem('Cnic') || prompt('Enter CNIC:');
if(!CNIC) CNIC='unknown';
localStorage.setItem('Cnic', CNIC);

// Helpers
function safeText(v){ return (v===undefined||v===null||v==='')? '' : String(v).trim(); }
function mapHobbyIcon(h){ const k=(h||'').toLowerCase(); if(k.includes('travel'))return '✈️';if(k.includes('photo'))return '📸';if(k.includes('music'))return '🎧';if(k.includes('game'))return '🎮';if(k.includes('read'))return '📚';if(k.includes('fit'))return '🏋️'; return '⭐'; }

// Fetch user data
async function fetchUser(){ 
  const dbRef = ref(db); 
  const snap = await get(child(dbRef, `resContainer9/${CNIC}`)); 
  return snap.exists()? snap.val() : {}; 
}

// Render CV
function render(data){
  const personal = data.Personal || {};
  const imageUrl = safeText(personal.ImageUrl) || '/assets/default-profile.png';
  profileImage.src = imageUrl;
  fullNameEl.textContent = safeText(personal.Name)||'';
  resumeprofessionEl.textContent = safeText(personal.Resumeprofession)||'';
  aboutpera.textContent = safeText(personal.Aboutpera)||'';

  personalListEl.innerHTML = '';
  [['Father',personal.Fname],['CNIC',personal.Cnic],['Phone',personal.Phone],['Bsnumber',personal.Bsnumber],['Email',personal.Email],['Address',personal.Caddres]].forEach(([l,v])=>{
    if(safeText(v)) personalListEl.insertAdjacentHTML('beforeend',`<div class="personal-item"><strong style="min-width:70px">${l}:</strong><span>${safeText(v)}</span></div>`);
  });

  skillListEl.innerHTML=''; 
  Object.values(data.Skills||{}).slice(0,LIMITS.skills).forEach(s=>{
    const name=s.name||s;
    const pct=s.level||s.percent||'0%';
    skillListEl.insertAdjacentHTML('beforeend',`<div class="skill-row"><div class="skill-meta"><div>${name}</div><div>${pct}</div></div><div class="skill-bar-wrap"><div class="skill-bar" style="width:${pct}"></div></div></div>`);
  });

  langListEl.innerHTML=''; 
  (safeText(personal.Paddres)||'').split(',').map(x=>x.trim()).filter(Boolean).slice(0,LIMITS.languages).forEach(l=>langListEl.insertAdjacentHTML('beforeend',`<div class="chip">${l}</div>`));

  hobbyListEl.innerHTML=''; 
  (safeText(personal.Qual)||'').split(',').map(x=>x.trim()).filter(Boolean).slice(0,LIMITS.hobbies).forEach(h=>hobbyListEl.insertAdjacentHTML('beforeend',`<div class="chip">${mapHobbyIcon(h)} ${h}</div>`));

  educationList.innerHTML=''; 
  Object.values(data.Education||{}).filter(e=>e && (e.Name||e.Degree)).slice(0,LIMITS.education).forEach(ed=>{
    const c=document.createElement('div'); c.className='item'; 
    if(ed.Startyear||ed.Endyear)c.insertAdjacentHTML('beforeend',`<div class="line">${ed.Startyear||''}${ed.Startyear||ed.Endyear?' - ':''}${ed.Endyear||''}</div>`);
    ['Name','Degree','Field','Subfield','Gpa'].forEach(f=>{if(ed[f]) c.insertAdjacentHTML('beforeend',`<div class="line">${f==='Gpa'?'GPA: '+ed[f]:ed[f]}</div>`)}); 
    educationList.appendChild(c);
  });

  experienceList.innerHTML=''; 
  (Array.isArray(data.Experience)?data.Experience:Object.values(data.Experience||{})).slice(0,LIMITS.experience).forEach(ex=>{
    const c=document.createElement('div');c.className='item';
    if(ex.durationNumber||ex.durationUnit)c.insertAdjacentHTML('beforeend',`<div class="line">${ex.durationNumber||''}${ex.durationNumber||ex.durationUnit?' - ':''}${ex.durationUnit||''}</div>`);
    ['organizationName','organizationPosition','Department','details'].forEach(f=>{if(ex[f]) c.insertAdjacentHTML('beforeend',`<div class="${f==='details'?'sub':'line'}">${ex[f]}</div>`)}); 
    experienceList.appendChild(c);
  });

  projectsRow.innerHTML=''; 
  (Array.isArray(data.Project)?data.Project:Object.values(data.Project||{})).slice(0,LIMITS.projects).forEach(p=>{
    const b=document.createElement('div'); b.className='col-box'; 
    b.innerHTML=`<div style="font-weight:700">${safeText(p.category)||''}</div><div>${safeText(p.projectName)||''}</div>${p.projectUrl?`<div style="margin-top:6px;font-size:10px"><a href="${p.projectUrl}" target="_blank">${p.projectUrl}</a></div>`:''}`; 
    projectsRow.appendChild(b);
  }); 
  while(projectsRow.children.length<2) projectsRow.appendChild(document.createElement('div')).lastChild.className='col-box',projectsRow.lastChild.style.visibility='hidden';

  referencesRow.innerHTML=''; 
  const refs=[]; 
  if(data.JobReference){if(data.JobReference.Reference1)refs.push(data.JobReference.Reference1); if(data.JobReference.Reference2)refs.push(data.JobReference.Reference2);} 
  refs.slice(0,LIMITS.references).forEach(r=>{
    const b=document.createElement('div');b.className='col-box'; 
    b.innerHTML=`<div style="font-weight:700">${safeText(r.Name)||''}</div><div class="sub">${safeText(r.Post)||''}</div><div style="margin-top:6px;font-size:11px">${safeText(r.PhoneNumber)||''}${r.Email?' • '+safeText(r.Email):''}</div>`; 
    referencesRow.appendChild(b);
  }); 
  while(referencesRow.children.length<2) referencesRow.appendChild(document.createElement('div')).lastChild.className='col-box',referencesRow.lastChild.style.visibility='hidden';

  requestAnimationFrame(()=>document.querySelectorAll('.skill-bar').forEach(b=>{const w=b.style.width;b.style.width='0%';setTimeout(()=>b.style.width=w,60)}));
}

// Wait for images
function waitForImages(container){
  const imgs = Array.from(container.querySelectorAll('img'));
  return Promise.all(imgs.map(img=>{
    if(img.complete) return Promise.resolve();
    return new Promise(resolve=>{img.onload=img.onerror=resolve});
  }));
}

// Create & download PDF with profile image
async function createAndDownloadPdf(){
  await waitForImages(cvSheet);
  const opt = {
    margin: 0,
    filename: `Resume-Cv.pdf`,
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 3, useCORS: true, scrollY: 0, windowHeight: cvSheet.scrollHeight },
    jsPDF: { unit: "px", format: [794, 1123], orientation: "portrait" }
  };
  const pdfBlob = await html2pdf().set(opt).from(cvSheet).outputPdf('blob');

  // Upload PDF to Firebase
  const storagePath = `ResumePdf/Portfolio/${CNIC}/Resume-Cv.pdf`;
  const fileRef = storageRef(storage, storagePath);
  await uploadBytes(fileRef, pdfBlob);

  // Auto download
  const url = URL.createObjectURL(pdfBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Resume-Cv.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Display modal with clone CV
displayDownloadBtn.addEventListener('click',()=>overlay.style.display='block');
closeModal.addEventListener('click',()=>overlay.style.display='none');

displayBtn.addEventListener('click', async () => {
  modalViewer.innerHTML = "";
  const clone = cvSheet.cloneNode(true);
  clone.style.width="100%";
  clone.style.height="auto";
  clone.style.transform="scale(0.8)";
  clone.style.transformOrigin="top center";
  clone.style.margin="0 auto 20px auto";
  modalViewer.appendChild(clone);
  await waitForImages(clone);
  modalViewer.style.display='block';
  overlay.style.display='block';
});

// Download with paymentStatus check
downloadBtn.addEventListener('click', async()=>{
  try{
    const dbRef = ref(db);
    const snap = await get(child(dbRef, `resContainer9/${CNIC}/Access`));
    const status = snap.val()?.paymentStatus || 'pending';
    if(status !== 'Verified'){
      window.location.href='/personal-portfolio-html-template/Login/payment.html';
      return;
    }
    await createAndDownloadPdf();
  }catch(err){ console.error(err); alert('Error generating/downloading PDF'); }
});

// Load CV data
fetchUser().then(render).catch(err=>console.error(err));
