document.addEventListener("DOMContentLoaded", () => {
  const tabs = Array.from(document.querySelectorAll(".tab-btn"));
  const contents = Array.from(document.querySelectorAll(".content"));
  const progressCircle = document.getElementById("progress-circle");
  const submitContainer = document.getElementById("submit-container");
  // const submitBtn = document.getElementById("submitBtn");
  const overlay = document.getElementById("overlay");
  const overlayInner = document.getElementById("overlayInner");
  const hamburger = document.getElementById("hamburger");
  const nav = document.querySelector(".nav");

  let currentStep = contents.findIndex(c => c.classList.contains("active"));
  if (currentStep < 0) currentStep = 0;
  const totalSteps = contents.length;
  let submitted = false; // will be set true when submitBtn clicked

  // helper: show step by index
  function showStep(index) {
    // clamp index
    index = Math.max(0, Math.min(index, totalSteps - 1));
    currentStep = index;

    // toggle active classes
    contents.forEach((c, i) => c.classList.toggle("active", i === index));
    tabs.forEach((t, i) => t.classList.toggle("active", i === index));

    // show/hide submit container (after 9th div -> index 8)
    if (totalSteps >= 9 && currentStep >= 8) {
      submitContainer.style.display = "block";
      submitContainer.setAttribute("aria-hidden", "false");
    } else {
      submitContainer.style.display = "none";
      submitContainer.setAttribute("aria-hidden", "true");
    }

    // update progress
    updateProgress();
  }

  // progress UI
  function updateProgress() {
    const percent = Math.round(((currentStep + 1) / totalSteps) * 100);
    const deg = ((currentStep + 1) / totalSteps) * 360;
    // colored 10-segment look using pastel palette
    const colors = [
      "#5c8fff","#f78fb3","#9b6bff","#8bd6ff","#ffb3d1",
      "#70a1ff","#a29bfe","#74b9ff","#81ecec","#fab1a0"
    ];
    const filled = Math.floor(((currentStep + 1) / totalSteps) * 10);
    const parts = [];
    for (let i=0;i<10;i++){
      const start = i*36;
      const end = start+36;
      if (i < filled) parts.push(`${colors[i]} ${start}deg ${end}deg`);
      else parts.push(`rgba(255,255,255,0.5) ${start}deg ${end}deg`);
    }
    progressCircle.style.background = `conic-gradient(${parts.join(", ")})`;
    progressCircle.textContent = `${percent}%`;
  }

  // event delegation for next and back buttons
  document.addEventListener("click", (e) => {
    const el = e.target;

    if (el.matches(".next-btn")) {
      e.preventDefault();
      if (currentStep < totalSteps - 1) {
        showStep(currentStep + 1);
      } else {
        // we're at the last step already — optionally handle end
        showStep(totalSteps - 1);
      }
      return;
    }

    if (el.matches(".back-btn")) {
      e.preventDefault();
      if (currentStep > 0) showStep(currentStep - 1);
      return;
    }
  });

  // tab clicks (optional navigation)
  tabs.forEach((tab, idx) => {
    tab.addEventListener("click", () => {
      showStep(idx);
      // close mobile nav if open
      nav.classList.remove("show");
    });
  });

  // hamburger toggle
  if (hamburger) hamburger.addEventListener("click", () => nav.classList.toggle("show"));

  // Submit container button (outside 9th div)
  // if (submitBtn) {
  //   submitBtn.addEventListener("click", (ev) => {
  //     ev.preventDefault();
  //     // mark submitted and give feedback
  //     submitted = true;
  //     // optional: dim background and show confirmation overlay
  //     overlayInner.innerHTML = `<p style="margin-bottom:12px; font-weight:700;">Data saved successfully.</p>
  //                               <button id="continueBtn" style="padding:10px 16px; border-radius:8px; border:none; background:#006eff; color:#fff; cursor:pointer;">Continue</button>`;
  //     overlay.style.display = "flex";
  //     overlay.setAttribute("aria-hidden", "false");

  //     // Continue button will hide overlay and keep user on same step (or go next)
  //     const continueHandler = (e) => {
  //       overlay.style.display = "none";
  //       overlay.setAttribute("aria-hidden", "true");
  //       // move forward if not at last
  //       if (currentStep < totalSteps - 1) showStep(currentStep + 1);
  //       document.getElementById("continueBtn")?.removeEventListener("click", continueHandler);
  //     };

  //     document.getElementById("continueBtn").addEventListener("click", continueHandler);
  //   });
  // }

  // When user reaches the very last step AND submitted is true -> show "Go to your web" inside overlay-inner
  // We'll watch step changes and if condition true, show special final control
  function checkFinalState() {
    if (currentStep === totalSteps - 1 && submitted) {
      overlayInner.innerHTML = `<p style="margin-bottom:12px; font-weight:700;">All done.</p>
                                <button id="goWebBtn">Go to your web</button>`;
      overlay.style.display = "flex";
      overlay.setAttribute("aria-hidden", "false");

      const goWebBtn = document.getElementById("goWebBtn");
      goWebBtn.addEventListener("click", () => {
        // default behavior: navigate to user's web panel (replace with your URL)
        window.location.href = "/UserWeb01.html";
      });
    }
  }

  // observe step changes to run checkFinalState
  const stepObserver = new MutationObserver(() => {
    // small timeout to allow state update
    setTimeout(() => checkFinalState(), 50);
  });
  // observe class attribute changes on contents container elements
  contents.forEach(c => stepObserver.observe(c, { attributes: true, attributeFilter: ['class'] }));

  // init
  showStep(currentStep);
});
