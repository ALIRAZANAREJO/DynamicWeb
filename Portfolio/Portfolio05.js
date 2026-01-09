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

// =================== DOM Ready ===================
document.addEventListener("DOMContentLoaded", async () => {
  // Ensure portfolio root exists
  let root = document.getElementById("portfolioRoot");
  if (!root) {
    root = document.createElement("div");
    root.id = "portfolioRoot";
    document.body.prepend(root);
  }

  const Cnic = localStorage.getItem("Cnic");
  if (!Cnic) return (root.innerHTML = `<p style="color:red;">❌ CNIC not found.</p>`);

  try {
    const snap = await get(child(ref(db), `resContainer9/${Cnic}`));
    if (!snap.exists()) {
      root.innerHTML = `<p style="color:orange;">⚠️ No data found for CNIC: ${Cnic}</p>`;
      return;
    }

    const data = snap.val();
    console.log("Fetched portfolio data for CNIC:", Cnic, data);

    const personal = data.Personal || data.personal || {};
    const skillsObj = data.Skills || data.skills || {};
    const education = data.Education || data.education || {};
    const experienceData = data.Experience || data.experience;
    const experience = Array.isArray(experienceData)
      ? experienceData
      : experienceData ? Object.values(experienceData) : [];

    renderPortfolio(personal, skillsObj, education, experience, root);
  } catch (err) {
    console.error("Error fetching data:", err);
    root.innerHTML = `<p style="color:red;">Error loading portfolio. Check console.</p>`;
  }
});

// =================== Render Portfolio ===================
function renderPortfolio(personal, skillsObj, education, experience, root) {
  const skills = Object.values(skillsObj).map(s => s.name || s);
  const langs = personal.Paddres
    ? personal.Paddres.split(",").map(l => l.trim())
    : [];

  const eduBlocks = [];
  for (const [key, item] of Object.entries(education)) {
    if (item && (item.Name || item.Degree)) {
      eduBlocks.push(`
        <div class="edu-card">
          <h4>${item.Name || key}</h4>
          <p>${item.Degree || ""}</p>
          <p>${item.Field || ""} ${item.Subfield || ""}</p>
          <p>${item.Startyear || ""} - ${item.Endyear || ""}</p>
          <span>${item.Gpa || item.Percentage || ""}</span>
        </div>
      `);
    }
  }

  const expBlocks = experience.map(exp => `
    <div class="exp-card">
      <h4>${exp.organizationName || "Organization"}</h4>
      <p>${exp.organizationPosition || ""}</p>
      <p class="duration">(${exp.durationNumber || ""} ${exp.durationUnit || ""})</p>
      ${
        exp.details
          ? `<ul>${exp.details.map(d => `<li>${d}</li>`).join("")}</ul>`
          : ""
      }
    </div>
  `).join("");

  root.innerHTML = `
    <div class="portfolio-container">
      <header>
        <img src="${personal.ImageUrl || '/assets/default-profile.png'}" alt="Profile">
        <div class="intro">
          <h1>${personal.Name || "Full Name"}</h1>
          <h2>${personal.profession || "Profession"}</h2>
          <p>${personal.about || ""}</p>
        </div>
      </header>

      <section class="skills-section">
        <h3>Skills</h3>
        <div class="skills-grid">
          ${skills.map(s => `<div class="skill-card">${s}</div>`).join("")}
        </div>
      </section>

      <section class="education-section">
        <h3>Education</h3>
        <div class="edu-grid">${eduBlocks.join("")}</div>
      </section>

      <section class="experience-section">
        <h3>Experience</h3>
        <div class="exp-grid">${expBlocks}</div>
      </section>

      ${
        langs.length
          ? `<section class="langs-section">
              <h3>Languages</h3>
              <ul>${langs.map(l => `<li>${l}</li>`).join("")}</ul>
            </section>`
          : ""
      }
    </div>
  `;
}
