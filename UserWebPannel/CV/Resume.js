import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";

// ---------- Firebase config ----------
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

// ---------- Limits ----------
const LIMITS = { skills:10, languages:10, hobbies:10, projects:3, references:2 };

// ---------- CNIC ----------
let CNIC = localStorage.getItem('Cnic') || prompt('Enter CNIC:') || 'unknown';
localStorage.setItem('Cnic', CNIC);

// ---------- Helpers ----------
function safeText(v){ return (v===undefined||v===null||v==='')? '' : String(v).trim(); }
function mapHobbyIcon(h){
  const k=(h||'').toLowerCase();
  if(k.includes('travel')) return '✈️';
  if(k.includes('photo')) return '📸';
  if(k.includes('music')) return '🎧';
  if(k.includes('game')) return '🎮';
  if(k.includes('read')) return '📚';
  if(k.includes('fit')) return '🏋️';
  return '⭐';
}
function waitForImages(container){
  const imgs = Array.from(container.querySelectorAll('img'));
  return Promise.all(imgs.map(img=> img.complete ? Promise.resolve() : new Promise(r=>{ img.onload=img.onerror=r; })));
}

// ---------- DOM elements ----------
let containerEl = null;
let cvSheet = null;
let overlay = null;
let modalViewer = null;
let displayDownloadBtn = null;
let displayBtn = null;
let downloadBtn = null;
let closeModal = null;

// ---------- Fetch user data ----------
async function fetchUser(){
  const dbRef = ref(db);
  const snap = await get(child(dbRef, `resContainer9/${CNIC}`));
  return snap.exists()? snap.val() : {};
}
function render(data){
  cvSheet.innerHTML='';

  const personal = data.Personal||{};
  const skills = Object.values(data.Skills||{}).slice(0,LIMITS.skills);
  const languages = (safeText(personal.Paddres)||'').split(',').map(x=>x.trim()).filter(Boolean).slice(0,LIMITS.languages);
  const hobbies = (safeText(personal.Qual)||'').split(',').map(x=>x.trim()).filter(Boolean).slice(0,LIMITS.hobbies);
  const projects = Array.isArray(data.Project)?data.Project:Object.values(data.Project||{});
  const jobRefs = data.JobReference?[data.JobReference.Reference1,data.JobReference.Reference2].filter(Boolean):[];

  // --- Sidebar ---
  const sidebar = document.createElement('aside'); sidebar.className='sidebar';
  if(safeText(personal.ImageUrl)){ const img=document.createElement('img'); img.className='profile-img'; img.src=safeText(personal.ImageUrl); img.alt='Profile'; sidebar.appendChild(img); }
  if(safeText(personal.Name)) sidebar.insertAdjacentHTML('beforeend', `<div class="name-small">${safeText(personal.Name)}</div>`);
  if(safeText(personal.Resumeprofession)) sidebar.insertAdjacentHTML('beforeend', `<div class="role-small">${safeText(personal.Resumeprofession)}</div>`);

  const personalPairs=[['Father',personal.Fname],['CNIC',personal.Cnic],['Phone',personal.Phone],['Bsnumber',personal.Bsnumber],['Email',personal.Email],['Address',personal.Caddres]];
  const personalList=document.createElement('div'); personalList.className='personal-list';
  personalPairs.forEach(([l,v])=>{ if(safeText(v)) personalList.insertAdjacentHTML('beforeend', `<div class="personal-item"><strong style="min-width:70px">${l}:</strong><span>${safeText(v)}</span></div>`); });
  if(personalList.children.length){ sidebar.insertAdjacentHTML('beforeend', `<div class="section-title" style="margin-top:6px"><span class="icon">👤</span><div>Personal Info</div></div>`); sidebar.appendChild(personalList); }

  // Languages
  if(languages.length){ const langWrap=document.createElement('div'); langWrap.className='lang-wrap'; langWrap.innerHTML=`<div class="section-title"><span class="icon">🏷️</span><div>Languages</div></div>`; const langList=document.createElement('div'); langList.className='chips'; languages.forEach(l=>langList.insertAdjacentHTML('beforeend', `<div class="chip">${l}</div>`)); langWrap.appendChild(langList); sidebar.appendChild(langWrap); }

  // Skills
  if(skills.length){ const skillsWrap=document.createElement('div'); skillsWrap.innerHTML=`<div class="section-title"><span class="icon">🛠️</span><div>Skills</div></div>`; const skillList=document.createElement('div'); skillList.className='skill-list'; skills.forEach(s=>{ const name=s.name||s; const pct=s.level||s.percent||'0%'; skillList.insertAdjacentHTML('beforeend', `<div class="skill-row"><div class="skill-meta"><div>${name}</div><div>${pct}</div></div><div class="skill-bar-wrap"><div class="skill-bar" style="width:${pct}"></div></div></div>`); }); skillsWrap.appendChild(skillList); sidebar.appendChild(skillsWrap); }

  // Hobbies
  if(hobbies.length){ const hobbyWrap=document.createElement('div'); hobbyWrap.innerHTML=`<div class="section-title"><span class="icon">🎯</span><div>Hobbies</div></div>`; const hobbyList=document.createElement('div'); hobbyList.className='chips'; hobbies.forEach(h=>hobbyList.insertAdjacentHTML('beforeend', `<div class="chip">${mapHobbyIcon(h)} ${h}</div>`)); hobbyWrap.appendChild(hobbyList); sidebar.appendChild(hobbyWrap); }

  cvSheet.appendChild(sidebar);

  // --- Main ---
  const main=document.createElement('main'); main.className='main';

  // Header
  if(safeText(personal.Name)||safeText(personal.Resumeprofession)||safeText(personal.Aboutpera)){
    const header=document.createElement('header'); header.className='header';
    const hdiv=document.createElement('div');
    if(safeText(personal.Name)) hdiv.insertAdjacentHTML('beforeend', `<div class="name-large">${safeText(personal.Name)}</div>`);
    if(safeText(personal.Resumeprofession)) hdiv.insertAdjacentHTML('beforeend', `<div class="profession">${safeText(personal.Resumeprofession)}</div>`);
    if(safeText(personal.Aboutpera)) hdiv.insertAdjacentHTML('beforeend', `<h5>About Me<div class="about">${safeText(personal.Aboutpera)}</div></h5>`);
    header.appendChild(hdiv); main.appendChild(header);
  }

  // --- Dynamic Sections ---
  const sheetHeight = 1123; // fixed A4
  const education = Object.values(data.Education||{}).filter(e=>e&&(e.Name||e.Degree));
  const experience = Array.isArray(data.Experience)?data.Experience:Object.values(data.Experience||{});
  const maxProj = 3, maxRef = 2;

  const eduSec = document.createElement('section'); eduSec.className='section';
  eduSec.innerHTML=`<div class="title"><div class="icon">🎓</div><div>Education</div></div>`;
  const eduList = document.createElement('div'); eduList.className='list';
  eduSec.appendChild(eduList);
  main.appendChild(eduSec);

  const expSec = document.createElement('section'); expSec.className='section';
  expSec.innerHTML=`<div class="title"><div class="icon">🏢</div><div>Experience</div></div>`;
  const expList = document.createElement('div'); expList.className='list';
  expSec.appendChild(expList);
  main.appendChild(expSec);

  // Projects
  const projSec = document.createElement('section'); projSec.className='section';
  if(projects.length){
    projSec.innerHTML=`<div class="title"><div class="icon">💡</div><div>Projects</div></div>`;
    const row=document.createElement('div'); row.className='col-row';
    projects.slice(0,maxProj).forEach(p=>{
      const box=document.createElement('div'); box.className='col-box';
      box.innerHTML=`<div style="font-weight:700">${safeText(p.category)||''}</div><div>${safeText(p.projectName)||''}</div>${p.projectUrl?`<div style="margin-top:6px;font-size:10px"><a href="${p.projectUrl}" target="_blank">${p.projectUrl}</a></div>`:''}`;
      row.appendChild(box);
    });
    projSec.appendChild(row);
  }

  // References
  const refSec = document.createElement('section'); refSec.className='section';
  if(jobRefs.length){
    refSec.innerHTML=`<div class="title"><div class="icon">📘</div><div>References</div></div>`;
    const row=document.createElement('div'); row.className='col-row';
    jobRefs.slice(0,maxRef).forEach(r=>{
      if(!r) return;
      const box=document.createElement('div'); box.className='col-box';
      box.innerHTML=`<div style="font-weight:700">${safeText(r.Name)||''}</div><div class="sub">${safeText(r.Post)||''}</div><div style="margin-top:6px;font-size:11px">${safeText(r.PhoneNumber)||''}${r.Email?' • '+safeText(r.Email):''}</div>`;
      row.appendChild(box);
    });
    refSec.appendChild(row);
  }

  // --- Dynamic rendering to fit page ---
  const addEduItem = (e)=>{ 
    const item=document.createElement('div'); item.className='item';
    if(e.Startyear||e.Endyear) item.insertAdjacentHTML('beforeend', `<div class="line">${e.Startyear||''}${e.Startyear||e.Endyear?' - ':''}${e.Endyear||''}</div>`);
    ['Name','Degree','Field','Subfield','Gpa','Institute'].forEach(f=>{ if(e[f]) item.insertAdjacentHTML('beforeend', `<div class="line">${f==='Gpa'?'GPA: '+e[f]:e[f]}</div>`); });
    eduList.appendChild(item);
  };
  const addExpItem = (e)=>{ 
    const item=document.createElement('div'); item.className='item';
    if(e.durationNumber||e.durationUnit) item.insertAdjacentHTML('beforeend', `<div class="line">${e.durationNumber||''}${e.durationNumber||e.durationUnit?' - ':''}${e.durationUnit||''}</div>`);
    ['organizationName','organizationPosition','Department','details'].forEach(f=>{ if(e[f]) item.insertAdjacentHTML('beforeend', `<div class="${f==='details'?'sub':'line'}">${e[f]}</div>`); });
    expList.appendChild(item);
  };

  let eduIndex=0, expIndex=0;
  while(main.offsetHeight < sheetHeight && (eduIndex<education.length || expIndex<experience.length)){
    if(eduIndex<education.length) addEduItem(education[eduIndex++]);
    if(main.offsetHeight>=sheetHeight) break;
    if(expIndex<experience.length) addExpItem(experience[expIndex++]);
  }

  // Append Projects & References if space remains
  if(main.offsetHeight+projSec.offsetHeight<=sheetHeight && projects.length) main.appendChild(projSec);
  if(main.offsetHeight+refSec.offsetHeight<=sheetHeight && jobRefs.length) main.appendChild(refSec);

  cvSheet.appendChild(main);

  // Animate skill bars
  requestAnimationFrame(()=>document.querySelectorAll('.skill-bar').forEach(b=>{const w=b.style.width;b.style.width='0%';setTimeout(()=>b.style.width=w,60)}));
}


// ---------- PDF creation ----------
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

  const storagePath = `ResumePdf/Portfolio/${CNIC}/Resume-Cv.pdf`;
  const fileRef = storageRef(storage, storagePath);
  await uploadBytes(fileRef, pdfBlob);

  const url = URL.createObjectURL(pdfBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Resume-Cv.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ---------- Modal & download ----------
function wireModalAndButtons(){
  overlay = document.getElementById('overlay');
  modalViewer = document.getElementById('modalViewer');
  displayDownloadBtn = document.getElementById('displayDownloadBtn');
  displayBtn = document.getElementById('displayBtn');
  downloadBtn = document.getElementById('downloadBtn');
  closeModal = document.getElementById('closeModal');

  if(displayDownloadBtn) displayDownloadBtn.addEventListener('click', ()=> overlay && (overlay.style.display='block'));
  if(closeModal) closeModal.addEventListener('click', ()=> overlay && (overlay.style.display='none'));

  if(displayBtn) displayBtn.addEventListener('click', async () => {
    if(!modalViewer) return;
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
    if(overlay) overlay.style.display='block';
  });

  if(downloadBtn) downloadBtn.addEventListener('click', async ()=>{
    try{
      const snap = await get(child(ref(db), `resContainer9/${CNIC}/Access`));
      const status = snap.val()?.paymentStatus || 'pending';
      if(status !== 'Verified'){ window.location.href='/personal-portfolio-html-template/Login/payment.html'; return; }
      await createAndDownloadPdf();
    }catch(err){ console.error(err); alert('Error generating/downloading PDF'); }
  });
}

// ---------- Initialization ----------
window.addEventListener('DOMContentLoaded', async () => {
  containerEl = document.querySelector('.container');
  if(!containerEl){
    containerEl = document.createElement('div');
    containerEl.className = 'container';
    document.body.insertBefore(containerEl, document.body.firstChild);
  }
  cvSheet = containerEl.querySelector('.cv-sheet') || document.createElement('div');
  cvSheet.className = 'cv-sheet';
  if(!containerEl.contains(cvSheet)) containerEl.appendChild(cvSheet);

  wireModalAndButtons();

  try{
    const data = await fetchUser();
    render(data);
  }catch(err){
    console.error('Failed to load CV data:', err);
  }
});
