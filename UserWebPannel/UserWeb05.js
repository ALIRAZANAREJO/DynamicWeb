// ============================
// 🔹 UPDATE USER DATA IN FIRESTORE
// ============================
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "./firebaseConfig.js"; // adjust if your file name differs

// -----------------------------
// 🔹 Update function
// -----------------------------
async function updateData() {
  try {
    const cnicValue = document.getElementById('Cnic').value.trim();
    if (!cnicValue) return alert("Please enter a CNIC number before updating.");

    // Reference user document
    const userRef = doc(db, "users", cnicValue);

    // Collect updated input values
    const updatedData = {
      Professionality: {
        Years: document.getElementById("Years")?.value || "",
        aboutParagraph: document.getElementById("aboutParagraph")?.value || "",
        aboutPara2: document.getElementById("aboutPara2")?.value || "",
        aboutPara3: document.getElementById("aboutPara3")?.value || "",
        happyClients: document.getElementById("happyClients")?.value || "",
        projectsCompleted: document.getElementById("projectsCompleted")?.value || "",
        profession: getProfessionTags("professionInput"),
      },
      // 🔹 Add more sections if needed
      Service: collectServiceData(),
      Project: collectProjectData(),
      Team: collectTeamData(),
    };

    // Update Firestore doc
    await updateDoc(userRef, updatedData);
    alert("✅ Data updated successfully!");
  } catch (err) {
    console.error("Error updating data:", err);
    alert("Error updating data: " + err.message);
  }
}

// -----------------------------
// 🔹 Helper: Get profession tags (if using tag UI)
// -----------------------------
function getProfessionTags(inputId) {
  const container = document.getElementById(inputId)?.parentNode?.querySelector(".selected-container");
  if (!container) return [];
  return [...container.querySelectorAll(".tag")].map(tag => tag.textContent.trim());
}

// -----------------------------
// 🔹 Helper: Collect Service Data
// -----------------------------
function collectServiceData() {
  const services = [];
  document.querySelectorAll(".ser-row-wrapper").forEach(wrapper => {
    const index = wrapper.dataset.serIndex;
    const serviceItem = {
      organizationtitle: document.getElementById(`Organizationtitle_${index}`)?.value || "",
      organizationprice: document.getElementById(`Organizationprice_${index}`)?.value || "",
      durationest: document.getElementById(`organizationest_${index}`)?.value || "",
      durationdigits: document.getElementById(`organizationdigits_${index}`)?.value || "",
      idCardUrl: document.getElementById(`Organizationidentity_${index}`)?.dataset.url || "",
      documents: [],
    };

    // Collect service documents
    wrapper.querySelectorAll(".serwices-docs .ser-row").forEach((docRow, docIndex) => {
      const docName = document.getElementById(`serwiseddocname_${index}_${docIndex}`)?.value || "";
      const docUrl = document.getElementById(`serwiseddocpdf_${index}_${docIndex}`)?.dataset.url || "";
      if (docName || docUrl) {
        serviceItem.documents.push({ name: docName, url: docUrl });
      }
    });

    services.push(serviceItem);
  });
  return services;
}

// -----------------------------
// 🔹 Helper: Collect Project Data
// -----------------------------
function collectProjectData() {
  const projects = [];
  document.querySelectorAll(".project-item").forEach((proj, index) => {
    const project = {
      title: proj.querySelector(`#projectTitle${index + 1}`)?.value || "",
      description: proj.querySelector(`#projectDesc${index + 1}`)?.value || "",
      imageUrl: document.getElementById(`projectImg${index + 1}`)?.dataset.url || "",
      documents: [],
    };

    const docs = proj.querySelectorAll(".project-doc input[type='file']");
    docs.forEach((input, docIndex) => {
      const docUrl = input.dataset.url || "";
      if (docUrl) project.documents.push({ url: docUrl });
    });

    projects.push(project);
  });
  return projects;
}

// -----------------------------
// 🔹 Helper: Collect Team Data
// -----------------------------
function collectTeamData() {
  const team = [];
  document.querySelectorAll(".team-member").forEach((member, index) => {
    const item = {
      name: member.querySelector(`#teamName${index + 1}`)?.value || "",
      role: member.querySelector(`#teamRole${index + 1}`)?.value || "",
      profileImgUrl: document.getElementById(`teamImg${index + 1}`)?.dataset.url || "",
      documents: [],
    };

    const docs = member.querySelectorAll(".team-doc input[type='file']");
    docs.forEach((input, docIndex) => {
      const docUrl = input.dataset.url || "";
      if (docUrl) item.documents.push({ url: docUrl });
    });

    team.push(item);
  });
  return team;
}

// -----------------------------
// 🔹 Attach button event
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("updateBtn");
  if (btn) btn.addEventListener("click", updateData);
});
