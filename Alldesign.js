// ======================= Firebase Imports =======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

// ======================= Firebase Config =======================
const firebaseConfig = {
  apiKey: "AIzaSyCmL8qcjg4S6NeY3erraq_XhlDJ7Ek2s_E",
  authDomain: "palestine-web.firebaseapp.com",
  databaseURL: "https://palestine-web-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "palestine-web",
  storageBucket: "palestine-web.appspot.com",
  messagingSenderId: "35190212487",
  appId: "1:35190212487:web:0a699bb1fa7b1a49113522"
};

// ======================= Init =======================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

// ======================= GitHub BASE PATH AUTO =======================
const BASE_PATH = location.hostname.includes("github.io")
  ? `/${location.pathname.split("/")[1]}/`
  : "";

// ======================= DOM =======================
const subContainer = document.getElementById("SubDesignsContainer");
const mainCards = document.getElementById("mainDesignCards");
const cards = document.querySelectorAll(".design-card");
const loginBtn = document.getElementById("loginBtn");
const backBtn = document.getElementById("__backToMainDesigns_9921Btn");

loginBtn.style.display = "none";
backBtn.classList.add("hidden");

let selectedDesign = null;
let selectedSubDesign = null;

// ======================= Utils =======================
const toSafeEmail = (email) => email.replace(/[.#$[\]]/g, "_");

// ======================= LOAD SUB DESIGNS =======================
async function loadSubDesigns(designName) {
  selectedDesign = designName;
  selectedSubDesign = null;
  subContainer.innerHTML = "";

  const jsonPath = `${BASE_PATH}AllWebDesigns/${designName}/_files.json`;

  console.log("📂 Fetching:", jsonPath);

  try {
    const res = await fetch(jsonPath);
    if (!res.ok) throw new Error(res.status);

    const files = await res.json();
    console.log("✅ JSON Loaded:", files);

    const wrap = document.createElement("div");
    wrap.className = "design-grid";

    files.forEach(sub => {
      const card = document.createElement("div");
      card.className = "design-card";

      const img = document.createElement("img");
      img.src = `${BASE_PATH}Assets/${sub.img}`;

      const title = document.createElement("span");
      title.textContent = sub.name;

      card.append(img, title);

      card.onclick = () => {
        selectedSubDesign = sub.name;
        wrap.querySelectorAll(".design-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
      };

      wrap.appendChild(card);
    });

    subContainer.appendChild(wrap);
    mainCards.style.display = "none";
    subContainer.style.display = "grid";
    loginBtn.style.display = "block";
    backBtn.classList.remove("hidden");

  } catch (err) {
    console.error("❌ JSON fetch failed:", err);
    alert("Service unavailable");
  }
}

// ======================= EVENTS =======================
cards.forEach(c =>
  c.addEventListener("click", () => loadSubDesigns(c.dataset.design))
);

backBtn.onclick = () => {
  subContainer.style.display = "none";
  mainCards.style.display = "grid";
  loginBtn.style.display = "none";
  backBtn.classList.add("hidden");
  selectedSubDesign = null;
};

// ======================= LOGIN =======================
loginBtn.addEventListener("click", async () => {
  if (!selectedDesign || !selectedSubDesign) {
    alert("Select a design first");
    return;
  }

  try {
    const { user } = await signInWithPopup(auth, provider);
    const email = user.email;
    const safeEmail = toSafeEmail(email);
    const now = Date.now();

    // ✅ SAVE EMAIL FIRST
    localStorage.setItem("userEmail", email);

    const accessRef = ref(db, `AR_Technologies/Ai/Dynamic_Web/${safeEmail}/Portfolio/Access`);
    const snap = await get(accessRef);

    const htmlPath = `${BASE_PATH}AllWebDesigns/${selectedDesign}/${selectedSubDesign}.html`;

    if (snap.exists() && snap.val().expiresAt > now) {
      window.location.href = htmlPath;
      return;
    }

    await set(accessRef, {
      expiresAt: now + 86400000,
      paymentStatus: "Pending"
    });

    window.location.href = htmlPath;

  } catch (err) {
    console.error(err);
    alert("Login failed");
  }
});
