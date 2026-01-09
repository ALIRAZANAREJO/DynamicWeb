// ResumePopup.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getStorage, ref as storageRef, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";

// ---------------- FIREBASE CONFIG ----------------
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
const storage = getStorage(app);

// ---------------- Inject Popup HTML ----------------
document.body.insertAdjacentHTML("beforeend", `
<div id="resumePopup" class="popup-overlay" style="display:none;">
  <div class="popup-card">
    <button id="closePopup" class="close-btn">&times;</button>
    <div class="pdf-wrapper">
      <iframe id="pdfViewer" style="width:100%;height:600px;border:1px solid #ccc;"></iframe>
    </div>
    <div class="popup-actions">
      <button id="downloadPdfBtn" class="action-btn">Download Resume</button>
    </div>
  </div>
</div>
`);

// ---------------- Helpers ----------------
function getEmailFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("email")?.trim() || null;
}

async function getPdfByEmail(email) {
  if (!email) return null;
  const path = `ResumePdf/Portfolio/${email}/1.pdf`;
  const pdfRef = storageRef(storage, path);
  try {
    const url = await getDownloadURL(pdfRef);
    console.log("PDF URL:", url);
    return url;
  } catch (err) {
    console.error("PDF not found:", err);
    return null;
  }
}

function waitForButton() {
  return new Promise(resolve => {
    const check = setInterval(() => {
      const btn = document.getElementById("showResumeBtn");
      if (btn) {
        clearInterval(check);
        resolve(btn);
      }
    }, 200);
  });
}

// ---------------- Main ----------------
waitForButton().then(showBtn => {
  const popup = document.getElementById("resumePopup");
  const closeBtn = document.getElementById("closePopup");
  const downloadBtn = document.getElementById("downloadPdfBtn");
  const viewer = document.getElementById("pdfViewer");

  showBtn.addEventListener("click", async () => {
    const email = getEmailFromURL();
    if (!email) return alert("Email not found in URL");

    const pdfUrl = await getPdfByEmail(email);
    if (!pdfUrl) return alert("Resume PDF not found for this email");

    viewer.src = pdfUrl;
    popup.style.display = "flex";
    document.body.style.overflow = "hidden";

    downloadBtn.onclick = () => {
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = "Resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
  });

  closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
    viewer.src = "";
    document.body.style.overflow = "auto";
  });
});
