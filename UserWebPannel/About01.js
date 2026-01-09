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

// Image preview
imagePreview.addEventListener('click', () => imageUpload.click());
imageUpload.addEventListener('change', () => {
    const file = imageUpload.files[0];
    if (file) updateImagePreview(file);
});
function updateImagePreview(file) {
    imagePreview.src = URL.createObjectURL(file);
}

// Submit data
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
            ImageUrl: imageUrl
        });

        clearForm();
        alert("Data Stored Successfully");
        fetchAndDisplayCards();
    } catch (error) {
        console.error("Error uploading files:", error);
        alert("Error uploading files: " + error.message);
    }
});

// Recall data
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
        } else {
            alert("No data found for the given CNIC number.");
        }
    } catch (error) {
        console.error("Error retrieving data:", error);
        alert("Error retrieving data: " + error.message);
    }
});

// Fetch & display cards
function fetchAndDisplayCards() {
    const dbRef = ref(db, "resContainer9");
    onValue(dbRef, snapshot => {
        resContainer9.innerHTML = "";
        snapshot.forEach(childSnapshot => createCard(childSnapshot.key, childSnapshot.val()));
    });
}

// Create card
function createCard(id, { Cnic, Name, Dob, Fname, Phone, Caddres, Paddres, Qual, ImageUrl, Lisnt, Rarmy, Citybox, Countrybox }) {
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
        <button class="select-btn" data-cnic="${Cnic}">Select</button>
        <p>List: ${Lisnt}</p>
        <p>Rarmy: ${Rarmy}</p>
        <p>City: ${Citybox}</p>
        <p>Country: ${Countrybox}</p>
       </div>`;

    resContainer9.appendChild(card);
    card.querySelector('.select-btn').addEventListener('click', () => recallData(Cnic));
}

// Update data
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
            Countrybox: countrybox.value
        };

        const imageFile = imageUpload.files[0];
        if (imageFile) {
            const imageStorageReference = storageRef(storage, `images/${imageFile.name}`);
            const imageSnapshot = await uploadBytes(imageStorageReference, imageFile);
            updatedData.ImageUrl = await getDownloadURL(imageSnapshot.ref);
        }

        await update(ref(db, `resContainer9/${cnicValue}`), updatedData);
        alert("Data updated successfully.");
        fetchAndDisplayCards();
    } catch (error) {
        console.error("Error updating data:", error);
        alert("Error updating data: " + error.message);
    }
});

function updateSelectedSkillsPreview() {
    const previewContainer = document.getElementById('selectedSkillsPreview');
    previewContainer.innerHTML = ""; // Clear previous
    
    if (state.selected.size === 0) {
        previewContainer.innerHTML = "<p style='color: gray;'>No skills selected</p>";
        return;
    }

    state.selected.forEach(skill => {
        const tag = document.createElement("span");
        tag.className = "skill-tag";
        tag.textContent = skill.name;
        previewContainer.appendChild(tag);
    });
}

// Delete data
deleteBtn.addEventListener('click', async () => {
    const cnicValue = cnic.value;
    if (!cnicValue) return alert("Please enter a CNIC number.");

    try {
        await remove(ref(db, `resContainer9/${cnicValue}`));
        alert("Data deleted successfully.");
        clearForm();
        fetchAndDisplayCards();
    } catch (error) {
        console.error("Error deleting data:", error);
        alert("Error deleting data: " + error.message);
    }
});

// Clear form
function clearForm() {
    cnic.value = '';
    nameInput.value = '';
    fname.value = '';
    dob.value = '';
    phone.value = '';
    caddres.value = '';
    paddres.value = '';
    qual.value = '';
    citybox.value = '';
    countrybox.value = '';
    imageUpload.value = '';
    imagePreview.src = '';
}

// Initial fetch
fetchAndDisplayCards();

// Close dropdown when clicking outside
document.addEventListener("click", function(e) {
  if (!wrapper.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.style.display = "none";
    highlightedIndex = -1;
  }
});

