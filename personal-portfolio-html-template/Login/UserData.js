import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getStorage, ref as storageRef, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// ======================= Firebase Configuration =======================
const firebaseConfig = {
  apiKey: "AIzaSyCmL8qcjg4S6NeY3erraq_XhlDJ7Ek2s_E",
  authDomain: "palestine-web.firebaseapp.com",
  projectId: "palestine-web",
  storageBucket: "palestine-web.appspot.com",
  messagingSenderId: "35190212487",
  appId: "1:35190212487:web:0a699bb1fa7b1a49113522"
};

// ======================= Initialize Firebase =======================
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// ======================= Get email from URL =======================
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get("email");

if (!email) {
  console.warn("No email found in URL. ptprp image cannot be loaded.");
} else {
  const sanitizedEmail = email.replace(/[.@]/g, "_");
  const imgRef = storageRef(storage, `ptprpPics/${sanitizedEmail}.png`);

  getDownloadURL(imgRef)
    .then(url => {
      const ptprpImg = document.getElementById("ptprpImg");
      if (ptprpImg) ptprpImg.src = url;
    })
    .catch(err => {
      console.error("Error loading ptprp image:", err);
    });
}
