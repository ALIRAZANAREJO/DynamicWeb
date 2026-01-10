// Detect GitHub Pages repo name automatically
const BASE_PATH = location.hostname.includes("github.io")
  ? `/${location.pathname.split("/")[1]}/`  // e.g., /REPO_NAME/
  : "/";  // localhost or Firebase Hosting



// ======================= Firebase Modular Imports =======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

// ======================= Firebase Configuration =======================
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

// ======================= Init =======================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

// ======================= DOM =======================
const subContainer = document.getElementById("SubDesignsContainer");
const mainCards = document.getElementById("mainDesignCards");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
const cards = document.querySelectorAll(".design-card");
const loginBtn = document.getElementById("loginBtn");
const backBtn = document.getElementById("__backToMainDesigns_9921Btn");

loginBtn.style.display = "none";
backBtn.classList.add("hidden");

let selectedDesign = null;
let selectedSubDesign = null;

// ======================= Utils =======================
const toSafeEmail = (email) => email.replace(/[.#$[\]]/g, "_");



// async function fileExists(path) {
//   try {
//     const res = await fetch(path, { method: "HEAD" });
//     return res.ok;
//   } catch {
//     return false;
//   }
// }

// ======================= LOAD SUB DESIGNS =======================
async function loadSubDesigns(designName) {
  selectedDesign = designName;
  selectedSubDesign = null;
  subContainer.innerHTML = "";

  const jsonPath = `AllWebDesigns/${designName}/_files.json`;

  try {
    const res = await fetch(jsonPath);
    if (!res.ok) throw new Error();

    const files = await res.json();
    const wrap = document.createElement("div");
    wrap.className = "design-grid";

    files.forEach(sub => {
      const card = document.createElement("div");
      card.className = "design-card";
      card.style.display = "flex";
      card.style.flexDirection = "column";
      card.style.alignItems = "center";

      const img = document.createElement("img");
img.src = `${BASE_PATH}Assets/${sub.img}`;
      img.style.width = "240px";
      img.style.height = "100px";
      img.style.objectFit = "cover";

      const title = document.createElement("span");
      title.textContent = sub.name;

      card.append(img, title);

      card.onclick = async () => {
        const path = `AllWebDesigns/${designName}/${sub.name}.html`;
        if (!(await fileExists(path))) {
          alert("Coming soon");
          return;
        }
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

  } catch {
    alert("Service unavailable");
  }
}

// ======================= EVENTS =======================
cards.forEach(c => c.addEventListener("click", () => loadSubDesigns(c.dataset.design)));

backBtn.onclick = () => {
  subContainer.style.display = "none";
  mainCards.style.display = "grid";
  loginBtn.style.display = "none";
  backBtn.classList.add("hidden");
  selectedSubDesign = null;
};

closePopup.onclick = () => popup.classList.add("hidden");

// ======================= LOGIN LOGIC =======================
loginBtn.addEventListener("click", async () => {
  if (!selectedDesign || !selectedSubDesign) {
    alert("Please select a design first.");
    return;
  }

const htmlPath = `${BASE_PATH}AllWebDesigns/${selectedDesign}/${selectedSubDesign}.html`;
window.location.href = `${htmlPath}?email=${encodeURIComponent(email)}`;
  if (!(await fileExists(htmlPath))) {
    alert("Design not available.");
    return;
  }

  try {
    const { user } = await signInWithPopup(auth, provider);
    const email = user.email;
    const safeEmail = toSafeEmail(email);
    const now = Date.now();
const profilePic = user.photoURL || null;   // ✅ FIX

    const personalRef = ref(db, `AR_Technologies/Ai/Dynamic_Web/${safeEmail}/Portfolio/Personal`);
    const accessRef = ref(db, `AR_Technologies/Ai/Dynamic_Web/${safeEmail}/Portfolio/Access`);
const personalSnap = await get(personalRef);
if (!personalSnap.exists()) {
  alert("No user found. Contact admin.");
  return;
}

// ✅ SAVE PROFILE FIRST (ALWAYS)
await set(ref(db, `PortfolioUsers/${safeEmail}`), {
  email,
  profilePic
});

const accessSnap = await get(accessRef);

if (accessSnap.exists()) {
  const { expiresAt } = accessSnap.val();

  if (expiresAt > now) {
    window.location.href = `${htmlPath}?email=${encodeURIComponent(email)}`;
    return;
  }

  if (expiresAt <= now) {
    window.location.href = `UserWebPannel/Account/Pakig.html`;
    return;
  }
}

// FIRST TIME ACCESS
const expiresAt = now + 24 * 60 * 60 * 1000;

await set(accessRef, {
  link: "User.html",
  timerStart: now,
  expiresAt,
  paymentStatus: "Pending"
});


    localStorage.setItem("userEmail", email);
    window.location.href = `${htmlPath}?email=${encodeURIComponent(email)}`;

  } catch (err) {
    console.error(err);
    alert("Login failed.");
  }
});
