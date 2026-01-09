// inject-portfolio.js
// Module used to inject your portfolio body HTML into #app and populate from Firebase.
//
// Usage: include in your index.html as:
// <script type="module" src="inject-portfolio.js"></script>

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";
import { getStorage, ref as storageRef, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-storage.js";

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
const storage = getStorage(app);




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
<nav class="navbar navbar-expand-lg fixed-top py-lg-0 px-4 px-lg-5 wow fadeIn" data-wow-delay="0.1s">

  <!-- Start Logo -->
  <a href="https://ar-dynamicweb.com" target="_blank" class="navbar-brand d-flex align-items-center">
    <img src="/Assets/AR Logo.jpg" class="arlogo" alt="Logo Start">
  </a>

<button class="navbar-toggler custom-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
    <span class="toggler-line"></span>
    <span class="toggler-line"></span>
    <span class="toggler-line"></span>
</button>


  <div class="collapse navbar-collapse justify-content-between py-4 py-lg-0" id="navbarCollapse">

    <!-- Centered Nav Links -->
    <div class="navbar-nav mx-auto py-0">
      <a href="#homed" class="nav-item nav-link activated">Home</a>
      <a href="#about" class="nav-item nav-link">About</a>
      <a href="#skill" class="nav-item nav-link">EEE/</a>
      <a href="#servicelist" class="nav-item nav-link">Services</a>
      <a href="#project" class="nav-item nav-link">Projects</a>
      <a href="#team" class="nav-item nav-link">Team</a>
      <a href="#contact" class="nav-item nav-link">Contact</a>  
      <div id="timerDisplay">Loading...</div>
    </div>
    </div>
 <!-- End Logo -->



<!-- PROFILE DROPDOWN -->
<div class="loprodiv">
<div class="profile-dropdown">
  <div class="profile-wrapper">
    <img id="ptprpImg" alt="Profile">
    <span class="online-dot"></span>
  </div>

  <div class="dropdowned-menued">
    <a href="#">Admin Dashboard</a>
    <a href="#">Users</a>
    <a href="#">Settings</a>
  </div>
  
</div>


    <a href="#" class="navbar-brand d-flex align-items-center">
              <img src="" class="adminlogo" id="profilePhoto" alt="Admin Logo">

    </a>
   

  </div>
  </div>
</nav>
<!-- Navbar End -->






<!-- Header Start -->
<div id="homed">
  <div class="container">
    <main>
      <div class="content">

        <!-- Line 1: I'm -->
        <div class="tag-box" data-aos="fade-zoom-in"
             data-aos-easing="ease-in-back"
             data-aos-delay="300"
             data-aos-offset="0"
             data-aos-duration="1500">
          <h3 class="texthd">I'm</h3>
        </div>

        <!-- Line 2: Hero Name + Profile Image -->
        <div class="name-line">
          <h1 class="heroName" id="heroName">Ali Raza</h1>
          <img class="image-gradient" id="heroProfileImg" src="/Assets/profile.png" alt="Profile">
        </div>

        <!-- Line 3: Auto-typing -->
        <h2 class="typed-text-output d-inline" id="typedOutput"></h2>

        <!-- Line 4: Description -->
        <p class="description" id="Aboutpera" data-aos="fade-zoom-in"
           data-aos-easing="ease-in-back"
           data-aos-delay="300"
           data-aos-offset="0"
           data-aos-duration="2500">
          This is a short description about yourself. Replace with real content.
        </p>

        <!-- Line 5: Buttons -->
        <div class="d-flex align-items-center pt-5">
<button id="showResumeBtn" class="main-btn">See My Resume</button>

        <button type="button" class="btn-play" data-bs-toggle="modal"
                  data-src="" data-bs-target="#videoModal" id="playVideoBtn">
            <span></span>
          </button>
          <h5 class="ms-4 mb-0 d-none d-sm-block">Play Video</h5>
        </div>

      </div>

      <!-- 3D Model -->
      <spline-viewer data-aos="fade-zoom-in"
                     data-aos-easing="ease-in-back"
                     data-aos-delay="300"
                     data-aos-offset="0"
                     data-aos-duration="3000"
                     class="robot-3d"
                     url="https://prod.spline.design/Qr2knMM4aKElH8x7/scene.splinecode">
      </spline-viewer>

    </main>
  </div>
</div>

<!-- Video Modal Start -->
<div class="modal modal-video fade" id="videoModal"    tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content rounded-20">
      <div class="modal-header">
        <h3 class="modal-title" id="exampleModalLabel">Self Introduction Clip</h3>
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
<!-- Header End -->





        <div class="d-flex align-items-center mb-3 wow fadeInUp" data-wow-delay="0.1s">

</div>


<!-- About Start -->
<div class="container-xxl py-6" id="about">
  <div class="container">
    <h1 class="display-5 mb-5 wow fadeInUp" data-wow-delay="0.1s">About Work</h1>
    <div class="row g-5">

      <!-- Left Column -->
      <div class="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">

        <div class="userimg wow fadeInUp" data-wow-delay="0.8s">
<img class="img-fluid02 wow fadeInUp" data-wow-delay="0.2s" id="heroProfileImg2" src="/Assets/profile.png" alt="">
        </div>

        <div class="d-flex align-items-center mb-5 wow fadeInUp" data-wow-delay="0.3s">
          <div class="years flex-shrink-0 text-center me-4">
            <h1 class="display-1 mb-0" id="Years">0</h1>
            <h5 class="mb-0">Years</h5>
          </div>
          <h3>Working Experience As
            <span class="lh-base mb-0" id="professionInput"></span>
          </h3>
        </div>

        <p class="mb-4 wow fadeInUp" data-wow-delay="0.8s" id="aboutParagraph">
          About text here.
        </p>

      </div>

      <!-- Right Column -->
      <div class="col-lg-6 wow fadeInUp" data-wow-delay="0.5s">

        <div class="row g-3 mb-4 wow fadeInUp" data-wow-delay="0.6s">
          <div class="col-sm-6">
<img class="img-fluid rounded wow fadeInUp" data-wow-delay="0.6s" id="cnicFront" src="img/about-1.jpg" alt="">
          </div>
          <div class="col-sm-6">
            <img class="img-fluid rounded wow fadeInUp" data-wow-delay="0.8s" id="cnicBack" src="img/about-2.jpg" alt="CNIC Back">
          </div>
        </div>

        <div class="d-flex align-items-center mb-3 wow fadeInUp" data-wow-delay="0.8s">
          <h5 class="border-end pe-3 me-3 mb-0">Happy Clients</h5>
          <h2 class="text-primary fw-bold mb-0 wow fadeInUp" data-wow-delay="0.9s" id="happyClients">0</h2>
        </div>
        <p class="mb-4 wow fadeInUp" data-wow-delay="0.3s" id="aboutPara2">Sub text about clients and projects.</p>

        <div class="d-flex align-items-center mb-3 wow fadeInUp" data-wow-delay="1.1s">
          <h5 class="border-end pe-3 me-3 mb-0">Projects Completed</h5>
          <h2 class="text-primary fw-bold mb-0 wow fadeInUp" data-wow-delay="1.2s" id="projectsCompleted">0</h2>
        </div>
        <p class="mb-0 wow fadeInUp" data-wow-delay="1.3s" id="aboutPara3">More about projects.</p>

        <br>
        <div id="aboutBullets" class="wow fadeInUp" data-wow-delay="1.4s"></div>
        <i class="far fa-check-circle text-primary me-3 wow fadeInUp" data-wow-delay="1.5s"></i>Afordable Price<br>
        <i class="far fa-check-circle text-primary me-3 wow fadeInUp" data-wow-delay="1.6s"></i>High Quality Product<br>
        <i class="far fa-check-circle text-primary me-3 wow fadeInUp" data-wow-delay="1.7s"></i>On Time Project Delivery<br>

        <a class="btn btn-primary py-3 px-5 mt-3 wow fadeInUp" data-wow-delay="1.8s" id="aboutReadMore" href="#">Read More</a>

      </div>
    </div>
  </div>
</div>
<!-- About End -->









<!-- Expertise / Skills Start -->
<div class="container-xxl" id="skill">
  <div class="container">
    <div class="row g-5">
      <div class="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
        <h1 class="display-5 mb-5">Expertise Experience & Education EEE/</h1>
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

<div class="servicelist" id="servicelist">
<div class="container-fluid  >
  <div class="container">
    <div class="row g-5 mb-5 wow fadeInUp" data-wow-delay="0.1s">
      <div class="col-lg-6">
        <h1 class="display-5 mb-0">My Services</h1>
      </div>
      <div class="col-lg-6 text-lg-end">
        <a class="btn btn-primary py-3 px-5" href="#" id="hireBtn">Hire Me</a>
      </div>
    </div>
    <div class="row g-4" id="serviceListContainer05">
      <!-- dynamic services -->
    </div>
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
                    <ul class="list-inline mx-n3 mb-0" id="projectFilters"></ul>

                   </div>
</div>
   
<div id="projectGrid" class="row g-4"></div>

</div>
</div>
</div>
<!-- Projects End -->



<!-- team Start -->
<div class="container-xxl py-6 pb-5" id="team">
  <div class="container">
    <div class="row g-5 mb-5 wow fadeInUp" data-wow-delay="0.1s">
      <div class="col-lg-6">
        <h1 class="display-5 mb-0">team Members</h1>
      </div>
      <div class="col-lg-6 text-lg-end">
        <a class="btn btn-primary py-3 px-5" href="#" id="contactteamBtn">Contact Us</a>
      </div>
    </div>
    <div class="row g-4" id="teamGrid">
      <!-- dynamic team -->
    </div>
  </div>
  </div>
</div>
<!-- Team End -->









<!-- Wrapper -->
    <div class="container-xxl py-6 pt-5" id="testimonial">

<div class="testimonial-wrapper">

    <!-- Title (NOT inside grid) -->
    <div class="title-row">
        <h3 class="Testm">Testimonial</h3>
    </div>

    <!-- Grid Starts After Title -->
    <div class="grid">

        <!-- 1st — Young Boy -->
        <div class="carded">
            <div class="badge">Verified</div>
            <div class="top">
                <img src="https://i.pravatar.cc/300?img=64" />
                <div>
                    <div class="name">Ayaan Malik</div>
                    <div class="role">Student / Creator</div>
                </div>
            </div>
            <div class="rating">★★★★★ 5.0</div>
            <p>
                  The glass UI feels so premium and aesthetic. Very iPhone-style, extremely smooth and professional. Highly recommended!
            </p>
        </div>

 
  <!-- 2nd — Young Girl -->
  <div class="carded">
    <div class="badge">Top Review</div>
    <div class="top">
      <img src="https://i.pravatar.cc/300?img=47"/>
      <div>
        <div class="name">Amelia Rose</div>
        <div class="role">Fashion Blogger</div>
      </div>
    </div>
    <div class="rating">★★★★★ 5.0</div>
    <p> AR Technology blew my mind. Super modern designs, fast delivery, and a futuristic UI experience. Loved the results!
    </p>
  </div>

  <!-- 3rd — Young Boy -->
  <div class="carded">
    <div class="badge">Premium</div>
    <div class="top">
      <img src="https://i.pravatar.cc/300?img=15"/>
      <div>
        <div class="name">Ethan Walker</div>
        <div class="role">Content Producer</div>
      </div>
    </div>
    <div class="rating">★★★★☆ 4.8</div>
    <p>
      Super aesthetic UI! The responsiveness and animations look insane. Perfect for my digital portfolio.
    </p>
  </div>

  <!-- 4th — Young Girl -->
  <div class="carded">
    <div class="badge">Client</div>
    <div class="top">
      <img src="https://i.pravatar.cc/300?img=49"/>
      <div>
        <div class="name">Lara Bennett</div>
        <div class="role">Model / Influencer</div>
      </div>
    </div>
    <div class="rating">★★★★★ 5.0</div>
    <p>
      Beautiful design, smooth interactions, luxury feel. AR Technology delivers next-level UI every time!
    </p>
  </div>

</div>
</div>
</div>










<!-- Contact Start -->
<div class="container-xxl pb-5" id="contact">
  <div class="container py-5">
    <div class="row g-5 mb-5 wow fadeInUp" data-wow-delay="0.1s">
      <div class="col-lg-6">
        <h1 class="display-5 mb-0">Let's Work Together</h1>
        <h2 class="display-5 mb-0" id="Name"></h2>

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

      
<!-- Gmail Portal (Replaces Contact Form) -->
<div id="gmailPortal" class="gmail-portal-card">
  <h3 class="portal-title">
    <img src="/Assets/gmail.png" alt="Gmail" class="portal-icon" />
    Send Email
  </h3>

  <div class="gp-field">
    <input type="text" id="gp_to" readonly placeholder="To" />
  </div>


  <div class="gp-field">
    <input type="text" id="gp_subject" placeholder="Subject" />
  </div>

  <div class="gp-field">
    <textarea id="gp_message" placeholder="Message"></textarea>
  </div>

  <button class="gp-btn" onclick="sendGmail()">Send Email</button>
</div>




        
      </div>
    </div>
  </div>
</div>
</div>
</div>
<!-- Contact End -->

  


<body>

<footer>
<div class="footer-container">

  <div class="top-row">
    <!-- AR Block -->
    <div class="col ar-block">
      <div class="brand-row">
        <img src="/Assets/AR Logo.jpg" class="brand-logo" alt="AR Technologies logo">
        <h2 class="brand-name">AR Technologies</h2>
      </div>
      <p class="brand-para">
        AR Technologies — premier software house delivering expert <strong>Web & App Development, Networking & Cloud, AI & ML, UI/UX, Graphic Design, Content Creation, Digital Marketing</strong> and modern portfolio/landing page solutions for startups & enterprises worldwide.
      </p>
      <div class="meta-row">
        <div class="rating">
          <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star-half-stroke"></i>
          <span class="rating-text">9.4 — Trusted by 520+ clients</span>
        </div>
        <a href="https://ar-dynamicweb.com"  target="_blank" class="cta"><span>Generate Your Portfolio</span></a>
      </div>
    </div>

    <!-- Admin Block -->
    <div class="col admin-block">
      <div class="admin-head">
          <img src="" class="admin-logo" id="profilePhoto2" alt="Admin Logo">

        <h3 class="admin-name" id="heroName2">Admin Portfolio</h3><h2 class="brand-name">Portfolio Website</h2>
      </div>
      <p class="admin-para">
        Dear User — welcome to my portfolio. Explore my expertise, education, and experience. I provide professional services including Web & App development, AI solutions, UI/UX design, graphic design, and digital marketing. Contact me if you want to work together.
      </p>
      <div class="admin-quick-links">
        <a href="#generate-portfolio">Generate Portfolio</a>
        <a href="#dashboard">Dashboard</a>
        <a href="#manage-users">Manage Users</a>
        <a href="#reports">Reports</a>
      </div>
    </div>
  </div>

  <!-- Services -->
  <section class="services-grid">
    <div class="service-group"><h4>Core Services</h4><ul>
        <li><a href="#web-design">Web Design</a></li><li><a href="#web-dev">Web Development</a></li><li><a href="#app-dev">App Development</a></li><li><a href="#ui-ux">UI/UX Design</a></li><li><a href="#graphic">Graphic Design</a></li><li><a href="#digital-marketing">Digital Marketing</a></li><li><a href="#content">Content Creation</a></li>
    </ul></div>
    <div class="service-group"><h4>Cloud & Infra</h4><ul>
        <li><a href="#cloud">Cloud Hosting</a></li><li><a href="#server">Server Mgmt</a></li><li><a href="#network">Networking</a></li><li><a href="#devops">DevOps</a></li><li><a href="#security">Security Audit</a></li><li><a href="#performance">Performance Tuning</a></li><li><a href="#backup">Backup & DR</a></li>
    </ul></div>
    <div class="service-group"><h4>Data & AI</h4><ul>
        <li><a href="#ai">AI & ML</a></li><li><a href="#data">Data Engineering</a></li><li><a href="#analytics">Analytics</a></li><li><a href="#bi">BI Dashboards</a></li><li><a href="#automation">Automation</a></li><li><a href="#docs">Documentation</a></li><li><a href="#research">Research & POCs</a></li>
    </ul></div>
    <div class="service-group"><h4>Enterprise</h4><ul>
        <li><a href="#enterprise">Enterprise Apps</a></li><li><a href="#crm">CRM Systems</a></li><li><a href="#fintech">FinTech</a></li><li><a href="#edtech">EdTech</a></li><li><a href="#logistics">Logistics Tech</a></li><li><a href="#ecommerce">eCommerce</a></li><li><a href="#support">Support Systems</a></li>
    </ul></div>
    <div class="service-group"><h4>Growth & Brand</h4><ul>
        <li><a href="#seo">SEO Optimization</a></li><li><a href="#ads">Ad Campaigns</a></li><li><a href="#social">Social Media Mgmt</a></li><li><a href="#brand">Brand Strategy</a></li><li><a href="#growth">Growth Hacking</a></li><li><a href="#content-plan">Content Planning</a></li><li><a href="#ux-review">UX Review</a></li>
    </ul></div>
    <div class="service-group"><h4>Tools & Integration</h4><ul>
        <li><a href="#api">API Integration</a></li><li><a href="#payment">Payment Integration</a></li><li><a href="#pwa">Progressive Web Apps</a></li><li><a href="#mobile-ux">Mobile UX</a></li><li><a href="#app-integration">App Integration</a></li><li><a href="#embedded">Embedded Systems</a></li><li><a href="#localization">Localization</a></li>
    </ul></div>
    <div class="service-group"><h4>Creative & Ops</h4><ul>
        <li><a href="#graphic2">Graphic Design</a></li><li><a href="#video">Video Production</a></li><li><a href="#voiceover">Voiceover</a></li><li><a href="#portfolio-audit">Portfolio Audit</a></li><li><a href="#partnerships">Partnerships</a></li><li><a href="#roadmaps">Product Roadmaps</a></li><li><a href="#consulting">Consulting</a></li>
    </ul></div>
  </section>

  <!-- Social icons -->
  <div class="icons-row"><a href="https://wa.me/923232997001?text=Hey%20admin%2C%20I%20contacted%20you%20from%20your%20website"target="_blank"class="social"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg" alt="WhatsApp"></a>
    <a href="https://whatsapp.com/channel/0029VbBEJHh17EmmElBMxu1r" target="_blank" class="social"><img src="/Assets/application.png"  style="font-weight: bolder; width: 30px; height: 30px;" alt="WhatsApp Channel"></a>
    <a href="https://www.youtube.com/@arstudios2" target="_blank" class="social"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg" alt="YouTube"></a>
    <a href="https://github.com/youraccount" target="_blank" class="social"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg" alt="GitHub"></a>
    <a href="https://github.com/ALIRAZANAREJO" target="_blank" class="social"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg" alt="LinkedIn"></a>
    <a href="https://facebook.com/yourpage" target="_blank" class="social"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg" alt="Facebook"></a>
    <a href="https://www.instagram.com/ar_technologyy?utm_source=qr&igsh=N2Y0d2VkNnBhMjA=" target="_blank" class="social"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" alt="Instagram"></a>
    <a href="#" target="_blank" class="social"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/discord.svg" alt="Discord"></a>
    <a href="https://x.com/AR_Technologes" target="_blank" class="social"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/twitter.svg" alt="Twitter"></a>
  </div>

  <!-- Copyright -->
  <div class="footer-copyright">
    <div class="copyright-row"> 

       
    
      <img src="/Assets/AR Logo.jpg" class="copyright-logo" alt="AR logo">
      <div class="copyright-text">
        <strong>AR Technologies</strong> — Portfolio designed & developed by AR Technologies. Delivering digital solutions, web & app, AI & ML, enterprise systems, UX-focused products worldwide.
      </div>
    </div>
    <small class="copyright-note">© 2026 AR Technologies. All rights reserved.</small>
  </div>

</div>
</footer>




<!-- Back to Top -->
<a href="#" class="btn btn-lg btn-primary btn-lg-square back-to-top"><i class="bi bi-arrow-up"></i></a>
`;
   

// ================= WHATSAPP REDIRECT HANDLER =================
(function () {
  const MESSAGE = "Hey admin, I contacted you from your website";
  const NUMBER = "923232997001"; // without +

  document.querySelectorAll('a[href*="whatsapp"]').forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const encodedMsg = encodeURIComponent(MESSAGE);
      const waLink = `https://wa.me/${NUMBER}?text=${encodedMsg}`;

      window.open(waLink, "_blank");
    });
  });
})();

// ---- LIVE EMAIL LOADER ----
function loadDynamicEmail() {
  const emailEl = document.getElementById("contactEmail");
  const inputEl = document.getElementById("gp_to");

  if (!emailEl || !inputEl) {
    setTimeout(loadDynamicEmail, 200);
    return;
  }

  const email = emailEl.innerText.trim();

  // keep waiting until DB loads real email
  if (!email || email === "info@example.com"){
    setTimeout(loadDynamicEmail, 200);
    return;
  }

  inputEl.value = email;
}

document.addEventListener("DOMContentLoaded", loadDynamicEmail);


// ---- SEND GMAIL ----
function sendGmail() {
  const to = document.getElementById("gp_to").value;
  const subject = document.getElementById("gp_subject").value;
  const message = document.getElementById("gp_message").value;

  // Gmail automatically inserts the user's logged-in Gmail as FROM
  const finalBody = `${message}`;

  const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(finalBody)}`;

  window.open(url, "_blank");
}

// Keep same format
window.sendGmail = sendGmail;



/* ---------- USAGE ----------
   After updating DOM values with displayProfessionality(data):
     displayProfessionality(data);
     animateCounters(2000); // duration in ms
*/



new WOW().init();


const email = localStorage.getItem("userEmail");
const toSafeEmail = (e) => e.replace(/[.#$[\]]/g, "_");

/* -------------------- MAIN -------------------- */
document.addEventListener("DOMContentLoaded", async () => {
  // ensure #app exists
  let app = document.getElementById("app");
  if (!app) {
    app = document.createElement("div");
    app.id = "app";
    document.body.insertBefore(app, document.body.firstChild);
  }

  // inject body template
  app.appendChild(html(BODY_TEMPLATE));
  const spinner = $("#spinner");
let navbarInterval = null;
let popupInterval = null;

// ---------------- NAVBAR COUNTDOWN / TIMER ----------------
async function startNavbarCountdown() {
    const timerEl = document.getElementById("timerDisplay");
    if (!timerEl || !email) return;

    const safeEmail = toSafeEmail(email);
    const accessRef = ref(db, `AR_Technologies/Ai/Dynamic_Web/${safeEmail}/Portfolio/Access`);

    const snap = await get(accessRef);
    if (!snap.exists()) {
        timerEl.innerText = "No Access Data!";
        timerEl.style.color = "red";
        return;
    }

    let { expiresAt, paymentStatus } = snap.val();
    expiresAt = Number(expiresAt);

    if (!expiresAt || isNaN(expiresAt)) {
        timerEl.innerText = "Invalid Timer!";
        timerEl.style.color = "red";
        return;
    }

    // Create popup element for big countdown
    let popup = document.createElement("div");
    popup.id = "timerPopup";
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.background = "rgba(0,0,0,0.85)";
    popup.style.color = "white";
    popup.style.fontSize = "3rem";
    popup.style.padding = "2rem 3rem";
    popup.style.borderRadius = "12px";
    popup.style.zIndex = "9999";
    popup.style.display = "none";
    popup.style.opacity = "0";
    popup.style.transition = "opacity 0.5s ease-in-out";
    document.body.appendChild(popup);

    function showPopup() {
        if (popupInterval) clearInterval(popupInterval);
        popup.style.display = "block";
        popup.style.opacity = "1";

        popupInterval = setInterval(() => {
            const now = Date.now();
            const diff = expiresAt - now;
            if (diff <= 0) {
                popup.style.display = "none";
                popup.style.opacity = "0";
                clearInterval(popupInterval);
                return;
            }

            const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
            const months = Math.floor(totalDays / 30);
            const days = totalDays % 30;
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            popup.innerText = `${months}mo ${days}d ${hours}h ${minutes}m ${seconds}s`;
        }, 1000);

        // Hide after 10 seconds with fade-out
        setTimeout(() => {
            popup.style.opacity = "0";
            setTimeout(() => {
                popup.style.display = "none";
                clearInterval(popupInterval);
            }, 500);
        }, 7000); // 10 seconds
    }

   function updateTimerUI() {
    const now = Date.now();
    const diff = expiresAt - now;

    if (diff <= 0) {
        timerEl.innerText = "⏳ Expired!";
        timerEl.style.color = "orange";
        timerEl.style.fontSize = "1rem";
        clearInterval(navbarInterval);
        clearInterval(popupInterval);
        popup.style.display = "none";
        return;
    }

    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const months = Math.floor(totalDays / 30);
    const days = totalDays % 30;
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const isMobile = window.innerWidth < 768; // mobile breakpoint

    if (diff > 24 * 60 * 60 * 1000) {
        // Timer icon for long duration
        timerEl.innerHTML = "⏱";
        timerEl.style.fontSize = isMobile ? "1.2rem" : "1.8rem";
        timerEl.style.cursor = "pointer";
        timerEl.style.fontWeight = "bolder";
        timerEl.style.color = "#7B2FF7";

        timerEl.onmouseenter = timerEl.onclick = showPopup;
    } else {
        // Small countdown on navbar
        timerEl.innerHTML = isMobile
            ? `${hours}h ${minutes}m`
            : `${hours}h ${minutes}m ${seconds}s`;
        timerEl.style.fontSize = isMobile ? "0.9rem" : "1rem";
        timerEl.style.cursor = "default";
        timerEl.onmouseenter = timerEl.onclick = null;
    }
}


    updateTimerUI(); // first render
    navbarInterval = setInterval(updateTimerUI, 1000);

    // 🔴 Realtime listener for paymentStatus updates
    onValue(accessRef, (s) => {
        if (!s.exists()) return;
        const { paymentStatus } = s.val();

        if (paymentStatus === "Verified") {
            clearInterval(navbarInterval);
            clearInterval(popupInterval);
            timerEl.innerHTML = "✅ Verified";
            timerEl.style.color = "limegreen";
        }

        if (paymentStatus === "Rejected") {
            clearInterval(navbarInterval);
            clearInterval(popupInterval);
            timerEl.innerHTML = "❌ Rejected";
            timerEl.style.color = "red";
        }
    });
}

// Boot
startNavbarCountdown();
// ✅ Get email from URL (KEEP EXISTING FLOW)
const urlParams = new URLSearchParams(window.location.search);
const rawEmail = urlParams.get("email");

if (!rawEmail) {
  console.warn("No email found in URL. Showing demo.");
  const demo = demoData();
  populateAll(demo);
  spinner?.classList.remove("show");
  return;
}

// ✅ FIX: decode + normalize WITHOUT disturbing rest
const decodedEmail = decodeURIComponent(rawEmail).toLowerCase();

// ✅ FIX: match DB format → alirazanarejo12@gmail_com
const [local, domain] = decodedEmail.split("@");
const safeEmail = `${local}@${domain.replace(/\./g, "_")}`;

try {
  const dbRef = ref(db);

  // ✅ direct email-based path
  const basePath = `AR_Technologies/Ai/Dynamic_Web/${safeEmail}/Portfolio`;
  const personalSnap = await get(child(dbRef, `${basePath}/Personal`));

  if (!personalSnap.exists()) {
    console.warn("No data found for this email. Showing demo.");
    const demo = demoData();
    populateAll(demo, "No data found for this email.");
    spinner?.classList.remove("show");
    return;
  }

  // ✅ fetch full portfolio under email
  const portfolioSnap = await get(child(dbRef, basePath));
  const data = portfolioSnap.val();
  console.log("Fetched user data:", data);

  const personal = data.Personal || {};
  const skills = data.Skills || {};
  const education = data.Education || {};
  const experienceRaw = data.Experience || {};
  const serviceRaw = data.Service || {};
  const projectRaw = data.Project || {};
  const professionality = data.Professionality || {};
  const teamRaw = data.Team || {};

  // convert objects to arrays (UNCHANGED)
  const experience = Array.isArray(experienceRaw) ? experienceRaw : Object.values(experienceRaw);
  const service = Array.isArray(serviceRaw) ? serviceRaw : Object.values(serviceRaw);
  const projectList = Array.isArray(projectRaw) ? projectRaw : Object.values(projectRaw);
  const team = Array.isArray(teamRaw) ? teamRaw : Object.values(teamRaw);

  const payload = {
    personal,
    skills,
    education,
    experience,
    professionality,
    service,
    projectList,
    team,
    raw: data
  };

  displayProfessionality(professionality);
  displayService(service);
  displayProject(projectList);
  displayTeamSection({ team });
  populateAll(payload);

} catch (err) {
  console.error("Error fetching Firebase data:", err);
  const demo = demoData();
  populateAll(demo, "Error loading data — showing demo.");
} finally {
  spinner?.classList.remove("show");
}
});


// ======================= TEAM DISPLAY =======================
function displayTeamSection(raw) {
  const teamWrap = document.getElementById("teamGrid");
  teamWrap.innerHTML = "";

  // Get team data (works for both "Team" and "team")
  const teamData = raw.Team || raw.team;

  if (teamData && typeof teamData === "object") {
    const teamArray = Object.values(teamData);

    if (teamArray.length > 0) {
      teamArray.forEach((t, i) => {
        const col = document.createElement("div");
        col.className = "col-lg-4 col-md-6 wow fadeInUp";
        col.dataset.wowDelay = `${0.1 * (i + 1)}s`;

        // Matching your exact Firebase keys
        const image = t.profileImgUrl || "img/team-1.jpg";
        const name = t.teamateName || "Unknown Member";
        const profession = t.teamateProfession || "Unknown Profession";
        const about = t.teamateAbout || "";
        const facebook = t.facebook || "#";
        const linkedin = t.linkdedin || "#"; // (Your key spelling is 'linkdedin')
        const twitter = t.twitter || "#";

        col.innerHTML = `
          <div class="team-item position-relative overflow-hidden" style="display: flex; flex-wrap: wrap;">
            <img class="img-fluid" src="${image}" alt="${name}">
            <div class="team-text ">
              <h5 class="nam01">${name}</h5>
              <span class="text-primary d-block mb-2">${profession}</span>
              <p class="small text-muted mb-3">${about}</p>
              <div class="d-flex gap-3">
                <a href="${facebook}" target="_blank" class="text-primary"><i class="fab fa-facebook-f"></i></a>
                <a href="${linkedin}" target="_blank" class="text-primary"><i class="fab fa-linkedin-in"></i></a>
                <a href="${twitter}" target="_blank" class="text-primary"><i class="fab fa-twitter"></i></a>
              </div>
            </div>
          </div>
        `;

        teamWrap.appendChild(col);
      });
    } else {
      teamWrap.innerHTML = `
        <div class="col-12 text-center">
          <p class="text-muted">No team members available.</p>
        </div>
      `;
    }
  } else {
    teamWrap.innerHTML = `
      <div class="col-12 text-center">
        <p class="text-muted">No team data found.</p>
      </div>
    `;
  }
}





/* -------------------- getServiceIcon() using CSV -------------------- */
let ICON_DICTIONARY_FA5 = {}; // Will be filled from CSV

// Load CSV and parse into dictionary (call once at page load)
async function loadIconCSV(csvUrl) {
  try {
    const res = await fetch(csvUrl);
    const text = await res.text();
    const lines = text.split("\n").slice(1); // skip header
    lines.forEach(line => {
      const [icon, title, keywordsStr] = line.split(",");
      if (!icon || !keywordsStr) return;
      const keywords = keywordsStr.split(";").map(k => k.trim().toLowerCase());
      ICON_DICTIONARY_FA5[icon.trim()] = keywords;
    });
    console.log("✅ Icons CSV loaded:", Object.keys(ICON_DICTIONARY_FA5).length);
  } catch (err) {
    console.error("⚠️ Failed to load icon CSV:", err);
  }
}

// Updated getServiceIcon to use CSV-loaded dictionary
function getServiceIcon(title = "") {
  const t = (title || "").toLowerCase().trim();
  for (const iconClass in ICON_DICTIONARY_FA5) {
    const keywords = ICON_DICTIONARY_FA5[iconClass];
    if (keywords.some(k => t.includes(k))) {
      return `fa ${iconClass} fa-2x text-dark`;
    }
  }
  return "fa fa-cog fa-2x text-dark";
}

// Example: call once at startup
loadIconCSV("/personal-portfolio-html-template/fa5_icons_1000.csv"); // <- put your CSV path here



function displayService(serviceList = []) {
  const serviceContainer = document.getElementById("serviceListContainer05");
  if (!serviceContainer) return console.warn("⚠️ serviceListContainer05 not found in DOM.");

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
      <div class="serviced-itemed">
        <div class="bg-icon flex-shrink-0 mb-3">
          <i class="${icon}"></i>
        </div>
        <div class="ms-sm-4">
          <h4 class="mb-3">${title}</h4>
          <h6 class="mb-3">Start From: <span class="textprice">$${price}</span></h6>
          <h6 class="mb-3">
            Service Experience: <span class="textunit">${durationDigits}  Years</span>
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






/* -------------------- Project Display -------------------- */
function displayProject(projectList = []) {
  const grid = document.getElementById("projectGrid");
  const filters = document.getElementById("projectFilters");
  if (!grid) return console.warn("⚠️ projectGrid not found in DOM.");

  grid.innerHTML = "";
  filters.innerHTML = "";

  if (!projectList || !projectList.length) {
    grid.innerHTML = `
      <div class="col-12 text-center">
        <p class="text-muted mb-0">No projects found.</p>
      </div>
    `;
    return;
  }

  // ✅ Get unique categories for filters
  const categories = [...new Set(projectList.map(p => p.category || "General"))];

  // Add "All Projects" button first
  const allBtn = document.createElement("li");
  allBtn.className = "list-inline-item mx-2";
  allBtn.innerHTML = `<button class="btn btn-outline-primary px-3 py-1 active" data-category="All">All Projects</button>`;
  allBtn.querySelector("button").addEventListener("click", () => {
    $$(`#projectFilters button`).forEach(btn => btn.classList.remove("active"));
    allBtn.querySelector("button").classList.add("active");
    renderProjects("All");
  });
  filters.appendChild(allBtn);

  // ✅ Render category buttons
  categories.forEach(cat => {
    const li = document.createElement("li");
    li.className = "list-inline-item mx-2";
    li.innerHTML = `<button class="btn btn-outline-primary px-3 py-1" data-category="${cat}">${cat}</button>`;
    li.querySelector("button").addEventListener("click", () => {
      $$(`#projectFilters button`).forEach(btn => btn.classList.remove("active"));
      li.querySelector("button").classList.add("active");
      renderProjects(cat);
    });
    filters.appendChild(li);
  });

  // ✅ Render projects by category
  function renderProjects(filterCat) {
    grid.innerHTML = "";

    const filtered =
      filterCat && filterCat !== "All"
        ? projectList.filter(p => (p.category || "General") === filterCat)
        : projectList;

    filtered.forEach((project, i) => {
      const title = safe(project.projectName || "Untitled Project");
      const img = safe(project.imageUrl || "img/default-project.jpg");
      const link = safe(project.projectUrl || "#");
      const category = safe(project.category || "General");

      const col = document.createElement("div");
      col.className = "col-lg-4 col-md-6 wow fadeInUp portfolio-item";
      col.setAttribute("data-wow-delay", `${(i * 0.1).toFixed(1)}s`);
      col.setAttribute("data-category", category);

      col.innerHTML = `
        <div class="portfolio-img rounded overflow-hidden">
          <img class="img-fluid" src="${img}" alt="${title}">
          
          <div class="portfolio-btn position-absolute top-50 start-50 translate-middle text-center">
            <a href="${img}" data-lightbox="portfolio" class="btn btn-lg-square btn-outline-secondary border-2 mx-1">
              <i class="fa fa-eye"></i>
            </a>

            <a href="${link}" target="_blank" class="btn btn-lg-square btn-outline-secondary border-2 mx-1">
              <i class="fa fa-link"></i>
            </a>
            <br>
            <h6 class="prohd" id="ticolor">${title}</h6>

          </div>
          
          <div class="backbottom">
            <h6 class="mb-0" id="ticolor">${title}</h6>
          </div>
        </div>
      `;

      grid.appendChild(col);
    });
  }



  // ✅ Initial render (show all)
  renderProjects("All");
}


/* -------------------- Professionality Display -------------------- */
function displayProfessionality(professionality) {
  if (!professionality) return;

  // Update main professionality fields
  $("#Years").textContent = safe(professionality.years || professionality.Years || "1");
  $("#professionInput").textContent = safe(professionality.profession || professionality.profession || "");
  $("#aboutParagraph").textContent = safe(professionality.aboutParagraph || "With a broad history of professional work across diverse roles and industries, I have built a reputation for reliability, adaptability, and consistent results. My experience reflects a long-term commitment to excellence, problem-solving, and continuous growth—delivering value through skilled execution and a strong, disciplined work ethic.");
  $("#aboutPara2").textContent = safe(professionality.aboutPara2 || "Our clients consistently express high satisfaction with the quality, professionalism, and reliability of our work. Their positive feedback reflects the trust we build through clear communication, timely delivery, and results that meet or exceed expectations. These long-term relationships highlight our commitment to excellence and our ability to deliver solutions that truly support client success.");
  $("#aboutPara3").textContent = safe(professionality.aboutPara3 || "Our completed projects demonstrate a strong commitment to quality, innovation, and timely execution. Each solution is delivered with strategic planning, modern technology, and a focus on client satisfaction—reflecting our ability to achieve reliable, high-standard results across diverse industries.");
  $("#happyClients").textContent = safe(professionality.happyClients || 120);
  $("#projectsCompleted").textContent = safe(professionality.projectsCompleted || 320);

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

 setTimeout(() => {
  countUp("happyClients");
  countUp("projectsCompleted");
}, 1000);






 

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
  $("#heroName").textContent = safe(personal.Name || personal.fullName || personal.Name || personal.name, "Ali Raza");
  $("#Aboutpera").textContent = safe(personal.Aboutpera || personal.Aboutpera || personal.Aboutpera || personal.aboutpera, "I am a dedicated and versatile professional with a strong focus on quality, creativity, and problem-solving. I adapt quickly, communicate clearly, and take responsibility for delivering meaningful and polished results. With experience across multiple fields, I combine smart thinking with practical execution to turn ideas into impactful outcomes. I am committed to continuous growth and always aim to exceed expectations in every project I handle.");
  $("#heroProfileImg").src = safe(personal.ImageUrl || personal.image || "/Assets/profile.png");
  $("#professionInput").textContent = safe(professionality.profession || professionality.profession || "");
  $("#playVideoBtn").dataset.src = safe(personal.selfVideoUrl || personal.selfVideoUrl || "");
  

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
      <h6 class="font-weight-bold"><span class="percent">0</span>%</h6>
    </div>
    <div class="progress">
      <div class="progress-bar ${progressBarClass(i)}" role="progressbar" style="width: 0%;" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
  `;
  if (i % 2 === 0) leftCol.appendChild(node); else rightCol.appendChild(node);
});

skillsColumns.appendChild(leftCol);
skillsColumns.appendChild(rightCol);

// Animate when skill section is visible
const skillSection = document.getElementById("skill");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll(".skill").forEach(skill => {
        const bar = skill.querySelector(".progress-bar");
        const percentEl = skill.querySelector(".percent");
        const target = parseInt(bar.getAttribute("aria-valuenow")) || 80;
        let current = 0;
        const speed = 15; // smaller = faster
        const anim = setInterval(() => {
          if (current >= target) {
            clearInterval(anim);
            bar.style.width = target + "%";
            percentEl.textContent = target;
          } else {
            current++;
            bar.style.width = current + "%";
            percentEl.textContent = current;
          }
        }, speed);
      });
      observer.unobserve(skillSection); // trigger only once
    }
  });
}, { threshold: 0.3 }); // 30% visible

observer.observe(skillSection);


  // EXPERIENCE (tab-1)
  const expWrap = $("#experienceTab");
  expWrap.innerHTML = "";
  if (Array.isArray(experience) && experience.length) {
    experience.forEach(exp => {
      const col = document.createElement("div");
      col.className = "col-sm-6";
      col.innerHTML = `
        <h5 class"exptittle">${safe(exp.organizationPosition || exp.title || exp.position || exp.role, "Position")}</h5>
        <hr class="exptittle my-2">
        <p class="exptime mb-1">${safe(exp.durationNumber || exp.number || exp.from || "")} - ${safe(exp.durationUnit || exp.unit || exp.from || "")}</p>
        <h6 class="exporg">${safe(exp.organizationName || exp.company || exp.org || "")}</h6>
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
        <h5 class"exptittle">${safe(ed.Degree || ed.degree || ed.Title || ed.title || "Degree")}</h5>
        <hr class="text-primary my-2">
        <p class="exptime mb-1">${safe(ed.Startyear || ed.start || "")} - ${safe(ed.Endyear || ed.end || "")}</p>
        <h6 class="exporg">${safe(ed.Name || ed.institute || ed.school || ed.place || "")}</h6>
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
    <p>${safe(professionality.Aboutperagraph || "")}</p>
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








function repeatField(value, selectorList) {
  selectorList.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.textContent = value || "Ali Raza";
  });
}
repeatField(personal.Name, ["#heroName", "#heroName2", "#heroName3", "#heroName4"]);





function repeatImageById(imgSrc, selectorList) {
  if (!imgSrc) return; // do nothing if no source
  selectorList.forEach(sel => {
    const el = document.querySelector(sel);
    if (el && el.tagName.toLowerCase() === "img") {
      el.src = imgSrc;

    }
  });
}

// Usage
repeatImageById(professionality.ProfilePhoto, ["#profilePhoto", "#profilePhoto2", "#profilePhoto3", "#profilePhoto4"]);

repeatImageById(personal.ImageUrl, ["#heroProfileImg", "#heroProfileImg2", "#heroProfileImg3", "#heroProfileImg4"]);









// CONTACT
$("#contactOffice").textContent = safe(
  personal.Busaddress || personal.address || "123 Street, New York, USA"
);
$("#contactPhone").textContent = safe(
  personal.BusNumber || personal.Phone || personal.mobile
    ? "+" + (personal.BusNumber || personal.Phone || personal.mobile).replace(/\D/g,'-')
    : "+012-3456789"
);

$("#contactEmail").textContent = safe(
  personal.Busemail || personal.email || "info@example.com"
);

// social links (DISPLAY SECTION – NOT TOUCHED)
const socialWrap = $("#socialLinks");
socialWrap.innerHTML = "";

// clean WhatsApp number → remove "+" space, dash, brackets
const cleanWN = personal.BusNumber
  ? String(personal.BusNumber).replace(/[^0-9]/g, "")
  : "";

// Build social links (your structure same)
const socials = {
  whatsapp: cleanWN ? `https://wa.me/${cleanWN}` : "",
  facebook:  personal.Busfacebooks,
  instagram: personal.Instagram,
  linkedin:  personal.Buslinkedin,
  twitter:   personal.Twitter,
  github:    personal.Github,
  youtube:   personal.Youtube
};

if (typeof socials === "object" && Object.keys(socials).length) {
  for (const [k, v] of Object.entries(socials)) {
    if (!v) continue;

    const a = document.createElement("a");
    a.className = "btn btn-square btn-primary me-2";
    a.target = "_blank";

    // ---------------- FIXED WHATSAPP DESKTOP & WEB ----------------
    if (k === "whatsapp") {
      const cleanWN = v.replace(/\D/g, ""); // keep digits only
      const msg = encodeURIComponent(
  "Hello, I am a visitor from your portfolio website. I would like to discuss a potential collaboration or work opportunity with you. Please let me know when we can connect."
      );

      // unique timestamp to force fresh chat each click
      a.href = `https://api.whatsapp.com/send?phone=${cleanWN}&text=${msg}&t=${Date.now()}`;
      a.onclick = (e) => {
        e.preventDefault();
        window.open(a.href, "_blank"); // open new window each click
      };

      a.innerHTML = `<i class="fab fa-whatsapp"></i>`;
      socialWrap.appendChild(a);
      continue;
    }
    // ---------------------------------------------------------------

    a.href = v;
    a.innerHTML = `<i class="fab fa-${k}"></i>`;
    socialWrap.appendChild(a);
  }


} else {
  socialWrap.innerHTML = `
    <a class="btn btn-square btn-primary me-2" href="#"><i class="fab fa-twitter"></i></a>
    <a class="btn btn-square btn-primary me-2" href="#"><i class="fab fa-facebook-f"></i></a>
    <a class="btn btn-square btn-primary me-2" href="#"><i class="fab fa-youtube"></i></a>
    <a class="btn btn-square btn-primary me-2" href="#"><i class="fab fa-linkedin-in"></i></a>
  `;
}

// // SITE NAME & DESIGNER
// $("#siteName").textContent = safe(personal.siteName || "Your Site Name");
// $("#siteDesigner").textContent = safe(personal.siteDesigner || "HTML Codex");

// initialize typed.js if available
initTyped();

// setup play video modal behaviour
setupVideoModal();

// show notice if provided
if (notice) {
  console.info(notice);
}
}

function progressBarClass(i) {
  const classes = [
    "bg-primary",
    "bg-warning",
    "bg-danger",
    "bg-dark",
    "bg-info",
    "bg-success",
    "bg-teal",
    "bg-orange"
  ];

  return classes[i % classes.length];
}
// ------------------ INIT TYPED ------------------
function initTyped() {
  const typedOutput = document.getElementById("typedOutput");
  const professionInput = document.getElementById("professionInput");
  if (!typedOutput || !professionInput) return;

  if (window.Typed) {
    if (window.__appTyped) window.__appTyped.destroy();

    window.__appTyped = new Typed("#typedOutput", {
      strings: professionInput.textContent.split(",").map(s => s.trim()),
      typeSpeed: 60,
      backSpeed: 35,
      backDelay: 1600,
      loop: true
    });
  }
}

// ------------------ VIDEO MODAL ------------------
function setupVideoModal(personalVideoUrl = "") {
  const playBtn = document.getElementById("playVideoBtn");
  const videoIframe = document.getElementById("video");
  const modalEl = document.getElementById("videoModal");

  if (!playBtn || !videoIframe || !modalEl) return;

  if (personalVideoUrl) {
    playBtn.dataset.src = personalVideoUrl;
  }

  modalEl.addEventListener("show.bs.modal", () => {
    if (playBtn.dataset.src) {
      videoIframe.src = playBtn.dataset.src + "?autoplay=1&rel=0";
    }
  });

  modalEl.addEventListener("hidden.bs.modal", () => {
    videoIframe.src = "";
  });
}

// ------------------ FIREBASE FETCH ------------------
async function loadPersonalData() {
  const data = await fetchUser(); // your existing function
  if (!data) return;

  const personal = data.personal || {};

  initTyped();
  setupVideoModal(personal.selfVideoUrl || "");
}

// ------------------ START ------------------
loadPersonalData();

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
  
  };
}








