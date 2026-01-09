// ======================= Firebase Modular Imports =======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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
    const profilePic = user.photoURL;

    console.log("✅ Logged in as:", email);

    // -------- Find CNIC by email from resContainer9 --------
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

    // -------- Create Access Timer Node (24-hour validity) --------
    const now = Date.now();
    // const expiresAt = now + 60 * 60 * 60 * 1000;

    const expiresAt = now + 3 * 60 * 1000;
    const accessRef = ref(db, `resContainer9/${foundCnic}/Access`);
    await set(accessRef, {
      link: "User.html",
      timerStart: now,
      expiresAt,
      paymentStatus: "Pending"
    });

    // -------- Save profile picture under PortfolioUsers --------
    const safeEmailKey = email.replace(/\./g, ",");
    const userRef = ref(db, `PortfolioUsers/${safeEmailKey}`);
    await set(userRef, {
      email,
      profilePic: profilePic || null,
      cnic: foundCnic
    });

    // -------- Save to localStorage for next pages --------
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userCNIC", foundCnic);

    // -------- Redirect to User.html --------
    const encodedEmail = encodeURIComponent(email);
    window.location.href = `/personal-portfolio-html-template/6.html?email=${encodedEmail}`;

  } catch (error) {
    console.error("❌ Sign-in error:", error);
    alert("Login failed. Please try again.");
  }
});
