// ======================= Firebase Modular Imports =======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// ======================= Firebase Configuration =======================
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

// ======================= Initialize Firebase =======================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

// ======================= DOM Element =======================
const loginBtn = document.getElementById("loginBtn");

// ======================= LOGIN FUNCTION =======================
loginBtn.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const email = user.email;
    const profilePic = user.photoURL;

    console.log("✅ Logged in as:", email);

    // -------- Find CNIC by email in resContainer9 --------
    const dbRef = ref(db, "resContainer9");
    const snapshot = await get(dbRef);

    let foundCnic = null;
    snapshot.forEach((childSnap) => {
      const personal = childSnap.child("Personal").val();
      if (personal && personal.Lisnt && personal.Lisnt.toLowerCase() === email.toLowerCase()) {
        foundCnic = childSnap.key;
      }
    });

    if (!foundCnic) {
      alert("⚠️ No user found in database. Please contact admin or try again.");
      return;
    }
    console.log("✅ User found under CNIC:", foundCnic);

    // -------- Upload Google Profile Pic to Firebase Storage --------
    let uploadedImageURL = null;

    if (profilePic) {
      try {
        const response = await fetch(profilePic);
        const blob = await response.blob();

        const sanitizedEmail = email.replace(/[.#$[\]]/g, "_");
        const imgRef = storageRef(storage, `ptprpPics/${sanitizedEmail}.png`);

        await uploadBytes(imgRef, blob);
        uploadedImageURL = await getDownloadURL(imgRef);

        console.log("✅ Profile photo uploaded to Storage:", uploadedImageURL);
      } catch (uploadErr) {
        console.error("❌ Error uploading profile image:", uploadErr);
      }
    }

    // -------- Create Access Timer Node --------
    const now = Date.now();
    const expiresAt = now + 3 * 60 * 1000; // 3 minutes for demo
    const accessRef = ref(db, `resContainer9/${foundCnic}/Access`);
    await set(accessRef, {
      link: "User.html",
      timerStart: now,
      expiresAt,
      paymentStatus: "Pending"
    });

    // -------- Save user info in PortfolioUsers --------
    const safeEmailKey = email.replace(/\./g, "_");
    const userRef = ref(db, `PortfolioUsers/${safeEmailKey}`);
    await set(userRef, {
      email,
      profilePic: uploadedImageURL || profilePic || null,
      cnic: foundCnic
    });

    console.log("✅ Profile photo stored in DB successfully");

    // -------- Save to localStorage --------
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userCNIC", foundCnic);

    // -------- Redirect after all is done --------
    const encodedEmail = encodeURIComponent(email);
    window.location.href = `/personal-portfolio-html-template/Login/User.html?email=${encodedEmail}`;

  } catch (error) {
    console.error("❌ Sign-in error:", error);
    alert("Login failed. Please try again.");
  }
});
