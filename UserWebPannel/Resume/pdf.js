// pdf.js — Email Version
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getDatabase, ref as dbRef, get, set } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";
const { jsPDF } = jspdf;

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

const $ = sel => document.querySelector(sel);

// ---------- Helpers ----------
function getSafeEmail(email){
  return email?.trim().toLowerCase().replace(/[.#$[\]]/g, "_");
}
export async function generatePdfBlob() {
  const resume = document.getElementById("preview-resume");
  if (!resume) throw new Error("Resume not found");

  // Save original styles
  const originalStyle = {
    transform: resume.style.transform,
    width: resume.style.width,
    maxWidth: resume.style.maxWidth
  };

  // Force A4 layout for generation
  resume.style.transform = "scale(1)";
  resume.style.width = "794px";      // A4 width in px
  resume.style.maxWidth = "794px";

  // Clone for safe capture
  const clone = resume.cloneNode(true);
  clone.classList.add("pdf-clone");

  const wrapper = document.createElement("div");
  wrapper.style.position = "absolute";
  wrapper.style.left = "-9999px";
  wrapper.style.top = "-9999px";
  wrapper.style.width = "794px";
  wrapper.style.height = "1123px";   // A4 height in px
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    // Wait for all images to load
    const imgs = clone.querySelectorAll("img");
    await Promise.all([...imgs].map(img => new Promise(res => {
      if (img.complete) return res();
      img.onload = img.onerror = () => res();
    })));

    // Ultra HD canvas
    const SCALE = 4;
    const canvas = await html2canvas(clone, {
      scale: SCALE,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      windowWidth: 794,
      windowHeight: 1123
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0);

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: false
    });

    const PAGE_WIDTH = 210;   // mm
    const PAGE_HEIGHT = 297;  // mm
    const MARGIN_LEFT = 10;
    const MARGIN_TOP = 10;
    const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT * 2;
    const CONTENT_HEIGHT = PAGE_HEIGHT - MARGIN_TOP * 2;

    pdf.addImage(imgData, "JPEG", MARGIN_LEFT, MARGIN_TOP, CONTENT_WIDTH, CONTENT_HEIGHT, undefined, "FAST");

    return pdf.output("blob");

  } finally {
    // Restore original styles and remove clone
    resume.style.transform = originalStyle.transform;
    resume.style.width = originalStyle.width;
    resume.style.maxWidth = originalStyle.maxWidth;
    wrapper.remove();
  }
}


// ---------- Upload PDF ----------
export async function savePdfToStorage(email, pdfBlob) {
  const safeEmail = getSafeEmail(email);
  if(!safeEmail) throw new Error('Email required');

  const folderRef = storageRef(storage, `ResumePdf/Portfolio/${safeEmail}`);
  const listRes = await listAll(folderRef).catch(()=>({ items: [] }));

  const nums = listRes.items.map(it => {
    const n = it.name.replace('.pdf','');
    const parsed = parseInt(n,10);
    return Number.isFinite(parsed) ? parsed : 0;
  });
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  const fileName = `${next}.pdf`;
  const fileRef = storageRef(storage, `ResumePdf/Portfolio/${safeEmail}/${fileName}`);

  await uploadBytes(fileRef, pdfBlob);
  const url = await getDownloadURL(fileRef);

  const recordRef = dbRef(db, `ResumePdfList/${safeEmail}/${next}`);
  await set(recordRef, { fileName, url, timestamp: Date.now() });

  return { fileName, url, index: next };
}

// ---------- Load PDF List ----------
export async function loadPdfList(email) {
  const safeEmail = getSafeEmail(email);
  const listEl = $('#pdfList');
  if(!listEl) return;

  if(!safeEmail){
    listEl.innerHTML = '<li class="muted">Enter email in Save section and click "Refresh".</li>';
    return;
  }

  const nodeRef = dbRef(db, `ResumePdfList/${safeEmail}`);
  const snap = await get(nodeRef);
  listEl.innerHTML = '';

  if(!snap.exists()){
    listEl.innerHTML = '<li class="muted">No PDFs saved for this email.</li>';
    return;
  }

  const data = snap.val();
  const entries = Object.keys(data)
    .map(k=>({ key:k, ...data[k] }))
    .sort((a,b)=>Number(a.key)-Number(b.key));

  entries.forEach(entry=>{
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${entry.fileName} — <small class="muted">${new Date(entry.timestamp).toLocaleString()}</small></span>
      <span class="pdf-actions">
        <button class="btn view-btn" data-url="${entry.url}">View</button>
        <a class="btn download-btn" href="${entry.url}" download="${entry.fileName}">Download</a>
      </span>`;
    listEl.appendChild(li);
  });

  listEl.querySelectorAll('button.view-btn').forEach(btn=>{
    btn.addEventListener('click', ()=> window.open(btn.dataset.url, '_blank'));
  });
}

// ---------- UI Binding ----------
function attachUi() {
  const emailInput = $('#userEmailInput');
  const saveBtn = $('#savePdfBtn');
  const downloadLocalBtn = $('#downloadPdfBtn');
  const refreshBtn = $('#refreshPdfPanel');
  const saveStatusEl = $('#saveStatus');

  // Save PDF
  saveBtn?.addEventListener('click', async ()=>{
    const email = emailInput?.value?.trim();
    if(!email){ saveStatusEl.innerText='Enter email first'; return; }
    try{
      saveStatusEl.innerText='Generating PDF...';
      const blob = await generatePdfBlob();
      saveStatusEl.innerText='Uploading PDF...';
      const saved = await savePdfToStorage(email, blob);
      saveStatusEl.innerText=`Saved as ${saved.fileName}`;
      await loadPdfList(email);
    }catch(err){
      console.error(err);
      saveStatusEl.innerText='Save failed';
    }
  });

  // Download local
  downloadLocalBtn?.addEventListener('click', async ()=>{
    const email = emailInput?.value?.trim() || 'Resume';
    try{
      const blob = await generatePdfBlob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = email + '.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }catch(err){
      console.error(err);
      alert('Local download failed');
    }
  });

  // Refresh PDF list
  refreshBtn?.addEventListener('click', async ()=>{
    const email = emailInput?.value?.trim();
    await loadPdfList(email);
  });
}

setTimeout(()=>attachUi(), 300);
