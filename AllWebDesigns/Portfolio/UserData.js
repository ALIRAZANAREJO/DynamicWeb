import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

// ======================= Firebase Config =======================
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

// ======================= Initialize =======================
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ======================= Load Image =======================
async function loadPtprpImage() {
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email");

  if (!email) return console.warn("No email in URL");

  const safeEmailKey = email.replace(/\./g, "_");
  const userRef = ref(db, `PortfolioUsers/${safeEmailKey}`);

  try {
    const snap = await get(userRef);

    if (!snap.exists()) return console.warn("User node not found");

    const profilePicURL = snap.val().profilePic;

    if (!profilePicURL) return console.warn("No image URL saved in DB");

    const imgEl = document.getElementById("ptprpImg");
    if (imgEl) imgEl.src = profilePicURL;

  } catch (err) {
    console.error("Error loading image:", err);
  }
}

loadPtprpImage();
