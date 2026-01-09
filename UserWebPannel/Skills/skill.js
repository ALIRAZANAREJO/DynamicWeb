const skillsList = ["HTML","CSS","JavaScript","Python","Node.js","React","SQL","Java","C++"];
let selectedSkills = JSON.parse(localStorage.getItem("skills")) || {};

const input = document.getElementById("searchInput");
const dropdown = document.getElementById("dropdown");
const selectedContainer = document.getElementById("selectedContainer");

// Render selected skills
function renderSkills() {
  selectedContainer.innerHTML = "";
  Object.keys(selectedSkills).forEach(skill => {
    let tag = document.createElement("div");
    tag.className = "skill-tag";
    tag.innerHTML = `
      <span>${skill}</span>
      <input type="text" value="${selectedSkills[skill]}" maxlength="4">
    `;
    let inputBox = tag.querySelector("input");
    inputBox.addEventListener("input", () => {
      selectedSkills[skill] = inputBox.value;
    });
    selectedContainer.appendChild(tag);
  });
}
renderSkills();

// Search filter
input.addEventListener("input", () => {
  let val = input.value.toLowerCase();
  dropdown.innerHTML = "";
  if (val) {
    let filtered = skillsList.filter(skill => skill.toLowerCase().includes(val));
    dropdown.style.display = filtered.length ? "block" : "none";
    filtered.forEach(skill => {
      let div = document.createElement("div");
      div.textContent = skill;
      div.onclick = () => {
        if (!selectedSkills[skill]) selectedSkills[skill] = "100%";
        renderSkills();
        input.value = "";
        dropdown.style.display = "none";
      };
      dropdown.appendChild(div);
    });
  } else {
    dropdown.style.display = "none";
  }
});

// Save to localStorage
function saveSkills() {
  localStorage.setItem("skills", JSON.stringify(selectedSkills));
  window.location.href = "personal.html"; // go back
}
