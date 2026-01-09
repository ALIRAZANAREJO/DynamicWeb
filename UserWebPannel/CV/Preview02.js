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
  const submitBtn = document.getElementById("submitBtn");
  const cnicInput = document.getElementById("Cnic");

  const selectedDesign = localStorage.getItem("selectedDesign");
  if (!selectedDesign) {
    alert("⚠️ No CV design selected! Redirecting...");
    return (window.location.href = "/UserWebPannel/CV/Cvaction.html");
  }

  // =================== CNIC Handling ===================
  // 🔹 Auto-save CNIC on typing (doesn't disturb submitBtn logic)
  if (cnicInput) {
    cnicInput.addEventListener("input", () => {
      const val = cnicInput.value.trim();
      if (val) localStorage.setItem("Cnic", val);
    });
  }

  // 🔹 Read CNIC from localStorage or prompt
  let Cnic = localStorage.getItem("Cnic");
  if (!Cnic) {
    Cnic = prompt("Please enter your CNIC to load your CV data:");
    if (!Cnic) return alert("❌ CNIC is required to load your CV.");
    localStorage.setItem("Cnic", Cnic);
  }

  // =================== Fetch CV Data ===================
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `resContainer9/${Cnic}`));

    if (!snapshot.exists()) {
      alert(`⚠️ No CV data found for CNIC: ${Cnic}`);
      localStorage.removeItem("Cnic");

      // Ask again without breaking existing save system
      const retry = confirm("Would you like to enter CNIC again?");
      if (retry) {
        const newCnic = prompt("Enter your CNIC number:");
        if (newCnic) {
          localStorage.setItem("Cnic", newCnic);
          location.reload();
        }
      } else {
        if (cvDisplay)
          cvDisplay.innerHTML = `<p>No data found for CNIC: ${Cnic}</p>`;
      }
      return;
    }

    const userData = snapshot.val();
    renderCV(selectedDesign, userData, cvDisplay);
  } catch (err) {
    console.error("Error fetching CV data:", err);
    if (cvDisplay)
      cvDisplay.innerHTML = `<p style="color:red;">Error loading CV data. Check console.</p>`;
  }

  // =================== Buttons ===================
  backBtn?.addEventListener("click", () => (window.location.href = "/UserWeb01.html"));
  okBtn?.addEventListener("click", () => {
    localStorage.setItem("finalCVDesign", selectedDesign);
    alert("✅ Design finalized!");
    window.location.href = "/UserWebPannel/CV/Cvaction.html";
  });
});

// =================== CV Renderer ===================
function renderCV(design, data, container) {
  const personal = data.Personal || {};
  const education = data.Education || {};
  const skills = data.Skills || {};
  const experience = data.Experience || [];
  const professionality = data.Professionality || [];

  // 🔹 Languages Section
  const langsHTML = personal.Paddres
    ? personal.Paddres.split(",").map(l => `<li>${l.trim()}</li>`).join("")
    : "<li>-</li>";

  // 🔹 Skills
  const skillsList = Object.values(skills).map(s => s.name || s).join(", ") || "No skills listed";

  // 🔹 Education Sections
  const educationHTML = [];
  const addEdu = (item, title) => {
    if (item) {
      educationHTML.push(`
        <div class="timeline-item">
          <h4>(${item.Startyear || ""} - ${item.Endyear || ""})</h4>
          <div class="place">${item.Name || title}</div>
          <p>${item.Degree || "Degree"}</p>
          <p>${item.Field || "Field"}</p>
          <p>${item.Subfield || ""}</p>
          <p>${item.Gpa || "GPA not listed"}</p>
        </div>
      `);
    }
  };

  addEdu(education.school, "School");
  addEdu(education.college, "College");
  addEdu(education.university, "University");
  addEdu(education.master, "Master University");
  addEdu(education.phd, "PhD University");

  // 🔹 Experience
  const experienceHTML = experience.map(exp => `
    <div class="timeline-item">
      <h4>(${exp.durationNumber || ""} ${exp.durationUnit || ""})</h4>
      <div class="place">${exp.organizationName || "Organization"}</div>
      <p>${exp.organizationPosition || "Position"}</p>
      ${
        exp.details
          ? `<ul class="bullet">${exp.details.map(d => `<li>${d}</li>`).join("")}</ul>`
          : ""
      }
    </div>
  `).join("");

  // =================== Final Render ===================
  container.innerHTML = `
    <div class="resume">
      <!-- LEFT -->
      <div class="left">
        <img src="${personal.ImageUrl || "/assets/default-profile.png"}" alt="Profile">
        <h2>About Me</h2>
        <p>${personal.about || "No about info provided."}</p>

        <h2>Contact</h2>
        <ul class="contact-info">
          <li>📞 ${personal.Phone || "-"}</li>
          <li>✉️ ${personal.Lisnt || "-"}</li>
          <li>📍 ${personal.Caddres || "-"}</li>
        </ul>

        <h2>Skills</h2>
        <ul>${skillsList.split(", ").map(s => `<li>${s}</li>`).join("")}</ul>

        <h2>Language</h2>
        <ul>${langsHTML}</ul>
      </div>

      <!-- RIGHT -->
      <div class="right">
        <h1>${personal.Name || "Full Name"} <span>${personal.Fname || ""}</span></h1>
        <p class="subtitle">${professionality.profession || "Profession"}</p>

        <section>
          <h3 class="section-title">Education</h3>
          ${educationHTML.join("")}
        </section>

        <section>
          <h3 class="section-title">Experience</h3>
          ${experienceHTML}
        </section>
      </div>
    </div>
  `;
}
