(function () {
  const input = document.getElementById("searchInput");
  const skills = [
    "👋🏻Hey User😍, Welcome💖 to Skills Platform✨ . ",
    "Here 🫵🏻 can search☃️ and select the world’s most popular⭐ skills.",
    "Here you select Global🌍 10,000+🔥 🥳skills available.",
    "⚠️Be careful selecting your skills because☠️ your selected skill will display on your CV💙 and portfolio.",
    "Start exploring🧠 now and showcase your expertise.",
    "All fields🌱 with their available skills for professional growth.",
    "💻 Computer Science",
    "🏗️ Engineering",
    "🩺 Medical",
    "💼 Business & Management",
    "⚖️ Law",
    "🎨 Arts & Humanities",
    "📚 Education & Teaching",
    "🔬 Natural Sciences",
    "📐 Mathematics & Statistics",
    "🌐 Social Sciences",
    "💰 Economics & Finance",
    "🧠 Psychology",
    "🏛️ Architecture & Design",
    "🌱 Environmental Science",
    "🌾 Agriculture & Forestry",
    "💊 Pharmacy",
    "🩹 Nursing & Allied Health",
    "🎥 Media",
    "🏨 Hospitality & Tourism Management",
    "🌍 Public Policy & International Relations"
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let running = true;
  let timer = null;

  const TYPE_SPEED = 50;
  const DELETE_SPEED = 30;
  const HOLD_TIME = 900;

  function clearTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function typeLoop() {
    if (!running) return;

    const text = skills[wordIndex];

    // color logic
    input.classList.toggle("autotype-red", wordIndex === 3);

    if (!deleting) {
      charIndex++;
      input.placeholder = text.slice(0, charIndex);

      if (charIndex === text.length) {
        timer = setTimeout(() => (deleting = true), HOLD_TIME);
      }
    } else {
      charIndex--;
      input.placeholder = text.slice(0, charIndex);

      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % skills.length;
      }
    }

    timer = setTimeout(typeLoop, deleting ? DELETE_SPEED : TYPE_SPEED);
  }

  function stopAuto() {
    running = false;
    clearTimer();
    input.placeholder = "";
    input.classList.remove("blink");
  }

  function restartAuto() {
    if (input.value.trim() !== "") return;
    clearTimer();
    running = true;
    charIndex = 0;
    deleting = false;
    typeLoop();
  }

  input.addEventListener("focus", stopAuto);
  input.addEventListener("input", stopAuto);

  document.addEventListener("click", () => {
    if (document.activeElement !== input) restartAuto();
  });

  window.addEventListener("load", () => {
    clearTimer();
    typeLoop();
  });
})();
