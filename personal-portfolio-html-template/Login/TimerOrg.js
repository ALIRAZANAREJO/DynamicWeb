// =================== Firebase Imports ===================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get, onValue, off } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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
const cnic = localStorage.getItem("Cnic"); // ✅ match login.js key
const email = localStorage.getItem("userEmail"); // ✅ match login.js key
const timerDisplay = document.getElementById("timerDisplay");

let hasRedirected = false;
let isVerified = false;

async function startTimer() {
  if (!cnic || !timerDisplay) {
    console.error("⚠️ CNIC or timer element missing.");
    return;
  }

  const accessRef = ref(db, `resContainer9/${cnic}/Access`);
  const snap = await get(accessRef);
  if (!snap.exists()) return;

  const { expiresAt, paymentStatus } = snap.val();

  // ✅ Already verified
  if (paymentStatus === "Verified") {
    timerDisplay.textContent = "✅ Access Verified";
    timerDisplay.style.color = "limegreen";
    return;
  }

  // 🕒 Countdown timer
  const interval = setInterval(() => {
    if (isVerified) return; // stop if verified

    const now = Date.now();
    const diff = expiresAt - now;

    if (diff <= 0) {
      clearInterval(interval);
      if (!hasRedirected && !isVerified) {
        hasRedirected = true;
        off(accessRef);
        timerDisplay.textContent = "❌ Access expired, redirecting...";
        timerDisplay.style.color = "red";
        setTimeout(() => window.location.replace("/UserWebPannel/Account/Pakig.html"), 1500);
      }
      return;
    }

    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    timerDisplay.textContent = `${mins}m ${secs}s`;
  }, 1000);

  // ⚡ Real-time paymentStatus listener
  onValue(accessRef, (snapshot) => {
    if (!snapshot.exists() || hasRedirected) return;

    const { paymentStatus } = snapshot.val();

    if (paymentStatus === "Verified" && !hasRedirected) {
      isVerified = true;
      hasRedirected = true;
      clearInterval(interval);
      off(accessRef);

      timerDisplay.textContent = "✅ Access Verified! Redirecting...";
      timerDisplay.style.color = "limegreen";

      // ✅ Correct full redirect path with email param
      const encodedEmail = encodeURIComponent(email);
      setTimeout(() => {
        window.location.replace(`/personal-portfolio-html-template/Login/User.html?email=${encodedEmail}`);
      }, 2000);
    }
  });
}

startTimer();


//   const interval = setInterval(() => {
//     const now = Date.now();
//     const diff = expiresAt - now;

//     if (diff <= 0) {
//       clearInterval(interval);
//       window.location.href = "/UserWebPannel/Account/Pakig.html";
//       return;
//     }

//     const hours = Math.floor(diff / (1000 * 60 * 60));
//     const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//     const secs = Math.floor((diff % (1000 * 60)) / 1000);
//     timerDisplay.textContent = `${hours}h ${mins}m ${secs}s`;
//   }, 1000);
// }

// startTimer();
