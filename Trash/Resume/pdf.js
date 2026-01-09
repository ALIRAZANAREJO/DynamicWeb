// pdf.js — Final Professional Version
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

// ---------- PDF Generation ----------
export async function generatePdfBlob() {
  const resumeEl = window._resume_getPreviewElement?.();
  if(!resumeEl) throw new Error('Preview element not found');

  // Use higher scale for sharp text
  const canvas = await html2canvas(resumeEl, { scale: 3, useCORS: true, scrollY: -window.scrollY });
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF('p', 'pt', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Maintain aspect ratio
  const imgProps = pdf.getImageProperties(imgData);
  const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
  const imgWidth = imgProps.width * ratio;
  const imgHeight = imgProps.height * ratio;

  pdf.addImage(imgData, 'PNG', (pdfWidth - imgWidth)/2, 20, imgWidth, imgHeight);
  return pdf.output('blob');
}

// ---------- Upload PDF ----------
export async function savePdfToStorage(cnic, pdfBlob) {
  if(!cnic) throw new Error('CNIC required to save');

  const folderRef = storageRef(storage, `ResumePdf/Portfolio/${cnic}`);
  const listRes = await listAll(folderRef).catch(()=>({ items: [] }));

  const nums = listRes.items.map(it => {
    const n = it.name.replace('.pdf','');
    const parsed = parseInt(n,10);
    return Number.isFinite(parsed) ? parsed : 0;
  });
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  const fileName = `${next}.pdf`;
  const fileRef = storageRef(storage, `ResumePdf/Portfolio/${cnic}/${fileName}`);

  await uploadBytes(fileRef, pdfBlob);
  const url = await getDownloadURL(fileRef);

  const recordRef = dbRef(db, `ResumePdfList/${cnic}/${next}`);
  await set(recordRef, { fileName, url, timestamp: Date.now() });

  return { fileName, url, index: next };
}

// ---------- Load PDF List ----------
export async function loadPdfList(cnic) {
  const listEl = $('#pdfList');
  if(!listEl) return;

  if(!cnic){
    listEl.innerHTML = '<li class="muted">Enter CNIC in Save section and click "Refresh" to see saved PDFs.</li>';
    return;
  }

  const nodeRef = dbRef(db, `ResumePdfList/${cnic}`);
  const snap = await get(nodeRef);
  listEl.innerHTML = '';

  if(!snap.exists()){
    listEl.innerHTML = '<li class="muted">No saved PDFs for this CNIC.</li>';
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

  // Attach handlers
  listEl.querySelectorAll('button.view-btn').forEach(btn=>{
    btn.addEventListener('click', ()=> window.open(btn.dataset.url, '_blank'));
  });
}

// ---------- UI Binding ----------
function attachUi() {
  const saveBtn = $('#savePdfBtn');
  const downloadLocalBtn = $('#downloadPdfBtn');
  const refreshBtn = $('#refreshPdfPanel');

  if(downloadLocalBtn){
    downloadLocalBtn.addEventListener('click', async ()=>{
      try{
        const blob = await generatePdfBlob();
        const name = (document.querySelector('#fullName')?.value?.trim() || 'Resume') + '.pdf';
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = name;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }catch(err){
        alert('PDF generation failed: '+ (err.message||err));
      }
    });
  }

  if(saveBtn){
    saveBtn.addEventListener('click', async ()=>{
      try{
        const cnic = (window._resume_getSaveCnic?.()) || '';
        if(!cnic){ window._resume_setSaveStatus?.('Please enter CNIC in Save section.'); return; }
        window._resume_setSaveStatus?.('Generating PDF...');
        const blob = await generatePdfBlob();
        window._resume_setSaveStatus?.('Uploading PDF to storage...');
        const saved = await savePdfToStorage(cnic, blob);
        window._resume_setSaveStatus?.(`Saved as ${saved.fileName}`);
        await loadPdfList(cnic);
      }catch(err){
        window._resume_setSaveStatus?.('Save failed: ' + (err.message||err));
      }
    });
  }

  if(refreshBtn){
    refreshBtn.addEventListener('click', async ()=>{
      const cnic = (window._resume_getSaveCnic?.()) || '';
      await loadPdfList(cnic);
    });
  }

  const initialCnic = (window._resume_getSaveCnic?.()) || '';
  if(initialCnic) loadPdfList(initialCnic);
}

// Initialize
setTimeout(()=>{ attachUi(); }, 300);
