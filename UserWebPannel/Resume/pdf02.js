// import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
// import { getDatabase, ref as dbRef,child, get, set } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";
// import { getStorage, ref as storageRef, uploadBytes, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";
// const { jsPDF } = jspdf;

// /* ================= FIREBASE INIT ================= */
// const firebaseConfig = {
//   apiKey: "AIzaSyCmL8qcjg4S6NeY3erraq_XhlDJ7Ek2s_E",
//   authDomain: "palestine-web.firebaseapp.com",
//   databaseURL: "https://palestine-web-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "palestine-web",
//   storageBucket: "palestine-web.appspot.com",
//   messagingSenderId: "35190212487",
//   appId: "1:35190212487:web:0a699bb1fa7b1a49113522"
// };

// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);
// const storage = getStorage(app);
// const $ = s => document.querySelector(s);



// Convert email into Firebase-safe key
function getSafeEmail(email) {
  return email?.trim().toLowerCase().replace(/[.#$[\]]/g, "_");
}

/* ============================================================
   PDF GENERATION (UNCHANGED – ULTRA HD)
============================================================ */
export async function generatePdfBlob() {
  const resumeEl = window._resume_getPreviewElement?.();
  if (!resumeEl) throw new Error("Preview element not found");

  const canvas = await html2canvas(resumeEl, {
    scale: 4,
    useCORS: true,
    backgroundColor: "#fff"
  });

  const imgData = canvas.toDataURL("image/jpeg", 1);
  const pdf = new jsPDF("p", "pt", "a4");

  const pw = pdf.internal.pageSize.getWidth();
  const ph = pdf.internal.pageSize.getHeight();
  const ratio = Math.min(pw / canvas.width, ph / canvas.height);

  pdf.addImage(
    imgData,
    "JPEG",
    0,
    0,
    canvas.width * ratio,
    canvas.height * ratio
  );

  return pdf.output("blob");
}

/* ============================================================
   SAVE PDF USING SAFE EMAIL (AUTO INCREMENT)
============================================================ */
export async function savePdfToStorage(email, pdfBlob) {
  const safeEmail = getSafeEmail(email);
  if (!safeEmail) throw new Error("Invalid email");

  const folderRef = storageRef(storage, `ResumePdf/Portfolio/${safeEmail}`);
  const list = await listAll(folderRef).catch(() => ({ items: [] }));

  const numbers = list.items
    .map(f => parseInt(f.name.replace(".pdf", ""), 10))
    .filter(n => !isNaN(n));

  const nextIndex = numbers.length ? Math.max(...numbers) + 1 : 1;
  const fileName = `${nextIndex}.pdf`;

  const fileRef = storageRef(storage, `ResumePdf/Portfolio/${safeEmail}/${fileName}`);
  await uploadBytes(fileRef, pdfBlob);

  const url = await getDownloadURL(fileRef);

  await set(
    dbRef(db, `ResumePdfList/${safeEmail}/${nextIndex}`),
    {
      fileName,
      url,
      timestamp: Date.now()
    }
  );

  return { fileName, url, index: nextIndex };
}

/* ============================================================
   LOAD USER PDF LIST
============================================================ */
export async function loadPdfList(email) {
  const safeEmail = getSafeEmail(email);
  if (!safeEmail) return;

  const listEl = document.querySelector("#pdfList");
  if (!listEl) return;

  const snap = await get(dbRef(db, `ResumePdfList/${safeEmail}`));
  listEl.innerHTML = "";

  if (!snap.exists()) {
    listEl.innerHTML = `<li class="muted">No PDFs saved yet for this email.</li>`;
    return;
  }

  const data = snap.val();
  Object.keys(data)
    .sort((a, b) => Number(a) - Number(b))
    .forEach(k => {
      const item = data[k];
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${item.fileName}</span>
        <span class="pdf-actions">
          <button class="btn view-btn" data-url="${item.url}">View</button>
          <a class="btn download-btn" href="${item.url}" download>Download</a>
        </span>`;
      listEl.appendChild(li);
    });

  listEl.querySelectorAll(".view-btn").forEach(btn => {
    btn.onclick = () => window.open(btn.dataset.url, "_blank");
  });
}

/* ============================================================
   UI EVENTS
============================================================ */
function attachUi() {
  const emailInput = document.getElementById("userEmailInput");
  const saveBtn = document.getElementById("savePdfBtn");
  const downloadStorageBtn = document.getElementById("downloadPdfBtn");
  const refreshBtn = document.getElementById("refreshPdfPanel");
  const saveStatusEl = document.getElementById("saveStatus");

  // Save email to global safeEmail
  emailInput?.addEventListener("input", () => {
    window.safeEmail = getSafeEmail(emailInput.value);
  });

  // Save PDF to storage
  saveBtn?.addEventListener("click", async () => {
    if (!window.safeEmail) return alert("Enter a valid email first");

    try {
      saveStatusEl.innerText = "Generating PDF...";
      const blob = await generatePdfBlob();

      saveStatusEl.innerText = "Uploading PDF...";
      const res = await savePdfToStorage(window.safeEmail, blob);

      saveStatusEl.innerText = `Saved as ${res.fileName}`;
      await loadPdfList(window.safeEmail);
    } catch (err) {
      console.error(err);
      saveStatusEl.innerText = "Save failed";
    }
  });

  // Download local PDF
  downloadLocalBtn?.addEventListener("click", async () => {
    try {
      const blob = await generatePdfBlob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "resume.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("PDF generation failed");
    }
  });

  // Download latest PDF from storage (optional)
  downloadStorageBtn?.addEventListener("click", async () => {
    if (!window.safeEmail) return alert("Enter email first");
    const snap = await get(dbRef(db, `ResumePdfList/${window.safeEmail}`));
    if (!snap.exists()) return alert("No PDFs found for this email");
    const data = snap.val();
    const lastIndex = Math.max(...Object.keys(data).map(k => Number(k)));
    const url = data[lastIndex].url;

    const a = document.createElement("a");
    a.href = url;
    a.download = data[lastIndex].fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  // Refresh PDF list
  refreshBtn?.addEventListener("click", async () => {
    if (!window.safeEmail) return alert("Enter email first");
    await loadPdfList(window.safeEmail);
  });

  // Load initial if email exists
  if (window.safeEmail) loadPdfList(window.safeEmail);
}

setTimeout(attachUi, 300);
