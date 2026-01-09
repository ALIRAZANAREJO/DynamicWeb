// === UPDATED PROFILE IMAGES + NAMES – AR TECHNOLOGY ===

// Inject Styles (same as before)
const style = document.createElement("style");
style.innerHTML = `
@import url('https://fonts.cdnfonts.com/css/sf-pro-display');

*{
  margin:0; padding:0; box-sizing:border-box;
  font-family: 'SF Pro Display', sans-serif;
}

body{
  background: radial-gradient(circle at 20% 20%, #7b2ff7, #4f2ddf, #1f1f3a);
  min-height:100vh;
  padding:60px 20px;
  display:flex;
  align-items:center;
  justify-content:center;
}

.testimonial-wrapper{
  max-width:1300px;
  width:100%;
  display:grid;
  gap:25px;
  grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));
}

.carded{
  backdrop-filter: blur(18px);
  background: rgba(255,255,255,0.08);
  border:1px solid rgba(255,255,255,0.1);
  padding:25px;
  border-radius:22px;
  color:white;
  transition:0.35s ease;
  box-shadow:0 0 35px rgba(0,0,0,0.25);
  position:relative;
}

.carded:hover{
  transform:translateY(-8px) scale(1.02);
  box-shadow:0 10px 45px rgba(132,0,255,0.55);
}

.cardeded.top{
  display:flex;
  align-items:center;
  gap:14px;
  margin-bottom:15px;
}

.carded.top img{
  width:55px;
  height:55px;
  border-radius:50%;
  object-fit:cover;
  border:2px solid rgba(255,255,255,0.3);
}

.carded.name{
  font-size:1.1rem;
  font-weight:600;
}

.carded.role{
  opacity:0.7;
  font-size:0.85rem;
  margin-top:-2px;
}

.rating{
  margin:12px 0;
  color:#38ff8d;
  font-size:0.9rem;
  font-weight:600;
}

.cardedp{
  font-size:0.95rem;
  line-height:1.55;
  color:#e8e8e8;
}

.badge{
  position:absolute;
  top:15px;
  right:15px;
  background:#38ff8d;
  color:black;
  padding:6px 12px;
  border-radius:12px;
  font-size:0.75rem;
  font-weight:600;
}

@media(max-width:600px){
  body{ padding:30px 15px; }
  .card{ padding:20px; }
  .carded.top img{ width:48px; height:48px; }
  .name{ font-size:1rem; }
}
`;
document.head.appendChild(style);


// === UPDATED HTML WITH YOUNG BOYS + GIRLS ===
document.body.innerHTML = `
<div class="testimonial-wrapper">

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
      AR Technology blew my mind. Super modern designs, fast delivery, and a futuristic UI experience. Loved the results!
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
    <p>
      The glass UI feels so premium and aesthetic. Very iPhone-style, extremely smooth and professional. Highly recommended!
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
`;
