// =================== Firebase Imports ===================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get, onValue, off } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// =================== Firebase Config ===================
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

// =================== Variables ===================
const params = new URLSearchParams(window.location.search);
const rawEmail = params.get("email");
const timerDisplay = document.getElementById("timerDisplay");

let hasRedirected = false;
let isVerified = false;

// =================== Helpers ===================
function hideTimer() {
  if (timerDisplay) timerDisplay.style.display = "none";
}

function getSafeEmail(email) {
  return decodeURIComponent(email || "")
    .trim()
    .toLowerCase()
    .replace(/\./g, "_");
}
async function startTimerByEmail() {
  if (!rawEmail || !timerDisplay) {
    console.error("Missing email or timer element");
    return;
  }

  const decodedEmail = decodeURIComponent(rawEmail).trim().toLowerCase();
  const safeEmail = getSafeEmail(rawEmail);

  // =================== 1. Check email exists ===================
  const usersRef = ref(db, "AR_Technologies/Ai/UsersEmail");
  const usersSnap = await get(usersRef);

  let emailExists = false;
  if (usersSnap.exists()) {
    const usersData = usersSnap.val();
    for (const idx in usersData) {
      if (usersData[idx].email === safeEmail) {
        emailExists = true;
        break;
      }
    }
  }

  if (!emailExists) {
    hasRedirected = true; // 🔒 prevent loop
    timerDisplay.textContent = "Email not registered.";
    timerDisplay.style.color = "red";
    setTimeout(() => location.replace("/UserWebPannel/Account/Pakig.html"), 1000);
    return;
  }

  // =================== 2. Access Check ===================
  const accessRef = ref(db, `AR_Technologies/Ai/Dynamic_Web/${safeEmail}/Portfolio/Access`);
  const accessSnap = await get(accessRef);

  if (!accessSnap.exists()) {
    hasRedirected = true; // 🔒 prevent loop
    timerDisplay.textContent = "No active access found.";
    timerDisplay.style.color = "orange";
    setTimeout(() => location.replace("/UserWebPannel/Account/Pakig.html"), 1000);
    return;
  }

  let { paymentStatus, expiresAt } = accessSnap.val();

  // =================== 3. Expiry Timer ===================
  const interval = setInterval(() => {
    if (hasRedirected || isVerified) return;

    const now = Date.now();
    const diff = (expiresAt || 0) - now;

    if (diff <= 0) {
      clearInterval(interval);
      hasRedirected = true; // 🔒 prevent loop
      off(accessRef);
      timerDisplay.textContent = "❌ Access expired.";
      timerDisplay.style.color = "red";
      setTimeout(() => location.replace("/UserWebPannel/Account/Pakig.html"), 1000);
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    timerDisplay.textContent = `${d}d ${h}h ${m}m ${s}s`;
  }, 1000);

  // =================== 4. Live Verification ===================
  const listener = onValue(accessRef, snap => {
    if (!snap.exists() || hasRedirected) return;

    const data = snap.val();
    if (data.paymentStatus === "Verified") {
      isVerified = true;
      clearInterval(interval);
      off(accessRef, "value", listener);
      hideTimer();

      setTimeout(() => {
        location.replace(`/AllWebDesigns/Portfolio/Portfolio01.html?email=${encodeURIComponent(decodedEmail)}`);
      }, 1500);
    }
  });
}

startTimerByEmail();
