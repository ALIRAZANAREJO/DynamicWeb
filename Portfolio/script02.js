// inject-portfolio.js
// Module used to inject your portfolio body HTML into #app and populate from Firebase.
//
// Usage: include in your index.html as:
// <script type="module" src="inject-portfolio.js"></script>

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

/* ---------------- FIREBASE CONFIG - UPDATE THIS ---------------- */
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
/* -------------------------------------------------------------- */

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// small helpers
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const safe = (v, f = "") => (v === undefined || v === null) ? f : v;
const html = (s) => {
  const tpl = document.createElement("template");
  tpl.innerHTML = s.trim();
  return tpl.content;
};

// Body template (derived from the HTML you provided).
// I replaced static text with placeholders and added ids for dynamic insertion.
const BODY_TEMPLATE = `
<!-- Spinner Start -->
<div id="spinner" class="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
  <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
<!-- Spinner End -->

<!-- Navbar Start -->
<nav class="navbar navbar-expand-lg bg-white navbar-light fixed-top shadow py-lg-0 px-4 px-lg-5 wow fadeIn" data-wow-delay="0.1s">
  <a href="index.html" class="navbar-brand d-block d-lg-none">
    <h1 class="text-primary fw-bold m-0">ProMan</h1>
  </a>
  <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse justify-content-between py-4 py-lg-0" id="navbarCollapse">
    <div class="navbar-nav ms-auto py-0">
      <a href="#home" class="nav-item nav-link active">Home</a>
      <a href="#about" class="nav-item nav-link">About</a>
      <a href="#skill" class="nav-item nav-link">Skills</a>
      <a href="#service" class="nav-item nav-link">Services</a>
    </div>
    <a href="index.html" class="navbar-brand bg-secondary py-3 px-4 mx-3 d-none d-lg-block">
      <h1 class="text-primary fw-bold m-0">ProMan</h1>
    </a>
    <div class="navbar-nav me-auto py-0">
      <a href="#project" class="nav-item nav-link">Projects</a>
      <a href="#team" class="nav-item nav-link">Team</a>
      <a href="#testimonial" class="nav-item nav-link">Testimonial</a>
      <a href="#contact" class="nav-item nav-link">Contact</a>
    </div>
  </div>
</nav>
<!-- Navbar End -->

<!-- Header Start -->
<div class="container-fluid bg-light my-6 mt-0" id="home">
  <div class="container">
    <div class="row g-5 align-items-center">
      <div class="col-lg-6 py-6 pb-0 pt-lg-0">
        <h3 class="text-primary mb-3">I'm</h3>
        <h1 class="display-3 mb-3" id="heroName">Full Name</h1>
        <h2 class="typed-text-output d-inline" id="typedOutput"></h2>
        <div class="typed-text d-none" id="profession"></div>
        <div class="d-flex align-items-center pt-5">
          <a id="downloadCV" href="#" class="btn btn-primary py-3 px-4 me-5">Download CV</a>
          <button type="button" class="btn-play" data-bs-toggle="modal"
              data-src="" data-bs-target="#videoModal" id="playVideoBtn">
              <span></span>
          </button>
          <h5 class="ms-4 mb-0 d-none d-sm-block">Play Video</h5>
        </div>
      </div>
      <div class="col-lg-6">
        <img class="img-fluid" id="heroProfileImg" src="img/profile.png" alt="Profile">
      </div>
    </div>
  </div>
</div>
<!-- Header End -->

<!-- Video Modal Start -->
<div class="modal modal-video fade" id="videoModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content rounded-0">
      <div class="modal-header">
        <h3 class="modal-title" id="exampleModalLabel">Youtube Video</h3>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="ratio ratio-16x9">
          <iframe class="embed-responsive-item" src="" id="video" allowfullscreen allowscriptaccess="always" allow="autoplay"></iframe>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- Video Modal End -->

<!-- About Start -->
<div class="container-xxl py-6" id="about">
  <div class="container">
    <div class="row g-5">
      <div class="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
        <div class="d-flex align-items-center mb-5">
          <div class="years flex-shrink-0 text-center me-4">
            <h1 class="display-1 mb-0" id="Years">0</h1>
            <h5 class="mb-0">Years</h5>
         
          </div>
          <h3>of working experience as
          <spam05 class="lh-base mb-0" id="professionInput"></spam05></h3>
        </div>
        <p class="mb-4" id="aboutParagraph">About text here.</p>
        <div id="aboutBullets"></div>
        <i class="far fa-check-circle text-primary me-3"></i>Afordable Price
        <br>
        <br>
        <i class="far fa-check-circle text-primary me-3"></i>High Quality Product
        <br>
        <br>
        <i class="far fa-check-circle text-primary me-3"></i>On Time Project Delivery
        <br>
        <br>

        <a class="btn btn-primary py-3 px-5 mt-3" id="aboutReadMore" href="#">Read More</a>
      </div>
      <div class="col-lg-6 wow fadeInUp" data-wow-delay="0.5s">
                    <div class="row g-3 mb-4">
                        <div class="col-sm-6">
                            <img class="img-fluid rounded" id="cnicFront" src="img/about-1.jpg" alt="">
                        </div>
                        <div class="col-sm-6">
                            <img class="img-fluid rounded"   id="cnicBack"src="img/about-2.jpg" alt="">
                        </div>
                    </div>



        <div class="d-flex align-items-center mb-3">
          <h5 class="border-end pe-3 me-3 mb-0">Happy Clients</h5>
          <h2 class="text-primary fw-bold mb-0" data-toggle="counter-up" id="happyClients">0</h2>
        </div>
        <p class="mb-4" id="aboutPara2">Sub text about clients and projects.</p>
        <div class="d-flex align-items-center mb-3">
          <h5 class="border-end pe-3 me-3 mb-0">Projects Completed</h5>
          <h2 class="text-primary fw-bold mb-0" data-toggle="counter-up" id="projectsCompleted">0</h2>
        </div>
        <p class="mb-0" id="aboutPara3">More about projects.</p>
      </div>
    </div>
  </div>
</div>
<!-- About End -->

<!-- Expertise / Skills Start -->
<div class="container-xxl py-6 pb-5" id="skill">
  <div class="container">
    <div class="row g-5">
      <div class="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
        <h1 class="display-5 mb-5">Skills & Experience</h1>
        <p class="mb-4" id="skillsIntro">Skills intro text.</p>
        <h3 class="mb-4">My Skills</h3>
        <div class="row align-items-center" id="skillsColumns">
          <!-- dynamic skill columns inserted here -->
        </div>
      </div>

      <div class="col-lg-6 wow fadeInUp" data-wow-delay="0.5s">
        <ul class="nav nav-pills rounded border border-2 border-primary mb-5">
          <li class="nav-item w-50">
            <button class="nav-link w-100 py-3 fs-5 active" data-bs-toggle="pill" data-bs-target="#tab-1">Experience</button>
          </li>
          <li class="nav-item w-50">
            <button class="nav-link w-100 py-3 fs-5" data-bs-toggle="pill" data-bs-target="#tab-2">Education</button>
          </li>
        </ul>
        <div class="tab-content">
          <div id="tab-1" class="tab-pane fade show p-0 active">
            <div class="row gy-5 gx-4" id="experienceTab">
              <!-- dynamic experience items -->
            </div>
          </div>
          <div id="tab-2" class="tab-pane fade show p-0">
            <div class="row gy-5 gx-4" id="educationTab">
              <!-- dynamic education items -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- Expertise End -->


<!-- Service Start -->
<div class="container-fluid bg-light my-5 py-6" id="servicelist">
  <div class="container">
    <div class="row g-5 mb-5 wow fadeInUp" data-wow-delay="0.1s">
      <div class="col-lg-6">
        <h1 class="display-5 mb-0">My Services</h1>
      </div>
      <div class="col-lg-6 text-lg-end">
        <a class="btn btn-primary py-3 px-5" href="#" id="hireBtn">Hire Me</a>
      </div>
    </div>
    <div class="row g-4" id="serviceListContainer">
      <!-- dynamic services -->
    </div>
  </div>
</div>
<!-- Service End -->


<!-- Projects Start -->
<div class="container-xxl py-6 pt-5" id="project">
  <div class="container">
    <div class="row g-5 mb-5 align-items-center wow fadeInUp" data-wow-delay="0.1s">
      <div class="col-lg-6">
        <h1 class="display-5 mb-0">My Projects</h1>
      </div>
      <div class="col-lg-6 text-lg-end">
        <ul class="list-inline mx-n3 mb-0" id="portfolio-flters">
          <li class="mx-3 active" data-filter="*">All Projects</li>
          <li class="mx-3 active" data-filter=".first">Web Developing</li>
        </ul>
      </div>
    </div>
    <div class="row g-4 portfolio-container wow fadeInUp" data-wow-delay="0.1s" id="projectsGrid">
      <!-- dynamic projects -->
    </div>
  </div>
</div>
<!-- Projects End -->

<!-- Team Start -->
<div class="container-xxl py-6 pb-5" id="team">
  <div class="container">
    <div class="row g-5 mb-5 wow fadeInUp" data-wow-delay="0.1s">
      <div class="col-lg-6">
        <h1 class="display-5 mb-0">Team Members</h1>
      </div>
      <div class="col-lg-6 text-lg-end">
        <a class="btn btn-primary py-3 px-5" href="#" id="contactTeamBtn">Contact Us</a>
      </div>
    </div>
    <div class="row g-4" id="teamGrid">
      <!-- dynamic team -->
    </div>
  </div>
</div>
<!-- Team End -->

<!-- Testimonial Start -->
<div class="container-fluid bg-light py-5 my-5" id="testimonial">
  <div class="container-fluid py-5">
    <h1 class="display-5 text-center mb-5 wow fadeInUp" data-wow-delay="0.1s">Testimonial</h1>
    <div class="row justify-content-center">
      <div class="col-lg-6 wow fadeInUp" data-wow-delay="0.5s">
        <div class="owl-carousel testimonial-carousel" id="testimonialCarousel">
          <!-- dynamic testimonials -->
        </div>
      </div>
    </div>
  </div>
</div>
<!-- Testimonial End -->

<!-- Contact Start -->
<div class="container-xxl pb-5" id="contact">
  <div class="container py-5">
    <div class="row g-5 mb-5 wow fadeInUp" data-wow-delay="0.1s">
      <div class="col-lg-6">
        <h1 class="display-5 mb-0">Let's Work Together</h1>
      </div>
      <div class="col-lg-6 text-lg-end">
        <a class="btn btn-primary py-3 px-5" href="#" id="sayHelloBtn">Say Hello</a>
      </div>
    </div>
    <div class="row g-5">
      <div class="col-lg-5 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
        <p class="mb-2">My office:</p>
        <h3 class="fw-bold" id="contactOffice">123 Street, New York, USA</h3>
        <hr class="w-100">
        <p class="mb-2">Call me:</p>
        <h3 class="fw-bold" id="contactPhone">+012 345 6789</h3>
        <hr class="w-100">
        <p class="mb-2">Mail me:</p>
        <h3 class="fw-bold" id="contactEmail">info@example.com</h3>
        <hr class="w-100">
        <p class="mb-2">Follow me:</p>
        <div class="d-flex pt-2" id="socialLinks"></div>
      </div>
      <div class="col-lg-7 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
        <p class="mb-4">The contact form is currently inactive.</p>
        <form id="contactForm">
          <div class="row g-3">
            <div class="col-md-6">
              <div class="form-floating">
                <input type="text" class="form-control" id="contact_name" placeholder="Your Name">
                <label for="contact_name">Your Name</label>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-floating">
                <input type="email" class="form-control" id="contact_email" placeholder="Your Email">
                <label for="contact_email">Your Email</label>
              </div>
            </div>
            <div class="col-12">
              <div class="form-floating">
                <input type="text" class="form-control" id="contact_subject" placeholder="Subject">
                <label for="contact_subject">Subject</label>
              </div>
            </div>
            <div class="col-12">
              <div class="form-floating">
                <textarea class="form-control" placeholder="Leave a message here" id="contact_message" style="height: 100px"></textarea>
                <label for="contact_message">Message</label>
              </div>
            </div>
            <div class="col-12">
              <button class="btn btn-primary py-3 px-5" id="contactSendBtn" type="submit">Send Message</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
<!-- Contact End -->

<!-- Map Start -->
<div class="container-xxl pt-5 px-0 wow fadeInUp" data-wow-delay="0.1s">
  <div class="container-xxl pt-5 px-0">
    <div class="bg-dark" id="mapWrap">
      <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001156.4288297426!2d-78.01371936852176!3d42.72876761954724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4ccc4bf0f123a5a9%3A0xddcfc6c1de189567!2sNew%20York%2C%20USA!5e0!3m2!1sen!2sbd!4v1603794290143!5m2!1sen!2sbd"
      frameborder="0" style="width: 100%; height: 450px; border:0;" allowfullscreen="" aria-hidden="false"
      tabindex="0"></iframe>
    </div>
  </div>
</div>
<!-- Map End -->

<!-- Copyright Start -->
<div class="container-fluid bg-dark text-white py-4">
  <div class="container">
    <div class="row">
      <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
        &copy; <a class="border-bottom text-secondary" href="#" id="siteName">Your Site Name</a>, All Right Reserved.
      </div>
      <div class="col-md-6 text-center text-md-end">
        Designed By <a class="border-bottom text-secondary" href="https://htmlcodex.com" id="siteDesigner">HTML Codex</a>
      </div>
    </div>
  </div>
</div>

<!-- Back to Top -->
<a href="#" class="btn btn-lg btn-primary btn-lg-square back-to-top"><i class="bi bi-arrow-up"></i></a>
`;

/* -------------------- MAIN -------------------- */
document.addEventListener("DOMContentLoaded", async () => {
  // ensure #app exists
  let app = document.getElementById("app");
  if (!app) {
    app = document.createElement("div");
    app.id = "app";
    // place after body start
    document.body.insertBefore(app, document.body.firstChild);
  }

  // inject the body template inside #app
  app.appendChild(html(BODY_TEMPLATE));

  // hide spinner once initial DOM inserted (we'll keep visible while loading data)
  const spinner = $("#spinner");

  // CNIC handling
  let Cnic = localStorage.getItem("Cnic");
  if (!Cnic) {
    Cnic = prompt("Enter CNIC to load portfolio (or cancel to use demo):");
    if (Cnic) localStorage.setItem("Cnic", Cnic);
  }

  // If no CNIC, optionally use demo data to preview UI
  if (!Cnic) {
    console.info("No CNIC provided — loading demo UI using demo data.");
    const demo = demoData();
    populateAll(demo);
    spinner?.classList.remove("show");
    return;
  }

  // fetch data from firebase
  try {
    const dbRef = ref(db);
    const snap = await get(child(dbRef, `resContainer9/${Cnic}`));
    if (!snap.exists()) {
      console.warn("No data found for CNIC:", Cnic);
      // show demo but inform user
      const demo = demoData();
      populateAll(demo, `No data found for CNIC: ${Cnic} — showing demo.`);
      spinner?.classList.remove("show");
      return;
    }
    const data = snap.val();
    console.log("Fetched data:", data);

    // support both capitalizations
    const personal = data.Personal || data.personal || {};
    const skills = data.Skills || data.skills || {};
    const education = data.Education || data.education || {};
    const experienceRaw = data.Experience || data.experience || {};
    const serviceRaw = data.Service || data.service || {};
    const professionality = data.Professionality || data.professionality || {};
    const experience = Array.isArray(experienceRaw) ? experienceRaw : Object.values(experienceRaw || {});
    const service = Array.isArray(serviceRaw) ? serviceRaw : Object.values(serviceRaw || {});
    const payload = { personal, skills, education, experience,professionality,service, raw: data };
        displayProfessionality(professionality);
        
displayService(service);

    populateAll(payload);

    
  } catch (err) {
    console.error("Error fetching Firebase data:", err);
    const demo = demoData();
    populateAll(demo, "Error loading data — showing demo.");
  } finally {
    spinner?.classList.remove("show");
  }
});









/* -------------------- Service Display -------------------- */
function getServiceIcon(title = "") {
  const t = (title || "").toLowerCase();
  if (t.includes("security")) return "fa fa-shield-alt fa-2x text-dark";
  if (t.includes("web") || t.includes("developer") || t.includes("development")) return "fa fa-code fa-2x text-dark";
  if (t.includes("design")) return "fa fa-paint-brush fa-2x text-dark";
  if (t.includes("marketing") || t.includes("seo")) return "fa fa-bullhorn fa-2x text-dark";
  return "fa fa-cog fa-2x text-dark";
}

function displayService(serviceList = []) {
  const serviceContainer = document.getElementById("serviceListContainer");
  if (!serviceContainer) return console.warn("⚠️ serviceListContainer not found in DOM.");

  serviceContainer.innerHTML = ""; // Clear any previous content

  if (!serviceList || !serviceList.length) {
    serviceContainer.innerHTML = `
      <div class="col-12 text-center">
        <p class="text-muted mb-0">No services added yet.</p>
      </div>
    `;
    return;
  }

  serviceList.forEach((srv, i) => {
    const title = safe(srv.organizationtitle || srv.title || "Untitled Service");
    const price = safe(srv.organizationprice || srv.price || "N/A");
    const durationDigits = safe(srv.durationdigits || "0");
    const durationEst = safe(srv.durationest || "Years");
    const pera = safe(
      srv.pera || srv.description ||
      `Worked for ${durationDigits} ${durationEst.toLowerCase()} as ${price}.`
    );

    const icon = getServiceIcon(title);

    const card = document.createElement("div");
    card.className = "col-lg-6 wow fadeInUp";
    card.setAttribute("data-wow-delay", `${(i * 0.1).toFixed(1)}s`);

    card.innerHTML = `
      <div class="service-item d-flex flex-column flex-sm-row bg-white rounded h-100 p-4 p-lg-5">
        <div class="bg-icon flex-shrink-0 mb-3">
          <i class="${icon}"></i>
        </div>
        <div class="ms-sm-4">
          <h4 class="mb-3">${title}</h4>
          <h6 class="mb-3">Start From: <span class="text-primary">$${price}</span></h6>
          <h6 class="mb-3">
            Service Experience: <span class="text-success">${durationDigits}  Years</span>
          </h6>
          <p>${durationEst}</p>
        </div>
      </div>
    `;

    serviceContainer.appendChild(card);
card.addEventListener("click", () => {
  localStorage.setItem("selectedService", JSON.stringify(srv));
  window.location.href = "/Portfolio/9.html";
});
  }
  )};












/* -------------------- Professionality Display -------------------- */
function displayProfessionality(professionality) {
  if (!professionality) return;

  // Update main professionality fields
  $("#Years").textContent = safe(professionality.years || professionality.Years || "0");
  $("#professionInput").textContent = safe(professionality.profession || professionality.profession || "");
//   $("#professionInput").textContent = safe(professionality.professionInput || "of working experience as a web designer & developer");
  $("#aboutParagraph").textContent = safe(professionality.aboutParagraph || "With years of dedicated experience in the field, I’ve built a strong foundation of skill, reliability, and results. Every project has strengthened my ability to deliver quality work with precision and professionalism, no matter the challenge.");
  $("#aboutPara2").textContent = safe(professionality.aboutPara2 || "Client satisfaction has always been the top priority. I take pride in understanding each client’s unique needs and exceeding their expectations through clear communication, commitment, and exceptional service.");
  $("#aboutPara3").textContent = safe(professionality.aboutPara3 || "Over time, I’ve successfully completed numerous projects, each reflecting hard work, creativity, and attention to detail. Every project adds to a growing portfolio of proven results and lasting value.");
  $("#happyClients").textContent = safe(professionality.happyClients || 0);
  $("#projectsCompleted").textContent = safe(professionality.projectsCompleted || 0);

  // Optional profile & CNIC images
  if (professionality.ProfilePhoto) {
    let img = $("#profilePhoto");
    if (img) img.src = professionality.ProfilePhoto;
  }
  if (professionality.CnicFront) {
    let img = $("#cnicFront");
    if (img) img.src = professionality.CnicFront;
  }
  if (professionality.CnicBack) {
    let img = $("#cnicBack");
    if (img) img.src = professionality.CnicBack;
  }

  // If you have a dedicated container to show professionality details (optional)
  const profWrap = $("#professionalityTab"); // create this div in HTML if you want full section
  if (profWrap) {
    profWrap.innerHTML = `
      <h3>${safe(professionality.professionInput || "Professional Experience")}</h3>
      <p>${safe(professionality.aboutParagraph || "")}</p>
      <p>${safe(professionality.aboutPara2 || "")}</p>
      <p>${safe(professionality.aboutPara3 || "")}</p>
      <p><strong>Years of Experience:</strong> ${safe(professionality.years || "0")}</p>
      <p><strong>Happy Clients:</strong> ${safe(professionality.happyClients || 0)}</p>
      <p><strong>Projects Completed:</strong> ${safe(professionality.projectsCompleted || 0)}</p>
    `;

    // Append images
    const imgCol = document.createElement("div");
    imgCol.className = "d-flex flex-wrap gap-2 mt-2";

    ["ProfilePhoto", "CnicFront", "CnicBack"].forEach(key => {
      if (professionality[key]) {
        const img = document.createElement("img");
        img.src = professionality[key];
        img.alt = key;
        img.className = "rounded shadow-sm";
        img.style.width = key === "ProfilePhoto" ? "100px" : "150px";
        img.style.height = "100px";
        imgCol.appendChild(img);
      }
    });

    if (imgCol.children.length) profWrap.appendChild(imgCol);
  }
}

/* -------------------- Populate UI from data -------------------- */
function populateAll({ personal = {}, skills = {}, education = {}, experience = [],service = [],professionality = [], raw = {} }, notice) {
  // HERO
  $("#heroName").textContent = safe(personal.Name || personal.fullName || personal.Name || personal.name, "Full Name");
  $("#heroProfileImg").src = safe(personal.ImageUrl || personal.image || "img/profile.png");
  $("#professionInput").textContent = safe(professionality.profession || professionality.profession || "");
  $("#playVideoBtn").dataset.src = safe(personal.video || personal.videoUrl || "");
  $("#downloadCV").href = safe(personal.cv || personal.Cv || "#");
  

  // BULLETS in about: features
  const bulletsWrap = $("#aboutBullets");
  bulletsWrap.innerHTML = "";
  const bullets = personal.features || personal.bullets || [];
  if (Array.isArray(bullets) && bullets.length) {
    bullets.forEach(b => {
      const p = document.createElement("p");
      p.className = "mb-3";
      p.innerHTML = `<i class="far fa-check-circle text-primary me-3"></i>${b}`;
      bulletsWrap.appendChild(p);
    });
  }

  // SKILLS - expecting either array or object
  const skillsArr = Array.isArray(skills) ? skills : Object.values(skills || {}).map(s => (typeof s === "string" ? { name: s, value: 80 } : s));
  const skillsColumns = $("#skillsColumns");
  skillsColumns.innerHTML = "";
  // divide skills into two columns like original layout
  const leftCol = document.createElement("div"); leftCol.className = "col-md-6";
  const rightCol = document.createElement("div"); rightCol.className = "col-md-6";

  skillsArr.forEach((sk, i) => {
    const name = safe(sk.name || sk.label || sk, "Skill");
    const value = safe(sk.value || sk.percent || sk.percentage || sk.per || 80);
    const node = document.createElement("div");
    node.className = "skill mb-4";
    node.innerHTML = `
      <div class="d-flex justify-content-between">
        <h6 class="font-weight-bold">${name}</h6>
        <h6 class="font-weight-bold">${value}%</h6>
      </div>
      <div class="progress">
        <div class="progress-bar ${progressBarClass(i)}" role="progressbar" style="width: ${value}%;" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    `;
    if (i % 2 === 0) leftCol.appendChild(node); else rightCol.appendChild(node);
  });

  skillsColumns.appendChild(leftCol);
  skillsColumns.appendChild(rightCol);

  // EXPERIENCE (tab-1)
  const expWrap = $("#experienceTab");
  expWrap.innerHTML = "";
  if (Array.isArray(experience) && experience.length) {
    experience.forEach(exp => {
      const col = document.createElement("div");
      col.className = "col-sm-6";
      col.innerHTML = `
        <h5>${safe(exp.organizationPosition || exp.title || exp.position || exp.role, "Position")}</h5>
        <hr class="text-primary my-2">
        <p class="text-primary mb-1">${safe(exp.durationNumber || exp.number || exp.from || "")} - ${safe(exp.durationUnit || exp.unit || exp.from || "")}</p>
        <h6 class="mb-0">${safe(exp.organizationName || exp.company || exp.org || "")}</h6>
      `;
      expWrap.appendChild(col);
    });
  } else {
    expWrap.innerHTML = `<div class="col-12"><p class="text-muted">No experience listed.</p></div>`;
  }
  // EXPERIENCE (tab-1)
//   const serWrap = $("#serviceTab");
//   serWrap.innerHTML = "";
//   if (Array.isArray(service) && service.length) {
//     service.forEach(exp => {
//       const col = document.createElement("div");
//       col.className = "col-sm-6";
//       col.innerHTML = `
//         <h5>${safe(ser.organizationprice || ser.title || ser.price || exp.role, "Price")}</h5>
//         <hr class="text-primary my-2">
//         <p class="text-primary mb-1">${safe(ser.durationdigits || ser.digits || ser.from || "")} - ${safe(exp.durationUnit || exp.unit || exp.from || "")}</p>
//         <h6 class="mb-0">${safe(ser.organizationTitle || ser.company || ser.org || "")}</h6>
//       `;
//       serWrap.appendChild(col);
//     });
//   } else {
//     serWrap.innerHTML = `<div class="col-12"><p class="text-muted">No service listed.</p></div>`;
//   }

  // EDUCATION (tab-2)
  const eduWrap = $("#educationTab");
  eduWrap.innerHTML = "";
  const eduItems = Array.isArray(education) ? education : Object.values(education || {});
  if (eduItems.length) {
    eduItems.forEach(ed => {
      const col = document.createElement("div");
      col.className = "col-sm-6";
      col.innerHTML = `
        <h5>${safe(ed.Degree || ed.degree || ed.Title || ed.title || "Degree")}</h5>
        <hr class="text-primary my-2">
        <p class="text-primary mb-1">${safe(ed.Startyear || ed.start || "")} - ${safe(ed.Endyear || ed.end || "")}</p>
        <h6 class="mb-0">${safe(ed.Name || ed.institute || ed.school || ed.place || "")}</h6>
      `;
      eduWrap.appendChild(col);
    });
  } else {
    eduWrap.innerHTML = `<div class="col-12"><p class="text-muted">No education listed.</p></div>`;
  }




function displayProfessionality(professionality) {
  const profWrap = $("#professionalityTab"); // replace with your actual container ID
  profWrap.innerHTML = "";

  if (!professionality) {
    profWrap.innerHTML = `<div class="col-12"><p class="text-muted">No professionality data available.</p></div>`;
    return;
  }

  // Text content
  const textCol = document.createElement("div");
  textCol.className = "col-12 mb-3";
  textCol.innerHTML = `
    <h5>${safe(professionality.profession || "Professional Experience")}</h5>
    <hr class="text-primary my-2">
    <p>${safe(professionality.aboutParagraph || "")}</p>
    <p>${safe(professionality.aboutPara2 || "")}</p>
    <p>${safe(professionality.aboutPara3 || "")}</p>
    <p><strong>Years of Experience:</strong> ${safe(professionality.Years || "0")}</p>
    <p><strong>Happy Clients:</strong> ${safe(professionality.happyClients || 0)}</p>
    <p><strong>Projects Completed:</strong> ${safe(professionality.projectsCompleted || 0)}</p>
  `;
  profWrap.appendChild(textCol);

  // Images
  const imgCol = document.createElement("div");
  imgCol.className = "col-12 d-flex flex-wrap gap-2";

  if (professionality.ProfilePhoto) {
    const img = document.createElement("img");
    img.src = professionality.ProfilePhoto;
    img.alt = "Profile Photo";
    img.className = "rounded shadow-sm";
    img.style.width = "100px";
    img.style.height = "100px";
    imgCol.appendChild(img);
  }

  if (professionality.CnicFront) {
    const img = document.createElement("img");
    img.src = professionality.CnicFront;
    img.alt = "CNIC Front";
    img.className = "rounded shadow-sm";
    img.style.width = "150px";
    img.style.height = "100px";
    imgCol.appendChild(img);
  }

  if (professionality.CnicBack) {
    const img = document.createElement("img");
    img.src = professionality.CnicBack;
    img.alt = "CNIC Back";
    img.className = "rounded shadow-sm";
    img.style.width = "150px";
    img.style.height = "100px";
    imgCol.appendChild(img);
  }

  if (imgCol.children.length) profWrap.appendChild(imgCol);
}
















  // PROJECTS
  const projWrap = $("#projectsGrid");
  projWrap.innerHTML = "";
  const projects = raw.projects || raw.Projects || [];
  if (Array.isArray(projects) && projects.length) {
    projects.forEach(p => {
      const col = document.createElement("div");
      col.className = "col-lg-4 col-md-6 portfolio-item first";
      col.innerHTML = `
        <div class="portfolio-img rounded overflow-hidden">
          <img class="img-fluid" src="${safe(p.image || p.src || 'img/project-1.jpg')}" alt="">
          <div class="portfolio-btn">
            <a class="btn btn-lg-square btn-outline-secondary border-2 mx-1" href="${safe(p.image || p.src || '#')}" data-lightbox="portfolio"><i class="fa fa-eye"></i></a>
            ${p.url ? `<a class="btn btn-lg-square btn-outline-secondary border-2 mx-1" href="${p.url}"><i class="fa fa-link"></i></a>` : ''}
          </div>
        </div>
      `;
      projWrap.appendChild(col);
    });
  } else {
    // keep default static items if no projects
    projWrap.innerHTML = document.querySelectorAll("#projectsGrid > .col-lg-4").length ? "" : `
      <div class="col-lg-4 col-md-6 portfolio-item first">
        <div class="portfolio-img rounded overflow-hidden">
          <img class="img-fluid" src="img/project-1.jpg" alt="">
          <div class="portfolio-btn">
            <a class="btn btn-lg-square btn-outline-secondary border-2 mx-1" href="img/project-1.jpg" data-lightbox="portfolio"><i class="fa fa-eye"></i></a>
            <a class="btn btn-lg-square btn-outline-secondary border-2 mx-1" href=""><i class="fa fa-link"></i></a>
          </div>
        </div>
      </div>
    `;
  }

  // TEAM
  const teamWrap = $("#teamGrid");
  teamWrap.innerHTML = "";
  const team = raw.team || raw.Team || [];
  if (Array.isArray(team) && team.length) {
    team.forEach(t => {
      const col = document.createElement("div");
      col.className = "col-lg-4 col-md-6 wow fadeInUp";
      col.innerHTML = `
        <div class="team-item position-relative">
          <img class="img-fluid rounded" src="${safe(t.image || 'img/team-1.jpg')}" alt="">
          <div class="team-text bg-white rounded-end p-4">
            <div>
              <h5>${safe(t.name || t.fullName)}</h5>
              <span>${safe(t.role || t.position)}</span>
            </div>
            <i class="fa fa-arrow-right fa-2x text-primary"></i>
          </div>
        </div>
      `;
      teamWrap.appendChild(col);
    });
  }

  // TESTIMONIALS
  const testWrap = $("#testimonialCarousel");
  testWrap.innerHTML = "";
  const testimonials = raw.testimonials || raw.Testimonial || [];
  if (Array.isArray(testimonials) && testimonials.length) {
    testimonials.forEach(tt => {
      const node = document.createElement("div");
      node.className = "testimonial-item text-center";
      node.innerHTML = `
        <div class="position-relative mb-5">
          <img class="img-fluid rounded-circle border border-secondary p-2 mx-auto" src="${safe(tt.image || 'img/testimonial-1.jpg')}" alt="">
          <div class="testimonial-icon">
            <i class="fa fa-quote-left text-primary"></i>
          </div>
        </div>
        <p class="fs-5 fst-italic">${safe(tt.message || tt.text)}</p>
        <hr class="w-25 mx-auto">
        <h5>${safe(tt.name)}</h5>
        <span>${safe(tt.role)}</span>
      `;
      testWrap.appendChild(node);
    });
    // initialize owl carousel if available
    if (window.jQuery && typeof window.jQuery.fn?.owlCarousel === "function") {
      window.jQuery(testWrap).owlCarousel({ items: 1, loop: true, nav: true, dots: true });
    }
  }

  // CONTACT
  $("#contactOffice").textContent = safe(personal.office || personal.address || personal.Caddres || "123 Street, New York, USA");
  $("#contactPhone").textContent = safe(personal.Phone || personal.phone || personal.mobile || "+012 345 6789");
  $("#contactEmail").textContent = safe(personal.Lisnt || personal.email || personal.Lisnt || "info@example.com");

  // social links
  const socialWrap = $("#socialLinks");
  socialWrap.innerHTML = "";
  const socials = personal.social || personal.socials || personal.links || {};
  if (typeof socials === "object" && Object.keys(socials).length) {
    for (const [k, v] of Object.entries(socials)) {
      const a = document.createElement("a");
      a.className = "btn btn-square btn-primary me-2";
      a.href = v;
      a.innerHTML = `<i class="fab fa-${k}"></i>`;
      a.target = "_blank";
      socialWrap.appendChild(a);
    }
  } else {
    // fallback static icons
    socialWrap.innerHTML = `
      <a class="btn btn-square btn-primary me-2" href="#"><i class="fab fa-twitter"></i></a>
      <a class="btn btn-square btn-primary me-2" href="#"><i class="fab fa-facebook-f"></i></a>
      <a class="btn btn-square btn-primary me-2" href="#"><i class="fab fa-youtube"></i></a>
      <a class="btn btn-square btn-primary me-2" href="#"><i class="fab fa-linkedin-in"></i></a>
    `;
  }

  // SITE NAME & DESIGNER
  $("#siteName").textContent = safe(personal.siteName || "Your Site Name");
  $("#siteDesigner").textContent = safe(personal.siteDesigner || "HTML Codex");

  // initialize typed.js if available
  initTyped();

  // setup play video modal behaviour
  setupVideoModal();

  // show notice if provided (optional)
  if (notice) {
    console.info(notice);
    // you can show a small toast or alert using bootstrap if desired
  }
}

/* -------------------- small utilities -------------------- */
function progressBarClass(i) {
  // cycle colors similar to original template
  const classes = ["bg-primary", "bg-warning", "bg-danger", "bg-danger", "bg-dark", "bg-info"];
  return classes[i % classes.length] || "bg-primary";
}

function initTyped() {
  const typedOutput = $("#typedOutput");
  const professionInput = $("#professionInput");
  if (!typedOutput || !professionInput) return;
  // if typed.js loaded
  if (window.Typed) {
    // destroy existing typed instance if any
    if (window.__appTyped) {
      try { window.__appTyped.destroy(); } catch {}
    }
    window.__appTyped = new window.Typed('#typedOutput', {
      strings: professionInput.textContent.split(",").map(s => s.trim()),
      typeSpeed: 60,
      backSpeed: 35,
      backDelay: 1600,
      loop: true
    });
  } else {
    // fallback: simple rotate
    let i = 0;
    const arr = professionInput.textContent.split(",").map(s => s.trim()).filter(Boolean);
    if (!arr.length) return;
    typedOutput.textContent = arr[0];
    setInterval(() => {
      i = (i + 1) % arr.length;
      typedOutput.textContent = arr[i];
    }, 2500);
  }
}

function setupVideoModal() {
  // when opening modal, set iframe src from data-src of button
  const playBtn = $("#playVideoBtn");
  const videoIframe = $("#video");
  if (!playBtn || !videoIframe) return;

  const modalEl = document.getElementById("videoModal");
  if (!modalEl) return;

  modalEl.addEventListener("show.bs.modal", (e) => {
    const src = playBtn.dataset.src || "";
    if (src) videoIframe.src = src + "?autoplay=1&rel=0";
  });
  modalEl.addEventListener("hidden.bs.modal", (e) => {
    videoIframe.src = "";
  });

  // also set initial data-src on button if personal video provided
  const src = playBtn.dataset.src;
  if (src) playBtn.setAttribute("data-src", src);
}

/* -------------------- demo data for preview if no firebase or CNIC -------------------- */
function demoData() {
  return {
    personal: {
      Name: "Ali Raza",
      profession: "Frontend Developer",
      ImageUrl: "img/profile.png",
      typed: "Web Developer, UI/UX Designer, Freelancer",
      about: "Creative front-end developer with 5+ years of experience building responsive websites.",
      features: ["Affordable Prices", "High Quality Product", "On Time Delivery"],
      Years: "5",
      happyClients: 120,
      projectsCompleted: 45,
      office: "Lahore, Pakistan",
      Phone: "+92 300 0000000",
      Lisnt: "ali@example.com",
      social: { twitter: "#", facebook: "#", linkedin: "#" },
      siteName: "AliRaza.dev",
      siteDesigner: "Your Name"
    },
    professionality: {
        professionInput: "Web Developer, Graphic Designer",
        years: "5",
      happyClients: 120,
      projectsCompleted: 45
    },
    skills: [{ name: "HTML", value: 95 }, { name: "CSS", value: 90 }, { name: "JavaScript", value: 92 }, { name: "React", value: 85 }],
    education: [
      { Degree: "BSCS", Name: "University of Sindh", Startyear: "2015", Endyear: "2019" }
    ],
    experience: [
      { organizationPosition: "Front-end Developer", organizationName: "Meer Security", Startyear: "2020", Endyear: "2024" }
    ],
    service: [
      { organizationtitle: "App Development", organizationprice: "200", Startyear: "2020", Endyear: "2024" }
    ],
    
    raw: {
      projects: [{ image: "img/project-1.jpg", url: "#" }],
      testimonials: [{ name: "Client", role: "CEO", message: "Great work!", image: "img/testimonial-1.jpg" }],
      team: [{ name: "Team Member", role: "Designer", image: "img/team-1.jpg" }]
    }
  };
}
