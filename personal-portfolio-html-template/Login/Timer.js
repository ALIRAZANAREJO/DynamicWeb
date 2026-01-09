// =================== Firebase Imports ===================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getDatabase, ref, get, onValue, off } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

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

// =================== Init ===================
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// =================== Helpers ===================
const toSafeEmail = (e) => e.replace(/[.#$[\]]/g, "_");
const email = localStorage.getItem("userEmail");

let interval = null;
let stopped = false;
let unsubscribeAccess = null;

function getTimerDisplay() {
  const el = document.getElementById("timerDisplay");
  if (!el) throw new Error("timerDisplay not found in DOM");
  return el;
}

// =================== Main ===================
async function startTimer() {
  console.log("🟢 timer.js loaded");
  console.log("📧 User email:", email);

  if (!email) {
    console.warn("⚠️ No email found, redirecting...");
    window.location.replace("/UserWebPannel/Account/Pakig.html");
    return;
  }

  const timerDisplay = getTimerDisplay();
  timerDisplay.textContent = "Loading...";

  const safeEmail = toSafeEmail(email);
  const accessRef = ref(db, `AR_Technologies/Ai/Dynamic_Web/${safeEmail}/Portfolio/Access`);

  // ---------- ONE TIME FETCH ----------
  const snap = await get(accessRef);
  if (!snap.exists()) {
    console.warn("❌ No access record found, redirecting...");
    window.location.replace("/UserWebPannel/Account/Pakig.html");
    return;
  }

  let { expiresAt, paymentStatus } = snap.val();
  expiresAt = Number(expiresAt);

  if (!expiresAt || isNaN(expiresAt)) {
    console.warn("❌ Invalid expiry time, redirecting...");
    window.location.replace("/UserWebPannel/Account/Pakig.html");
    return;
  }

  console.log("🔍 Access data fetched:", { expiresAt, paymentStatus });

  // ✅ Verified instantly
  if (paymentStatus === "Verified") {
    timerDisplay.textContent = "✅ Your verified successfully";
    timerDisplay.style.color = "limegreen";
    return;
  }

  // ❌ Rejected
  if (paymentStatus === "Rejected") {
    window.location.replace("/UserWebPannel/Account/Pakig.html");
    return;
  }

  // =================== TIMER ===================
  const tick = () => {
    if (stopped) return;

    const diff = expiresAt - Date.now();
    if (diff <= 0) {
      cleanup();
      window.location.replace("/UserWebPannel/Account/Pakig.html");
      return;
    }

    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const months = Math.floor(totalDays / 30);
    const days = totalDays % 30;
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    timerDisplay.textContent = `${months}mo ${days}d ${hours}h ${mins}m ${secs}s`;
    timerDisplay.style.color = "#ffc107";
  };

  tick();
  interval = setInterval(tick, 5000);
  console.log("⏱ Countdown started");

  // =================== SAFE REALTIME LISTENER ===================
  const onAccessChange = (s) => {
    if (!s.exists() || stopped) return;

    const { paymentStatus } = s.val();
    console.log("🔄 Realtime status:", paymentStatus);

    if (paymentStatus === "Verified") {
      cleanup();
      timerDisplay.textContent = "✅ Your verified successfully";
      timerDisplay.style.color = "limegreen";
    }

    if (paymentStatus === "Rejected") {
      cleanup();
      window.location.replace("/UserWebPannel/Account/Pakig.html");
    }
  };

  unsubscribeAccess = onValue(accessRef, onAccessChange);

  // =================== CLEANUP ===================
  function cleanup() {
    stopped = true;

    if (interval) clearInterval(interval);

    if (unsubscribeAccess) {
      off(accessRef, onAccessChange);
      unsubscribeAccess = null;
    }
  }
}

// =================== Boot ===================
startTimer();
