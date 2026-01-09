// =================== Firebase Setup ===================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";

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
const db = getDatabase(app);
const storage = getStorage(app);

// ----------------- Upload Helper -----------------
async function uploadImage(file, path) {
  if (!file) return null;
  const imageRef = sRef(storage, path);
  await uploadBytes(imageRef, file);
  return await getDownloadURL(imageRef);
}

// ----------------- Save Function -----------------
document.getElementById("submitBtn").addEventListener("click", async () => {
  const cnic = document.getElementById("cnic").value.trim();
  if (!cnic) return alert("Please enter CNIC!");

  const data = {
    cnic,
    Years: document.getElementById("Years").value,
    aboutHeadline: document.getElementById("aboutHeadline").value,
    aboutParagraph: document.getElementById("aboutParagraph").value,
    aboutPara2: document.getElementById("aboutPara2").value,
    aboutPara3: document.getElementById("aboutPara3").value,
    happyClients: document.getElementById("happyClients").value,
    projectsCompleted: document.getElementById("projectsCompleted").value,
  };

  const frontFile = document.getElementById("cnicFront").files[0];
  const backFile = document.getElementById("cnicBack").files[0];
  const profileFile = document.getElementById("profilePhoto").files[0];

  const [frontUrl, backUrl, profileUrl] = await Promise.all([
    uploadImage(frontFile, `rescontainer9/${cnic}/cnicFront.jpg`),
    uploadImage(backFile, `rescontainer9/${cnic}/cnicBack.jpg`),
    uploadImage(profileFile, `rescontainer9/${cnic}/profilePhoto.jpg`),
  ]);

  data.cnicFront = frontUrl || "";
  data.cnicBack = backUrl || "";
  data.profilePhoto = profileUrl || "";

  await set(ref(db, `rescontainer9/${cnic}`), data);
  alert("Profession details saved successfully!");
});
