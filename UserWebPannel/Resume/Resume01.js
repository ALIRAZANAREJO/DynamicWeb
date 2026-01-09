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



// ---------- EMAIL ----------
let email = localStorage.getItem("userEmail") || prompt("Enter Email:") || "unknown@email.com";
email = email.toLowerCase();
localStorage.setItem("userEmail", email);

const toSafeEmail = (e) => {
  const [l, d] = e.split("@");
  return `${l}@${d.replace(/\./g, "_")}`;
};
const safeEmail = toSafeEmail(email);

let finalPdfBlob = null;

// ===============================
// WAIT FOR IMAGES
// ===============================
async function waitForImages(root) {
  const imgs = root.querySelectorAll("img");
  await Promise.all(
    [...imgs].map(img => new Promise(res => {
      if (img.complete) return res();
      img.onload = img.onerror = () => res();
    }))
  );
}

// ===============================
// FETCH USER DATA
// ===============================
async function fetchUser() {
  if (!window.safeEmail) return {};

  try {
    const snap = await get(
      child(ref(db), `AR_Technologies/Ai/Dynamic_Web/${safeEmail}/Portfolio`)
    );
    return snap.exists() ? snap.val() : {};
  } catch (e) {
    console.error("fetchUser error:", e);
    return {};
  }
}


async function generateUploadAndDownloadPDF() {
  const resume = document.getElementById("preview-resume");
  if (!resume) return alert("Resume not found");

  // ===============================
  // FORCE DESKTOP LAYOUT
  // ===============================
  const originalStyle = {
    transform: resume.style.transform,
    width: resume.style.width,
    maxWidth: resume.style.maxWidth
  };

  resume.style.transform = "scale(1)";
  resume.style.width = "794px";     // A4 width
  resume.style.maxWidth = "794px";

  // ===============================
  // CLONE FOR CAPTURE
  // ===============================
  const clone = resume.cloneNode(true);
  clone.classList.add("pdf-clone");

  const wrapper = document.createElement("div");
  wrapper.style.position = "absolute";
  wrapper.style.left = "-9999px";
  wrapper.style.top = "-9999px";
  wrapper.style.width = "794px";
  wrapper.style.height = "1123px";
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    await waitForImages(clone);

    // 🔥 ULTRA HD SETTINGS
    const SCALE = 4; // 4x = Ultra HD (safe for memory)

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

// ===============================
// PDF PAGE LAYOUT SETTINGS
// ===============================
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN_LEFT = 10;
const MARGIN_TOP = 10;

const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN_LEFT * 2);
const CONTENT_HEIGHT = PAGE_HEIGHT - (MARGIN_TOP * 2);

// ===============================
// ADD IMAGE WITH MARGINS
// ===============================
pdf.addImage(
  imgData,
  "JPEG",
  MARGIN_LEFT,
  MARGIN_TOP,
  CONTENT_WIDTH,
  CONTENT_HEIGHT,
  undefined,
  "FAST"
);


    const blob = pdf.output("blob");

    // Upload
    const fileRef = storageRef(
      storage,
      `ResumePdf/Portfolio/${safeEmail}/1.pdf`
    );
    await uploadBytes(fileRef, blob);

    // Download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Resume";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

  } catch (err) {
    console.error("PDF ERROR:", err);
    alert("Failed to generate PDF");
  } finally {
    // RESTORE UI
    resume.style.transform = originalStyle.transform;
    resume.style.width = originalStyle.width;
    resume.style.maxWidth = originalStyle.maxWidth;
    wrapper.remove();
  }
}

// ===============================
// BUTTON HANDLER
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("downloadPreviewPdf");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    try {
      const snap = await get(
        child(ref(db), `AR_Technologies/Ai/Dynamic_Web/${safeEmail}/Portfolio/Access`)
      );

      if (snap.val()?.paymentStatus !== "Verified") {
        window.location.href = "/personal-portfolio-html-template/Login/payment.html";
        return;
      }

      await generateUploadAndDownloadPDF();
    } catch (e) {
      console.error(e);
      alert("Download failed");
    }
  });
});







