// =================== Professionality.js ===================
// This saves Professionality data under rescontainer9/{Cnic}/Professionality

import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

// Firebase references (use the same app initialization from your main file)
const db = getDatabase();
const storage = getStorage();

// ----------------- Upload Helper -----------------
async function uploadFile(file, path) {
  if (!file) return "";
  const fileRef = storageRef(storage, path);
  const snapshot = await uploadBytes(fileRef, file);
  return await getDownloadURL(snapshot.ref);
}

// ----------------- Save Professionality -----------------
export async function saveProfessionality(Cnic) {
  if (!Cnic) {
    alert("CNIC not found — please fill Personal Info first!");
    return;
  }

  const Years = document.getElementById("Years").value.trim();
  const aboutHeadline = document.getElementById("aboutHeadline").value.trim();
  const aboutParagraph = document.getElementById("aboutParagraph").value.trim();
  const aboutPara2 = document.getElementById("aboutPara2").value.trim();
  const aboutPara3 = document.getElementById("aboutPara3").value.trim();
  const happyClients = document.getElementById("happyClients").value.trim();
  const projectsCompleted = document.getElementById("projectsCompleted").value.trim();

  const CnicFront = document.getElementById("CnicFront").files[0];
  const CnicBack = document.getElementById("CnicBack").files[0];
  const profilePhoto = document.getElementById("profilePhoto").files[0];

  // Upload images if present
  const [frontUrl, backUrl, profileUrl] = await Promise.all([
    uploadFile(CnicFront, `rescontainer9/${Cnic}/Professionality/CnicFront.jpg`),
    uploadFile(CnicBack, `rescontainer9/${Cnic}/Professionality/CnicBack.jpg`),
    uploadFile(profilePhoto, `rescontainer9/${Cnic}/Professionality/ProfilePhoto.jpg`),
  ]);

  const data = {
    Years,
    aboutHeadline,
    aboutParagraph,
    aboutPara2,
    aboutPara3,
    happyClients,
    projectsCompleted,
    CnicFront: frontUrl || "",
    CnicBack: backUrl || "",
    ProfilePhoto: profileUrl || "",
    updatedAt: new Date().toISOString()
  };

  // ✅ Update instead of set — merges into existing CNIC data
  await update(ref(db, `rescontainer9/${Cnic}/Professionality`), data);

  alert("✅ Professionality data saved successfully under existing CNIC!");
}
