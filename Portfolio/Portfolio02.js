// =================== Firebase Setup ===================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

// ----------------- Firebase configuration -----------------
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// =================== Portfolio Loader ===================
document.addEventListener("DOMContentLoaded", async () => {
  let Cnic = localStorage.getItem("Cnic");
  if (!Cnic) {
    Cnic = prompt("Please enter your CNIC to load your Portfolio data:");
    if (!Cnic) return alert("❌ CNIC is required to load your portfolio.");
    localStorage.setItem("Cnic", Cnic);
  }

  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `resContainer9/${Cnic}`));

    if (!snapshot.exists()) {
      alert(`⚠️ No data found for CNIC: ${Cnic}`);
      localStorage.removeItem("Cnic");
      const retry = confirm("Would you like to enter CNIC again?");
      if (retry) {
        const newCnic = prompt("Enter your CNIC number:");
        if (newCnic) {
          localStorage.setItem("Cnic", newCnic);
          location.reload();
        }
      }
      return;
    }

    const userData = snapshot.val();
    renderPortfolio(userData);
  } catch (err) {
    console.error("Error loading portfolio data:", err);
  }
});

// =================== Portfolio Renderer ===================
function renderPortfolio(data) {
  const personal = data.Personal || {};
  const education = data.Education || {};
  const skills = data.Skills || {};
  const experience = data.Experience || [];

  // ---------------- HERO SECTION ----------------
  setText("hero-name", personal.Name || "Your Name");
  setText("hero-profession", personal.profession || "Profession");
  setText("hero-about", personal.about || "I am a professional web developer.");
  setImage("hero-img", personal.ImageUrl || "assets/default-profile.png");

  // ---------------- ABOUT SECTION ----------------
  setText("about-desc", personal.about || "No about info provided.");
  setText("about-phone", personal.Phone || "-");
  setText("about-email", personal.Lisnt || "-");
  setText("about-address", personal.Caddres || "-");

  // ---------------- SKILLS SECTION ----------------
  const skillsContainer = document.getElementById("skills-list");
  if (skillsContainer) {
    const skillsList =
      Object.values(skills).map(s => `<li>${s.name || s}</li>`).join("") || "<li>No skills listed</li>";
    skillsContainer.innerHTML = skillsList;
  }

  // ---------------- EDUCATION SECTION ----------------
  function fillEdu(idPrefix, data) {
    setText(`${idPrefix}-name`, data?.Name || "-");
    setText(`${idPrefix}-degree`, data?.Degree || "-");
    setText(`${idPrefix}-gpa`, data?.Gpa || "-");
    setText(`${idPrefix}-start`, data?.Startyear || "-");
    setText(`${idPrefix}-end`, data?.Endyear || "-");
  }

  fillEdu("school", education.school);
  fillEdu("college", education.college);
  fillEdu("university", education.university);
  fillEdu("master", education.master);
  fillEdu("phd", education.phd);

  // ---------------- EXPERIENCE SECTION ----------------
  const expContainer = document.getElementById("experience-timeline");
  if (expContainer) {
    const experienceHTML = experience.map(
      exp => `
        <div class="timeline-item">
          <h4>${exp.organizationPosition || "Position"}</h4>
          <p>${exp.organizationName || "Organization"}</p>
          <p>${exp.durationNumber || ""} ${exp.durationUnit || ""}</p>
        </div>
      `
    ).join("");
    expContainer.innerHTML = experienceHTML || "<p>No experience data.</p>";
  }

  // ---------------- LANGUAGE SECTION ----------------
  const langContainer = document.getElementById("languages-list");
  if (langContainer) {
    const langsHTML = personal.Paddres
      ? personal.Paddres.split(",").map(l => `<li>${l.trim()}</li>`).join("")
      : "<li>-</li>";
    langContainer.innerHTML = langsHTML;
  }

  // ---------------- CONTACT SECTION ----------------
  setText("contact-name", personal.Name || "Name");
  setText("contact-email", personal.Lisnt || "Email not found");
  setText("contact-phone", personal.Phone || "Phone not found");
  setText("contact-location", personal.Caddres || "Location not found");
}

// =================== Helpers ===================
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setImage(id, src) {
  const el = document.getElementById(id);
  if (el) el.src = src;
}
