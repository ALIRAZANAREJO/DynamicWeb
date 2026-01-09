// CV Design Selection JS
const cards = document.querySelectorAll(".cv-card");
const continueBtn = document.getElementById("continueBtn");
let selectedDesign = null;

// Click on any card
cards.forEach(card => {
  card.addEventListener("click", () => {
    // Remove previous selection
    cards.forEach(c => c.classList.remove("selected"));
    // Add highlight to clicked card
    card.classList.add("selected");

    // Enable Continue button
    continueBtn.disabled = false;
    selectedDesign = card.dataset.design;
  });
});

// Continue button click
continueBtn.addEventListener("click", () => {
  if (!selectedDesign) return;

  // Store selected design in localStorage
  localStorage.setItem("selectedCVDesign", selectedDesign);

  // Redirect to CV preview page
  window.location.href = "/UserWebPannel/CV/Cv03.html";
});
