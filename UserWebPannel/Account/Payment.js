// =================== Firebase Imports ===================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, update, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
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

// =================== Loader ===================
const loader = document.createElement("div");
loader.id = "loaderOverlay";
loader.style.cssText = `
  position: fixed; inset: 0; background: rgba(0,0,0,0.85);
  display: none; color: #fff; font-family: 'Poppins', sans-serif;
  align-items: center; justify-content: center; flex-direction: column; z-index: 9999;
`;
loader.innerHTML = `
  <div class="spinner" style="width:60px;height:60px;border:5px solid #fff;border-top:5px solid #00eaff;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:15px;"></div>
  <p id="loaderMsg" style="font-size:1rem;text-align:center;">Processing...</p>
`;
document.body.appendChild(loader);

const styleEl = document.createElement("style");
styleEl.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleEl);

function showLoader(msg) { loader.querySelector("#loaderMsg").textContent = msg || ""; loader.style.display = "flex"; }
function hideLoader() { loader.style.display = "none"; }

// =================== Helpers ===================
function makeSafeEmail(email = "") { return String(email).trim().toLowerCase().replace(/\./g, "_"); }
function getReadableTimestamp() { return new Date().toLocaleString("en-US", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit", hour12:true }); }

// =================== Upload & Save ===================
async function uploadSlipAndSave(method, parent, data) {
  try {
    const emailInput = parent.querySelector('input[id="email"]');
    const rawEmail = (emailInput?.value.trim() || "");
    if (!rawEmail) return alert("Enter your email before submitting.");
    const safeEmail = makeSafeEmail(rawEmail);

    const cnic = (parent.querySelector('input[id="Cnic"]')?.value.trim() || data.cnic || "");
    let slipURL = "N/A";

    if (data.fileId) {
      const fileInput = parent.querySelector(`#${data.fileId}`);
      if (!fileInput?.files?.length) return alert("Please upload your payment slip before submitting.");
      const file = fileInput.files[0];
      const storageRef = sRef(storage, `AR_Technologies/Ai/Dynamic_Web/${safeEmail}/Portfolio/Accounts/${method}/${file.name}`);
      await uploadBytes(storageRef, file);
      slipURL = await getDownloadURL(storageRef);
    }

    const pkgName = document.getElementById("pkgName")?.textContent.trim() || "";
    const pkgPrice = document.getElementById("pkgPrice")?.textContent.trim() || "";
    const pkgExpiry = document.getElementById("pkgExpiry")?.textContent.trim() || "";
    const timestamp = getReadableTimestamp();

    const paymentData = { ...data, email: rawEmail, cnic, pkgName, pkgPrice, pkgExpiry, paymentSlipURL: slipURL, status:"Pending", timestamp };
    delete paymentData.fileId;

    // Save Accounts
    const accountRef = ref(db, `AR_Technologies/Ai/Dynamic_Web/${safeEmail}/Portfolio/Accounts/${method}`);
    await update(accountRef, paymentData);

    // Update Access node
    const accessRef = ref(db, `AR_Technologies/Ai/Dynamic_Web/${safeEmail}/Portfolio/Access`);
    await update(accessRef, { paymentStatus:"Pending" });

    showLoader("✅ Payment submitted. Waiting admin verification...");

    // Listen for admin verification
    onValue(accessRef, (snapshot) => {
      const accessData = snapshot.val();
      if (!accessData) return;
      if (accessData.paymentStatus === "Verified") {
        loader.querySelector("#loaderMsg").textContent = "✅ Payment verified! Redirecting...";
        setTimeout(() => window.location.href = `/AllWebDesigns/Portfolio/Portfolio01.html?email=${encodeURIComponent(rawEmail)}`, 1500);
      } else if (accessData.paymentStatus === "Rejected") {
        loader.querySelector("#loaderMsg").textContent = "❌ Payment rejected. Please re-upload your slip.";
        setTimeout(() => hideLoader(), 3000);
      }
    });

  } catch (err) {
    console.error("uploadSlipAndSave error:", err);
    hideLoader();
    alert("An error occurred while submitting payment.");
  }
}

// =================== Payment Buttons ===================
document.querySelectorAll(".submit-btn").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    const parent = e.target.closest(".method");
    if (!parent) return alert("Payment method container not found.");
    const method = parent.id;
    let data = { cnic: parent.querySelector('input[id="Cnic"]')?.value || "" };

    if (method === "jazzcash") data = { ...data, payern01: parent.querySelector('#payern01')?.value || "", telephone01: parent.querySelector('#telephone01')?.value || "", transactionid01: parent.querySelector('#transactionid01')?.value || "N/A", fileId:"paymentslip01" };
    else if (method === "easypaisa") data = { ...data, payern02: parent.querySelector('#payern02')?.value || "", telephone02: parent.querySelector('#telephone02')?.value || "", transactionid02: parent.querySelector('#transactionid02')?.value || "N/A", fileId:"paymentslip02" };
    else if (method === "bank") data = { ...data, payern04: parent.querySelector('#payern04')?.value || "", telephone04: parent.querySelector('#telephone04')?.value || "", transactionid04: parent.querySelector('#transactionid04')?.value || "N/A", fileId:"paymentslip04" };
    else if (method === "paypal") { const tx = parent.querySelector('#transactionid03')?.value || ""; const payerEmail = parent.querySelector('#payeremail03')?.value || ""; if(!tx) return alert("Enter PayPal transaction ID."); data = { email: payerEmail||parent.querySelector('#email')?.value, transactionid03: tx, payeremail03: payerEmail, cnic: data.cnic, fileId:null }; }
    else if (method === "card") { const cardnum = parent.querySelector('#cardnum05')?.value || ""; const cardname = parent.querySelector('#cardname05')?.value || ""; const expiry = parent.querySelector('#expiry05')?.value || ""; const cvv = parent.querySelector('#cvv05')?.value || ""; if(!cardnum||!cardname) return alert("Enter card details."); data = { email: parent.querySelector('#email')?.value, cardnum05:cardnum, cardname05:cardname, expiry05:expiry, cvv05:cvv, cnic: data.cnic, fileId:null }; }

    await uploadSlipAndSave(method, parent, data);
  });
});
// =================== Already Paid Verify (from HTML) ===================
const verifyInput = document.getElementById("verifyEmail");
const verifyBtn = document.getElementById("verifyBtn");

verifyBtn.addEventListener("click", async () => {
  const rawEmail = verifyInput.value.trim();
  if (!rawEmail) return alert("Enter your email first.");
  const safeEmail = makeSafeEmail(rawEmail);

  showLoader("⏳ Verifying from Admin, please wait...");
  const accessRef = ref(db, `AR_Technologies/Ai/Dynamic_Web/${safeEmail}/Portfolio/Access`);

  const unsubscribe = onValue(accessRef, (snapshot) => {
    const accessData = snapshot.val();
    if (!accessData) return;

    if (accessData.paymentStatus === "Verified") {
      loader.querySelector("#loaderMsg").textContent = "✅ Payment verified! Redirecting...";
      setTimeout(() => window.location.href = `/AllWebDesigns/Portfolio/Portfolio01.html?email=${encodeURIComponent(rawEmail)}`, 1500);
      unsubscribe();
    } else if (accessData.paymentStatus === "Rejected") {
      loader.querySelector("#loaderMsg").textContent = "❌ Payment rejected. Please contact support.";
      setTimeout(() => hideLoader(), 3000);
      unsubscribe();
    } else {
      loader.querySelector("#loaderMsg").textContent = "⏳ Payment is still under verification. Please wait...";
    }
  });
});
