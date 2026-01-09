// ---------- FIREBASE SETUP ----------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ---------- ADD EXPERIENCE ROW ----------
document.addEventListener("DOMContentLoaded", () => {
  const addExperienceBtn = document.getElementById("organizationexperiance");
  const experDocsContainer = document.querySelector(".exper-docs");
  let experienceCount = 1;

  addExperienceBtn.addEventListener("click", () => {
    experienceCount++;
    const newExp = document.createElement("div");
    newExp.classList.add("exp-row-wrapper");
    newExp.innerHTML = `
      <div class="exp-row">
        <div class="exp-group">
          <input type="text" id="Organizationname_${experienceCount}" class="exp-input" placeholder=" " required />
          <label class="exp-label">Organization Name</label>
        </div>

        <div class="exp-group">
          <select id="Organizationunit_${experienceCount}" class="exp-input" required>
            <option value="" disabled selected></option>
            <option value="Months">Months</option>
            <option value="Years">Years</option>
          </select>
          <label class="exp-label">Month Or Year</label>
        </div>

        <div class="exp-group">
          <input type="number" id="Organizationduration_${experienceCount}" class="exp-input" placeholder=" " required />
          <label class="exp-label">Duration Number</label>
        </div>

        <div class="exp-group file-group">
          <input type="file" id="Organizationidentity_${experienceCount}" class="exp-input" required />
          <label class="exp-label">ID Card</label>
        </div>

        <div class="moress-docs"></div>
        <button type="button" class="more-doc">+ Add New Documents</button>
        <button type="button" class="remove-experience">🗑️ Remove Experience</button>
      </div>
    `;
    experDocsContainer.appendChild(newExp);

    newExp.querySelector(".remove-experience").addEventListener("click", () => newExp.remove());
    newExp.querySelector(".more-doc").addEventListener("click", (e) => addMoreDoc(e.target));
  });

  function addMoreDoc(button) {
    const container = button.previousElementSibling;
    const docIndex = container.querySelectorAll(".exp-row").length + 1;

    const newDoc = document.createElement("div");
    newDoc.classList.add("exp-row");
    newDoc.innerHTML = `
      <div class="exp-group">
        <input type="text" id="moredocname_${docIndex}" class="exp-input" placeholder=" " required>
        <label class="exp-label" for="moredocname_${docIndex}">Document Name</label>
      </div>

      <div class="exp-group file-group">
        <input type="file" id="moredocpdf_${docIndex}" class="exp-input" required>
        <label class="exp-label" for="moredocpdf_${docIndex}">Choose Img Or PDF</label>
      </div>

      <button type="button" class="remove-doc">🗑️ Remove</button>
    `;
    container.appendChild(newDoc);
    newDoc.querySelector(".remove-doc").addEventListener("click", () => newDoc.remove());
  }

  document.querySelectorAll(".more-doc").forEach((btn) => {
    btn.addEventListener("click", (e) => addMoreDoc(e.target));
  });
});

// ---------- SAVE TO FIRESTORE ----------
document.getElementById("submitBtn").addEventListener("click", async () => {
  try {
    const CNICinput = document.getElementById("UserCNIC");
    const CNIC = CNICinput?.value.trim();
    if (!CNIC) {
      alert("⚠️ Please enter CNIC before submitting.");
      return;
    }

    // Optionally save CNIC in localStorage
    localStorage.setItem("CNIC", CNIC);

    const userRef = doc(db, "resContainer9", CNIC);
    const allExperienceRows = document.querySelectorAll(".exp-row-wrapper");
    let experienceData = {};

    allExperienceRows.forEach((wrapper, index) => {
      const expIndex = index + 1;

      const orgName = wrapper.querySelector(`#Organizationname_${expIndex}`) || wrapper.querySelector("#Organizationname");
      const orgUnit = wrapper.querySelector(`#Organizationunit_${expIndex}`) || wrapper.querySelector("#Organizationunit");
      const orgDuration = wrapper.querySelector(`#Organizationduration_${expIndex}`) || wrapper.querySelector("#Organizationduration");
      const orgIdentity = wrapper.querySelector(`#Organizationidentity_${expIndex}`) || wrapper.querySelector("#Organizationidentity");

      const moreDocsContainer = wrapper.querySelector(".moress-docs");
      const docRows = moreDocsContainer ? moreDocsContainer.querySelectorAll(".exp-row") : [];
      let moreDocs = [];

      docRows.forEach((row) => {
        const docName = row.querySelector("input[type='text']")?.value || "";
        const docFile = row.querySelector("input[type='file']")?.files[0]?.name || "";
        if (docName || docFile) moreDocs.push({ name: docName, file: docFile });
      });

      experienceData[`exp_${expIndex}`] = {
        OrganizationName: orgName?.value || "",
        OrganizationUnit: orgUnit?.value || "",
        OrganizationDuration: orgDuration?.value || "",
        OrganizationIdentity: orgIdentity?.files[0]?.name || "",
        MoreDocs: moreDocs,
      };
    });

    await setDoc(userRef, { Experience: experienceData }, { merge: true });

    alert("✅ Experience data saved successfully!");
  } catch (error) {
    console.error("Error saving experience data:", error);
    alert("❌ Error saving experience data. Check console for details.");
  }
});
