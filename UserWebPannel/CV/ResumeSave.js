// ResumeFinal.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";

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

// ---------- SAFE EMAIL ----------
let email = localStorage.getItem("userEmail") || prompt("Enter Email:") || "unknown@email.com";
email = email.toLowerCase();
localStorage.setItem("userEmail", email);
const toSafeEmail = (e) => { const [l,d]=e.split("@"); return `${l}@${d.replace(/\./g,"_")}`; };
const safeEmail = toSafeEmail(email);

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
let containerEl=null, cvSheet=null, overlay=null, modalViewer=null;
let displayDownloadBtn=null, displayBtn=null, downloadBtn=null, closeModal=null;

// ---------- Fetch user data ----------
async function fetchUser() {
  if(!safeEmail) return {};
  const snap = await get(child(ref(db), `AR_Technologies/Ai/Dynamic_Web/${safeEmail}/Portfolio`));
  return snap.exists()? snap.val() : {};
}

// ---------- Render CV ----------
function render(data){
  cvSheet.innerHTML='';
  const personal = data.Personal || {};
  const skills = Object.values(data.Skills || {}).slice(0,LIMITS.skills).filter(s=>s&&(s.name||s.level||s.percent));
  const languages = (safeText(personal.Paddres)||'').split(',').map(x=>x.trim()).filter(Boolean).slice(0,LIMITS.languages);
  const hobbies = (safeText(personal.Qual)||'').split(',').map(x=>x.trim()).filter(Boolean).slice(0,LIMITS.hobbies);
  const projects = (Array.isArray(data.Project)?data.Project:Object.values(data.Project||{})).filter(p=>p&&(p.projectName||p.category));
  const jobRefs = (data.JobReference?[data.JobReference.Reference1,data.JobReference.Reference2].filter(r=>r&&(r.Name||r.Post)):[]);

  // Sidebar
  const sidebar=document.createElement('aside'); sidebar.className='sidebar';
  if(safeText(personal.ImageUrl)){
    const img=document.createElement('img'); img.className='profile-img'; img.src=safeText(personal.ImageUrl); sidebar.appendChild(img);
  }
  const personalItems=[['Father',personal.Fname],['CNIC',personal.Cnic],['Phone',personal.Phone],['Bsnumber',personal.Bsnumber],['Email',personal.Email],['Address',personal.Caddres]].filter(([_,v])=>safeText(v));
  if(personalItems.length){
    const personalListEl=document.createElement('div'); personalListEl.className='personal-list';
    personalItems.forEach(([label,val])=> personalListEl.insertAdjacentHTML('beforeend', `<div class="personal-item"><strong style="min-width:70px">${label}:</strong><span>${safeText(val)}</span></div>`));
    sidebar.insertAdjacentHTML('beforeend', `<div class="section-title" style="margin-top:6px"><span class="icon">👤</span><div>Personal Info</div></div>`);
    sidebar.appendChild(personalListEl);
  }
  if(languages.length){
    const langWrap=document.createElement('div'); langWrap.className='lang-wrap';
    langWrap.innerHTML=`<div class="section-title"><span class="icon">🏷️</span><div>Languages</div></div>`;
    const langList=document.createElement('div'); langList.className='chips';
    languages.forEach(l=>langList.insertAdjacentHTML('beforeend', `<div class="chip">${l}</div>`));
    langWrap.appendChild(langList); sidebar.appendChild(langWrap);
  }
  if(skills.length){
    const skillsWrap=document.createElement('div'); skillsWrap.innerHTML=`<div class="section-title"><span class="icon">🛠️</span><div>Skills</div></div>`;
    const skillList=document.createElement('div'); skillList.className='skill-list';
    skills.forEach(s=>{const name=s.name||s; const pct=s.level||s.percent||'0%'; skillList.insertAdjacentHTML('beforeend', `<div class="skill-row"><div class="skill-meta"><div>${name}</div><div>${pct}</div></div><div class="skill-bar-wrap"><div class="skill-bar" style="width:${pct}"></div></div></div>`);});
    skillsWrap.appendChild(skillList); sidebar.appendChild(skillsWrap);
  }
  if(hobbies.length){
    const hobbyWrap=document.createElement('div'); hobbyWrap.innerHTML=`<div class="section-title"><span class="icon">🎯</span><div>Hobbies</div></div>`;
    const hobbyList=document.createElement('div'); hobbyList.className='chips';
    hobbies.forEach(h=>hobbyList.insertAdjacentHTML('beforeend', `<div class="chip">${mapHobbyIcon(h)} ${h}</div>`));
    hobbyWrap.appendChild(hobbyList); sidebar.appendChild(hobbyWrap);
  }
  cvSheet.appendChild(sidebar);

  // Main
  const main=document.createElement('main'); main.className='main';
  if(safeText(personal.Name)||safeText(personal.Resumeprofession)||safeText(personal.Aboutpera)){
    const header=document.createElement('header'); header.className='header';
    const hdiv=document.createElement('div');
    if(safeText(personal.Name)) hdiv.insertAdjacentHTML('beforeend', `<div class="name-large">${safeText(personal.Name)}</div>`);
    if(safeText(personal.Resumeprofession)) hdiv.insertAdjacentHTML('beforeend', `<div class="profession">${safeText(personal.Resumeprofession)}</div>`);
    if(safeText(personal.Aboutpera)) hdiv.insertAdjacentHTML('beforeend', `<h5>About Me<div class="about">${safeText(personal.Aboutpera)}</div></h5>`);
    header.appendChild(hdiv); main.appendChild(header);
  }

  // Education
  const educationItems = Object.values(data.Education||{}).filter(e=>e&&(e.Name||e.Degree||e.Field||e.Subfield||e.Gpa));
  if(educationItems.length){
    const eduSection=document.createElement('section'); eduSection.className='section';
    eduSection.innerHTML=`<div class="title"><div class="icon">🎓</div><div>Education</div></div>`;
    const eduList=document.createElement('div'); eduList.className='list';
    educationItems.slice(0,eduLimitFromData(projects,jobRefs)).forEach(ed=>{
      const item=document.createElement('div'); item.className='item';
      if(ed.Startyear||ed.Endyear) item.insertAdjacentHTML('beforeend', `<div class="line">${ed.Startyear||''}${ed.Startyear||ed.Endyear?' - ':''}${ed.Endyear||''}</div>`);
      ['Name','Degree','Field','Subfield','Gpa'].forEach(f=>{if(ed[f]) item.insertAdjacentHTML('beforeend', `<div class="line">${f==='Gpa'?'GPA: '+ed[f]:ed[f]}</div>`);});
      eduList.appendChild(item);
    });
    eduSection.appendChild(eduList); main.appendChild(eduSection);
  }

  // Experience
  const experienceItems = Array.isArray(data.Experience)?data.Experience:Object.values(data.Experience||{}).filter(e=>e&&(e.organizationName||e.organizationPosition||e.Department||e.details));
  if(experienceItems.length){
    const expSection=document.createElement('section'); expSection.className='section';
    expSection.innerHTML=`<div class="title"><div class="icon">🏢</div><div>Experience</div></div>`;
    const expList=document.createElement('div'); expList.className='list';
    experienceItems.slice(0,expLimitFromData(projects,jobRefs)).forEach(ex=>{
      const item=document.createElement('div'); item.className='item';
      if(ex.durationNumber||ex.durationUnit) item.insertAdjacentHTML('beforeend', `<div class="line">${ex.durationNumber||''}${ex.durationNumber||ex.durationUnit?' - ':''}${ex.durationUnit||''}</div>`);
      ['organizationName','organizationPosition','Department','details'].forEach(f=>{if(ex[f]) item.insertAdjacentHTML('beforeend', `<div class="${f==='details'?'sub':'line'}">${ex[f]}</div>`);});
      expList.appendChild(item);
    });
    expSection.appendChild(expList); main.appendChild(expSection);
  }

  // Projects
  if(projects.length){
    const projSection=document.createElement('section'); projSection.className='section';
    projSection.innerHTML=`<div class="title"><div class="icon">💡</div><div>Projects</div></div>`;
    const projRow=document.createElement('div'); projRow.className='col-row';
    projects.slice(0,LIMITS.projects).forEach(p=>{
      const b=document.createElement('div'); b.className='col-box';
      b.innerHTML=`<div style="font-weight:700">${safeText(p.category)||''}</div><div>${safeText(p.projectName)||''}</div>${p.projectUrl?`<div style="margin-top:6px;font-size:10px"><a href="${p.projectUrl}" target="_blank">${p.projectUrl}</a></div>`:''}`;
      projRow.appendChild(b);
    });
    projSection.appendChild(projRow); main.appendChild(projSection);
  }

  // References
  if(jobRefs.length){
    const refSection=document.createElement('section'); refSection.className='section';
    refSection.innerHTML=`<div class="title"><div class="icon">📘</div><div>References</div></div>`;
    const refRow=document.createElement('div'); refRow.className='col-row';
    jobRefs.slice(0,LIMITS.references).forEach(r=>{
      const b=document.createElement('div'); b.className='col-box';
      b.innerHTML=`<div style="font-weight:700">${safeText(r.Name)||''}</div><div class="sub">${safeText(r.Post)||''}</div><div style="margin-top:6px;font-size:11px">${safeText(r.PhoneNumber)||''}${r.Email?' • '+safeText(r.Email):''}</div>`;
      refRow.appendChild(b);
    });
    refSection.appendChild(refRow); main.appendChild(refSection);
  }

  cvSheet.appendChild(main);
  requestAnimationFrame(()=>document.querySelectorAll('.skill-bar').forEach(b=>{const w=b.style.width;b.style.width='0%';setTimeout(()=>b.style.width=w,60)}));
}

// ---------- Limits helpers ----------
function eduLimitFromData(projects, jobRefs){return projects.length>0&&jobRefs.length>0?3:projects.length===0&&jobRefs.length===0?5:4;}
function expLimitFromData(projects, jobRefs){return projects.length>0&&jobRefs.length>0?4:projects.length===0&&jobRefs.length===0?5:5;}

// ---------- Auto generate PDF and save to Firebase Storage ----------
async function autoGenerateAndSavePdf(){
  const storagePath = `ResumePdf/Portfolio/${safeEmail}/Resume-Cv.pdf`;
  const fileRef = storageRef(storage, storagePath);

  // clone and fix styles
  const clone = cvSheet.cloneNode(true);
  clone.style.width="794px"; clone.style.height="1123px"; clone.style.background="#fff"; clone.style.margin="0"; clone.style.transform="none";
  const sandbox=document.createElement("div"); sandbox.style.position="fixed"; sandbox.style.left="-9999px"; sandbox.appendChild(clone); document.body.appendChild(sandbox);

  await waitForImages(clone);

  const pdfBlob = await html2pdf().set({
    margin:0, html2canvas:{scale:2, backgroundColor:"#fff", width:794, height:1123}, jsPDF:{unit:"px", format:[794,1123], orientation:"portrait"}, pagebreak:{mode:["avoid-all"]}
  }).from(clone).outputPdf("blob");

  document.body.removeChild(sandbox);
  await uploadBytes(fileRef, pdfBlob);
  console.log("✅ PDF saved with all rendered content");
}

// ---------- Download PDF ----------
async function downloadPdfFromStorage(){
  const storagePath = `ResumePdf/Portfolio/${safeEmail}/Resume-Cv.pdf`;
  const fileRef = storageRef(storage, storagePath);
  const url = await getDownloadURL(fileRef);
  const a=document.createElement("a"); a.href=url; a.download="Resume-Cv.pdf"; document.body.appendChild(a); a.click(); a.remove();
}

// ---------- Wire modal & buttons ----------
function wireModalAndButtons(){
  overlay = document.getElementById('overlay'); modalViewer=document.getElementById('modalViewer');
  displayDownloadBtn=document.getElementById('displayDownloadBtn'); displayBtn=document.getElementById('displayBtn');
  downloadBtn=document.getElementById('downloadBtn'); closeModal=document.getElementById('closeModal');

  if(displayDownloadBtn) displayDownloadBtn.addEventListener('click', ()=>overlay&&(overlay.style.display='block'));
  if(closeModal) closeModal.addEventListener('click', ()=>overlay&&(overlay.style.display='none'));

  if(displayBtn) displayBtn.addEventListener('click', async ()=>{
    if(!modalViewer) return;
    modalViewer.innerHTML="";
    const clone=cvSheet.cloneNode(true); clone.style.width="100%"; clone.style.height="auto"; clone.style.transform="scale(0.8)";
    clone.style.transformOrigin="top center"; clone.style.margin="0 auto 20px auto"; modalViewer.appendChild(clone);
    await waitForImages(clone);
    modalViewer.style.display='block'; if(overlay) overlay.style.display='block';
  });

  if(downloadBtn) downloadBtn.addEventListener("click", async ()=>{
    const snap=await get(child(ref(db), `AR_Technologies/Ai/Dynamic_Web/${safeEmail}/Portfolio/Access`));
    if(snap.val()?.paymentStatus!=="Verified"){ window.location.href="/personal-portfolio-html-template/Login/payment.html"; return; }
    await downloadPdfFromStorage();
  });
}

// ---------- Init ----------
window.addEventListener('DOMContentLoaded', async ()=>{
  containerEl=document.querySelector('.container')||document.createElement('div'); containerEl.className='container';
  if(!document.body.contains(containerEl)) document.body.insertBefore(containerEl, document.body.firstChild);

  cvSheet=containerEl.querySelector('.cv-sheet')||document.createElement('div'); cvSheet.className='cv-sheet';
  if(!containerEl.contains(cvSheet)) containerEl.appendChild(cvSheet);

  wireModalAndButtons();

  try{
    const data=await fetchUser();
    render(data);
    await autoGenerateAndSavePdf();
  }catch(err){console.error('CV load failed:',err);}
});
