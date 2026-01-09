// ===================== Projected Multi-Select =====================

function setupProjectedMultiSelect(inputId, items) {
  const input = document.getElementById(inputId);

  // Hide real input (for saving only)
  input.style.opacity = "0px";
  input.style.position = "absolute";
  input.style.pointerEvents = "none";

  // Containers
  const selectedContainer = document.createElement("div");
  selectedContainer.className = "selected-container";
  input.parentNode.insertBefore(selectedContainer, input);

  const dropdown = document.createElement("div");
  dropdown.className = "dropdown";
  input.parentNode.appendChild(dropdown);

  let selectedItems = [];
  let filteredItems = [];
  let highlightedIndex = -1;

  // Update hidden input for Firebase saving
  function updateInputValue() {
    input.value = selectedItems.join(", ");
  }

  // Render tags
  function renderTags() {
    selectedContainer.innerHTML = "";
    selectedItems.forEach(item => {
      const tag = document.createElement("div");
      tag.className = "tag";
      tag.textContent = item;

      const removeBtn = document.createElement("span");
      removeBtn.textContent = "×";
      removeBtn.onclick = () => removeItem(item);
      tag.appendChild(removeBtn);

      selectedContainer.appendChild(tag);
    });
    updateInputValue();
  }

  // Add item
  function addItem(item) {
    if (!selectedItems.includes(item)) {
      selectedItems.push(item);
      renderTags();
    }
    searchInput.value = "";
    dropdown.style.display = "none";
    highlightedIndex = -1;
  }

  // Remove item
  function removeItem(item) {
    selectedItems = selectedItems.filter(i => i !== item);
    renderTags();
  }

  // Render dropdown
  function renderDropdown() {
    dropdown.innerHTML = "";
    filteredItems.forEach((item, index) => {
      const option = document.createElement("div");
      option.textContent = item;
      if (index === highlightedIndex) {
        option.classList.add("highlighted");
      }
      option.onclick = () => addItem(item);
      dropdown.appendChild(option);
    });
    dropdown.style.display = filteredItems.length ? "block" : "none";
  }

  // Visible search input
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search Projecteds...";
  searchInput.className = "search-box";
  selectedContainer.parentNode.insertBefore(searchInput, selectedContainer.nextSibling);

  // Handle typing
  searchInput.addEventListener("input", function () {
    const value = this.value.toLowerCase();
    highlightedIndex = -1;
    if (!value) {
      dropdown.style.display = "none";
      filteredItems = [];
      return;
    }
    filteredItems = items.filter(i => i.toLowerCase().includes(value));
    renderDropdown();
  });

  // Handle keys (Enter + Arrow nav + Esc)
  searchInput.addEventListener("keydown", function (e) {
    if (!filteredItems.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      highlightedIndex = (highlightedIndex + 1) % filteredItems.length;
      renderDropdown();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      highlightedIndex = (highlightedIndex - 1 + filteredItems.length) % filteredItems.length;
      renderDropdown();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        addItem(filteredItems[highlightedIndex]);
      } else {
        addItem(filteredItems[0]);
      }
    } else if (e.key === "Escape") {
      dropdown.style.display = "none";
      highlightedIndex = -1;
    }
  });

  // Close dropdown on outside click
  document.addEventListener("click", function (e) {
    if (!dropdown.contains(e.target) && !searchInput.contains(e.target)) {
      dropdown.style.display = "none";
      highlightedIndex = -1;
    }
  });
}

// ===================== Initialize Projecteds =====================
setupProjectedMultiSelect("projectedInput", [
"Web Developer","Software Engineer","Frontend Developer","Backend Developer","Full Stack Developer",
"Mobile App Developer","Game Developer","Data Scientist","Machine Learning Engineer","AI Specialist",
"UI/UX Designer","Graphic Designer","Product Designer","Interior Designer","Fashion Designer",
"Architect","Civil Engineer","Mechanical Engineer","Electrical Engineer","Chemical Engineer",
"Aerospace Engineer","Biomedical Engineer","Environmental Engineer","Industrial Engineer","Automotive Engineer",
"Doctor","Surgeon","Dentist","Pharmacist","Nurse","Veterinarian","Optometrist","Psychologist","Therapist",
"Teacher","Professor","Lecturer","Tutor","Lawyer","Judge","Police Officer","Firefighter","Chef","Plumber",
"Electrician","Carpenter","Photographer","Videographer","Journalist","Actor","Musician","Painter","Author",
"Translator","Librarian","Economist","Banker","Accountant","Marketer","Sales Executive","HR Manager",
"Business Consultant","Project Manager","Cybersecurity Specialist","Data Analyst","IT Support","Network Engineer",
"System Administrator","UI Tester","QA Engineer","Cloud Architect","AI Researcher","Software Tester",
"Entrepreneur","Event Planner","Tour Guide","Hotel Manager","Mechanic","Driver","Security Guard","Tailor",
"Beautician","Fashion Stylist","Fitness Trainer","Yoga Instructor","Social Worker","Politician","Journalist"
]);
