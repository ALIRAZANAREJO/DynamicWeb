// database.js (full final file)
// -----------------------------
// Firebase + app logic that stores Personal, Education, Experience, Skills
// under resContainer9/{CNIC} with files uploaded to Storage and URLs saved in DB.

// Imports (v9)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, set, onValue, get, child, update, remove } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

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
const citybox = document.getElementById('Citybox');
const countrybox = document.getElementById('Countrybox');
const imageUpload = document.getElementById('ImageUpload');
const imagePreview = document.getElementById('image-preview');
const submitBtn = document.getElementById('submitBtn');
const recallBtn = document.getElementById('recallBtn');
const updateBtn = document.getElementById('updateBtn');
const deleteBtn = document.getElementById('deleteBtn');
const resContainer9 = document.getElementById('resContainer9');

// ================== Education Form Elements (as before) ==================
const years = document.getElementById('Years');
const aboutHeadline = document.getElementById('aboutHeadline');
const aboutParagraph = document.getElementById('aboutParagraph');
const aboutPara2 = document.getElementById('aboutPara2');
const aboutPara3 = document.getElementById('aboutPara3');
const happyClients = document.getElementById('happyClients');
const projectsCompleted = document.getElementById('projectsCompleted');
const aboutImages = document.getElementById('AboutImages');

// ================== Education Form Elements (as before) ==================
const Schoolname = document.getElementById('Schoolname');
const Schooldegree = document.getElementById('Schooldegree');
const Schoolrollno = document.getElementById('Schoolrollno');
const Schoolstartyear = document.getElementById('Schoolstartyear');
const Schoolendyear = document.getElementById('Schoolendyear');
const Schoolgpa = document.getElementById('Schoolgpa');
const Schoolcertificate = document.getElementById('Schoolcertificate');
const Schooladddoc = document.getElementById('Schooladddoc');

const Collegename = document.getElementById('Collegename');
const Collegedegree = document.getElementById('Collegedegree');
const Collegerollno = document.getElementById('Collegerollno');
const Collegestartyear = document.getElementById('Collegestartyear');
const Collegeendyear = document.getElementById('Collegeendyear');
const Collegegpa = document.getElementById('Collegegpa');
const Collegemarksheet = document.getElementById('Collegemarksheet');
const Collegecertificate = document.getElementById('Collegecertificate');
const Collegeadddoc = document.getElementById('Collegeadddoc');

const Universityname = document.getElementById('Universityname');
const Universitydegree = document.getElementById('Universitydegree');
const Universityrollno = document.getElementById('Universityrollno');
const Universitystartyear = document.getElementById('Universitystartyear');
const Universityendyear = document.getElementById('Universityendyear');
const Universitygpa = document.getElementById('Universitygpa');
const Universitymarksheet = document.getElementById('Universitymarksheet');
const Universitycertificate = document.getElementById('Universitycertificate');
const Universityadddoc = document.getElementById('Universityadddoc');


const Masteruniversityname = document.getElementById('Masteruniversityname');
const Masterdegree = document.getElementById('Masterdegree');
const Masterrollno = document.getElementById('Masterrollno');
const Masterstartyear = document.getElementById('Masterstartyear');
const Masterendyear = document.getElementById('Masterendyear');
const Mastergpa = document.getElementById('Mastergpa');
const Mastermarksheet = document.getElementById('Mastermarksheet');
const Mastercertificate = document.getElementById('Mastercertificate');
const Masteradddoc = document.getElementById('Masteradddoc');

const Phduniversityname = document.getElementById('Phduniversityname');
const Phddegree = document.getElementById('Phddegree');
const Phdrollno = document.getElementById('Phdrollno');
const Phdstartyear = document.getElementById('Phdstartyear');
const Phdendyear = document.getElementById('Phdendyear');
const Phdgpa = document.getElementById('Phdgpa');
const Phdmarksheet = document.getElementById('Phdmarksheet');
const Phdcertificate = document.getElementById('Phdcertificate');
const Phdadddoc = document.getElementById('Phdadddoc');



// ----------------- Helpers -----------------
function getSkills() {
    return JSON.parse(localStorage.getItem("selectedSkills")) || [];
}

function maybeGetById(id) {
    return document.getElementById(id) || null;
}

imagePreview.addEventListener('click', () => imageUpload.click());
imageUpload.addEventListener('change', () => {
    const file = imageUpload.files[0];
    if (file) updateImagePreview(file);
});
function updateImagePreview(file) {
    imagePreview.src = URL.createObjectURL(file);
}

// ----------------- Fetch & display cards (overview) -----------------
function fetchAndDisplayCards() {
    const dbRef = ref(db, "resContainer9");
    onValue(dbRef, snapshot => {
        resContainer9.innerHTML = "";
        snapshot.forEach(childSnapshot => createCard(childSnapshot.key, childSnapshot.val()));
    });
}

function createCard(id, data) {
    // If using nested Personal structure, pull from data.Personal
    const personal = data.Personal || {};
    const Skills = data.Skills || [];
    const ImageUrl = personal.ImageUrl || "";

    const card = document.createElement('div');
    card.className = 'card-container';
    card.setAttribute('data-id', id);

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
    citybox.value = '';
    countrybox.value = '';
    imageUpload.value = '';
    imagePreview.src = '';
    localStorage.removeItem("selectedSkills");

    // Clear education form
    Schoolname.value = '';
    Schooldegree.value = '';
    Schoolrollno.value = '';
    Schoolmarksheet.value = '';
    Schoolcertificate.value = '';

    Collegename.value = '';
    Collegedegree.value = '';
    Collegerollno.value = '';
    Collegemarksheet.value = '';
    Collegecertificate.value = '';

    Universityname.value = '';
    Universitydegree.value = '';
    Universityrollno.value = '';
    Universitymarksheet.value = '';
    Universitycertificate.value = '';

    Masteruniversityname.value = '';
    Masterdegree.value = '';
    Masterrollno.value = '';
    Mastermarksheet.value = '';
    Mastercertificate.value = '';

    Phduniversityname.value = '';
    Phddegree.value = '';
    Phdrollno.value = '';
    Phdmarksheet.value = '';
    Phdcertificate.value = '';
}

// ----------------- Submit (combined) -----------------
/*
  NOTE: I replaced the old experience collection loop with a call to collectExperiences(cnicValue)
  which is defined below and handles first static row (index 0) + dynamic rows (1..n)
*/
submitBtn.addEventListener('click', async () => {
    if (!cnic.value) return alert("Please enter a CNIC number.");

    try {
        // =========== Upload profile image ===========
        let imageUrl = imagePreview.src || "";
        const imageFile = imageUpload.files[0];
        if (imageFile) {
            const imageStorageRef = storageRef(storage, `images/${cnic.value}/${Date.now()}_${imageFile.name}`);
            const imageSnapshot = await uploadBytes(imageStorageRef, imageFile);
            imageUrl = await getDownloadURL(imageSnapshot.ref);
        }

        // =========== Skills ===========
        const skills = getSkills();

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
        // Use the robust helper defined later that properly maps 0..n
        const experienceData = await collectExperiences(cnic.value);

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
            Citybox: citybox.value,
            Countrybox: countrybox.value,
            ImageUrl: imageUrl
        };
 

        // =========== Store All Data under resContainer9/{cnic} ===========
        const newCnicRef = ref(db, `resContainer9/${cnic.value}`);
        await set(newCnicRef, {
            Personal: personalData,
            Education: educationData,
            Experience: experienceData,
            Skills: skills,
            Professionality,professionalityData
        });

        localStorage.removeItem("selectedSkills");
        clearForm();
        alert("Data stored successfully with education and experience!");
        fetchAndDisplayCards();

    } catch (error) {
        console.error("Error storing education & experience data:", error);
        alert("Error storing data: " + error.message);
    }
});


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

// ================== Submit Button (duplicate block removed) ==================
// NOTE: Your file included a separate submit handler near the end; we've used the first submit handler above
// which calls collectExperiences. If you had another submit handler lower in the file, please remove duplicates.

// ----------------- Recall data (reads nested structure) -----------------
recallBtn.addEventListener('click', async () => {
    const cnicValue = cnic.value;
    if (!cnicValue) return alert("Please enter a CNIC number.");

    try {
        const snapshot = await get(child(ref(db), `resContainer9/${cnicValue}`));
        if (snapshot.exists()) {
            const data = snapshot.val();

            // Personal (nested)
            const personal = data.Personal || {};
            nameInput.value = personal.Name || '';
            fname.value = personal.Fname || '';
            dob.value = personal.Dob || '';
            phone.value = personal.Phone || '';
            caddres.value = personal.Caddres || '';
            paddres.value = personal.Paddres || '';
            qual.value = personal.Qual || '';
            lisnt.value = personal.Lisnt || '';
            rarmy.value = personal.Rarmy || '';
            citybox.value = personal.Citybox || '';
            countrybox.value = personal.Countrybox || '';
            imagePreview.src = personal.ImageUrl || '';

            // Education (best-effort mapping)
            const education = data.Education || {};
            // Each education type stored previously under its type key
            // We'll try to map some common fields you had
            // (Note: file inputs cannot be set for security reasons — we only restore text fields and can show links.)
            // Example for School
            if (education.school) {
                Schoolname.value = education.school.Name || '';
                Schooldegree.value = education.school.Degree || '';
                Schoolrollno.value = education.school.Rollno || '';
                // show marksheet and certificate links if needed (not populating file inputs)
                if (education.school.Marksheet && education.school.Marksheet.length) {
                    // you can render links in UI if desired
                }
            } else {
                // fallback older plain fields if present
                Schoolname.value = data.Schoolname || '';
                Schooldegree.value = data.Schooldegree || '';
                Schoolrollno.value = data.Schoolrollno || '';
            }

            // Similarly for College, University, Master, Phd (best-effort)
            if (education.college) {
                Collegename.value = education.college.Name || '';
                Collegedegree.value = education.college.Degree || '';
                Collegerollno.value = education.college.Rollno || '';
            } else {
                Collegename.value = data.Collegename || '';
                Collegedegree.value = data.Collegedegree || '';
                Collegerollno.value = data.Collegerollno || '';
            }

            if (education.university) {
                Universityname.value = education.university.Name || '';
                Universitydegree.value = education.university.Degree || '';
                Universityrollno.value = education.university.Rollno || '';
            } else {
                Universityname.value = data.Universityname || '';
                Universitydegree.value = data.Universitydegree || '';
                Universityrollno.value = data.Universityrollno || '';
            }

            if (education.master) {
                Masteruniversityname.value = education.master.Name || '';
                Masterdegree.value = education.master.Degree || '';
                Masterrollno.value = education.master.Rollno || '';
            } else {
                Masteruniversityname.value = data.Masteruniversityname || '';
                Masterdegree.value = data.Masterdegree || '';
                Masterrollno.value = data.Masterrollno || '';
            }

            if (education.phd) {
                Phduniversityname.value = education.phd.Name || '';
                Phddegree.value = education.phd.Degree || '';
                Phdrollno.value = education.phd.Rollno || '';
            } else {
                Phduniversityname.value = data.Phduniversityname || '';
                Phddegree.value = data.Phddegree || '';
                Phdrollno.value = data.Phdrollno || '';
            }

            // Restore Skills to localStorage for UI usage
            if (data.Skills) localStorage.setItem("selectedSkills", JSON.stringify(data.Skills));

            // Experience: render into .exper-docs container if present
            const experienceArr = data.Experience || [];
            const experDocsContainer = document.querySelector(".exper-docs");
            if (experDocsContainer) {
                // Clear existing UI experiences
                experDocsContainer.innerHTML = "";

                // For each experience, create a small summary block (non-destructive)
                experienceArr.forEach(exp => {
                    const block = document.createElement("div");
                    block.className = "recalled-experience";
                    block.innerHTML = `
                        <h4>Organization: ${exp.organizationName || ''}</h4>
                        <h5>Organization: ${exp.organizationPosition || ''}</h5>
                        <p>Duration: ${exp.durationNumber || ''} ${exp.durationUnit || ''}</p>
                        ${exp.idCardUrl ? `<p>ID Card: <a target="_blank" href="${exp.idCardUrl}">View</a></p>` : ''}
                        ${exp.documents && exp.documents.length ? `<p>Documents:</p><ul>${exp.documents.map(d => `<li>${d.name || 'file'} ${d.url ? `- <a target="_blank" href="${d.url}">View</a>` : ''}</li>`).join('')}</ul>` : ''}
                    `;
                    experDocsContainer.appendChild(block);
                });
            }

        } else {
            alert("No data found for the given CNIC number.");
        }
    } catch (error) {
        console.error("Error retrieving data:", error);
        alert("Error retrieving data: " + error.message);
    }
});

// ----------------- Update (partial update, preserves nested structure) -----------------
updateBtn.addEventListener('click', async () => {
    const cnicValue = cnic.value;
    if (!cnicValue) return alert("Please enter a CNIC number.");

    try {
        const updatedPersonal = {
            Cnic: cnicValue,
            Name: nameInput.value,
            Fname: fname.value,
            Dob: dob.value,
            Phone: phone.value,
            Caddres: caddres.value,
            Paddres: paddres.value,
            Qual: qual.value,
            Lisnt: lisnt.value,
            Rarmy: rarmy.value,
            Citybox: citybox.value,
            Countrybox: countrybox.value
        };

        // Upload new profile image if provided
        const imageFile = imageUpload.files[0];
        if (imageFile) {
            const imageStorageReference = storageRef(storage, `images/${cnicValue}/${Date.now()}_${imageFile.name}`);
            const imageSnapshot = await uploadBytes(imageStorageReference, imageFile);
            updatedPersonal.ImageUrl = await getDownloadURL(imageSnapshot.ref);
        }

        // Update data at the path resContainer9/{cnic}/Personal and resContainer9/{cnic}/Skills (if changed)
        await update(ref(db, `resContainer9/${cnicValue}`), {
            Personal: updatedPersonal,
            Skills: getSkills()
            // Education/Experience left untouched here (use Submit to fully overwrite them)
        });

        alert("Personal data updated successfully!");
        fetchAndDisplayCards();
        localStorage.removeItem("selectedSkills");
    } catch (error) {
        console.error("Error updating data:", error);
        alert("Error updating data: " + error.message);
    }
});

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
