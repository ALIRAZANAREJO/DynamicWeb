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

  const selectedDesign = localStorage.getItem("selectedDesign");
  if (!selectedDesign) {
    alert("⚠️ No CV design selected!");
    return (window.location.href = "/UserWebPannel/CV/Cvaction.html");
  }

  let Cnic = localStorage.getItem("Cnic");
  if (!Cnic) {
    Cnic = prompt("Enter CNIC:");
    if (!Cnic) return alert("CNIC required!");
    localStorage.setItem("Cnic", Cnic);
  }

  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `resContainer9/${Cnic}`));

    if (!snapshot.exists()) {
      alert(`❌ No data found for CNIC: ${Cnic}`);
      return;
    }

    const userData = snapshot.val();
    console.log("🔥 FULL FETCHED DATA:", userData);

    renderCV(selectedDesign, userData, cvDisplay);
  } catch (err) {
    console.error("CV LOAD ERROR:", err);
  }

  backBtn?.addEventListener("click", () => window.location.href = "/UserWeb01.html");
});

// =================== CV Renderer ===================
function renderCV(design, data, container) {
  const personal = data.Personal || {};
  const education = data.Education || {};

  const experienceData = Array.isArray(data.Experience) ? data.Experience : [];
  const projectData = Array.isArray(data.Project) ? data.Project : [];
  const referenceData = Array.isArray(data.Service) ? data.Service : [];

  const jobRef = data.JobReference || {};

  // ================= Languages ================
  const langsHTML = personal.Paddres
    ? `<ul>${personal.Paddres.split(",").map(l => `<li>${l.trim()}</li>`).join("")}</ul>`
    : "";

  // ================= Hobbies ================
  const hobbiesHTML = personal.Qual
    ? `<ul>${personal.Qual.split(",").map(h => `<li>${h.trim()}</li>`).join("")}</ul>`
    : "";

  // ================= Skills =================
  const skills = data.Skills || {};
  const skillsHTML = Object.keys(skills).length
    ? `<ul>${Object.values(skills)
        .map(s => `<li>${s.name || s}</li>`)
        .join("")}</ul>`
    : "";

  // ================ Education ==================
  const educationHTML = [];
  const addEdu = (item, title) => {
    if (!item) return;
    educationHTML.push(`
      <div class="timeline-item">
        <h4>(${item.Startyear || ""} - ${item.Endyear || ""})</h4>
        <div class="place">${item.Name || title}</div>
        <p>${item.Degree || ""}</p>
        <p>${item.Field || ""}</p>
        <p>${item.Subfield || ""}</p>
        <p>${item.Gpa || ""}</p>
      </div>
    `);
  };

  addEdu(education.school, "School");
  addEdu(education.college, "College");
  addEdu(education.university, "University");
  addEdu(education.master, "Master");
  addEdu(education.phd, "PhD");

  // ================ Experience ================
  const experienceHTML = experienceData.length
    ? experienceData
        .map(exp => `
      <div class="timeline-item">
        <h4>${exp.durationNumber || ""} ${exp.durationUnit || ""}</h4>
        <div class="place">${exp.organizationName || ""}</div>
        <p>${exp.organizationPosition || ""}</p>
      </div>
    `)
        .join("")
    : "";

  // ================ Projects ==================
  const projectHTML = projectData.length
    ? projectData
        .map(pro => `
      <div class="project-box">
        <h4>${pro.projectName || ""}</h4>
        <p>${pro.category || ""}</p>
        <a href="${pro.projectUrl}" target="_blank">View Project</a>
      </div>
    `)
        .join("")
    : "";

  // ================ Job Reference (2 Columns) ==================
  const ref1 = jobRef.Reference1 || {};
  const ref2 = jobRef.Reference2 || {};

  const jobRefHTML =
    ref1.Name || ref2.Name
      ? `
    <section>
      <h3>Job References</h3>
      <div class="reference-columns">

        <div class="ref-box">
          ${ref1.Name ? `<p><b>Name:</b> ${ref1.Name}</p>` : ""}
          ${ref1.Post ? `<p><b>Post:</b> ${ref1.Post}</p>` : ""}
          ${ref1.Email ? `<p><b>Email:</b> ${ref1.Email}</p>` : ""}
          ${ref1.PhoneNumber ? `<p><b>Phone:</b> ${ref1.PhoneNumber}</p>` : ""}
        </div>

        <div class="ref-box">
          ${ref2.Name ? `<p><b>Name:</b> ${ref2.Name}</p>` : ""}
          ${ref2.Post ? `<p><b>Post:</b> ${ref2.Post}</p>` : ""}
          ${ref2.Email ? `<p><b>Email:</b> ${ref2.Email}</p>` : ""}
          ${ref2.PhoneNumber ? `<p><b>Phone:</b> ${ref2.PhoneNumber}</p>` : ""}
        </div>

      </div>
    </section>`
      : "";

  // =================== FINAL RENDER ===================
  container.innerHTML = `
    <div class="resume">

      <!-- LEFT -->
      <div class="left">
        <img src="${personal.ImageUrl || "/assets/default-profile.png"}" alt="Profile">

        ${
          personal.Fname ||
          personal.Cnic ||
          personal.Phone ||
          personal.Bsnumber ||
          personal.Email ||
          personal.Caddres
            ? `
        <h2>Personal Information</h2>
        <ul class="contact-info">
          ${personal.Fname ? `<li>Father NAME = ${personal.Fname}</li>` : ""}
          ${personal.Cnic ? `<li>Cnic No = ${personal.Cnic}</li>` : ""}
          ${personal.Phone ? `<li>📞 ${personal.Phone}</li>` : ""}
          ${personal.Bsnumber ? `<li>📞 ${personal.Bsnumber}</li>` : ""}
          ${personal.Email ? `<li>✉️ ${personal.Email}</li>` : ""}
          ${personal.Caddres ? `<li>📍 ${personal.Caddres}</li>` : ""}
        </ul>
        `
            : ""
        }

        ${personal.aboutHeadline ? `<h2>About Me</h2><p>${personal.aboutHeadline}</p>` : ""}
        ${langsHTML ? `<h2>Languages</h2>${langsHTML}` : ""}
        ${hobbiesHTML ? `<h2>Hobbies</h2>${hobbiesHTML}` : ""}
        ${skillsHTML ? `<h2>Skills</h2>${skillsHTML}` : ""}
      </div>

      <!-- RIGHT -->
      <div class="right">
        <h1>${personal.Name || ""} <span>${personal.Fname || ""}</span></h1>
        ${personal.profession ? `<p class="subtitle">${personal.profession}</p>` : ""}

        ${educationHTML.length ? `<section><h3>Education</h3>${educationHTML.join("")}</section>` : ""}
        ${experienceHTML ? `<section><h3>Experience</h3>${experienceHTML}</section>` : ""}
        ${projectHTML ? `<section><h3>Projects</h3>${projectHTML}</section>` : ""}
        ${jobRefHTML}
      </div>

    </div>
  `;
}
