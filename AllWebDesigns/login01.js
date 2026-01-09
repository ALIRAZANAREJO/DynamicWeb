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
const email = localStorage.getItem("userEmail");
const timerDisplay = document.getElementById("timerDisplay");

let hasRedirected = false;
let isVerified = false;

// =================== Utils ===================
function toSafeEmail(email) {
  return email.replace(/[.#$[\]]/g, "_");
}

// =================== Main Logic ===================
async function startTimer() {
  if (!email || !timerDisplay) {
    console.error("⚠️ Email or timer element missing.");
    return;
  }

  const safeEmail = toSafeEmail(email);
  const accessRef = ref(
    db,
    `AR_Technologies/Ai/Dynamic_Web/${safeEmail}/Portfolio/Access`
  );

  const snap = await get(accessRef);
  if (!snap.exists()) return;

  const { expiresAt, paymentStatus } = snap.val();

  // ✅ Already verified
  if (paymentStatus === "Verified") {
    timerDisplay.textContent = "✅ Access Verified";
    timerDisplay.style.color = "limegreen";
    return;
  }

  // ⏳ Countdown
  const interval = setInterval(() => {
    if (isVerified) return;

    const diff = expiresAt - Date.now();

    if (diff <= 0) {
      clearInterval(interval);
      if (!hasRedirected) {
        hasRedirected = true;
        off(accessRef);
        timerDisplay.textContent = "❌ Access expired, redirecting...";
        timerDisplay.style.color = "red";
        setTimeout(() => {
          window.location.replace("/UserWebPannel/Account/Pakig.html");
        }, 1500);
      }
      return;
    }

    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    timerDisplay.textContent = `${mins}m ${secs}s`;
  }, 1000);

  // ⚡ Real-time verification listener
  onValue(accessRef, (snapshot) => {
    if (!snapshot.exists() || hasRedirected) return;

    const { paymentStatus } = snapshot.val();

    if (paymentStatus === "Verified") {
      isVerified = true;
      hasRedirected = true;
      clearInterval(interval);
      off(accessRef);

      timerDisplay.textContent = "✅ Access Verified! Redirecting...";
      timerDisplay.style.color = "limegreen";

      const encodedEmail = encodeURIComponent(email);
      setTimeout(() => {
        window.location.replace(
          `/personal-portfolio-html-template/Login/User.html?email=${encodedEmail}`
        );
      }, 2000);
    }
  });
}

startTimer();
