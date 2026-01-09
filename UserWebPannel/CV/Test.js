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

// =================== Main Logic ===================
document.addEventListener("DOMContentLoaded", async () => {
  const cvDisplay = document.getElementById("cvDisplay");
  const backBtn = document.getElementById("backBtn");
  const okBtn = document.getElementById("okBtn");
  const cnicInput = document.getElementById("Cnic");

  // CNIC handling
  let Cnic = localStorage.getItem("Cnic") || prompt("Enter your CNIC to load CV:");
  if (!Cnic) return alert("❌ CNIC is required.");
  localStorage.setItem("Cnic", Cnic);

  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `resContainer9/${Cnic}`));
    if (!snapshot.exists()) return alert("⚠️ No CV data found for this CNIC.");

    const data = snapshot.val();
    console.log("Fetched CV Data:", data);
    renderCV(data, cvDisplay);
  } catch (err) {
    console.error("Error fetching CV data:", err);
    cvDisplay.innerHTML = `<p style="color:red;">Error loading CV data. Check console.</p>`;
  }

  backBtn?.addEventListener("click", () => window.history.back());
  okBtn?.addEventListener("click", () => {
    alert("✅ CV Design finalized!");
  });
});

// =================== CV Renderer ===================
function renderCV(data, container) {
  const personal = data.Personal || {};
  const education = data.Education || {};
  const skills = data.Skills || {};
  const experienceArr = data.Experience || [];
  const projectArr = data.Project || [];
  const teamArr = data.Team || [];
  
  // Hobbies
  const hobbiesHTML = personal.Qual
    ? `<ul>${personal.Qual.split(",").map(h => `<li>${h.trim()}</li>`).join("")}</ul>`
    : "";

  // Languages
  const langsHTML = personal.Paddres
    ? `<ul>${personal.Paddres.split(",").map(l => `<li>${l.trim()}</li>`).join("")}</ul>`
    : "";

  // Skills
  const skillsHTML = Object.values(skills).length
    ? `<ul>${Object.values(skills).map(s => `<li>${s.name || s}</li>`).join("")}</ul>`
    : "";

  // Education
  const educationHTML = [];
  ["school","college","university","master","phd"].forEach(eduKey => {
    if (education[eduKey]) {
      const edu = education[eduKey];
      educationHTML.push(`
        <div class="timeline-item">
          <h4>${edu.Startyear || ""} - ${edu.Endyear || ""}</h4>
          <div class="place">${edu.Name || ""}</div>
          <p>${edu.Degree || ""}</p>
          <p>${edu.Field || ""}</p>
          <p>${edu.Subfield || ""}</p>
          <p>${edu.Gpa || ""}</p>
        </div>
      `);
    }
  });

  // Experience
  let experienceHTML = "";
  if (experienceArr.length) {
    console.log("Rendering Experience:", experienceArr);
    experienceHTML = experienceArr.map(exp => `
      <div class="timeline-item">
        <h4>${exp.durationNumber || ""} ${exp.durationUnit || ""}</h4>
        <div class="place">${exp.organizationName || ""}</div>
        <p>${exp.organizationPosition || ""}</p>
        ${exp.documents?.length ? `<ul>${exp.documents.map(d => `<li>${d.Name}</li>`).join("")}</ul>` : ""}
      </div>
    `).join("");
  }

  // Projects
  let projectHTML = "";
  if (projectArr.length) {
    console.log("Rendering Projects:", projectArr);
    projectHTML = projectArr.map(pro => `
      <div class="timeline-item">
        <h4>${pro.category || ""}</h4>
        <div class="place">${pro.projectName || ""}</div>
        <a href="${pro.projectUrl || "#"}" target="_blank">${pro.projectUrl || ""}</a>
        ${pro.Documents?.length ? `<ul>${pro.Documents.map(d => `<li>${d.Name}</li>`).join("")}</ul>` : ""}
      </div>
    `).join("");
  }
container.innerHTML = `
  <div class="resume">
    <div class="left">
      <img src="${personal.ImageUrl || "/assets/default-profile.png"}" alt="Profile">

      ${personal.Name || personal.Fname || personal.Cnic || personal.Phone || personal.Bsnumber || personal.Email || personal.Caddres
        ? `<h2>Personal Information</h2>
           <ul class="contact-info">
             ${personal.Fname ? `<li>Father NAME= ${personal.Fname}</li>` : ""}
             ${personal.Cnic ? `<li>Cnic No= ${personal.Cnic}</li>` : ""}
             ${personal.Phone ? `<li>📞 ${personal.Phone}</li>` : ""}
             ${personal.Bsnumber ? `<li>📞 ${personal.Bsnumber}</li>` : ""}
             ${personal.Email ? `<li>✉️ ${personal.Email}</li>` : ""}
             ${personal.Caddres ? `<li>📍 ${personal.Caddres}</li>` : ""}
           </ul>` 
        : ""}

      ${langsHTML ? `<h2>Languages</h2>${langsHTML}` : ""}
      ${skillsHTML ? `<h2>Skills</h2>${skillsHTML}` : ""}
      ${hobbiesHTML ? `<h2>Hobbies</h2>${hobbiesHTML}` : ""}

    </div>

    <div class="right">
      <h1>${personal.Name || ""} <span>${personal.Fname || ""}</span></h1>
      ${personal.profession ? `<p class="subtitle">${personal.profession}</p>` : ""}
        <p><h2>About Me</h2>${personal.about || ""}</p>

      ${educationHTML.length ? `<section><h3>Education</h3>${educationHTML.join("")}</section>` : ""}
      ${experienceHTML ? `<section><h3>Experience</h3>${experienceHTML}</section>` : ""}
      ${projectHTML ? `<section><h3>Projects</h3>${projectHTML}</section>` : ""}
    </div>
  </div>
`;
      }