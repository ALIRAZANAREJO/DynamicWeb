// ======================= Firebase Modular Imports =======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, get, set, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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
const provider = new GoogleAuthProvider();

// ======================= DOM Element =======================
const loginBtn = document.getElementById("loginBtn");

// ======================= LOGIN FUNCTION =======================
loginBtn.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const email = user.email;
    const ptprpPic = user.photoURL; // Google ptprp image URL

    console.log("✅ Logged in as:", email);

    // ------------------- CNIC Check -------------------
    const dbRef = ref(db, "resContainer9");
    const snapshot = await get(dbRef);

    let foundCnic = null;
    snapshot.forEach(childSnap => {
      const personal = childSnap.child("Personal").val();
      if (personal && personal.Lisnt && personal.Lisnt.toLowerCase() === email.toLowerCase()) {
        foundCnic = childSnap.key;
      }
    });

    if (!foundCnic) {
      alert("No user found in database. Please contact admin or try again.");
      console.warn("❌ Email not found in DB:", email);
      return;
    }

    console.log("✅ User found under CNIC:", foundCnic);

    // ------------------- Store ptprp Pic in Database (only if not exists) -------------------
    const safeEmailKey = email.replace(/\./g, ','); // make key safe
    const userRef = ref(db, `PortfolioUsers/${safeEmailKey}`);

    const userSnapshot = await get(userRef);
    if (!userSnapshot.exists()) {
      // Only store if user node does not exist
      await set(userRef, {
        email: email,
        ptprpPicURL: ptprpPic || null
      });
      console.log("✅ ptprp pic URL stored in Database under safe key:", safeEmailKey);
    } else {
      console.log("ℹ️ User already exists. ptprp pic not overwritten.");
    }

    // ------------------- Redirect with Encoded Email -------------------
    const encodedEmail = encodeURIComponent(email);
    window.location.href = `/Trash/Login/User.html?email=${encodedEmail}`;

  } catch (error) {
    console.error("❌ Sign-in error:", error);
    alert("Login failed. Please try again.");
  }
});
