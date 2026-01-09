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

// Initialize Firebase App & Database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// =================== Main Logic ===================
document.addEventListener("DOMContentLoaded", async () => {
  const displayBtn = document.getElementById("displayCV");
  const downloadBtn = document.getElementById("downloadCV");
  const cvOutput = document.getElementById("cvOutput");

  const selectedDesign = localStorage.getItem("finalCVDesign");
  const Cnic = localStorage.getItem("Cnic");

  if (!selectedDesign || !Cnic) {
    alert("⚠️ Missing CV design or CNIC. Please create your CV again.");
    return window.location.href = "/UserWebPannel/CV/Cv03.html";
  }

  // --- Fetch user data from Realtime Database ---
  let userData = {};
  try {
    const snapshot = await get(child(ref(db), `resContainer9/${Cnic}`));
    if (!snapshot.exists()) {
      alert("⚠️ No data found for CNIC: " + Cnic);
      return;
    }
    userData = snapshot.val();
  } catch (err) {
    console.error("🔥 Error fetching user data:", err);
    alert("Error fetching data. Check console for details.");
    return;
  }

  // =================== CV Renderer ===================
  function renderCV(design, data) {
    const personal = data.Personal || {};
    const education = data.Education || {};
    const skills = data.Skills || {};
    const experience = data.Experience || [];

    // 🔹 Languages Section
    const langsHTML = personal.Paddres
      ? personal.Paddres.split(',').map(l => `<li>${l.trim()}</li>`).join('')
      : '<li>-</li>';

    // 🔹 Skills
    const skillsList = Object.values(skills).map(s => s.name || s).join(", ") || "No skills listed";

    // 🔹 Education
    const makeEduItem = (edu, fallback) => `
      <div class="timeline-item">
        <h4>(${edu?.StartYear || ""} - ${edu?.EndYear || ""})</h4>
        <div class="place">${edu?.Name || fallback}</div>
        <p>${edu?.Degree || "-"}</p>
        <p>${edu?.Field || ""}</p>
        <p>${edu?.Subfield || ""}</p>
        ${edu?.Gpa ? `<p>GPA: ${edu.Gpa}</p>` : ""}
      </div>
    `;
    const educationHTML = `
      ${education.school ? makeEduItem(education.school, "School") : ""}
      ${education.college ? makeEduItem(education.college, "College") : ""}
      ${education.university ? makeEduItem(education.university, "University") : ""}
      ${education.master ? makeEduItem(education.master, "Master's") : ""}
      ${education.phd ? makeEduItem(education.phd, "PhD") : ""}
    `;

    // 🔹 Experience
    const experienceHTML = Array.isArray(experience)
      ? experience.map(exp => `
        <div class="timeline-item">
          <h4>(${exp.durationNumber || ""} ${exp.durationUnit || ""})</h4>
          <div class="place">${exp.organizationName || "Organization"}</div>
          <p>${exp.organizationPosition || "Position"}</p>
          ${exp.details ? `<ul>${exp.details.map(d => `<li>${d}</li>`).join("")}</ul>` : ""}
        </div>
      `).join("")
      : "<p>No experience added.</p>";

    // 🔹 Final CV layout (Design 1 and 2 use same structure but styled differently)
    const baseCV = `
      <div class="resume ${design}">
        <div class="left">
          <img src="${personal.ImageUrl || '/assets/default-profile.png'}" alt="Profile">
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

        <div class="right">
          <h1>${personal.Name || "Full Name"} <span>${personal.Fname || ""}</span></h1>
          <p class="subtitle">${personal.profession || "Profession"}</p>

          <section>
            <h3 class="section-title">Education</h3>
            ${educationHTML}
          </section>

          <section>
            <h3 class="section-title">Experience</h3>
            ${experienceHTML}
          </section>
        </div>
      </div>
    `;
    return baseCV;
  }

  // --- Display CV button ---
  displayBtn.addEventListener("click", () => {
    cvOutput.innerHTML = renderCV(selectedDesign, userData);
    cvOutput.style.display = "block";
  });

  // --- Download CV button ---
  downloadBtn.addEventListener("click", async () => {
    cvOutput.innerHTML = renderCV(selectedDesign, userData);
    cvOutput.style.display = "block";

    const opt = {
      margin: 0.2,
      filename: `${userData.Personal?.Name || "My"}_CV.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 1 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
    };
    await html2pdf().from(cvOutput).set(opt).save();
  });
});
