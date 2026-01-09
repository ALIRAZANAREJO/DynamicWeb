import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, set, onValue, get, child, update, remove } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

// Firebase configuration
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

// Elements
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

// ================== Education Form Elements ==================
const Schoolname = document.getElementById('Schoolname');
const Schooldegree = document.getElementById('Schooldegree');
const Schoolrollno = document.getElementById('Schoolrollno');
const Schoolmarksheet = document.getElementById('Schoolmarksheet');
const Schoolcertificate = document.getElementById('Schoolcertificate');
const Schooladddoc = document.getElementById('Schooladddoc');

const Collegename = document.getElementById('Collegename');
const Collegedegree = document.getElementById('Collegedegree');
const Collegerollno = document.getElementById('Collegerollno');
const Collegemarksheet = document.getElementById('Collegemarksheet');
const Collegecertificate = document.getElementById('Collegecertificate');
const Collegeadddoc = document.getElementById('Collegeadddoc');

const Universityname = document.getElementById('Universityname');
const Universitydegree = document.getElementById('Universitydegree');
const Universityrollno = document.getElementById('Universityrollno');
const Universitymarksheet = document.getElementById('Universitymarksheet');
const Universitycertificate = document.getElementById('Universitycertificate');
const Universityadddoc = document.getElementById('Universityadddoc');

const Masteruniversityname = document.getElementById('Masteruniversityname');
const Masterdegree = document.getElementById('Masterdegree');
const Masterrollno = document.getElementById('Masterrollno');
const Mastermarksheet = document.getElementById('Mastermarksheet');
const Mastercertificate = document.getElementById('Mastercertificate');
const Masteradddoc = document.getElementById('Masteradddoc');

const Phduniversityname = document.getElementById('Phduniversityname');
const Phddegree = document.getElementById('Phddegree');
const Phdrollno = document.getElementById('Phdrollno');
const Phdmarksheet = document.getElementById('Phdmarksheet');
const Phdcertificate = document.getElementById('Phdcertificate');
const Phdadddoc = document.getElementById('Phdadddoc');


// ================== Skills Integration ==================
function getSkills() {
    return JSON.parse(localStorage.getItem("selectedSkills")) || [];
}

// ================== Image preview ==================
imagePreview.addEventListener('click', () => imageUpload.click());
imageUpload.addEventListener('change', () => {
    const file = imageUpload.files[0];
    if (file) updateImagePreview(file);
});
function updateImagePreview(file) {
    imagePreview.src = URL.createObjectURL(file);
}
// ================== Submit Education Data with Dynamic Files ==================
submitBtn.addEventListener('click', async () => {
    if (!cnic.value) return alert("Please enter a CNIC number.");

    try {
        // ================== Profile Image ==================
        let imageUrl = imagePreview.src || ""; // default to current preview
        const imageFile = imageUpload.files[0];
        if (imageFile) {
            const imageStorageRef = storageRef(storage, `images/${imageFile.name}`);
            const imageSnapshot = await uploadBytes(imageStorageRef, imageFile);
            imageUrl = await getDownloadURL(imageSnapshot.ref);
        }

        // ================== Skills ==================
        const skills = getSkills();

        // ================== Collect Education Data ==================
        const educationData = {};

        const eduCards = document.querySelectorAll(".edu-card");
        for (const card of eduCards) {
            const type = card.dataset.form; // school, college, etc.

            const nameInput = card.querySelector("input[type='text']");
            const degreeSelect = card.querySelector("select.float-input");
            const fieldSelect = card.querySelector(".field-select");
            const subfieldSelect = card.querySelector(".subfield-select");
            const rollnoInput = card.querySelector("input[type='number']");

            // Files: Marksheets and Certificates (first 2 file inputs)
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
                const refFile = storageRef(storage, `education/${cnic.value}/${type}/marksheets/${file.name}`);
                const snapshot = await uploadBytes(refFile, file);
                marksheetUrls.push(await getDownloadURL(snapshot.ref));
            }

            // Upload Certificates
            const certificateUrls = [];
            for (const file of certificateFiles) {
                const refFile = storageRef(storage, `education/${cnic.value}/${type}/certificates/${file.name}`);
                const snapshot = await uploadBytes(refFile, file);
                certificateUrls.push(await getDownloadURL(snapshot.ref));
            }

            // Save edu-card data
   educationData[type] = {
    Name: nameInput ? nameInput.value : "",
    Degree: degreeSelect ? degreeSelect.value : "",
    Field: fieldSelect ? fieldSelect.value : "",
    Subfield: subfieldSelect ? subfieldSelect.value : (card.dataset.autoSubfield || ""),
    Rollno: rollnoInput ? rollnoInput.value : "",
    Marksheet: marksheetUrls,
    Certificate: certificateUrls,
    ExtraDocuments: []
};


// Collect Extra Documents & upload files
const extraDocItems = card.querySelectorAll('.extra-doc-item');
const extraDocPromises = [];

extraDocItems.forEach(docItem => {
    const docName = docItem.querySelector('input[type="text"]')?.value || "";
    const docFileInput = docItem.querySelector('input[type="file"]');
    const docFile = docFileInput?.files[0] || null;

    if (docFile) {
        // Use v9 syntax: storageRef + uploadBytes + getDownloadURL
        const fileRef = storageRef(storage, `education/${cnic.value}/${type}/extra/${Date.now()}_${docFile.name}`);
        const promise = uploadBytes(fileRef, docFile)
            .then(snapshot => getDownloadURL(snapshot.ref))
            .then(url => {
                educationData[type].ExtraDocuments.push({
                    name: docName,
                    url: url   // ✅ saved file download URL
                });
            });

        extraDocPromises.push(promise);
    }
});

// Wait for all extra documents to upload
await Promise.all(extraDocPromises);

        }
        // ================== Store Data in Firebase ==================
        const newCnicRef = ref(db, `resContainer9/${cnic.value}`);
        await set(newCnicRef, {
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
            ImageUrl: imageUrl,
            Skills: skills,
            Education: educationData
        });

        localStorage.removeItem("selectedSkills");
        clearForm();
        alert("Data stored successfully with roll numbers, marksheets, certificates, and extra documents!");
        fetchAndDisplayCards();

    } catch (error) {
        console.error("Error storing education data:", error);
        alert("Error storing data: " + error.message);
    }
});



// ================== Recall data ==================
recallBtn.addEventListener('click', async () => {
    const cnicValue = cnic.value;
    if (!cnicValue) return alert("Please enter a CNIC number.");

    try {
        const snapshot = await get(child(ref(db), `resContainer9/${cnicValue}`));
        if (snapshot.exists()) {
            const data = snapshot.val();
            nameInput.value = data.Name;
            fname.value = data.Fname;
            dob.value = data.Dob;
            phone.value = data.Phone;
            caddres.value = data.Caddres;
            paddres.value = data.Paddres;
            qual.value = data.Qual;
            lisnt.value = data.Lisnt;
            rarmy.value = data.Rarmy;
            citybox.value = data.Citybox;
            countrybox.value = data.Countrybox;
            imagePreview.src = data.ImageUrl;

            // Load education form values
            Schoolname.value = data.Schoolname || '';
            Schooldegree.value = data.Schooldegree || '';
            Schoolrollno.value = data.Schoolrollno || '';
            Schoolmarksheet.value = data.Schoolmarksheet || '';
            Schoolcertificate.value = data.Schoolcertificate || '';

            Collegename.value = data.Collegename || '';
            Collegedegree.value = data.Collegedegree || '';
            Collegerollno.value = data.Collegerollno || '';
            Collegemarksheet.value = data.Collegemarksheet || '';
            Collegecertificate.value = data.Collegecertificate || '';

            Universityname.value = data.Universityname || '';
            Universitydegree.value = data.Universitydegree || '';
            Universityrollno.value = data.Universityrollno || '';
            Universitymarksheet.value = data.Universitymarksheet || '';
            Universitycertificate.value = data.Universitycertificate || '';

            Masteruniversityname.value = data.Masteruniversityname || '';
            Masterdegree.value = data.Masterdegree || '';
            Masterrollno.value = data.Masterrollno || '';
            Mastermarksheet.value = data.Mastermarksheet || '';
            Mastercertificate.value = data.Mastercertificate || '';

            Phduniversityname.value = data.Phduniversityname || '';
            Phddegree.value = data.Phddegree || '';
            Phdrollno.value = data.Phdrollno || '';
            Phdmarksheet.value = data.Phdmarksheet || '';
            Phdcertificate.value = data.Phdcertificate || '';

            if(data.Skills) localStorage.setItem("selectedSkills", JSON.stringify(data.Skills));
        } else {
            alert("No data found for the given CNIC number.");
        }
    } catch (error) {
        console.error("Error retrieving data:", error);
        alert("Error retrieving data: " + error.message);
    }
});

// ================== Fetch & display cards ==================
function fetchAndDisplayCards() {
    const dbRef = ref(db, "resContainer9");
    onValue(dbRef, snapshot => {
        resContainer9.innerHTML = "";
        snapshot.forEach(childSnapshot => createCard(childSnapshot.key, childSnapshot.val()));
    });
}

// ================== Create card ==================
function createCard(id, data) {
    const { Cnic, Name, Fname, Dob, Phone, Caddres, Paddres, Qual, Lisnt, Rarmy, Citybox, Countrybox, ImageUrl, Skills } = data;
    const card = document.createElement('div');
    card.className = 'card-container';
    card.setAttribute('data-id', id);

    card.innerHTML = `
       <div class="card">
        <div class="image-upload-circle">
          <img src="${ImageUrl}" alt="${Cnic}" style="width:100px; height:100px; object-fit: cover; border-radius: 50%;">
        </div>
        <h3 class="card-title">${Cnic}</h3>
        <p>Name: ${Name}</p>
        <p>Father's Name: ${Fname}</p>
        <p>Date of Birth: ${Dob}</p>
        <p>Phone: ${Phone}</p>
        <p>Current Address: ${Caddres}</p>
        <p>Permanent Address: ${Paddres}</p>
        <p>Qualification: ${Qual}</p>
        <p>Skills: ${Skills.map(s => `${s.name} (${s.percent})`).join(", ")}</p>
       </div>`;

    resContainer9.appendChild(card);
}

// ================== Update, Delete, Clear ==================
updateBtn.addEventListener('click', async () => {
    const cnicValue = cnic.value;
    if (!cnicValue) return alert("Please enter a CNIC number.");
    try {
        const updatedData = {
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
            Countrybox: countrybox.value,
            Skills: getSkills(),

            Schoolname: Schoolname.value,
            Schooldegree: Schooldegree.value,
            Schoolrollno: Schoolrollno.value,
            Schoolmarksheet: Schoolmarksheet.value,
            Schoolcertificate: Schoolcertificate.value,

            Collegename: Collegename.value,
            Collegedegree: Collegedegree.value,
            Collegerollno: Collegerollno.value,
            Collegemarksheet: Collegemarksheet.value,
            Collegecertificate: Collegecertificate.value,

            Universityname: Universityname.value,
            Universitydegree: Universitydegree.value,
            Universityrollno: Universityrollno.value,
            Universitymarksheet: Universitymarksheet.value,
            Universitycertificate: Universitycertificate.value,

            Masteruniversityname: Masteruniversityname.value,
            Masterdegree: Masterdegree.value,
            Masterrollno: Masterrollno.value,
            Mastermarksheet: Mastermarksheet.value,
            Mastercertificate: Mastercertificate.value,

            Phduniversityname: Phduniversityname.value,
            Phddegree: Phddegree.value,
            Phdrollno: Phdrollno.value,
            Phdmarksheet: Phdmarksheet.value,
            Phdcertificate: Phdcertificate.value
        };

        const imageFile = imageUpload.files[0];
        if (imageFile) {
            const imageStorageReference = storageRef(storage, `images/${imageFile.name}`);
            const imageSnapshot = await uploadBytes(imageStorageReference, imageFile);
            updatedData.ImageUrl = await getDownloadURL(imageSnapshot.ref);
        }

        await update(ref(db, `resContainer9/${cnicValue}`), updatedData);
        alert("Data updated successfully with skills and education!");
        fetchAndDisplayCards();
        localStorage.removeItem("selectedSkills");
    } catch (error) {
        console.error("Error updating data:", error);
        alert("Error updating data: " + error.message);
    }
});

deleteBtn.addEventListener('click', async () => {
    const cnicValue = cnic.value;
    if (!cnicValue) return alert("Please enter a CNIC number.");
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

// ================== Initial fetch ==================
fetchAndDisplayCards();






// ===== Separate Firebase Submission Function =====
async function submitEducationData() {
    const imageFile = imageUpload.files[0];
  
    if (!imageFile) {
        alert("Please select an image to upload.");
        return;
    }

    try {
        // Upload image
        const imageStorageReference = storageRef(storage, `images/${imageFile.name}`);
        const imageSnapshot = await uploadBytes(imageStorageReference, imageFile);
        const imageUrl = await getDownloadURL(imageSnapshot.ref);

        // Get skills from localStorage
        const skills = getSkills();

        // Collect Degree, Field, Subfield values from all edu-cards
        const eduData = {};
        document.querySelectorAll(".edu-card").forEach(card => {
            const type = card.dataset.form;

            // Grab values from the inputs, do not recreate selects
            const degree = card.querySelector("select.float-input")?.value || "";
            const field = card.querySelector(".field-select")?.value || "";
            const subfield = card.querySelector(".subfield-select")?.value || card.dataset.autoSubfield || "";

            eduData[type] = { Degree: degree, Field: field, Subfield: subfield };
        });

        // Store all data in Firebase
        const newCnicRef = ref(db, `resContainer9/${cnic.value}`);
        await set(newCnicRef, {
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
            ImageUrl: imageUrl,
            Skills: skills,
            Education: eduData  // All education data here
        });

        localStorage.removeItem("selectedSkills");
        clearForm();
        alert("Education data submitted successfully!");
        fetchAndDisplayCards();

    } catch (error) {
        console.error("Error uploading files:", error);
        alert("Error uploading files: " + error.message);
    }
}

// Replace submitBtn listener
submitBtn.addEventListener('click', submitEducationData);
