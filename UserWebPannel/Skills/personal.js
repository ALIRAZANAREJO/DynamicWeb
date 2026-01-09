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

// ================== Skills Integration ==================
// Get skills from localStorage automatically
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

// ================== Submit data ==================
submitBtn.addEventListener('click', async () => {
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

        // Store data in database
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
            Skills: skills // <-- Add skills here
        });

        // Clear localStorage for skills after submit
        localStorage.removeItem("selectedSkills");

        clearForm();
        alert("Data Stored Successfully with Skills!");
        fetchAndDisplayCards();
    } catch (error) {
        console.error("Error uploading files:", error);
        alert("Error uploading files: " + error.message);
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

            // Auto load skills into localStorage so user can see/edit
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
            Skills: getSkills()
        };

        const imageFile = imageUpload.files[0];
        if (imageFile) {
            const imageStorageReference = storageRef(storage, `images/${imageFile.name}`);
            const imageSnapshot = await uploadBytes(imageStorageReference, imageFile);
            updatedData.ImageUrl = await getDownloadURL(imageSnapshot.ref);
        }

        await update(ref(db, `resContainer9/${cnicValue}`), updatedData);
        alert("Data updated successfully with skills!");
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
}

// ================== Initial fetch ==================
fetchAndDisplayCards();

