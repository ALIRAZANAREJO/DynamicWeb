// =================== Firebase Imports ===================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, update, onValue, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// =================== Firebase Config ===================
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

// =================== Show Logged-in Email ===================
const userEmail = localStorage.getItem("userEmail") || localStorage.getItem("loggedEmail");
if (userEmail) {
  const emailBanner = document.createElement("div");
  emailBanner.innerHTML = `🔐 Logged in as: <b>${userEmail}</b>`;
  emailBanner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: #007bff;
    color: white;
    font-family: 'Poppins', sans-serif;
    text-align: center;
    padding: 6px 0;
    font-size: 0.95rem;
    z-index: 9999;
  `;
  document.body.appendChild(emailBanner);
} else {
  alert("⚠️ No logged-in email found. Please log in again.");
  window.location.href = "/personal-portfolio-html-template/Login/index.html";
}

// =================== Loader UI ===================
const loader = document.createElement("div");
loader.id = "loaderOverlay";
loader.innerHTML = `
  <div class="loader-content">
    <div class="spinner"></div>
    <p id="loaderMsg">✅ Your submission is successful.<br>⏳ Please wait a few minutes for admin verification...</p>
  </div>
`;
document.body.appendChild(loader);

const loaderStyle = document.createElement("style");
loaderStyle.textContent = `
  #loaderOverlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    color: #fff;
    font-family: 'Poppins', sans-serif;
    display: none;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    z-index: 9998;
  }
  .loader-content { text-align: center; }
  .spinner {
    width: 60px;
    height: 60px;
    border: 5px solid #fff;
    border-top: 5px solid #00eaff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 15px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  #loaderMsg { font-size: 1rem; line-height: 1.6; }
`;
document.head.appendChild(loaderStyle);

// =================== Upload & Save ===================
async function uploadSlipAndSave(method, data) {
  const cnic = data.cnic.trim();
  if (!cnic) return alert("Enter CNIC number before submitting.");

  const fileInput = document.querySelector(`#${data.fileId}`);
  let slipURL = "";

  if (fileInput && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const storageRef = sRef(storage, `resContainer9/${cnic}/${method}/${file.name}`);
    await uploadBytes(storageRef, file);
    slipURL = await getDownloadURL(storageRef);
  }

  const pkgName = document.getElementById("pkgName").textContent.trim();
  const pkgPrice = document.getElementById("pkgPrice").textContent.trim();
  const pkgExpiry = document.getElementById("pkgExpiry").textContent.trim();

  const paymentData = {
    ...data,
    pkgName,
    pkgPrice,
    pkgExpiry,
    status: "Pending",
    paymentSlipURL: slipURL || "N/A",
    timestamp: new Date().toISOString(),
  };

  delete paymentData.fileId;

  const userRef = ref(db, `resContainer9/${cnic}/Accounts/${method}`);
  await update(userRef, paymentData);

  // Update Access Node (only for local pending marker, admin controls final status)
  const accessRef = ref(db, `resContainer9/${cnic}/Access`);
  await update(accessRef, { paymentStatus: "Pending" });

  // Show loader
  document.getElementById("loaderOverlay").style.display = "flex";

  // =================== Expiry Check Logic ===================
  try {
    const expiryRef = ref(db, `resContainer9/${cnic}/Access/expiresAt`);
    const snapshot = await get(expiryRef);

    if (snapshot.exists()) {
      const expiresAt = snapshot.val();
      const now = Date.now();

      // If still time left, skip verification and redirect directly
      if (now < expiresAt) {
        document.getElementById("loaderMsg").textContent = "⏳ Payment submitted successfully. Redirecting...";
        setTimeout(() => {
          const encodedEmail = encodeURIComponent(userEmail || "");
          window.location.href = `/personal-portfolio-html-template/Login/User.html?email=${encodedEmail}`;
        }, 2000);
        return; // stop here (no need for onValue listener)
      }
    }
  } catch (err) {
    console.error("Error checking expiry:", err);
  }

  // =================== If time expired, wait for admin verification ===================
  onValue(accessRef, (snapshot) => {
    const accessData = snapshot.val();
    if (accessData && accessData.paymentStatus === "Verified") {
      document.getElementById("loaderMsg").textContent = "✅ Payment verified! Redirecting...";
      setTimeout(() => {
        const encodedEmail = encodeURIComponent(userEmail || "");
        window.location.href = `/personal-portfolio-html-template/Login/User.html?email=${encodedEmail}`;
      }, 2000);
    } else if (accessData && accessData.paymentStatus === "Rejected") {
      document.getElementById("loaderMsg").textContent = "❌ Payment rejected. Please re-upload your slip.";
      setTimeout(() => {
        document.getElementById("loaderOverlay").style.display = "none";
      }, 4000);
    }
  });
}

// =================== Button Events ===================
document.querySelectorAll(".submit-btn").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    const parent = e.target.closest(".method");
    const method = parent.id;
    let data = {};

    if (method === "jazzcash") {
      data = {
        payern01: document.getElementById("payern01").value,
        telephone01: document.getElementById("telephone01").value,
        transactionid01: document.getElementById("transactionid01").value || "N/A",
        cnic: document.getElementById("Cnic").value,
        fileId: "paymentslip01",
      };
    } else if (method === "easypaisa") {
      data = {
        payern02: document.getElementById("payern02").value,
        telephone02: document.getElementById("telephone02").value,
        transactionid02: document.getElementById("transactionid02").value || "N/A",
        cnic: document.getElementById("Cnic").value,
        fileId: "paymentslip02",
      };
    } else if (method === "bank") {
      data = {
        payern04: document.getElementById("payern04").value,
        telephone04: document.getElementById("telephone04").value,
        transactionid04: document.getElementById("transactionid04").value || "N/A",
        cnic: document.getElementById("Cnic").value,
        fileId: "paymentslip04",
      };
    }

    await uploadSlipAndSave(method, data);
  });
});
