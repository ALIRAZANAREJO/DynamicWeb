// -----------------------------
// Firebase + app logic that stores Personal, Education, Experience, Skills
// under resContainer9/{CNIC} with files uploaded to Storage and URLs saved in DB.
// -----------------------------

// Imports (v9)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, set, onValue, get, child, update, remove, } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

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
const storage = getStorage(app);

// ----------------- Elements -----------------
const cnic = document.getElementById('Cnic');
const nameInput = document.getElementById('Name');
const fname = document.getElementById('Fname');
const dob = document.getElementById('Dob');
const phone = document.getElementById('Phone');
const caddres = document.getElementById('Caddres');
const paddres = document.getElementById("Paddres");
const qual = document.getElementById('Qual');
const lisnt = document.getElementById('Lisnt');
const rarmy = document.getElementById('Rarmy');
const selfVideoInput = document.getElementById('selfVideoUrl');
const citybox = document.getElementById('Citybox');
const countrybox = document.getElementById('Countrybox');
const resumeprofession = document.getElementById('Resumeprofession');
const aboutpera = document.getElementById('Aboutpera');
const imageUpload = document.getElementById('ImageUpload');
const imagePreview = document.getElementById('image-preview');
const submitBtn = document.getElementById('submitBtn');
const deleteBtn = document.getElementById('deleteBtn');
const recallBtn = document.getElementById('recallBtn');
const resContainer9 = document.getElementById('resContainer9');

// Business input elements
const busName = document.getElementById('Busname');
const busNumber = document.getElementById('BusNumber');
const busEmail = document.getElementById('Busemail');
const busAddress = document.getElementById('Busaddress');
const busFacebook = document.getElementById('Busfacebooks');
const busInstagram = document.getElementById('Instagram');
const busLinkedIn = document.getElementById('Buslinkedin');
const busTwitter = document.getElementById('Twitter');
const busGithub = document.getElementById('Github');
const busYoutube = document.getElementById('Youtube');

// ----------------- Job Reference Elements -----------------
const refName1 = document.getElementById('Refreencename');
const post1 = document.getElementById('Post');
const refNumber1 = document.getElementById('Refnumber');
const refEmail1 = document.getElementById('Refemail');
const refName2 = document.getElementById('Refreencename02');
const post2 = document.getElementById('Post02');
const refNumber2 = document.getElementById('Refnumber02');
const refEmail2 = document.getElementById('Refemail02');

// ----------------- Helpers -----------------
function getSkills() {
    return JSON.parse(localStorage.getItem("selectedSkills")) || [];
}

function maybeGetById(id) {
    return document.getElementById(id) || null;
}

// Preview image on upload
imagePreview.addEventListener('click', () => imageUpload.click());
imageUpload.addEventListener('change', () => {
    const file = imageUpload.files[0];
    if (file) imagePreview.src = URL.createObjectURL(file);
});

// ----------------- Fetch & display cards -----------------
function fetchAndDisplayCards() {
    const dbRef = ref(db, "resContainer9");
    onValue(dbRef, snapshot => {
        resContainer9.innerHTML = "";
        snapshot.forEach(childSnapshot => createCard(childSnapshot.key, childSnapshot.val()));
    });
}

function createCard(id, data) {
    const personal = data.Personal || {};
    const Skills = data.Skills || [];
    const ImageUrl = personal.ImageUrl || "";

    const card = document.createElement('div');
    card.className = 'card-container';
    card.innerHTML = `
       <div class="card">
        <div class="image-upload-circle">
          <img src="${ImageUrl}" alt="${id}" style="width:100px; height:100px; object-fit: cover; border-radius: 50%;">
        </div>
        <h3 class="card-title">${id}</h3>
        <p>Name: ${personal.Name || ""}</p>
        <p>Father's Name: ${personal.Fname || ""}</p>
        <p>Date of Birth: ${personal.Dob || ""}</p>
        <p>Phone: ${personal.Phone || ""}</p>
        <p>Current Address: ${personal.Caddres || ""}</p>
        <p>Permanent Address: ${personal.Paddres || ""}</p>
        <p>Qualification: ${personal.Qual || ""}</p>
        <p>Skills: ${Skills.map(s => `${s.name} (${s.percent})`).join(", ")}</p>
       </div>`;
    resContainer9.appendChild(card);
}

// ----------------- Clear Form -----------------
function clearForm() {
    cnic.value = '';
    nameInput.value = '';
    fname.value = '';
    dob.value = '';
    phone.value = '';
    caddres.value = '';
    paddres.value = '';
    qual.value = '';
    lisnt.value = '';
    rarmy.value = '';
    selfVideoUrl.value = '';
    citybox.value = '';
    countrybox.value = '';
    imageUpload.value = '';
    imagePreview.src = '';
    localStorage.removeItem("selectedSkills");
    // Clear business inputs
    busName.value = '';
    busNumber.value = '';
    busEmail.value = '';
    busAddress.value = '';
    busFacebook.value = '';
    busInstagram.value = '';
    busLinkedIn.value = '';
    busTwitter.value = '';
    busGithub.value = '';
    busYoutube.value = '';
    // Clear job reference inputs
    refName1.value = '';
    post1.value = '';
    refNumber1.value = '';
    refEmail1.value = '';
    refName2.value = '';
    post2.value = '';
    refNumber2.value = '';
    refEmail2.value = '';
}

// ----------------- Get Job Reference Data -----------------
async function getJobReferenceData(cnicValue) {
    const jobReferenceData = {
        Reference1: {
            Name: refName1.value,
            Post: post1.value,
            PhoneNumber: refNumber1.value,
            Email: refEmail1.value,
        },
        Reference2: {
            Name: refName2.value,
            Post: post2.value,
            PhoneNumber: refNumber2.value,
            Email: refEmail2.value,
        }
    };
    return jobReferenceData;
}

// ----------------- Fetch Professional Data -----------------
async function getProfessionalityData(cnicValue) {
    // Upload files if selected
    let frontUrl = "", backUrl = "", profileUrl = "";

    const frontFile = document.getElementById('CnicFrontUpload')?.files[0];
    const backFile = document.getElementById('CnicBackUpload')?.files[0];
    const profileFile = document.getElementById('ProfilePhotoUpload')?.files[0];

    if (frontFile) {
        const refFront = storageRef(storage, `professionality/${cnicValue}/CnicFront_${Date.now()}_${frontFile.name}`);
        const snap = await uploadBytes(refFront, frontFile);
        frontUrl = await getDownloadURL(snap.ref);
    }

    if (backFile) {
        const refBack = storageRef(storage, `professionality/${cnicValue}/CnicBack_${Date.now()}_${backFile.name}`);
        const snap = await uploadBytes(refBack, backFile);
        backUrl = await getDownloadURL(snap.ref);
    }

    if (profileFile) {
        const refProfile = storageRef(storage, `professionality/${cnicValue}/ProfilePhoto_${Date.now()}_${profileFile.name}`);
        const snap = await uploadBytes(refProfile, profileFile);
        profileUrl = await getDownloadURL(snap.ref);
    }

    // Return full professionality data
    return {
        Years: maybeGetById('Years')?.value || "",
        aboutHeadline: maybeGetById('aboutHeadline')?.value || "",
        profession: maybeGetById('professionInput')?.value || "",
        aboutParagraph: maybeGetById('aboutParagraph')?.value || "",
        aboutPara2: maybeGetById('aboutPara2')?.value || "",
        aboutPara3: maybeGetById('aboutPara3')?.value || "",
        happyClients: maybeGetById('happyClients')?.value || "",
        projectsCompleted: maybeGetById('projectsCompleted')?.value || "",
        CnicFront: frontUrl,
        CnicBack: backUrl,
        ProfilePhoto: profileUrl,
        updatedAt: new Date().toISOString()
    };
}

// ----------------- Submit -----------------
submitBtn.addEventListener('click', async () => {
    if (!cnic.value) return alert("Please enter a CNIC number.");

    try {
        // ===== Upload profile image =====
        let imageUrl = imagePreview.src || "";
        const imageFile = imageUpload.files[0];
        if (imageFile) {
            const imageStorageRef = storageRef(storage, `images/${cnic.value}/${Date.now()}_${imageFile.name}`);
            const imageSnapshot = await uploadBytes(imageStorageRef, imageFile);
            imageUrl = await getDownloadURL(imageSnapshot.ref);
        }

  // ===== Upload Self Intro Video (Max 200MB) =====
let selfVideoUrl = ""; // stores Firebase URL (reassignable)
const selfVideoInput = document.getElementById("selfVideoUrl"); // DOM element (const)

const selfVideoFile = selfVideoInput.files[0];
if (selfVideoFile) {
    // ---- Size Restriction (200 MB) ----
    const maxSize = 200 * 1024 * 1024; // 200MB
    if (selfVideoFile.size > maxSize) {
        alert("Video must be under 200MB!");
        return; 
    }

    // ---- Fast Upload to Firebase Storage ----
    const videoStorageRef = storageRef(
        storage,
        `selfVideos/${cnic.value}/${Date.now()}_${selfVideoFile.name}`
    );

    const snapshot = await uploadBytes(videoStorageRef, selfVideoFile);

    // ---- Store download URL for DB ----
    selfVideoUrl = await getDownloadURL(snapshot.ref);
}


        // =========== Skills ===========
// =========== Skills =========== 
// =========== Skills =========== 
const skills = [...selectedSkills]; 
localStorage.setItem("selectedSkills", JSON.stringify(skills)); // optional: keep localStorage in sync

        // =========== Collect Education Data ===========
        const educationData = {};
        const eduCards = document.querySelectorAll(".edu-card");
        for (const card of eduCards) {
            const type = card.dataset.form; // school, college, etc.
            const nameInputEl = card.querySelector("input[type='text']");
            const degreeSelect = card.querySelector("select.float-input");
            const fieldSelect = card.querySelector(".field-select");
            const subfieldSelect = card.querySelector(".subfield-select");
            const rollnoInput = card.querySelector("input[type='number']");
            const gpaInput = card.querySelector("input[type='number04']");
            const startyearInput = card.querySelector("input[type='number02']");
            const endyearInput = card.querySelector("input[type='number03']");

            // Files: first two file inputs considered marksheet and certificate
            const fileInputs = card.querySelectorAll("input[type='file']");
            const marksheetFiles = [];
            const certificateFiles = [];
            if (fileInputs[0] && fileInputs[0].files.length > 0) {
                for (const f of fileInputs[0].files) marksheetFiles.push(f);
            }
            if (fileInputs[1] && fileInputs[1].files.length > 0) {
                for (const f of fileInputs[1].files) certificateFiles.push(f);
            }

            // Upload Marksheets
            const marksheetUrls = [];
            for (const file of marksheetFiles) {
                const refFile = storageRef(storage, `education/${cnic.value}/${type}/marksheets/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(refFile, file);
                marksheetUrls.push(await getDownloadURL(snapshot.ref));
            }

            // Upload Certificates
            const certificateUrls = [];
            for (const file of certificateFiles) {
                const refFile = storageRef(storage, `education/${cnic.value}/${type}/certificates/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(refFile, file);
                certificateUrls.push(await getDownloadURL(snapshot.ref));
            }

            // Build education object
            educationData[type] = {
                Name: nameInputEl ? nameInputEl.value : "",
                Degree: degreeSelect ? degreeSelect.value : "",
                Field: fieldSelect ? fieldSelect.value : "",
                Subfield: subfieldSelect ? subfieldSelect.value : (card.dataset.autoSubfield || ""),
                Rollno: rollnoInput ? rollnoInput.value : "",
                Gpa: gpaInput ? gpaInput.value : "",
                Startyear: startyearInput ? startyearInput.value : "",
                Endyear: endyearInput ? endyearInput.value : "",
                Marksheet: marksheetUrls,
                Certificate: certificateUrls,
                ExtraDocuments: []
            };

            // Extra documents inside edu card (selector .extra-doc-item)
            const extraDocItems = card.querySelectorAll('.extra-doc-item');
            const extraDocPromises = [];

            extraDocItems.forEach(docItem => {
                const docName = docItem.querySelector('input[type="text"]')?.value || "";
                const docFileInput = docItem.querySelector('input[type="file"]');
                const docFile = docFileInput?.files[0] || null;

                if (docFile) {
                    const fileRef = storageRef(storage, `education/${cnic.value}/${type}/extra/${Date.now()}_${docFile.name}`);
                    const promise = uploadBytes(fileRef, docFile)
                        .then(snapshot => getDownloadURL(snapshot.ref))
                        .then(url => {
                            educationData[type].ExtraDocuments.push({
                                name: docName,
                                url: url
                            });
                        });

                    extraDocPromises.push(promise);
                }
            });

            await Promise.all(extraDocPromises);
        }

        // =========== Experience ===========
        const experienceData = await collectExperiences(cnic.value);
        const serviceData = await collectServices(cnic.value);
        const projectData = await collectProjects(cnic.value);
        const teamData = await collectTeams(cnic.value);

        // =========== Prepare Personal object (nested) ===========
        const personalData = {
            Cnic: cnic.value,
            Name: nameInput.value,
            Fname: fname.value,
            Dob: dob.value,
            Phone: phone.value,
            Caddres: caddres.value,
            Paddres: paddres.value,
            Qual: qual.value,
            Lisnt: lisnt.value,
            Rarmy: rarmy.value,
            selfVideoUrl: selfVideoUrl,
            Citybox: citybox.value,
            Countrybox: countrybox.value,
            Resumeprofession: resumeprofession.value,
            Aboutpera: aboutpera.value,
            ImageUrl: imageUrl,
            Busname: busName.value,
            BusNumber: busNumber.value,
            Busemail: busEmail.value,
            Busaddress: busAddress.value,
            Busfacebooks: busFacebook.value,
            Instagram: busInstagram.value,
            Buslinkedin: busLinkedIn.value,
            Twitter: busTwitter.value,
            Github: busGithub.value,
            Youtube: busYoutube.value
        };

        // Get job reference data
        const jobReferenceData = await getJobReferenceData(cnic.value);

        // Get professionality data
        const professionalityData = await getProfessionalityData(cnic.value);

        // Store everything under CNIC


        // const newCnicRef = ref(db,`AR_Technologies/Ai/Dynamic_Web/Portfolio/${email.value}/Personal`);

        const newCnicRef = ref(db, `resContainer9/${cnic.value}`);
        await set(newCnicRef, {
            Personal: personalData,
            Education: educationData,
            Experience: experienceData,
            Skills: skills,
            Professionality: professionalityData,
            Service: serviceData,
            Project: projectData,
            Team: teamData,
            JobReference: jobReferenceData // Store job reference data
        });

        localStorage.removeItem("selectedSkills");
        clearForm();
        alert("Data stored successfully with education, experience, and professionality!");
        fetchAndDisplayCards();

    } catch (error) {
        console.error("Error storing data:", error);
        alert("Error storing data: " + error.message);
    }
});

fetchAndDisplayCards();








// ------------------- Full Fixed Experience JS -------------------
document.addEventListener("DOMContentLoaded", () => {
  const addExperienceBtn = document.getElementById("organizationexperiance");
  const experDocsContainer = document.querySelector(".exper-docs");
  let nextExperienceIndex = 1;
  const MAX_EXPERIENCES = 15;
  const MAX_DOCS_PER_EXP = 2;

  if (!experDocsContainer) {
    console.warn(".exper-docs container not found — dynamic experiences may not render.");
  }

// ---------- Add Dynamic Experience Row ----------
  if (addExperienceBtn) {
    addExperienceBtn.addEventListener("click", () => {
      const existing = document.querySelectorAll('.exp-row-wrapper[data-exp-index]');
      if (existing.length >= MAX_EXPERIENCES) {
        alert("You can only add up to 15 experiences.");
        return;
      }

      let candidate = nextExperienceIndex;
      while (document.querySelector(`.exp-row-wrapper[data-exp-index="${candidate}"]`)) {
        candidate++;
      }
      nextExperienceIndex = candidate + 1;

      if (existing.length + 1 === 5) {
        alert(
          "Hey user, you filled 5 experiences. These experiences will show in your CV.\n" +
          "If you add more, please prioritize your top 5 important experiences.\n\n" +
          "You can still fill up to 15 experiences."
        );
      }

      const html = createExperienceHTML(candidate);
      if (experDocsContainer) experDocsContainer.insertAdjacentHTML("beforeend", html);
      else document.body.insertAdjacentHTML("beforeend", html);
    });
  }

  // ---------- Experience HTML Template ----------
  function createExperienceHTML(expIndex) {
    return `
      <div class="exp-row-wrapper" data-exp-index="${expIndex}">
        <div class="exp-row">
          <div class="exp-group">
            <input type="text" id="Organizationname_${expIndex}" class="exp-input" placeholder=" " required />
            <label class="exp-label" for="Organizationname_${expIndex}">Organization Name</label>
          </div>
                <div class="exp-group">
        <input type="text" id="Organizationposition_${expIndex}" class="exp-input" placeholder=" " required />
        <label class="exp-label" for="Organizationposition_${expIndex}">Position</label>
      </div>
          <div class="exp-group">
            <select id="Organizationunit_${expIndex}" class="exp-input" required>
              <option value="" disabled selected></option>
              <option value="Months">Months</option>
              <option value="Years">Years</option>
            </select>
            <label class="exp-label" for="Organizationunit_${expIndex}">Month Or Year</label>
          </div>
          <div class="exp-group">
            <input type="number" id="Organizationduration_${expIndex}" class="exp-input" placeholder=" " required />
            <label class="exp-label" for="Organizationduration_${expIndex}">Duration Number</label>
          </div>
          <div class="exp-group file-group">
            <input type="file" id="Organizationidentity_${expIndex}" class="exp-input" required />
            <label class="exp-label" for="Organizationidentity_${expIndex}">ID Card</label>
          </div>

          <div class="moress-docs"></div>
          <button type="button" class="more-doc" data-exp="${expIndex}">+ Add New Documents</button>
          <button type="button" class="remove-experience">🗑️ Remove Experience</button>
        </div>
      </div>
    `;
  }

  // ---------- Extra Document HTML ----------
  function createMoreDocHTML(expIndex, docIndex) {
    return `
      <div class="exp-row">
        <div class="exp-group">
          <input type="text" id="moredocname_${expIndex}_${docIndex}" class="exp-input" placeholder=" " required>
          <label class="exp-label" for="moredocname_${expIndex}_${docIndex}">Document Name</label>
        </div>
        <div class="exp-group file-group">
          <input type="file" id="moredocpdf_${expIndex}_${docIndex}" class="exp-input" required>
          <label class="exp-label" for="moredocpdf_${expIndex}_${docIndex}">Choose Img Or PDF</label>
        </div>
        <button type="button" class="remove-doc">🗑️ Remove</button>
      </div>
    `;
  }

  // ---------- Event Delegation for Add/Remove ----------
  document.addEventListener("click", (e) => {
    // Add More Docs
    if (e.target.classList.contains("more-doc") || e.target.id === "Organizationmoredoc") {
      let wrapper = e.target.closest(".exp-row-wrapper") || e.target.closest(".exp-card");
      if (!wrapper) {
        console.warn("Cannot find experience wrapper for Add Doc");
        return;
      }

      if (!wrapper.dataset.expIndex) wrapper.dataset.expIndex = "0";

      const expIndex = wrapper.dataset.expIndex;
      const moressDocsContainer = wrapper.querySelector(".moress-docs");
      if (!moressDocsContainer) {
        console.warn("No .moress-docs found inside wrapper", wrapper);
        return;
      }

      const docCount = moressDocsContainer.querySelectorAll(".exp-row").length;
      if (docCount >= MAX_DOCS_PER_EXP) {
        alert("You can only add up to 2 additional document sets for this experience.");
        return;
      }

      const docIndex = docCount + 1;
      moressDocsContainer.insertAdjacentHTML("beforeend", createMoreDocHTML(expIndex, docIndex));
      return;
    }

    // Remove Experience
    if (e.target.classList.contains("remove-experience")) {
      const wrapper = e.target.closest(".exp-row-wrapper") || e.target.closest(".exp-card");
      if (!wrapper) return;

      if (wrapper.dataset.expIndex) {
        wrapper.remove();
      } else {
        const inputs = wrapper.querySelectorAll('input[type="text"], input[type="number"], select, input[type="file"]');
        inputs.forEach(i => {
          if (i.type === 'file') i.value = '';
          else if (i.tagName.toLowerCase() === 'select') i.selectedIndex = 0;
          else i.value = '';
        });
        const moress = wrapper.querySelectorAll('.moress-docs .exp-row');
        moress.forEach(node => node.remove());
      }
      return;
    }

    // Remove Document Row
    if (e.target.classList.contains("remove-doc")) {
      const docRow = e.target.closest(".exp-row");
      if (docRow) docRow.remove();
      return;
    }
  });
});
  // ---------- collectExperiences helper is attached to window below (function definition is reused) ----------
  // Note: we do not define collectExperiences here to avoid duplication — it's defined below and used by submit.

// ---------- Robust collectExperiences function (works for static first row = index 0 + dynamic ones) ----------
/*
  This function:
  - Finds every wrapper: any element with class `.exp-row-wrapper` OR element `.exp-card` containing experience fields.
  - Derives expIndex:
      - If wrapper.dataset.expIndex exists -> use it
      - else -> 0 (static first row)
  - Reads inputs using ID convention `Organizationname_{index}` when present, otherwise looks inside wrapper for inputs.
  - Uploads files to storage under `experiance/{CNIC}/{expIndex}/...`
*/
async function collectExperiences(cnicValue) {
  // Gather wrappers (static .exp-card that contains the original row may not have data-exp-index)
  const wrappers = [];
  // preferred: explicit exp-row-wrapper elements (these include dynamic ones)
  document.querySelectorAll('.exp-row-wrapper').forEach(w => wrappers.push(w));
  // also include original .exp-card if present and not already included
  const expCard = document.querySelector('.exp-card');
  if (expCard && !wrappers.includes(expCard)) {
    // But if the exp-card contains .exp-row-wrapper inside it, do not duplicate
    if (!expCard.querySelector('.exp-row-wrapper')) wrappers.unshift(expCard);
    else {
      // if exp-card contains a wrapper, we assume wrapper covers original row
      // do nothing
    }
  }

  // As a final fallback, include any element that looks like an experience row
  if (wrappers.length === 0) {
    document.querySelectorAll('.experience-item, .exp-row').forEach(w => wrappers.push(w));
  }

  const results = [];

  // Ensure unique wrappers in order
  const uniqueWrappers = Array.from(new Set(wrappers));

  for (const wrapper of uniqueWrappers) {
    // Determine expIndex
    let expIndex = wrapper.dataset && wrapper.dataset.expIndex !== undefined ? wrapper.dataset.expIndex : null;
    if (expIndex === null) {
      // try to infer from child IDs like Organizationname_#
      const anyOrg = wrapper.querySelector('[id^="Organizationname_"], [id^="Organizationunit_"], [id^="Organizationduration_"]');
      if (anyOrg && anyOrg.id) {
        const parts = anyOrg.id.split('_');
        expIndex = (parts.length > 1) ? parts[1] : "0";
      } else {
        expIndex = "0";
      }
    }

    // Ensure it's string
    expIndex = expIndex.toString();

    // Try to locate main inputs by ID first (Organizationname_{expIndex}), else fallback to first relevant inputs inside wrapper
    const orgNameEl = maybeGetById(`Organizationname_${expIndex}`) || wrapper.querySelector('input[type="text"]');
    const orgPositionEl = maybeGetById(`Organizationposition_${expIndex}`) || wrapper.querySelector('input[type="text01"]');
    const orgUnitEl = maybeGetById(`Organizationunit_${expIndex}`) || wrapper.querySelector('select');
    const orgDurationEl = maybeGetById(`Organizationduration_${expIndex}`) || wrapper.querySelector('input[type="number"]');
    const orgIdentityEl = maybeGetById(`Organizationidentity_${expIndex}`) || wrapper.querySelector('input[type="file"]');

    const organizationName = orgNameEl ? (orgNameEl.value || "") : "";
    const organizationPosition = orgPositionEl ? (orgPositionEl.value || "") : "";
    const durationUnit = orgUnitEl ? (orgUnitEl.value || "") : "";
    const durationNumber = orgDurationEl ? (orgDurationEl.value || "") : "";

    // Upload ID card if present
    let idCardUrl = "";
    if (orgIdentityEl && orgIdentityEl.files && orgIdentityEl.files[0]) {
      try {
        const file = orgIdentityEl.files[0];
        const path = `experiance/${cnicValue}/${expIndex}/idcard/${Date.now()}_${file.name}`;
        const refFile = storageRef(storage, path);
        const snap = await uploadBytes(refFile, file);
        idCardUrl = await getDownloadURL(snap.ref);
      } catch (err) {
        console.warn("ID card upload failed for expIndex", expIndex, err);
        idCardUrl = "";
      }
    }

    // Collect extra documents for this wrapper (local to parent)
    const documents = [];
    // Prefer moress-docs container within the wrapper
    const extraDocsContainer = wrapper.querySelector('.moress-docs');
    const docRows = extraDocsContainer ? extraDocsContainer.querySelectorAll('.exp-row') : [];

    // Also check for inputs named using pattern moredocname_{expIndex}_{doc}
    const moreNameInputs = wrapper.querySelectorAll(`input[id^="moredocname_${expIndex}_"]`);

    // If pattern-based inputs found, use them (keeps naming consistent)
    if (moreNameInputs && moreNameInputs.length > 0) {
      for (const nameInputEl of moreNameInputs) {
        const nameId = nameInputEl.id;
        const suffix = nameId.slice(`moredocname_${expIndex}_`.length);
        const fileInputEl = wrapper.querySelector(`#moredocpdf_${expIndex}_${suffix}`);
        const docName = nameInputEl.value || "";
        let docFileUrl = "";
        if (fileInputEl && fileInputEl.files && fileInputEl.files[0]) {
          try {
            const file = fileInputEl.files[0];
            const path = `experiance/${cnicValue}/${expIndex}/docs/${Date.now()}_${file.name}`;
            const refFile = storageRef(storage, path);
            const snap = await uploadBytes(refFile, file);
            docFileUrl = await getDownloadURL(snap.ref);
          } catch (err) {
            console.warn("Error uploading doc for", expIndex, suffix, err);
            docFileUrl = "";
          }
        }
        documents.push({ name: docName, url: docFileUrl });
      }
    } else {
      // Otherwise use docRows inside moress-docs
      for (const docRow of docRows) {
        const docNameEl = docRow.querySelector('input[type="text"]');
        const docFileEl = docRow.querySelector('input[type="file"]');
        const docName = docNameEl?.value || "";
        let docFileUrl = "";
        if (docFileEl && docFileEl.files && docFileEl.files[0]) {
          try {
            const file = docFileEl.files[0];
            const path = `experiance/${cnicValue}/${expIndex}/docs/${Date.now()}_${file.name}`;
            const refFile = storageRef(storage, path);
            const snap = await uploadBytes(refFile, file);
            docFileUrl = await getDownloadURL(snap.ref);
          } catch (err) {
            console.warn("Error uploading docRow for expIndex", expIndex, err);
            docFileUrl = "";
          }
        }
        documents.push({ name: docName, url: docFileUrl });
      }
    }

    // Push experience record
    results.push({
      experienceIndex: expIndex.toString(),
      organizationName,
      organizationPosition,
      durationUnit,
      durationNumber,
      idCardUrl,
      documents
    });
  } // end for wrappers

  // Ensure experiences are ordered by numeric experienceIndex (0,1,2,...)
  results.sort((a, b) => {
    const ai = parseInt(a.experienceIndex || "0", 10);
    const bi = parseInt(b.experienceIndex || "0", 10);
    return ai - bi;
  });

  // Convert results into object keyed by index if you want object structure,
  // but we will return array (as your code expects). If you prefer object,
  // you can transform here.
  return results;
}

// ------------------- Full Fixed Service JS -------------------
document.addEventListener("DOMContentLoaded", () => {
  const addServiceBtn = document.getElementById("organizationservviced");
  const sererDocsContainer = document.querySelector(".serv-docs");
  let nextServiceIndex = 1;
  const MAX_SERVICES = 15;
  const MAX_DOCS_PER_ser = 2;

  if (!sererDocsContainer) {
    console.warn(".serv-docs container not found — dynamic Services may not render.");
  }

  // ---------- Add Dynamic Service Row ----------
  if (addServiceBtn) {
    addServiceBtn.addEventListener("click", () => {
      const existing = document.querySelectorAll('.ser-row-wrapper[data-ser-index]');
      if (existing.length >= MAX_SERVICES) {
        alert("You can only add up to 15 Services.");
        return;
      }

      let candidate = nextServiceIndex;
      while (document.querySelector(`.ser-row-wrapper[data-ser-index="${candidate}"]`)) {
        candidate++;
      }
      nextServiceIndex = candidate + 1;

      if (existing.length + 1 === 5) {
        alert(
          "Hey user, you filled 5 Services. These Services will show in your CV.\n" +
          "If you add serwised, please prioritize your top 5 important Services.\n\n" +
          "You can still fill up to 15 Services."
        );
      }

      const html = createServiceHTML(candidate);
      if (sererDocsContainer) sererDocsContainer.insertAdjacentHTML("beforeend", html);
      else document.body.insertAdjacentHTML("beforeend", html);
    });
  }

  // ---------- Service HTML Template ----------
  function createServiceHTML(serIndex) {
    return `
      <div class="ser-row-wrapper" data-ser-index="${serIndex}">
        <div class="ser-row">
          <div class="ser-group">
            <input type="text" id="Organizationtitle_${serIndex}" class="ser-input" placeholder=" " required />
            <label class="ser-label" for="Organizationtitle_${serIndex}">Service Name</label>
          </div>
                <div class="ser-group">
        <input type="text" id="Organizationprice_${serIndex}" class="ser-input" placeholder=" " required />
        <label class="ser-label" for="Organizationprice_${serIndex}">Starting Price</label>
      </div>
            <div class="ser-group">
        <input type="text01" id="organizationest_${serIndex}" class="ser-input" placeholder=" " required />
        <label class="ser-label" for="organizationest_${serIndex}">Discription</label>
      </div>
         
          <div class="ser-group">
            <input type="digits" id="organizationdigits_${serIndex}" class="ser-input" placeholder=" " required />
            <label class="ser-label" for="organizationdigits_${serIndex}">Experience Time</label>
          </div>
          <div class="ser-group file-group">
            <input type="file" id="
            ${serIndex}" class="ser-input" required />
            <label class="ser-label" for="organizationlicence_${serIndex}">Certificate Or Licence</label>
          </div>

          <div class="serwices-docs"></div>
          <button type="button" class="serwised-doc" data-ser="${serIndex}">+ Add New Documents</button>
          <button type="button" class="remove-service">🗑️ Remove Service</button>
        </div>
      </div>
    `;
  }

  // ---------- Extra Document HTML ----------
  function createserwisedDocHTML(serIndex, docIndex) {
    return `
      <div class="ser-row">
        <div class="ser-group">
          <input type="text" id="serwiseddocname_${serIndex}_${docIndex}" class="ser-input" placeholder=" " required>
          <label class="ser-label" for="serwiseddocname_${serIndex}_${docIndex}">Document Name</label>
        </div>
        <div class="ser-group file-group">
          <input type="file" id="serwiseddocpdf_${serIndex}_${docIndex}" class="ser-input" required>
          <label class="ser-label" for="serwiseddocpdf_${serIndex}_${docIndex}">Choose Img Or PDF</label>
        </div>
        <button type="button" class="remove-doc">🗑️ Remove</button>
      </div>
    `;
  }


// ===================== UNIVERSAL FILE PREVIEW HANDLER =====================
document.addEventListener("change", (e) => {
  const input = e.target;
  if (input.type === "file") handleFilePreview(input);
});

function handleFilePreview(input, fileUrl = "") {
  const file = input.files?.[0] || null;

  // Detect valid wrapper
  const wrapper = input.closest(".input-wrapper,.exp-group,.ser-group, .pro-group, .tem-group");
  if (!wrapper) return;

  // Remove previous preview if exists
  let existing = wrapper.querySelector(".inline-preview");
  if (existing) existing.remove();

  // Create preview element
  const isImage = file ? file.type.startsWith("image/") : /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl);
  const preview = document.createElement(isImage ? "img" : "div");
  preview.className = "inline-preview";

  // ========== STYLE ==========
Object.assign(preview.style, {
  position: "absolute",
  bottom: "5px",
  right: "5px",
  width: "50px",
  height: "50px",
  borderRadius: "8px",
  objectFit: "cover",
  background: "#fff",
  boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
  display: "block",
  opacity: "1",
  zIndex: "10", // ✅ ensures it's above the input
  pointerEvents: "none",
  textAlign: "center",
  lineHeight: "60px",
  fontSize: "32px",
});


  // Detect file or URL source
  if (file) {
    if (file.type.startsWith("image/")) {
      preview.src = URL.createObjectURL(file);
    } else if (file.type === "application/pdf") {
      preview.textContent = "📄";
    } else {
      preview.textContent = "⚠️";
    }
  } else if (fileUrl) {
    if (fileUrl.endsWith(".pdf")) {
      preview.textContent = "📄";
    } else {
      preview.src = fileUrl;
    }
  } else return;

  // Ensure wrapper is positioned correctly
  wrapper.style.position = "relative";
  wrapper.appendChild(preview);
}



function showSavedFilePreviews() {
  document.querySelectorAll('input[type="file"][data-url]').forEach((input) => {
    const url = input.getAttribute("data-url");
    if (url) handleFilePreview(input, url);
  });
}


showSavedFilePreviews();





  // ---------- Event Delegation for Add/Remove ----------
  document.addEventListener("click", (e) => {
    // Add serwised Docs
    if (e.target.classList.contains("serwised-doc") || e.target.id === "Organizationserwiseddoc") {
      let wrapper = e.target.closest(".ser-row-wrapper") || e.target.closest(".ser-card");
      if (!wrapper) {
        console.warn("Cannot find Service wrapper for Add Doc");
        return;
      }

      if (!wrapper.dataset.serIndex) wrapper.dataset.serIndex = "0";

      const serIndex = wrapper.dataset.serIndex;
      const servDocsContainer = wrapper.querySelector(".serwices-docs");
      if (!servDocsContainer) {
        console.warn("No .serwices-docs found inside wrapper", wrapper);
        return;
      }

      const docCount = servDocsContainer.querySelectorAll(".ser-row").length;
      if (docCount >= MAX_DOCS_PER_ser) {
        alert("You can only add up to 2 additional document sets for this Service.");
        return;
      }

      const docIndex = docCount + 1;
      servDocsContainer.insertAdjacentHTML("beforeend", createserwisedDocHTML(serIndex, docIndex));
      return;
    }

    // Remove Service
    if (e.target.classList.contains("remove-service")) {
      const wrapper = e.target.closest(".ser-row-wrapper") || e.target.closest(".ser-card");
      if (!wrapper) return;

      if (wrapper.dataset.serIndex) {
        wrapper.remove();
      } else {
        const inputs = wrapper.querySelectorAll('input[type="text"], input[type="digits"], select, input[type="file"]');
        inputs.forEach(i => {
          if (i.type === 'file') i.value = '';
          else if (i.tagName.toLowerCase() === 'select') i.selectedIndex = 0;
          else i.value = '';
        });
        const serv = wrapper.querySelectorAll('.serwices-docs .ser-row');
        serv.forEach(node => node.remove());
      }
      return;
    }

    // Remove Document Row
    if (e.target.classList.contains("remove-doc")) {
      const docRow = e.target.closest(".ser-row");
      if (docRow) docRow.remove();
      return;
    }
  });
});
  // ---------- collectservices helper is attached to window below (function definition is reused) ----------
  // Note: we do not define collectservices here to avoid duplication — it's defined below and used by submit.

// ---------- Robust collectservices function (works for static first row = index 0 + dynamic ones) ----------
/*
  This function:
  - Finds every wrapper: any element with class `.ser-row-wrapper` OR element `.ser-card` containing service fields.
  - Derives serIndex:
      - If wrapper.dataset.serIndex exists -> use it
      - else -> 0 (static first row)
  - Reads inputs using ID convention `Organizationtitle_{index}` when present, otherwise looks inside wrapper for inputs.
  - Uploads files to storage under `servviced/{CNIC}/{serIndex}/...`
*/
async function collectServices(cnicValue) {
  // Gather wrappers (static .ser-card that contains the original row may not have data-ser-index)
  const wrappers = [];
  // preferred: serlicit ser-row-wrapper elements (these include dynamic ones)
  document.querySelectorAll('.ser-row-wrapper').forEach(w => wrappers.push(w));
  // also include original .ser-card if present and not already included
  const serCard = document.querySelector('.ser-card');
  if (serCard && !wrappers.includes(serCard)) {
    // But if the ser-card contains .ser-row-wrapper inside it, do not duplicate
    if (!serCard.querySelector('.ser-row-wrapper')) wrappers.unshift(serCard);
    else {
      // if ser-card contains a wrapper, we assume wrapper covers original row
      // do nothing
    }
  }

  // As a final fallback, include any element that looks like an Service row
  if (wrappers.length === 0) {
    document.querySelectorAll('.service-item, .ser-row').forEach(w => wrappers.push(w));
  }

  const results = [];

  // Ensere unique wrappers in order
  const uniqueWrappers = Array.from(new Set(wrappers));

  for (const wrapper of uniqueWrappers) {
    // Determine serIndex
    let serIndex = wrapper.dataset && wrapper.dataset.serIndex !== undefined ? wrapper.dataset.serIndex : null;
    if (serIndex === null) {
      // try to infer from child IDs like Organizationtitle_#
      const anyOrg = wrapper.querySelector('[id^="Organizationtitle_"], [id^="organizationest_"], [id^="organizationdigits_"]');
      if (anyOrg && anyOrg.id) {
        const parts = anyOrg.id.split('_');
        serIndex = (parts.length > 1) ? parts[1] : "0";
      } else {
        serIndex = "0";
      }
    }

    // Ensere it's string
    serIndex = serIndex.toString();

    // Try to locate main inputs by ID first (Organizationtitle_{serIndex}), else fallback to first relevant inputs inside wrapper
    const orgNameEl = maybeGetById(`Organizationtitle_${serIndex}`) || wrapper.querySelector('input[type="text"]');
    const orgPositionEl = maybeGetById(`Organizationprice_${serIndex}`) || wrapper.querySelector('input[type="text01"]');
    const orgestEl = maybeGetById(`organizationest_${serIndex}`) || wrapper.querySelector('select');
    const orgdigitsEl = maybeGetById(`organizationdigits_${serIndex}`) || wrapper.querySelector('input[type="number03"]');
    const orgIdentityEl = maybeGetById(`organizationlicence_${serIndex}`) || wrapper.querySelector('input[type="file"]');

    const organizationtitle = orgNameEl ? (orgNameEl.value || "") : "";
    const organizationprice = orgPositionEl ? (orgPositionEl.value || "") : "";
    const durationest = orgestEl ? (orgestEl.value || "") : "";
    const durationdigits = orgdigitsEl ? (orgdigitsEl.value || "") : "";

    // Upload ID card if present
    let idCardUrl = "";
    if (orgIdentityEl && orgIdentityEl.files && orgIdentityEl.files[0]) {
      try {
        const file = orgIdentityEl.files[0];
        const path = `servviced/${cnicValue}/${serIndex}/idcard/${Date.now()}_${file.name}`;
        const refFile = storageRef(storage, path);
        const snap = await uploadBytes(refFile, file);
        idCardUrl = await getDownloadURL(snap.ref);
      } catch (err) {
        console.warn("ID card upload failed for serIndex", serIndex, err);
        idCardUrl = "";
      }
    }

    // Collect extra documents for this wrapper (local to parent)
    const documents = [];
    // Prefer serwices-docs container within the wrapper
    const extraDocsContainer = wrapper.querySelector('.serwices-docs');
    const docRows = extraDocsContainer ? extraDocsContainer.querySelectorAll('.ser-row') : [];

    // Also check for inputs named using pattern serwiseddocname_{serIndex}_{doc}
    const serwisedNameInputs = wrapper.querySelectorAll(`input[id^="serwiseddocname_${serIndex}_"]`);

    // If pattern-based inputs found, use them (keeps naming consistent)
    if (serwisedNameInputs && serwisedNameInputs.length > 0) {
      for (const nameInputEl of serwisedNameInputs) {
        const nameId = nameInputEl.id;
        const suffix = nameId.slice(`serwiseddocname_${serIndex}_`.length);
        const fileInputEl = wrapper.querySelector(`#serwiseddocpdf_${serIndex}_${suffix}`);
        const docName = nameInputEl.value || "";
        let docFileUrl = "";
        if (fileInputEl && fileInputEl.files && fileInputEl.files[0]) {
          try {
            const file = fileInputEl.files[0];
            const path = `servviced/${cnicValue}/${serIndex}/docs/${Date.now()}_${file.name}`;
            const refFile = storageRef(storage, path);
            const snap = await uploadBytes(refFile, file);
            docFileUrl = await getDownloadURL(snap.ref);
          } catch (err) {
            console.warn("Error uploading doc for", serIndex, suffix, err);
            docFileUrl = "";
          }
        }
        documents.push({ name: docName, url: docFileUrl });
      }
    } else {
      // Otherwise use docRows inside serwices-docs
      for (const docRow of docRows) {
        const docNameEl = docRow.querySelector('input[type="text"]');
        const docFileEl = docRow.querySelector('input[type="file"]');
        const docName = docNameEl?.value || "";
        let docFileUrl = "";
        if (docFileEl && docFileEl.files && docFileEl.files[0]) {
          try {
            const file = docFileEl.files[0];
            const path = `servviced/${cnicValue}/${serIndex}/docs/${Date.now()}_${file.name}`;
            const refFile = storageRef(storage, path);
            const snap = await uploadBytes(refFile, file);
            docFileUrl = await getDownloadURL(snap.ref);
          } catch (err) {
            console.warn("Error uploading docRow for serIndex", serIndex, err);
            docFileUrl = "";
          }
        }
        documents.push({ name: docName, url: docFileUrl });
      }
    }

    // Push service record
    results.push({
      serviceIndex: serIndex.toString(),
      organizationtitle,
      organizationprice,
      durationest,
      durationdigits,
      idCardUrl,
      documents
    });
  } // end for wrappers

  // Ensere services are ordered by numeric serviceIndex (0,1,2,...)
  results.sort((a, b) => {
    const ai = parseInt(a.serviceIndex || "0", 10);
    const bi = parseInt(b.serviceIndex || "0", 10);
    return ai - bi;
  });

  // Convert results into object keyed by index if you want object structure,
  // but we will return array (as your code serects). If you prefer object,
  // you can transform here.
  return results;
}


// ------------------- Full Fixed Project JS -------------------
document.addEventListener("DOMContentLoaded", () => {
  const addProjectBtn = document.getElementById("organizationprojected");
  const projectDocsContainer = document.querySelector(".prod-docs");
  let nextProjectIndex = 1;
  const MAX_PROJECTS = 15;
  const MAX_DOCS_PER_PROJECT = 2;

  if (!projectDocsContainer) {
    console.warn(".prod-docs container not found — dynamic Projects may not render.");
  }

  // ---------- Add Dynamic Project Row ----------
  if (addProjectBtn) {
    addProjectBtn.addEventListener("click", () => {
      const existing = document.querySelectorAll('.pro-row-wrapper[data-pro-index]');
      if (existing.length >= MAX_PROJECTS) {
        alert("You can only add up to 15 Projects.");
        return;
      }

      let candidate = nextProjectIndex;
      while (document.querySelector(`.pro-row-wrapper[data-pro-index="${candidate}"]`)) {
        candidate++;
      }
      nextProjectIndex = candidate + 1;

      if (existing.length + 1 === 5) {
        alert(
          "Hey user, you filled 5 Projects. These Projects will show in your CV.\n" +
          "If you add more, please prioritize your top 5 important ones.\n\n" +
          "You can still fill up to 15 Projects."
        );
      }

      const html = createProjectHTML(candidate);
      if (projectDocsContainer) projectDocsContainer.insertAdjacentHTML("beforeend", html);
      else document.body.insertAdjacentHTML("beforeend", html);
    });
  }

  // ---------- Project HTML Template ----------
  function createProjectHTML(proIndex) {
    return `
      <div class="pro-row-wrapper" data-pro-index="${proIndex}">
        <div class="pro-row">
          <div class="pro-group">
            <input type="text" id="Organizationcategory_${proIndex}" class="pro-input" placeholder=" " required />
            <label class="pro-label" for="Organizationcategory_${proIndex}">Category Name</label>
          </div>

          <div class="pro-group">
            <input type="text" id="Organizationproname_${proIndex}" class="pro-input" placeholder=" " required />
            <label class="pro-label" for="Organizationproname_${proIndex}">Projects Name</label>
          </div>

          <div class="pro-group">
            <input type="url" id="Organizationprourl_${proIndex}" class="pro-input" placeholder=" " required />
            <label class="pro-label" for="Organizationprourl_${proIndex}">Projects Url</label>
          </div>

          <div class="pro-group file-group">
            <input type="file" id="Organizationproimg_${proIndex}" class="pro-input" required />
            <label class="pro-label" for="Organizationproimg_${proIndex}">Projects Image</label>
          </div>

          <div class="prowices-docs"></div>
          <button type="button" class="prowised-doc" data-pro="${proIndex}">+ Add New Documents</button>
          <button type="button" class="remove-project">🗑️ Remove Project</button>
        </div>
      </div>
    `;
  }

  // ---------- Extra Document HTML ----------
  function createProwisedDocHTML(proIndex, docIndex) {
    return `
      <div class="pro-row">
        <div class="pro-group">
          <input type="text" id="prowisedname_${proIndex}_${docIndex}" class="pro-input" placeholder=" " required>
          <label class="pro-label" for="prowisedname_${proIndex}_${docIndex}">Document Name</label>
        </div>
        <div class="pro-group file-group">
          <input type="file" id="prowisedfile_${proIndex}_${docIndex}" class="pro-input" required>
          <label class="pro-label" for="prowisedfile_${proIndex}_${docIndex}">Choose Img Or PDF</label>
        </div>
        <button type="button" class="remove-pro-doc">🗑️ Remove</button>
      </div>
    `;
  }

  // ---------- Event Delegation ----------
  document.addEventListener("click", (e) => {
    // Add Project Docs
    if (e.target.classList.contains("prowised-doc") || e.target.id === "Organizationprowised") {
      let wrapper = e.target.closest(".pro-row-wrapper") || e.target.closest(".pro-card");
      if (!wrapper) {
        console.warn("Cannot find Project wrapper for Add Doc");
        return;
      }

      if (!wrapper.dataset.proIndex) wrapper.dataset.proIndex = "0";

      const proIndex = wrapper.dataset.proIndex;
      const docsContainer = wrapper.querySelector(".prowices-docs");
      if (!docsContainer) {
        console.warn("No .prowices-docs found inside wrapper", wrapper);
        return;
      }

      const docCount = docsContainer.querySelectorAll(".pro-row").length;
      if (docCount >= MAX_DOCS_PER_PROJECT) {
        alert("You can only add up to 2 additional document sets for this Project.");
        return;
      }

      const docIndex = docCount + 1;
      docsContainer.insertAdjacentHTML("beforeend", createProwisedDocHTML(proIndex, docIndex));
      return;
    }

    // Remove Project
    if (e.target.classList.contains("remove-project")) {
      const wrapper = e.target.closest(".pro-row-wrapper") || e.target.closest(".pro-card");
      if (!wrapper) return;

      if (wrapper.dataset.proIndex) {
        wrapper.remove();
      } else {
        const inputs = wrapper.querySelectorAll('input[type="text"], input[type="text01"], input[type="file"]');
        inputs.forEach(i => {
          if (i.type === 'file') i.value = '';
          else i.value = '';
        });
        const docs = wrapper.querySelectorAll('.prowices-docs .pro-row');
        docs.forEach(node => node.remove());
      }
      return;
    }

    // Remove Document Row
    if (e.target.classList.contains("remove-pro-doc")) {
      const docRow = e.target.closest(".pro-row");
      if (docRow) docRow.remove();
      return;
    }
  });
});

// ---------- collectProjects function ----------
async function collectProjects(cnicValue) {
  const wrappers = [];
  document.querySelectorAll('.pro-row-wrapper').forEach(w => wrappers.push(w));

  const proCard = document.querySelector('.pro-card');
  if (proCard && !wrappers.includes(proCard)) {
    if (!proCard.querySelector('.pro-row-wrapper')) wrappers.unshift(proCard);
  }

  if (wrappers.length === 0) {
    document.querySelectorAll('.project-item, .pro-row').forEach(w => wrappers.push(w));
  }

  const results = [];
  const uniqueWrappers = Array.from(new Set(wrappers));

  for (const wrapper of uniqueWrappers) {
    let proIndex = wrapper.dataset && wrapper.dataset.proIndex !== undefined ? wrapper.dataset.proIndex : null;
    if (proIndex === null) {
      const anyPro = wrapper.querySelector('[id^="Organizationcategory_"], [id^="Organizationprourl_"]');
      if (anyPro && anyPro.id) {
        const parts = anyPro.id.split('_');
        proIndex = (parts.length > 1) ? parts[1] : "0";
      } else {
        proIndex = "0";
      }
    }

    proIndex = proIndex.toString();

    const categoryEl = document.getElementById(`Organizationcategory_${proIndex}`) || wrapper.querySelector('input[type="text"]');
    const nameEl = document.getElementById(`Organizationproname_${proIndex}`) || wrapper.querySelector('input[type="text01"]');
    const urlEl = document.getElementById(`Organizationprourl_${proIndex}`) || wrapper.querySelector('input[type="text01"]');
    const imageEl = document.getElementById(`Organizationproimg_${proIndex}`) || wrapper.querySelector('input[type="file"]');

    const category = categoryEl ? categoryEl.value : "";
    const projectName = nameEl ? nameEl.value : "";
    const projectUrl = urlEl ? urlEl.value : "";

    // Upload main project image
    let imageUrl = "";
    if (imageEl && imageEl.files && imageEl.files[0]) {
      try {
        const file = imageEl.files[0];
        const path = `projected/${cnicValue}/${proIndex}/image/${Date.now()}_${file.name}`;
        const refFile = storageRef(storage, path);
        const snap = await uploadBytes(refFile, file);
        imageUrl = await getDownloadURL(snap.ref);
      } catch (err) {
        console.warn("Image upload failed for proIndex", proIndex, err);
        imageUrl = "";
      }
    }

    // Collect extra documents
    const documents = [];
    const extraDocsContainer = wrapper.querySelector('.prowices-docs');
    const docRows = extraDocsContainer ? extraDocsContainer.querySelectorAll('.pro-row') : [];

    for (const docRow of docRows) {
      const docNameEl = docRow.querySelector('input[type="text"]');
      const docFileEl = docRow.querySelector('input[type="file"]');
      const docName = docNameEl?.value || "";
      let docFileUrl = "";
      if (docFileEl && docFileEl.files && docFileEl.files[0]) {
        try {
          const file = docFileEl.files[0];
          const path = `projected/${cnicValue}/${proIndex}/docs/${Date.now()}_${file.name}`;
          const refFile = storageRef(storage, path);
          const snap = await uploadBytes(refFile, file);
          docFileUrl = await getDownloadURL(snap.ref);
        } catch (err) {
          console.warn("Error uploading doc for project", proIndex, err);
          docFileUrl = "";
        }
      }
      documents.push({ name: docName, url: docFileUrl });
    }

    results.push({
      projectIndex: proIndex,
      category,
      projectName,
      projectUrl,
      imageUrl,
      documents
    });
  }

  results.sort((a, b) => parseInt(a.projectIndex) - parseInt(b.projectIndex));
  return results;
}


// ------------------- Full Fixed Team JS -------------------
document.addEventListener("DOMContentLoaded", () => {
  const addTeamBtn = document.getElementById("organizationteamed");
  const teamDocsContainer = document.querySelector(".temd-docs");
  let nextTeamIndex = 1;
  const MAX_TEAMS = 15;
  const MAX_DOCS_PER_TEAM = 2;

  if (!teamDocsContainer) {
    console.warn(".temd-docs container not found — dynamic Team rows may not render.");
  }

  // ---------- Add Dynamic Team Row ----------
  if (addTeamBtn) {
    addTeamBtn.addEventListener("click", () => {
      const existing = document.querySelectorAll('.tem-row-wrapper[data-tem-index]');
      if (existing.length >= MAX_TEAMS) {
        alert("You can only add up to 15 team members.");
        return;
      }

      let candidate = nextTeamIndex;
      while (document.querySelector(`.tem-row-wrapper[data-tem-index="${candidate}"]`)) {
        candidate++;
      }
      nextTeamIndex = candidate + 1;

      if (existing.length + 1 === 5) {
        alert(
          "You have added 5 team members. These will show first on your CV.\n" +
          "You can still add up to 15 total."
        );
      }

      const html = createTeamHTML(candidate);
      if (teamDocsContainer) teamDocsContainer.insertAdjacentHTML("beforeend", html);
      else document.body.insertAdjacentHTML("beforeend", html);
    });
  }

  // ---------- Team HTML Template ----------
  function createTeamHTML(teamIndex) {
    return `
      <div class="tem-row-wrapper" data-tem-index="${teamIndex}">
        <div class="tem-row">
          <div class="tem-group">
            <input type="text" id="Organizationtemname_${teamIndex}" class="tem-input" placeholder=" " required />
            <label class="tem-label" for="Organizationtemname_${teamIndex}">Teamate Name</label>
          </div>

          <div class="tem-group">
            <input type="text" id="Organizationtemproff_${teamIndex}" class="tem-input" placeholder=" " required />
            <label class="tem-label" for="Organizationtemproff_${teamIndex}">Profession</label>
          </div>

          <div class="tem-group">
            <input type="text" id="Organizationtemperagraph02_${teamIndex}" class="tem-input" placeholder=" " required />
            <label class="tem-label" for="Organizationtemperagraph02_${teamIndex}">About Peragraph</label>
          </div>

          <div class="tem-group">
            <input type="url" id="Organizationfacebookurl_${teamIndex}" class="tem-input" placeholder=" " required />
            <label class="tem-label" for="Organizationfacebookurl_${teamIndex}">Facebook</label>
          </div>

          <div class="tem-group">
            <input type="url" id="Organizationlinkedurl_${teamIndex}" class="tem-input" placeholder=" " required />
            <label class="tem-label" for="Organizationlinkedurl_${teamIndex}">LinkedIn</label>
          </div>

          <div class="tem-group">
            <input type="url" id="Organizationtwitterurl_${teamIndex}" class="tem-input" placeholder=" " required />
            <label class="tem-label" for="Organizationtwitterurl_${teamIndex}">Twitter</label>
          </div>

          <div class="tem-group file-group">
            <input type="file" id="Organizationtemimg_${teamIndex}" class="tem-input" required />
            <label class="tem-label" for="Organizationtemimg_${teamIndex}">Profile Image</label>
          </div>

          <div class="tammed-docs"></div>
          <button type="button" class="temmes-doc" data-tem="${teamIndex}">+ Add New Documents</button>
          <button type="button" class="remove-team">🗑️ Remove Teamate</button>
        </div>
      </div>
    `;
  }

  // ---------- Extra Document Template ----------
  function createTeamDocHTML(teamIndex, docIndex) {
    return `
      <div class="tem-row">
        <div class="tem-group">
          <input type="text" id="teamdocname_${teamIndex}_${docIndex}" class="tem-input" placeholder=" " required>
          <label class="tem-label" for="teamdocname_${teamIndex}_${docIndex}">Document Name</label>
        </div>
        <div class="tem-group file-group">
          <input type="file" id="teamdocpdf_${teamIndex}_${docIndex}" class="tem-input" required>
          <label class="tem-label" for="teamdocpdf_${teamIndex}_${docIndex}">Choose Img Or PDF</label>
        </div>
        <button type="button" class="remove-doc">🗑️ Remove</button>
      </div>
    `;
  }

  // ---------- Event Delegation ----------
  document.addEventListener("click", (e) => {
    // Add Extra Documents
    if (e.target.classList.contains("temmes-doc")) {
      const wrapper = e.target.closest(".tem-row-wrapper");
      if (!wrapper) return;

      const teamIndex = wrapper.dataset.temIndex;
      const docsContainer = wrapper.querySelector(".tammed-docs");
      if (!docsContainer) return;

      const docCount = docsContainer.querySelectorAll(".tem-row").length;
      if (docCount >= MAX_DOCS_PER_TEAM) {
        alert("You can only add up to 2 documents per team member.");
        return;
      }

      const docIndex = docCount + 1;
      docsContainer.insertAdjacentHTML("beforeend", createTeamDocHTML(teamIndex, docIndex));
      return;
    }

    // Remove Team
    if (e.target.classList.contains("remove-team")) {
      const wrapper = e.target.closest(".tem-row-wrapper");
      if (wrapper) wrapper.remove();
      return;
    }

    // Remove Document
    if (e.target.classList.contains("remove-doc")) {
      const docRow = e.target.closest(".tem-row");
      if (docRow) docRow.remove();
      return;
    }
  });
});

// ---------- collectTeams Function ----------
async function collectTeams(cnicValue) {
  const wrappers = document.querySelectorAll(".tem-row-wrapper");
  const results = [];

  for (const wrapper of wrappers) {
    const teamIndex = wrapper.dataset.temIndex || "0";
    const get = (id) => wrapper.querySelector(`#${id}`)?.value || "";

    const teamateName = get(`Organizationtemname_${teamIndex}`);
    const teamateProfession = get(`Organizationtemproff_${teamIndex}`);
    const teamateAbout = get(`Organizationtemperagraph02_${teamIndex}`);
    const facebook = get(`Organizationfacebookurl_${teamIndex}`);
    const linkedin = get(`Organizationlinkedurl_${teamIndex}`);
    const twitter = get(`Organizationtwitterurl_${teamIndex}`);

    // Upload Profile Image
    let profileImgUrl = "";
    const imgEl = wrapper.querySelector(`#Organizationtemimg_${teamIndex}`);
    if (imgEl && imgEl.files[0]) {
      try {
        const file = imgEl.files[0];
        const path = `teamed/${cnicValue}/${teamIndex}/profile/${Date.now()}_${file.name}`;
        const refFile = storageRef(storage, path);
        const snap = await uploadBytes(refFile, file);
        profileImgUrl = await getDownloadURL(snap.ref);
      } catch (err) {
        console.warn("Profile upload failed for", teamIndex, err);
      }
    }

    // Collect Extra Docs
    const documents = [];
    const docNameInputs = wrapper.querySelectorAll(`[id^="teamdocname_${teamIndex}_"]`);
    for (const nameInput of docNameInputs) {
      const suffix = nameInput.id.split("_").pop();
      const fileInput = wrapper.querySelector(`#teamdocpdf_${teamIndex}_${suffix}`);
      let docUrl = "";
      if (fileInput && fileInput.files[0]) {
        try {
          const file = fileInput.files[0];
          const path = `teamed/${cnicValue}/${teamIndex}/docs/${Date.now()}_${file.name}`;
          const refFile = storageRef(storage, path);
          const snap = await uploadBytes(refFile, file);
          docUrl = await getDownloadURL(snap.ref);
        } catch (err) {
          console.warn("Doc upload failed for", teamIndex, err);
        }
      }
      documents.push({ name: nameInput.value || "", url: docUrl });
    }

    results.push({
      teamIndex,
      teamateName,
      teamateProfession,
      teamateAbout,
      facebook,
      linkedin,
      twitter,
      profileImgUrl,
      documents
    });
  }

  results.sort((a, b) => parseInt(a.teamIndex) - parseInt(b.teamIndex));
  return results;
}

// ================== Submit Button (duplicate block removed) ==================
// NOTE: Your file included a separate submit handler near the end; we've used the first submit handler above
// which calls collectExperiences. If you had another submit handler lower in the file, please remove duplicates.









// ----------------- Recall data (reads nested structure) -----------------
recallBtn.addEventListener('click', async () => {
  const cnicValue = cnic.value;
  if (!cnicValue) return alert("Please enter a CNIC number.");

  // ✅ Recall Professionality (tags + other fields)
  await recallProfessionality(cnicValue);

  // ✅ Recall Personal multi-selects
  await recallPersonalMultiSelect(cnicValue);

  // ---------- Helper: Show image/pdf/video preview ----------
  function handleFilePreview(input, fileUrl = "") {
    const wrapper = input.closest(".input-wrapper, .file-group, .ser-group, .pro-group, .tem-group, .exp-group");
    if (!wrapper) return;

    // Remove existing preview
    const oldPreview = wrapper.querySelector(".inline-preview");
    if (oldPreview) oldPreview.remove();

    const preview = document.createElement(fileUrl?.match(/\.(mp4|webm|ogg)$/i) ? "video" : "img");
    preview.className = "inline-preview";
    Object.assign(preview.style, {
      position: "absolute",
      right: "6px",
      bottom: "6px",
      width: "50px",
      height: "50px",
      objectFit: "cover",
      borderRadius: "8px",
      boxShadow: "0 0 5px rgba(0,0,0,0.3)",
      zIndex: "10",
      background: "#fff",
    });

    if (preview.tagName === "VIDEO") {
      preview.src = fileUrl;
      preview.controls = true;
    } else {
      preview.src = fileUrl || "";
    }

    wrapper.style.position = "relative";
    wrapper.appendChild(preview);
  }

  try {
    const snapshot = await get(child(ref(db), `resContainer9/${cnicValue}`));
    if (!snapshot.exists()) return alert("No record found for this CNIC.");

    const data = snapshot.val();

    // -------------------- PERSONAL --------------------
    const personal = data.Personal || {};
    nameInput.value = personal.Name || "";
    fname.value = personal.Fname || "";
    dob.value = personal.Dob || "";
    phone.value = personal.Phone || "";
    caddres.value = personal.Caddres || "";
    paddres.value = personal.Paddres || "";
    lisnt.value = personal.Lisnt || "";
    rarmy.value = personal.Rarmy || "";

   // Correct DB path:
    let selfVideoUrl = personal.selfVideoUrl || ""; 

    const selfVideoInput = document.getElementById("selfVideoUrl");
    const videoPreviewContainer = document.querySelector("#selfVideoWrapper .video-preview-container");

    // Clear old preview
    videoPreviewContainer.innerHTML = "";

    // If video exists → show it
    if (selfVideoUrl !== "") {
        const vid = document.createElement("video");
        vid.src = selfVideoUrl;
        vid.className = "video-preview-box";
        vid.controls = true;

        videoPreviewContainer.appendChild(vid);

        console.log("🎥 Self Video Recalled & Displayed:", selfVideoUrl);
    } else {
        console.log("⚠ No Self Video Found in DB");
    }

    // When new file selected → display instantly
    selfVideoInput.addEventListener("change", () => {
        const file = selfVideoInput.files[0];
        if (!file) return;

        videoPreviewContainer.innerHTML = ""; // clear old preview

        const vid = document.createElement("video");
        vid.src = URL.createObjectURL(file);
        vid.className = "video-preview-box";
        vid.controls = true;

        videoPreviewContainer.appendChild(vid);

        console.log("📥 New Self Video Selected:", file.name);
    });




    countrybox.value = personal.Countrybox || "";
    resumeprofession.value = personal.Resumeprofession || "";
    busName.value = personal.Busname || "";
    busNumber.value = personal.BusNumber || "";
    busEmail.value = personal.Busemail || "";
    busAddress.value = personal.Busaddress || "";
    busFacebook.value = personal.Busfacebooks || "";
    busInstagram.value = personal.Instagram || "";
    busLinkedIn.value = personal.Buslinkedin || "";
    busTwitter.value = personal.Twitter || "";
    busGithub.value = personal.Github || "";
    busYoutube.value = personal.Youtube || "";
    countrybox.dispatchEvent(new Event("change")); // load cities

    setTimeout(() => {
      citybox.value = personal.Citybox || "";
    }, 50);

    if (personal.ImageUrl) imagePreview.src = personal.ImageUrl;

    // ----------------- Skills recall -----------------
    async function recallSkills(cnicValue){
      if(!cnicValue) return;

      try{
        const snapshot = await get(child(ref(db), `resContainer9/${cnicValue}`));
        if(!snapshot.exists()) return console.log("No record found for this CNIC.");

        const data = snapshot.val();
        const skillsData = data.Skills || {};

        selectedSkills = []; // clear previous

        Object.keys(skillsData).forEach(k => {
          const skillObj = skillsData[k];
          if(skillObj.name){
            selectedSkills.push({
              name: skillObj.name,
              percent: skillObj.percent || "100%"
            });
          }
        });

        renderSelected();                     // show in selected panel
        populateCards(input.value || "");     // sync dropdown badges
        console.log("Recalled skills:", selectedSkills);

      }catch(err){
        console.error("Error recalling skills:", err);
      }
    }

    // Call recallSkills
    await recallSkills(cnicValue);

    // ----------------- Attach change listeners for all file inputs -----------------
    document.querySelectorAll('input[type="file"]').forEach(input => {
      if (input.__attached) return;
      input.__attached = true;
      input.addEventListener("change", () => handleFilePreview(input));
    });



// <-- REMOVE this line entirely
// attachFileChange();














     // ----------------- Recall Job Reference Data -----------------
        async function recallJobReferenceData(cnicValue) {
            const jobReferenceData = data.JobReference || {};
            refName1.value = jobReferenceData.Reference1?.Name || "";
            post1.value = jobReferenceData.Reference1?.Post || "";
            refNumber1.value = jobReferenceData.Reference1?.PhoneNumber || "";
            refEmail1.value = jobReferenceData.Reference1?.Email || "";
            refName2.value = jobReferenceData.Reference2?.Name || "";
            post2.value = jobReferenceData.Reference2?.Post || "";
            refNumber2.value = jobReferenceData.Reference2?.PhoneNumber || "";
            refEmail2.value = jobReferenceData.Reference2?.Email || "";
        }

        // Call recallJobReferenceData
        await recallJobReferenceData(cnicValue);



 // -------------------- EDUCATION RECALL & LIVE PREVIEW --------------------
const education = data.Education || {};
const eduCards = document.querySelectorAll(".edu-card");

eduCards.forEach(card => {
  const type = card.dataset.form;
  const edu = education[type] || {};

  // ----------- BASIC INPUTS -----------
  const nameInputEl = card.querySelector("input[type='text']");
  const degreeSelect = card.querySelector("select.float-input");
  const rollnoInput = card.querySelector("input[type='number']");
  const gpaInput = card.querySelector("input[type='number04']");
  const startyearInput = card.querySelector("input[type='number02']");
  const endyearInput = card.querySelector("input[type='number03']");

  if (nameInputEl) nameInputEl.value = edu.Name || "";
  if (degreeSelect) {
    degreeSelect.value = edu.Degree || "";

    // Trigger Field/Subfield dropdown creation
    degreeSelect.dispatchEvent(new Event("change"));

    // Wait for field & subfield to be added before assigning
    setTimeout(() => {
      const fieldSelect = card.querySelector(".field-select");
      if (fieldSelect) {
        fieldSelect.value = edu.Field || "";
        fieldSelect.dispatchEvent(new Event("change"));
      }

      // Give extra time for subfield options to populate
      setTimeout(() => {
        const subfieldSelect = card.querySelector(".subfield-select");
        if (subfieldSelect) subfieldSelect.value = edu.Subfield || "";
      }, 200);
    }, 300);
  }

  if (rollnoInput) rollnoInput.value = edu.Rollno || "";
  if (gpaInput) gpaInput.value = edu.Gpa || "";
  if (startyearInput) startyearInput.value = edu.Startyear || "";
  if (endyearInput) endyearInput.value = edu.Endyear || "";

  // ----------- FILE INPUTS (Marksheets & Certificates) -----------
  const fileInputs = card.querySelectorAll("input[type='file']");

  fileInputs.forEach((input, index) => {
    if (!input) return;
    function displayFile(url) {
      const old = input.parentElement.querySelector(".file-preview");
      if (old) old.remove();
      const preview = document.createElement("img");
      preview.src = url;
      preview.className = "file-preview";
      preview.style.cssText =
        "width:40px;height:auto;border-radius:6px;cursor:pointer;border:2px solid #ddd;transition:0.2s;display:flex;flex-wrap:wrap;gap:8px;margin-top:-50px;margin-left:170px;cursor:pointer;";
      preview.onclick = () => window.open(url, "_blank");
      input.insertAdjacentElement("afterend", preview);
    }

    const storedUrl = (index === 0 ? edu.Marksheet?.[0] : edu.Certificate?.[0]) || "";
    if (storedUrl) displayFile(storedUrl);

    input.addEventListener("change", () => {
      const file = input.files?.[0];
      if (!file) return;
      const url = file.type.startsWith("image/") ? URL.createObjectURL(file) : storedUrl;
      if (url) displayFile(url);
    });
  });

  // ----------- EXTRA DOCUMENTS -----------
  const extraDocContainer = card.querySelector(".extra-docs");
  if (extraDocContainer && Array.isArray(edu.ExtraDocuments) && edu.ExtraDocuments.length > 0) {
    extraDocContainer.innerHTML = "";
    edu.ExtraDocuments.forEach((doc, i) => {
      const docItem = document.createElement("div");
      docItem.className = "extra-doc-item";
      docItem.style.margin = "0";
      docItem.style.padding = "0";

      const nameDiv = document.createElement("div");
      nameDiv.className = "float-card";
      nameDiv.style.margin = "0";
      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.className = "float-input";
      nameInput.value = doc.name || "";
      nameDiv.appendChild(nameInput);

      const nameLabel = document.createElement("label");
      nameLabel.className = "float-label";
      nameLabel.textContent = "Document Name";
      nameLabel.style = "margin-top:10px;";
      nameDiv.appendChild(nameLabel);

      if (nameInput.value.trim() !== '') nameInput.classList.add('filled');
      nameInput.addEventListener('input', () => {
        nameInput.classList.toggle('filled', nameInput.value.trim() !== '');
      });

      docItem.appendChild(nameDiv);

      const fileDiv = document.createElement("div");
      fileDiv.className = "float-card";
      fileDiv.style.display = "flex";
      fileDiv.style.alignItems = "center";
      fileDiv.style.gap = "18px";
      fileDiv.style.margin = "20";

      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".pdf,.jpg,.png";
      fileInput.className = "float-input";
      fileInput.style.flex = "1";
      fileDiv.appendChild(fileInput);

      const fileLabel = document.createElement("label");
      fileLabel.className = "float-label";
      fileLabel.style = "margin-top:10px;";
      fileLabel.textContent = "Upload Img Or PDF";
      fileDiv.appendChild(fileLabel);

      const previewContainer = document.createElement("div");
      previewContainer.className = "preview-container";
      previewContainer.style.display = "flex";
      previewContainer.style.flexDirection = "column";
      previewContainer.style.margin = "0";
      fileDiv.appendChild(previewContainer);

      if (doc.url) {
        const preview = document.createElement("img");
        preview.src = doc.url;
        preview.className = "file-preview";
        preview.style.cssText = `
          width:40px;height:auto;border-radius:6px;cursor:pointer;border:2px solid #ddd;transition:0.2s;margin:0;
        `;
        preview.onclick = () => window.open(doc.url, "_blank");
        previewContainer.appendChild(preview);
      }

      fileInput.addEventListener("change", () => {
        const file = fileInput.files?.[0];
        if (!file) return;
        previewContainer.innerHTML = "";
        if (file.type.startsWith("image/")) {
          const preview = document.createElement("img");
          preview.src = URL.createObjectURL(file);
          preview.className = "file-preview";
          preview.style.cssText = `
            width:40px;height:auto;border-radius:6px;cursor:pointer;border:2px solid #ddd;transition:0.2s;margin:10px;
          `;
          preview.onclick = () => window.open(preview.src, "_blank");
          previewContainer.appendChild(preview);
        }
        if (file.type === "application/pdf") {
          const pdfPreview = document.createElement("span");
          pdfPreview.textContent = "📄 PDF";
          pdfPreview.style.cssText = "font-size:0.9rem;color:#333;cursor:pointer;margin:0;";
          pdfPreview.onclick = () => window.open(URL.createObjectURL(file), "_blank");
          previewContainer.appendChild(pdfPreview);
        }
      });

      docItem.appendChild(fileDiv);
      extraDocContainer.appendChild(docItem);
    });
  }
});

// ----------- FLOATING LABELS -----------
document.querySelectorAll('.float-input').forEach(input => {
  if (input.value.trim() !== '') input.classList.add('filled');
  input.addEventListener('input', () => {
    input.classList.toggle('filled', input.value.trim() !== '');
  });
});

// ✅ APPLY PREVIEWS FOR RE-CALLED IMAGE URLs
document.querySelectorAll('input[type="file"]').forEach(fileInput => {
  const previewWrapper = fileInput.closest('.file-wrapper');
  if (!previewWrapper) return;
  const previewImg = previewWrapper.querySelector('.file-preview-img');
  const previewAnchor = previewWrapper.querySelector('.file-preview-name');
  const storedUrl = fileInput.getAttribute('data-url');
  if (!storedUrl) return;
  if (previewImg && /\.(png|jpe?g|gif|webp)$/i.test(storedUrl)) {
    previewImg.src = storedUrl;
    previewImg.style.display = "block";
  }
  if (previewAnchor && /\.(pdf|docx?|pptx?)$/i.test(storedUrl)) {
    previewAnchor.href = storedUrl;
    previewAnchor.textContent = "View File";
    previewAnchor.style.display = "inline-block";
  }
  handleFilePreview(fileInput, storedUrl);
});

// ✅ RE-ENABLE LIVE PREVIEWS WHEN USER SELECTS NEW FILES
// attachFileChange();



    // -------------------- SKILLS --------------------
    if (data.Skills)
      localStorage.setItem("selectedSkills", JSON.stringify(data.Skills));


    
    // -------------------- EXPERIENCE --------------------
const experienceData = data.Experience;
const experDocsContainer = document.querySelector(".exper-docs");

if (experDocsContainer) {
  experDocsContainer.innerHTML = "";

  if (experienceData && typeof experienceData === "object") {
    const expArray = Array.isArray(experienceData)
      ? experienceData
      : Object.values(experienceData);

    expArray.forEach((exp, index) => {
      const block = document.createElement("div");
      block.className = "exp-row-wrapper";
      block.setAttribute("data-exp-index", index);

      block.innerHTML = `
        <div class="exp-row">
          <div class="exp-group">
            <input type="text" id="Organizationname_${index}" class="exp-input" placeholder=" " value="${exp.organizationName || ''}" required />
            <label class="exp-label" for="Organizationname_${index}">Organization Name</label>
          </div>

          <div class="exp-group">
            <input type="text" id="Organizationposition_${index}" class="exp-input" placeholder=" " value="${exp.organizationPosition || ''}" required />
            <label class="exp-label" for="Organizationposition_${index}">Position</label>
          </div>

          <div class="exp-group">
            <select id="Organizationunit_${index}" class="exp-input" required>
              <option value="" disabled ${!exp.durationUnit ? "selected" : ""}></option>
              <option value="Months" ${exp.durationUnit === "Months" ? "selected" : ""}>Months</option>
              <option value="Years" ${exp.durationUnit === "Years" ? "selected" : ""}>Years</option>
            </select>
            <label class="exp-label" for="Organizationunit_${index}">Month Or Year</label>
          </div>

          <div class="exp-group">
            <input type="number" id="Organizationduration_${index}" class="exp-input" placeholder=" " value="${exp.durationNumber || ''}" required />
            <label class="exp-label" for="Organizationduration_${index}">Duration Number</label>
          </div>

          <div class="exp-group file-group">
            <input type="file" id="Organizationidentity_${index}" class="exp-input" ${exp.idCardUrl ? `data-url="${exp.idCardUrl}"` : ""} />
            <label class="exp-label" for="Organizationidentity_${index}">ID Card</label>
          </div>
        </div>

        <div class="moress-docs">
          ${Array.isArray(exp.documents)
            ? exp.documents
                .map(
                  (d, docIndex) => `
          <div class="exp-group">
            <input type="text" id="moredocname_${index}_${docIndex}" class="exp-input" value="${d.name || ''}" placeholder=" " required />
            <label class="exp-label" for="moredocname_${index}_${docIndex}">Document Name</label>
          </div>

          <div class="exp-group file-group">
            <input type="file" id="moredocpdf_${index}_${docIndex}" class="exp-input" ${d.url ? `data-url="${d.url}"` : ""} />
            <label class="exp-label" for="moredocpdf_${index}_${docIndex}">Choose Img Or PDF</label>
          </div>`
                )
                .join("")
            : ""
          }
        </div>
      `;

      experDocsContainer.appendChild(block);
    });
  }
}

    // -------------------- SERVICES --------------------
    const servContainer = document.querySelector(".serv-docs");
    servContainer.innerHTML = "";

    const service = data.Service || [];
    if (Array.isArray(service)) {
      service.forEach((serviceItem, index) => {
        const html = `
          <div class="ser-row-wrapper" data-ser-index="${index}">
            <div class="ser-row">
              <div class="ser-group">
                <input type="text" id="Organizationtitle_${index}" class="ser-input" value="${serviceItem.organizationtitle || ''}" placeholder=" " required>
                <label class="ser-label" for="Organizationtitle_${index}">Service Name</label>
              </div>
              <div class="ser-group">
                <input type="text" id="Organizationprice_${index}" class="ser-input" value="${serviceItem.organizationprice || ''}" placeholder=" " required>
                <label class="ser-label" for="Organizationprice_${index}">Starting Price</label>
              </div>
              <div class="ser-group">
                <input type="text" id="organizationest_${index}" class="ser-input" value="${serviceItem.durationest || ''}" placeholder=" " required>
                <label class="ser-label" for="organizationest_${index}">Description</label>
              </div>
              <div class="ser-group">
                <input type="text" id="organizationdigits_${index}" class="ser-input" value="${serviceItem.durationdigits || ''}" placeholder=" " required>
                <label class="ser-label" for="organizationdigits_${index}">Experience Time</label>
              </div>
              <div class="ser-group file-group">
                <input type="file" id="Organizationidentity_${index}" class="ser-input" ${serviceItem.idCardUrl ? `data-url="${serviceItem.idCardUrl}"` : ""} />
                <label class="ser-label" for="Organizationidentity_${index}">Certificate Or Licence</label>
              </div>
            </div>
            <div class="serwices-docs">
              ${
                Array.isArray(serviceItem.documents)
                  ? serviceItem.documents
                      .map(
                        (doc, docIndex) => `
                <div class="ser-row">
                  <div class="ser-group">
                    <input type="text" id="serwiseddocname_${index}_${docIndex}" class="ser-input" value="${doc.name || ''}" placeholder=" " required>
                    <label class="ser-label" for="serwiseddocname_${index}_${docIndex}">Document Name</label>
                  </div>
                  <div class="ser-group file-group">
                    <input type="file" id="serwiseddocpdf_${index}_${docIndex}" class="ser-input" ${doc.url ? `data-url="${doc.url}"` : ""} />
                    <label class="ser-label" for="serwiseddocpdf_${index}_${docIndex}">Choose Img Or PDF</label>
                  </div>
                </div>
              `
                      )
                      .join("")
                  : ""
              }
            </div>
          </div>
        `;
        servContainer.insertAdjacentHTML("beforeend", html);
      });
    }

    // ✅ Floating labels
    document.querySelectorAll('.ser-input').forEach(input => {
      if (input.value.trim() !== '') input.classList.add('filled');
      input.addEventListener('input', () => {
        input.classList.toggle('filled', input.value.trim() !== '');
      });
    });

    // ✅ Apply previews for recalled data-urls
    document.querySelectorAll('input[type="file"][data-url]').forEach(input => {
      const url = input.getAttribute("data-url");
      if (url) handleFilePreview(input, url);
    });

    // ✅ Attach live change previews
    // attachFileChange();



// -------------------- PROJECT RECALL --------------------
const prodContainer = document.querySelector('.prod-docs');
prodContainer.innerHTML = '';

const projects = data.Project || [];
if (Array.isArray(projects)) {
  projects.forEach((project, proIndex) => {
    const html = `
      <div class="pro-row-wrapper" data-pro-index="${proIndex}">
        <div class="pro-row">
          <div class="pro-group">
            <input type="text" id="Organizationcategory_${proIndex}" class="pro-input" value="${project.category || ''}" placeholder=" " required>
            <label class="pro-label" for="Organizationcategory_${proIndex}">Category Name</label>
          </div>
          <div class="pro-group">
            <input type="text" id="Organizationproname_${proIndex}" class="pro-input" value="${project.projectName || ''}" placeholder=" " required>
            <label class="pro-label" for="Organizationproname_${proIndex}">Projects Name</label>
          </div>
          <div class="pro-group">
            <input type="url" id="Organizationprourl_${proIndex}" class="pro-input" value="${project.projectUrl || ''}" placeholder=" " required>
            <label class="pro-label" for="Organizationprourl_${proIndex}">Projects Url</label>
          </div>

          <div class="pro-group file-group">
            <input type="file" id="Organizationproimg_${proIndex}" class="pro-input" ${project.imageUrl ? `data-url="${project.imageUrl}"` : ""} required>
            <label class="pro-label" for="Organizationproimg_${proIndex}">Projects Image</label>
          </div>

          <div class="prowices-docs">
            ${
              Array.isArray(project.documents)
                ? project.documents.map((doc, docIndex) => `
                    <div class="pro-row">
                      <div class="pro-group">
                        <input type="text" id="prowisedname_${proIndex}_${docIndex}" class="pro-input" value="${doc.name || ''}" placeholder=" " required>
                        <label class="pro-label" for="prowisedname_${proIndex}_${docIndex}">Document Name</label>
                      </div>
                      <div class="pro-group file-group">
                        <input type="file" id="prowisedfile_${proIndex}_${docIndex}" class="pro-input" ${doc.url ? `data-url="${doc.url}"` : ""} required>
                        <label class="pro-label" for="prowisedfile_${proIndex}_${docIndex}">Choose Img Or PDF</label>
                      </div>
                      <button type="button" class="remove-pro-doc">🗑️ Remove</button>
                    </div>
                  `).join('')
                : ''
            }
          </div>

          <button type="button" class="prowised-doc" data-pro="${proIndex}">+ Add New Documents</button>
          <button type="button" class="remove-project">🗑️ Remove Project</button>
        </div>
      </div>`;
    prodContainer.insertAdjacentHTML('beforeend', html);
  });
}

// Floating labels
document.querySelectorAll('.pro-input').forEach(input => {
  if (input.value.trim() !== '') input.classList.add('filled');
  input.addEventListener('input', () => {
    input.classList.toggle('filled', input.value.trim() !== '');
  });
});

// ✅ Show saved project image previews
document.querySelectorAll('.pro-group.file-group input[type="file"][data-url]').forEach(input => {
  const url = input.getAttribute("data-url");
  if (url) handleFilePreview(input, url);
});



// -------------------- TEAM RECALL --------------------
const temdContainer = document.querySelector('.temd-docs');
temdContainer.innerHTML = '';

const teams = data.Team || [];
if (Array.isArray(teams)) {
  teams.forEach((team, temIndex) => {
    const html = `
      <div class="tem-row-wrapper" data-tem-index="${temIndex}">
        <div class="tem-row">
          <div class="tem-group">
            <input type="text" id="Organizationtemname_${temIndex}" class="tem-input" value="${team.teamateName || ''}" placeholder=" " required>
            <label class="tem-label" for="Organizationtemname_${temIndex}">Teamate Name</label>
          </div>

          <div class="tem-group">
            <input type="text" id="Organizationtemproff_${temIndex}" class="tem-input" value="${team.teamateProfession || ''}" placeholder=" " required>
            <label class="tem-label" for="Organizationtemproff_${temIndex}">Profession</label>
          </div>

          <div class="tem-group">
            <input type="text" id="Organizationtemperagraph02_${temIndex}" class="tem-input" value="${team.teamateAbout || ''}" placeholder=" " required>
            <label class="tem-label" for="Organizationtemperagraph02_${temIndex}">About Peragraph</label>
          </div>

          <div class="tem-group">
            <input type="url" id="Organizationfacebookurl_${temIndex}" class="tem-input" value="${team.facebook || ''}" placeholder=" " required>
            <label class="tem-label" for="Organizationfacebookurl_${temIndex}">Facebook</label>
          </div>

          <div class="tem-group">
            <input type="url" id="Organizationlinkedurl_${temIndex}" class="tem-input" value="${team.linkedin || ''}" placeholder=" " required>
            <label class="tem-label" for="Organizationlinkedurl_${temIndex}">LinkedIn</label>
          </div>

          <div class="tem-group">
            <input type="url" id="Organizationtwitterurl_${temIndex}" class="tem-input" value="${team.twitter || ''}" placeholder=" " required>
            <label class="tem-label" for="Organizationtwitterurl_${temIndex}">Twitter</label>
          </div>

          <div class="tem-group file-group">
            <input type="file" id="Organizationtemimg_${temIndex}" class="tem-input" ${team.profileImgUrl ? `data-url="${team.profileImgUrl}"` : ""} required>
            <label class="tem-label" for="Organizationtemimg_${temIndex}">Profile Image</label>
          </div>

          <div class="tammed-docs">
            ${
              Array.isArray(team.documents)
                ? team.documents.map((doc, docIndex) => `
                    <div class="tem-row">
                      <div class="tem-group">
                        <input type="text" id="teamdocname_${temIndex}_${docIndex}" class="tem-input" value="${doc.name || ''}" placeholder=" " required>
                        <label class="tem-label" for="teamdocname_${temIndex}_${docIndex}">Document Name</label>
                      </div>
                      <div class="tem-group file-group">
                        <input type="file" id="teamdocpdf_${temIndex}_${docIndex}" class="tem-input" ${doc.url ? `data-url="${doc.url}"` : ""} required>
                        <label class="tem-label" for="teamdocpdf_${temIndex}_${docIndex}">Choose Img Or PDF</label>
                      </div>
                      <button type="button" class="remove-doc">🗑️ Remove</button>
                    </div>
                  `).join('')
                : ''
            }
          </div>

          <button type="button" class="temmes-doc" data-tem="${temIndex}">+ Add New Documents</button>
          <button type="button" class="remove-team">🗑️ Remove Teamate</button>
        </div>
      </div>`;
    temdContainer.insertAdjacentHTML('beforeend', html);
  });
}

// Floating labels
document.querySelectorAll('.tem-input').forEach(input => {
  if (input.value.trim() !== '') input.classList.add('filled');
  input.addEventListener('input', () => {
    input.classList.toggle('filled', input.value.trim() !== '');
  });
});

// ✅ Show saved team profile image previews
document.querySelectorAll('.tem-group.file-group input[type="file"][data-url]').forEach(input => {
  const url = input.getAttribute("data-url");
  if (url) handleFilePreview(input, url);
});










 const prof = data.Professionality || {};

    // ===== Basic Input Fields =====
    document.getElementById("Years").value = prof.Years || "";
    document.getElementById("aboutParagraph").value = prof.aboutParagraph || "";
    document.getElementById("aboutPara2").value = prof.aboutPara2 || "";
    document.getElementById("aboutPara3").value = prof.aboutPara3 || "";
    document.getElementById("happyClients").value = prof.happyClients || "";
    document.getElementById("projectsCompleted").value = prof.projectsCompleted || "";
// ===== Profession Multi-Select Tags =====
const professionInput = document.getElementById("professionInput");
const selectedContainer = professionInput.parentNode.querySelector(".selected-container");

// Convert stored DB array/string to array
let recalledProfessions = [];
if (prof.profession) {
  if (Array.isArray(prof.profession)) {
    recalledProfessions = prof.profession.map(p => p.trim()).filter(Boolean);
  } else if (typeof prof.profession === "string") {
    // If stored as string with commas
    recalledProfessions = prof.profession.split(",").map(p => p.trim()).filter(Boolean);
  }
}

// Merge with existing tags in DOM
const existingTags = Array.from(selectedContainer.querySelectorAll(".tag-text"))
  .map(el => el.textContent.trim());

const mergedProfessions = Array.from(new Set([...existingTags, ...recalledProfessions]));

// Clear container and render merged tags
selectedContainer.innerHTML = "";
mergedProfessions.forEach(name => {
  const tag = document.createElement("div");
  tag.className = "tagd";

  const textSpan = document.createElement("span");
  textSpan.className = "tag-text";
  textSpan.textContent = name;

  const removeBtn = document.createElement("span");
  removeBtn.className = "remove-tag";
  removeBtn.textContent = "×";
  removeBtn.onclick = () => {
    tag.remove();
    updateProfessionInputValue();
  };

  tag.appendChild(textSpan);
  tag.appendChild(removeBtn);
  selectedContainer.appendChild(tag);
});

// Sync hidden input with visual tags
function updateProfessionInputValue() {
  const tags = Array.from(selectedContainer.querySelectorAll(".tag-text"))
    .map(el => el.textContent.trim());
  professionInput.value = tags.join(", ");
}
updateProfessionInputValue();
    // ===== Image Previews =====
    if (prof.CnicFront) {
      const img1 = document.getElementById("cnicPreview1");
      img1.src = prof.CnicFront;
      img1.style.display = "block";
    }

    if (prof.CnicBack) {
      const img2 = document.getElementById("cnicPreview2");
      img2.src = prof.CnicBack;
      img2.style.display = "block";
    }

    if (prof.ProfilePhoto) {
      const img3 = document.getElementById("preview3");
      img3.src = prof.ProfilePhoto;
      img3.style.display = "block";
    }
    






    
alert("Data recalled successfully!");
} catch (err) {
  console.error("Error retrieving data:", err);
  alert("Error retrieving data: " + err.message);
}
});

// ==========================
// ✅ Restore tags for any multi-select input
// ==========================
function restoreTagsToMultiSelect(inputId, storedData) {
  const input = document.getElementById(inputId);
  if (!input) return;

  // Create selected-container if it doesn't exist
  let selectedContainer = input.parentNode.querySelector(".selected-container");
  if (!selectedContainer) {
    selectedContainer = document.createElement("div");
    selectedContainer.className = "selected-container";
    input.parentNode.insertBefore(selectedContainer, input.nextSibling);
  }

  // Clear previous tags
  selectedContainer.innerHTML = "";

  // Convert storedData to array
  const items = Array.isArray(storedData)
    ? storedData.map(p => p.trim()).filter(Boolean)
    : typeof storedData === "string"
      ? storedData.split(",").map(p => p.trim()).filter(Boolean)
      : [];

  // Add tags
  items.forEach(name => {
    const tag = document.createElement("div");
    tag.className = "tagd";

    const textSpan = document.createElement("span");
    textSpan.className = "tag-text";
    textSpan.textContent = name;

    const removeBtn = document.createElement("span");
    removeBtn.className = "remove-tag";
    removeBtn.textContent = "×";
    removeBtn.onclick = () => {
      tag.remove();
      updateInputValue();
    };

    tag.appendChild(textSpan);
    tag.appendChild(removeBtn);
    selectedContainer.appendChild(tag);
  });

  // Update hidden input value
  function updateInputValue() {
    const tags = Array.from(selectedContainer.querySelectorAll(".tag-text"))
      .map(el => el.textContent.trim());
    input.value = tags.join(", ");
    console.log(`✅ ${inputId} current value:`, input.value);
  }
  updateInputValue();
}

// ==========================
// ✅ Recall Professionality
// ==========================
async function recallProfessionality(cnicValue) {
  if (!cnicValue) return;

  try {
    const profSnap = await get(ref(db, `resContainer9/${cnicValue}/Professionality`));
    const prof = profSnap.exists() ? profSnap.val() : {};

    restoreTagsToMultiSelect("professionInput", prof.profession || "");
    restoreTagsToMultiSelect("hobbiesInput", prof.hobbies || "");
    restoreTagsToMultiSelect("languagesInput", prof.languages || "");

    // Other text fields
    document.getElementById("Years").value = prof.Years || "";
    document.getElementById("aboutParagraph").value = prof.aboutParagraph || "";
    document.getElementById("aboutPara2").value = prof.aboutPara2 || "";
    document.getElementById("aboutPara3").value = prof.aboutPara3 || "";
    document.getElementById("happyClients").value = prof.happyClients || "";
    document.getElementById("projectsCompleted").value = prof.projectsCompleted || "";

    // Images
    if (prof.CnicFront) document.getElementById("cnicPreview1").src = prof.CnicFront;
    if (prof.CnicBack) document.getElementById("cnicPreview2").src = prof.CnicBack;
    if (prof.ProfilePhoto) document.getElementById("preview3").src = prof.ProfilePhoto;

    console.log("✅ Professionality recalled successfully");

  } catch (err) {
    console.error("❌ Error recalling Professionality:", err);
  }
}

// ==========================
// ✅ Recall Personal multi-selects (Qual & Paddres)
// ==========================
async function recallPersonalMultiSelect(cnicValue) {
  if (!cnicValue) return;

  try {
    const personalSnap = await get(ref(db, `resContainer9/${cnicValue}/Personal`));
    const personalData = personalSnap.exists() ? personalSnap.val() : {};

    restoreTagsToMultiSelect("Qual", personalData.Qual || "");
    restoreTagsToMultiSelect("Paddres", personalData.Paddres || "");

    console.log("✅ Personal multi-selects recalled successfully");
  } catch (err) {
    console.error("❌ Error recalling Personal multi-selects:", err);
  }
}

// ==========================
// ✅ Full recall after CNIC input
// ==========================
const cnicValue = cnic.value?.trim();
if (cnicValue) {
  recallProfessionality(cnicValue);
  recallPersonalMultiSelect(cnicValue);
}

// ==========================
// ✅ Optional: File preview handling
// ==========================
window.handleFilePreview = function(input, fileUrl = "") {
  if (!input) return;
  const wrapper = input.parentElement;
  let preview = wrapper.querySelector(".file-preview");
  if (!preview) {
    preview = document.createElement("a");
    preview.className = "file-preview";
    preview.target = "_blank";
    wrapper.appendChild(preview);
  }
  preview.href = fileUrl;
  preview.textContent = fileUrl.split("/").pop() || "File";
  input.dataset.url = fileUrl;
};

window.showSavedFilePreviews = function() {
  document.querySelectorAll('input[type="file"][data-url]').forEach((input) => {
    const url = input.getAttribute("data-url");
    if (url) handleFilePreview(input, url);
  });
};



// showSavedFilePreviews();




// ----------------- Recall data (reads nested structure) -----------------
// async function recallData() {
//     const cnicValue = document.getElementById('Cnic').value; // Get the CNIC input value
//     if (!cnicValue) return alert("Please enter a CNIC number.");

//     try {
//         const snapshot = await get(child(ref(db), `resContainer9/${cnicValue}`));
//         if (snapshot.exists()) {
//             const data = snapshot.val();

//             // Populate Personal data
//             const personal = data.Personal || {};
//             document.getElementById('Name').value = personal.Name || '';
//             document.getElementById('Fname').value = personal.Fname || '';
//             document.getElementById('Dob').value = personal.Dob || '';
//             document.getElementById('Phone').value = personal.Phone || '';
//             document.getElementById('Caddres').value = personal.Caddres || '';
//             document.getElementById('Paddres').value = personal.Paddres || '';
//             document.getElementById('Qual').value = personal.Qual || '';
//             document.getElementById('Lisnt').value = personal.Lisnt || '';
//             document.getElementById('Rarmy').value = personal.Rarmy || '';
//             document.getElementById('Citybox').value = personal.Citybox || '';
//             document.getElementById('Countrybox').value = personal.Countrybox || '';
//             document.getElementById('image-preview').src = personal.ImageUrl || '';

//             // Populate Skills
//             if (data.Skills) localStorage.setItem("selectedSkills", JSON.stringify(data.Skills));

//             alert("Data recalled successfully!");
//         } else {
//             alert("No data found for the given CNIC number.");
//         }
//     } catch (error) {
//         console.error("Error retrieving data:", error);
//         alert("Error retrieving data: " + error.message);
//     }
// }

// // ----------------- Update data -----------------
// async function updateData() {
//     const cnicValue = document.getElementById('Cnic').value; // Get the CNIC input value
//     if (!cnicValue) return alert("Please enter a CNIC number.");

//     try {
//         const updatedPersonal = {
//             Cnic: cnicValue,
//             Name: document.getElementById('Name').value,
//             Fname: document.getElementById('Fname').value,
//             Dob: document.getElementById('Dob').value,
//             Phone: document.getElementById('Phone').value,
//             Caddres: document.getElementById('Caddres').value,
//             Paddres: document.getElementById('Paddres').value,
//             Qual: document.getElementById('Qual').value,
//             Lisnt: document.getElementById('Lisnt').value,
//             Rarmy: document.getElementById('Rarmy').value,
//             Citybox: document.getElementById('Citybox').value,
//             Countrybox: document.getElementById('Countrybox').value
//         };

//         // Upload new profile image if provided
//         const imageFile = document.getElementById('ImageUpload').files[0];
//         if (imageFile) {
//             const imageStorageReference = storageRef(storage, `images/${cnicValue}/${Date.now()}_${imageFile.name}`);
//             const imageSnapshot = await uploadBytes(imageStorageReference, imageFile);
//             updatedPersonal.ImageUrl = await getDownloadURL(imageSnapshot.ref);
//         }

//         // Update data at the path resContainer9/{cnic}/Personal
//         await update(ref(db, `resContainer9/${cnicValue}`), {
//             Personal: updatedPersonal,
//             Skills: getSkills() // Update skills if changed
//         });

//         alert("Personal data updated successfully!");
//         fetchAndDisplayCards(); // Refresh the displayed cards if necessary
//     } catch (error) {
//         console.error("Error updating data:", error);
//         alert("Error updating data: " + error.message);
//     }
// }












// ===============================
// Helper: upload file and return download URL (unchanged)
// ===============================
async function uploadFile(file, path) {
  if (!file) return "";
  const refFile = storageRef(storage, path);
  const snap = await uploadBytes(refFile, file);
  return await getDownloadURL(snap.ref);
}

// ===============================
// Helper: update section (object or array) (unchanged)
// ===============================
async function updateSectionData(cnicValue, sectionName, sectionData) {
  const baseRef = ref(db, `resContainer9/${cnicValue}/${sectionName}`);

  if (sectionName === "Education" && typeof sectionData === "object") {
    for (const type in sectionData) {
      const typeRef = ref(db, `resContainer9/${cnicValue}/Education/${type}`);
      await update(typeRef, sectionData[type]); // merge
    }
    return;
  }

  if (Array.isArray(sectionData)) {
    await set(baseRef, sectionData);
  } else if (typeof sectionData === "object" && sectionData !== null) {
    await update(baseRef, sectionData);
  } else {
    throw new Error("Invalid data type for updateSectionData");
  }
}

// ===============================
// Collect Education (parallel uploads, preserve old URLs)
// ===============================
async function collectEducationData(cnicValue) {
  const educationData = {};
  const eduCards = document.querySelectorAll(".edu-card");

  for (const card of eduCards) {
    const type = card.dataset.form;
    if (!type) continue;

    // fetch existing to preserve urls
    const typeRef = ref(db, `resContainer9/${cnicValue}/Education/${type}`);
    const oldSnap = await get(typeRef);
    const oldData = oldSnap.exists() ? oldSnap.val() : {};

    const oldMarksheet = Array.isArray(oldData.Marksheet) ? oldData.Marksheet : [];
    const oldCertificate = Array.isArray(oldData.Certificate) ? oldData.Certificate : [];
    const oldExtraDocs = Array.isArray(oldData.ExtraDocuments) ? oldData.ExtraDocuments : [];

    const fileInputs = card.querySelectorAll("input[type='file']");
    const marksheetFiles = fileInputs[0]?.files || [];
    const certificateFiles = fileInputs[1]?.files || [];

    // marksheets: upload in parallel and append to old
    const markPromises = [];
    for (const file of marksheetFiles) {
      markPromises.push(uploadFile(file, `resContainer9/${cnicValue}/Education/${type}/marksheets/${Date.now()}_${file.name}`));
    }
    const newMarks = markPromises.length ? await Promise.all(markPromises) : [];
    const marksheetUrls = [...oldMarksheet, ...newMarks];

    // certificates: upload in parallel and append to old
    const certPromises = [];
    for (const file of certificateFiles) {
      certPromises.push(uploadFile(file, `resContainer9/${cnicValue}/Education/${type}/certificates/${Date.now()}_${file.name}`));
    }
    const newCerts = certPromises.length ? await Promise.all(certPromises) : [];
    const certificateUrls = [...oldCertificate, ...newCerts];

      // ExtraDocuments: preserve old, replace/add per item (keep position)
    const extraDocItems = card.querySelectorAll(".extra-doc-item");
    // copy old array so entries not present in UI remain intact
    const mergedExtra = [...oldExtraDocs];
    const extraPromises = [];

    extraDocItems.forEach((docItem, uiIdx) => {
      const nameInput = docItem.querySelector('input[type="text"]');
      const fileInput = docItem.querySelector('input[type="file"]');

      // Prefer dataset.url, otherwise fall back to old DB entry at same index
      const datasetUrl = fileInput?.dataset?.url;
      const fallbackOld = oldExtraDocs[uiIdx] || {};
      const existingUrl = (typeof datasetUrl === "string" && datasetUrl !== "") ? datasetUrl : (fallbackOld.url || "");
      const existingName = nameInput?.value || (fallbackOld.name || "");

      if (fileInput?.files?.[0]) {
        // upload new file for this UI index
        extraPromises.push(
          (async () => {
            const f = fileInput.files[0];
            const url = await uploadFile(f, `resContainer9/${cnicValue}/Education/${type}/extra/${Date.now()}_${f.name}`);
            return { idx: uiIdx, entry: { name: nameInput?.value || fallbackOld.name || "", url } };
          })()
        );
      } else {
        // no new file: keep dataset/url or fallback to old DB url
        extraPromises.push(Promise.resolve({
          idx: uiIdx,
          entry: { name: existingName, url: existingUrl }
        }));
      }
    });

    // resolve and apply (parallel)
    const extraResults = extraPromises.length ? await Promise.all(extraPromises) : [];
    extraResults.forEach(({ idx, entry }) => {
      mergedExtra[idx] = entry;
    });


    // Build education item
    const educationItem = {
      Name: card.querySelector("input[type='text']")?.value || "",
      Degree: card.querySelector("select.float-input")?.value || "",
      Field: card.querySelector(".field-select")?.value || "",
      Subfield: card.querySelector(".subfield-select")?.value || card.dataset.autoSubfield || "",
      Rollno: card.querySelector("input[type='number']")?.value || "",
      Gpa: card.querySelector("input[type='number04']")?.value || "",
      Startyear: card.querySelector("input[type='number02']")?.value || "",
      Endyear: card.querySelector("input[type='number03']")?.value || "",
      Marksheet: marksheetUrls,
      Certificate: certificateUrls,
      ExtraDocuments: mergedExtra
    };

    educationData[type] = educationItem;
  }

  return educationData;
}

// ===============================
// Collect Experience (parallel uploads, preserve existing urls)
// ===============================
async function collectExperienceData(cnicValue) {
  const wrappers = document.querySelectorAll(".exp-row-wrapper");
  const experiences = [];

  let idx = 0;
  for (const wrapper of wrappers) {
    const expIndex = wrapper.dataset.expIndex || idx.toString();

    // Basic fields
    const orgName = wrapper.querySelector(`#Organizationname_${expIndex}`)?.value?.trim() || "";
    const orgPos = wrapper.querySelector(`#Organizationposition_${expIndex}`)?.value?.trim() || "";
    const unit = wrapper.querySelector(`#Organizationunit_${expIndex}`)?.value?.trim() || "";
    const duration = wrapper.querySelector(`#Organizationduration_${expIndex}`)?.value?.trim() || "";

    // ID card (preserve dataset.url if no new file)
    const idFileEl = wrapper.querySelector(`#Organizationidentity_${expIndex}`) || wrapper.querySelector(".exp-group input[type='file']");
    let idCardUrl = idFileEl?.dataset?.url || "";
    const idFile = idFileEl?.files?.[0];
    if (idFile) {
      idCardUrl = await uploadFile(idFile, `experiance/${cnicValue}/${expIndex}/idcard/${Date.now()}_${idFile.name}`);
    }

    // Extra documents: do parallel uploads for files
    const documents = [];
    const docNameInputs = wrapper.querySelectorAll(`[id^="moredocname_${expIndex}_"]`);
    const docPromises = [];

    for (let d = 0; d < docNameInputs.length; d++) {
      const nameEl = docNameInputs[d];
      const docName = nameEl?.value?.trim() || "";
      const fileEl = wrapper.querySelector(`#moredocpdf_${expIndex}_${d}`);
      const existingUrl = fileEl?.dataset?.url || "";
      const file = fileEl?.files?.[0];

      if (file) {
        docPromises.push(
          (async () => {
            const url = await uploadFile(file, `experiance/${cnicValue}/${expIndex}/docs/${Date.now()}_${file.name}`);
            return { idx: d, entry: { name: docName, url } };
          })()
        );
      } else {
        docPromises.push(Promise.resolve({ idx: d, entry: { name: docName, url: existingUrl } }));
      }
    }

    const docResults = docPromises.length ? await Promise.all(docPromises) : [];
    docResults.forEach(r => documents[r.idx] = r.entry);

    if (orgName || orgPos || duration || idCardUrl || documents.length) {
      experiences.push({
        experienceIndex: expIndex.toString(),
        organizationName: orgName,
        organizationPosition: orgPos,
        durationUnit: unit,
        durationNumber: duration,
        idCardUrl: idCardUrl || "",
        documents
      });
    }

    idx++;
  }

  experiences.sort((a, b) => parseInt(a.experienceIndex) - parseInt(b.experienceIndex));
  return experiences;
}

// ===============================
// Collect Service (parallel uploads)
// ===============================
async function collectServiceData(cnicValue) {
  const services = [];
  const wrappers = document.querySelectorAll(".ser-row-wrapper");
  let idx = 0;
  for (const w of wrappers) {
    const title = w.querySelector(`#Organizationtitle_${idx}`)?.value || "";
    const price = w.querySelector(`#Organizationprice_${idx}`)?.value || "";
    const desc = w.querySelector(`#organizationest_${idx}`)?.value || "";
    const duration = w.querySelector(`#organizationdigits_${idx}`)?.value || "";

    const idFileEl = w.querySelector(`#Organizationidentity_${idx}`) || w.querySelector(".ser-group input[type='file']");
    let idCardUrl = idFileEl?.dataset?.url || "";
    const idFile = idFileEl?.files?.[0];
    if (idFile) {
      idCardUrl = await uploadFile(idFile, `resContainer9/${cnicValue}/Service/${idx}/id_${Date.now()}_${idFile.name}`);
    }

    const docs = [];
    const docNameInputs = w.querySelectorAll(`[id^="serwiseddocname_${idx}_"]`);
    const docPromises = [];

    for (let d = 0; d < docNameInputs.length; d++) {
      const nameEl = docNameInputs[d];
      const docName = nameEl?.value || "";
      const fileEl = w.querySelector(`#serwiseddocpdf_${idx}_${d}`);
      const existingUrl = fileEl?.dataset?.url || "";
      const file = fileEl?.files?.[0];

      if (file) {
        docPromises.push(
          (async () => {
            const url = await uploadFile(file, `resContainer9/${cnicValue}/Service/${idx}/documents/${Date.now()}_${file.name}`);
            return { idx: d, entry: { name: docName, url } };
          })()
        );
      } else {
        docPromises.push(Promise.resolve({ idx: d, entry: { name: docName, url: existingUrl } }));
      }
    }

    const docResults = docPromises.length ? await Promise.all(docPromises) : [];
    docResults.forEach(r => docs[r.idx] = r.entry);

    if (title || price || desc || duration || idCardUrl || docs.length) {
      services.push({
        organizationtitle: title,
        organizationprice: price,
        durationest: desc,
        durationdigits: duration,
        idCardUrl: idCardUrl || "",
        documents: docs
      });
    }
    idx++;
  }
  return services;
}

// ===============================
// Collect Projects (parallel uploads)
// ===============================
async function collectProjectData(cnicValue) {
  const projects = [];
  const wrappers = document.querySelectorAll(".pro-row-wrapper");
  let idx = 0;
  for (const w of wrappers) {
    const category = w.querySelector(`#Organizationcategory_${idx}`)?.value || "";
    const pname = w.querySelector(`#Organizationproname_${idx}`)?.value || "";
    const purl = w.querySelector(`#Organizationprourl_${idx}`)?.value || "";

    const imgEl = w.querySelector(`#Organizationproimg_${idx}`) || w.querySelector(".pro-group input[type='file']");
    let imgUrl = imgEl?.dataset?.url || "";
    const imgFile = imgEl?.files?.[0];
    if (imgFile) {
      imgUrl = await uploadFile(imgFile, `resContainer9/${cnicValue}/Project/${idx}/image_${Date.now()}_${imgFile.name}`);
    }

    const docs = [];
    const docNameInputs = w.querySelectorAll(`[id^="prowisedname_${idx}_"]`);
    const docPromises = [];

    for (let d = 0; d < docNameInputs.length; d++) {
      const nameEl = docNameInputs[d];
      const docName = nameEl?.value || "";
      const fileEl = w.querySelector(`#prowisedfile_${idx}_${d}`);
      const existingUrl = fileEl?.dataset?.url || "";
      const file = fileEl?.files?.[0];

      if (file) {
        docPromises.push(
          (async () => {
            const url = await uploadFile(file, `resContainer9/${cnicValue}/Project/${idx}/documents/${Date.now()}_${file.name}`);
            return { idx: d, entry: { name: docName, url } };
          })()
        );
      } else {
        docPromises.push(Promise.resolve({ idx: d, entry: { name: docName, url: existingUrl } }));
      }
    }

    const docResults = docPromises.length ? await Promise.all(docPromises) : [];
    docResults.forEach(r => docs[r.idx] = r.entry);

    if (category || pname || purl || imgUrl || docs.length) {
      projects.push({
        category,
        projectName: pname,
        projectUrl: purl,
        imageUrl: imgUrl || "",
        documents: docs
      });
    }
    idx++;
  }
  return projects;
}

// ===============================
// Collect Team (parallel uploads)
// ===============================
async function collectTeamData(cnicValue) {
  const team = [];
  const wrappers = document.querySelectorAll(".tem-row-wrapper");
  let idx = 0;
  for (const w of wrappers) {
    const name = w.querySelector(`#Organizationtemname_${idx}`)?.value || "";
    const prof = w.querySelector(`#Organizationtemproff_${idx}`)?.value || "";
    const about = w.querySelector(`#Organizationtemperagraph02_${idx}`)?.value || "";
    const facebook = w.querySelector(`#Organizationfacebookurl_${idx}`)?.value || "";
    const linkedin = w.querySelector(`#Organizationlinkedurl_${idx}`)?.value || "";
    const twitter = w.querySelector(`#Organizationtwitterurl_${idx}`)?.value || "";

    const imgEl = w.querySelector(`#Organizationtemimg_${idx}`) || w.querySelector(".tem-group input[type='file']");
    let profileImgUrl = imgEl?.dataset?.url || "";
    const imgFile = imgEl?.files?.[0];
    if (imgFile) {
      profileImgUrl = await uploadFile(imgFile, `resContainer9/${cnicValue}/Team/${idx}/profile_${Date.now()}_${imgFile.name}`);
    }

    const docs = [];
    const docNameInputs = w.querySelectorAll(`[id^="teamdocname_${idx}_"]`);
    const docPromises = [];

    for (let d = 0; d < docNameInputs.length; d++) {
      const nameEl = docNameInputs[d];
      const docName = nameEl?.value || "";
      const fileEl = w.querySelector(`#teamdocpdf_${idx}_${d}`);
      const existingUrl = fileEl?.dataset?.url || "";
      const file = fileEl?.files?.[0];

      if (file) {
        docPromises.push(
          (async () => {
            const url = await uploadFile(file, `resContainer9/${cnicValue}/Team/${idx}/documents/${Date.now()}_${file.name}`);
            return { idx: d, entry: { name: docName, url } };
          })()
        );
      } else {
        docPromises.push(Promise.resolve({ idx: d, entry: { name: docName, url: existingUrl } }));
      }
    }

    const docResults = docPromises.length ? await Promise.all(docPromises) : [];
    docResults.forEach(r => docs[r.idx] = r.entry);

    if (name || prof || about || facebook || linkedin || twitter || profileImgUrl || docs.length) {
      team.push({
        teamateName: name,
        teamateProfession: prof,
        teamateAbout: about,
        facebook,
        linkedin,
        twitter,
        profileImgUrl: profileImgUrl || "",
        documents: docs
      });
    }
    idx++;
  }
  return team;
}







// ===============================
// Job Reference Update Function
// ===============================
async function updateJobReferenceData(cnicValue) {
    const jobReferenceData = {
        Reference1: {
            Name: refName1.value?.trim() || "",
            Post: post1.value?.trim() || "",
            PhoneNumber: refNumber1.value?.trim() || "",
            Email: refEmail1.value?.trim() || "",
        },
        Reference2: {
            Name: refName2.value?.trim() || "",
            Post: post2.value?.trim() || "",
            PhoneNumber: refNumber2.value?.trim() || "",
            Email: refEmail2.value?.trim() || "",
        }
    };

    await updateSectionData(cnicValue, "JobReference", jobReferenceData);
    console.log("✅ Updated job reference data:", jobReferenceData);
}



// ----- Self Video Update inside updateData() -----
async function updateData() {
  const cnicValue = cnic.value?.trim();
  if (!cnicValue) return alert("Please enter CNIC before updating.");

  try {
    // 1) Personal
    const personalData = {
      Name: nameInput.value?.trim() || "",
      Fname: fname.value?.trim() || "",
      Dob: dob.value?.trim() || "",
      Phone: phone.value?.trim() || "",
      Caddres: caddres.value?.trim() || "",
      Paddres: paddres.value?.trim() || "",
      Qual: qual.value?.trim() || "",
      Lisnt: lisnt.value?.trim() || "",
      Rarmy: rarmy.value?.trim() || "",
      Citybox: citybox.value?.trim() || "",
      Countrybox: countrybox.value?.trim() || "",
      Resumeprofession: resumeprofession.value?.trim() || "",
      Aboutpera: aboutpera.value?.trim() || "",
      Busname: busName.value?.trim() || "",
      BusNumber: busNumber.value?.trim() || "",
      Busemail: busEmail.value?.trim() || "",
      Busaddress: busAddress.value?.trim() || "",
      Busfacebooks: busFacebook.value?.trim() || "",
      Instagram: busInstagram.value?.trim() || "",
      Buslinkedin: busLinkedIn.value?.trim() || "",
      Twitter: busTwitter.value?.trim() || "",
      Github: busGithub.value?.trim() || "",
      Youtube: busYoutube.value?.trim() || "",    
      updatedAt: new Date().toISOString(),
    };

    // --- Handle Self Video Upload ---
    const selfVideoInput = document.getElementById("selfVideoUrl");
    if (selfVideoInput?.files?.[0]) {
      const file = selfVideoInput.files[0];
      const maxSize = 200 * 1024 * 1024; // 200MB limit
      if (file.size > maxSize) {
        alert("Video must be under 200MB!");
      } else {
        const videoStorageRef = storageRef(
          storage,
          `resContainer9/${cnicValue}/Personal/selfVideo_${Date.now()}_${file.name}`
        );
        const snapshot = await uploadBytes(videoStorageRef, file);
        const videoUrl = await getDownloadURL(snapshot.ref);

        personalData.selfVideoUrl = videoUrl;

        // Update preview immediately
        const videoPreviewContainer = document.querySelector("#selfVideoPreview");
        if (videoPreviewContainer) {
          videoPreviewContainer.innerHTML = "";
          const vid = document.createElement("video");
          vid.src = videoUrl;
          vid.className = "video-preview-box";
          vid.controls = true;
          videoPreviewContainer.appendChild(vid);
        }

        console.log("🎥 Self Video updated and preview refreshed:", videoUrl);
      }
    } else if (personalData.selfVideoUrl) {
      console.log("⚠ No new video selected, keeping existing:", personalData.selfVideoUrl);
    }

    // --- Handle Profile Image ---
    if (imageUpload?.files?.[0]) {
      personalData.ImageUrl = await uploadFile(
        imageUpload.files[0],
        `resContainer9/${cnicValue}/Personal/profile_${Date.now()}_${imageUpload.files[0].name}`
      );
    }

    await updateSectionData(cnicValue, "Personal", personalData);

    // 2) Other sections remain untouched
    const educationData = await collectEducationData(cnicValue);
    await updateSectionData(cnicValue, "Education", educationData);

    const experienceArr = await collectExperienceData(cnicValue);
    await updateSectionData(cnicValue, "Experience", experienceArr);

    const serviceArr = await collectServiceData(cnicValue);
    await updateSectionData(cnicValue, "Service", serviceArr);

    const projectArr = await collectProjectData(cnicValue);
    await updateSectionData(cnicValue, "Project", projectArr);

    const teamArr = await collectTeamData(cnicValue);
    await updateSectionData(cnicValue, "Team", teamArr);

    await updateJobReferenceData(cnicValue);

// --- Skills update (old format preserved) ---
const skillsRef = ref(db, `resContainer9/${cnicValue}/Skills`);
const existingSnap = await get(skillsRef);
const existingSkills = existingSnap.exists() ? existingSnap.val() : {};

// Map DB by name
const existingByName = {};
Object.keys(existingSkills).forEach(key => {
  const item = existingSkills[key];
  if (item && item.name) existingByName[item.name] = { ...item, key };
});

// Map selected by name
const selectedByName = {};
selectedSkills.forEach(s => { if (s.name) selectedByName[s.name] = s });

// 1️⃣ DELETE items that exist in DB but NOT selected
for (const name in existingByName) {
  if (!selectedByName[name]) {
    const delKey = existingByName[name].key;
    await remove(ref(db, `resContainer9/${cnicValue}/Skills/${delKey}`));
  }
}

// 2️⃣ ADD or UPDATE items
for (const s of selectedSkills) {

  // If exists → update percent only if changed
  if (existingByName[s.name]) {
    const oldItem = existingByName[s.name];
    if (oldItem.percent !== s.percent) {
      await update(
        ref(db, `resContainer9/${cnicValue}/Skills/${oldItem.key}`),
        { percent: s.percent }
      );
    }
  }



  // If NOT exists → add at next index
  else {
    const newIndex = Object.keys(await get(skillsRef).then(x => x.val() || {})).length;
    await update(
      ref(db, `resContainer9/${cnicValue}/Skills/${newIndex}`),
      {
        name: s.name,
        percent: s.percent || "100%"
      }
    );
  }
}

console.log("✅ Skills perfectly synced");


    // --- Professionality update remains untouched ---
    const professionEl = document.getElementById("professionInput");
    const currentTags = professionEl.value
      .split(",")
      .map(p => p.trim())
      .filter(Boolean);

    const existingProfSnap = await get(ref(db, `resContainer9/${cnicValue}/Professionality`));
    const existingData = existingProfSnap.exists() ? existingProfSnap.val() : {};

    let existingProfArr = [];
    if (existingData.profession) {
      existingProfArr = existingData.profession.split(",").map(p => p.trim());
    }

    const mergedProfArr = Array.from(new Set([...existingProfArr, ...currentTags]));

    const profData = {
      ...existingData,
      profession: mergedProfArr.join(", "),
      Years: maybeGetById("Years")?.value || existingData.Years || "",
      aboutHeadline: maybeGetById("aboutHeadline")?.value || existingData.aboutHeadline || "",
      aboutParagraph: maybeGetById("aboutParagraph")?.value || existingData.aboutParagraph || "",
      aboutPara2: maybeGetById("aboutPara2")?.value || existingData.aboutPara2 || "",
      aboutPara3: maybeGetById("aboutPara3")?.value || existingData.aboutPara3 || "",
      happyClients: maybeGetById("happyClients")?.value || existingData.happyClients || "",
      projectsCompleted: maybeGetById("projectsCompleted")?.value || existingData.projectsCompleted || "",
      updatedAt: new Date().toISOString()
    };

    const frontFile = document.getElementById("CnicFrontUpload")?.files?.[0];
    const backFile = document.getElementById("CnicBackUpload")?.files?.[0];
    const profileFile = document.getElementById("ProfilePhotoUpload")?.files?.[0];

    profData.CnicFront = frontFile
      ? await uploadFile(frontFile, `resContainer9/${cnicValue}/Professionality/CnicFront_${Date.now()}_${frontFile.name}`)
      : (existingData.CnicFront || "");

    profData.CnicBack = backFile
      ? await uploadFile(backFile, `resContainer9/${cnicValue}/Professionality/CnicBack_${Date.now()}_${backFile.name}`)
      : (existingData.CnicBack || "");

    profData.ProfilePhoto = profileFile
      ? await uploadFile(profileFile, `resContainer9/${cnicValue}/Professionality/ProfilePhoto_${Date.now()}_${profileFile.name}`)
      : (existingData.ProfilePhoto || "");

    await updateSectionData(cnicValue, "Professionality", profData);

    console.log("✅ Updated profession:", mergedProfArr.join(", "));
    alert("✅ All sections updated successfully.");
    try { fetchAndDisplayCards(); } catch (e) { /* optional UI refresh */ }

  } catch (err) {
    console.error("❌ Update failed:", err);
    alert("Update failed: " + (err.message || err));
  }
}

document.getElementById("updateBtn")?.addEventListener("click", updateData);


// // =============
// // Event Binding
// // =============
// document.getElementById("updateBtn")?.addEventListener("click", updateData);









// // ===============================
// // ✏️ UPDATE FUNCTION
// // ===============================
// async function updateData() {
//   const cnicValue = cnic.value.trim();
//   if (!cnicValue) return alert("Please enter CNIC first.");

//   const userRef = ref(db, `resContainer9/${cnicValue}/Personal`);

//   try {
//     // --- Base object with updated values ---
//     const updatedData = {
//       Name: nameInput.value.trim(),
//       Fname: fname.value.trim(),
//       Dob: dob.value.trim(),
//       Phone: phone.value.trim(),
//       Caddres: caddres.value.trim(),
//       Paddres: paddres.value.trim(),
//       Qual: qual.value.trim(),
//       Lisnt: lisnt.value.trim(),
//       Rarmy: rarmy.value.trim(),
//       City: citybox.value.trim(),
//       Country: countrybox.value.trim(),
//       updatedAt: new Date().toISOString(),
//     };

//     // --- Upload new image if changed ---
//     if (imageUpload.files[0]) {
//       const imgRef = storageRef(storage, `resContainer9/${cnicValue}/profile_${Date.now()}.jpg`);
//       const snap = await uploadBytes(imgRef, imageUpload.files[0]);
//       const imageURL = await getDownloadURL(snap.ref);
//       updatedData.ImageUrl = imageURL;
//     }

//     // --- Update Realtime DB ---
//     await update(userRef, updatedData);
//     alert("✅ Data updated successfully!");

//     // Optional: refresh card display instantly
//     fetchAndDisplayCards();

//   } catch (error) {
//     console.error("❌ Update failed:", error);
//     alert("Error updating data: " + error.message);
//   }
// }

// // ===============================
// // 🔘 Update Button Handler
// // ===============================
// document.getElementById("updateBtn")?.addEventListener("click", updateData);













// async function updateData() {
//   const cnicValue = document.getElementById("Cnic").value.trim();
//   if (!cnicValue) return alert("Please enter a CNIC number.");

//   try {
//     const userRef = doc(db, "users", cnicValue);

//     // ---------- Gather all input, select, and textarea values ----------
//     const updatedData = {};
//     const allInputs = document.querySelectorAll(
//       "input:not([type='file']), select, textarea"
//     );

//     allInputs.forEach((el) => {
//       const key = el.id || el.name;
//       if (key) updatedData[key] = el.value.trim();
//     });

//     // ---------- Gather project, team, and service file URLs ----------
//     const allFileGroups = document.querySelectorAll(
//       ".file-group, .pro-group, .tem-group, .ser-group"
//     );

//     allFileGroups.forEach((group) => {
//       const input = group.querySelector("input[type='file']");
//       const img = group.querySelector("img");
//       const link = group.querySelector("a");
//       if (!input) return;

//       const key = input.id || input.name;
//       if (img) updatedData[key] = img.src;
//       else if (link) updatedData[key] = link.href;
//     });

//     // ---------- Push update to Firestore ----------
//     await updateDoc(userRef, updatedData);

//     alert("✅ Data successfully updated!");
//     console.log("Updated data:", updatedData);
//   } catch (error) {
//     console.error("❌ Error updating data:", error);
//     alert("Failed to update data — see console for details.");
//   }
// }






// ----------------- Delete entire CNIC node -----------------
deleteBtn.addEventListener('click', async () => {
    const cnicValue = cnic.value;
    if (!cnicValue) return alert("Please enter a CNIC number.");

    if (!confirm(`Delete all data for CNIC ${cnicValue}? This cannot be undone.`)) return;

    try {
        await remove(ref(db, `resContainer9/${cnicValue}`));
        alert("Data deleted successfully.");
        clearForm();
        fetchAndDisplayCards();
        localStorage.removeItem("selectedSkills");
    } catch (error) {
        console.error("Error deleting data:", error);
        alert("Error deleting data: " + error.message);
    }
});

// ----------------- Initial fetch -----------------
fetchAndDisplayCards();










                   
      // <div class="exp-group">
      //   <select id="organizationunit" class="exp-input" required>
      //     <option value="" disabled selected></option>
      //     <option value="Months">Months</option>
      //     <option value="Years">Years</option>
      //   </select>
      //   <label class="exp-label" for="organizationunit_${index}">Month Or Year</label>
      // </div>
      //    <div class="exp-group">
      //   <input type="number" id="Organizationduration_${index}" class="ser-input" placeholder=" " required />
      //   <label class="exp-label" for="Organizationduration_${index}">Duration Number</label>
      // </div>