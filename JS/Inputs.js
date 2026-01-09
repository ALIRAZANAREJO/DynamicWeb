function setupMultiSelect(inputId, items) {
  const input = document.getElementById(inputId);
  input.style.opacity = "0";
  input.style.position = "absolute";
  input.style.pointerEvents = "none";

  const selectedContainer = document.createElement("div");
  selectedContainer.className = "selected-container";
  input.parentNode.insertBefore(selectedContainer, input.nextSibling);

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = inputId === "Paddres" ? "Search languages..." : "Search hobbies...";
  searchInput.className = "search-box";
  selectedContainer.parentNode.insertBefore(searchInput, selectedContainer.nextSibling);

  const dropdown = document.createElement("div");
  dropdown.className = "dropdown";
  input.parentNode.appendChild(dropdown);

  let selectedItems = [];
  let filteredItems = [];
  let highlightedIndex = -1;

  function updateInputValue() {
    input.value = selectedItems.join(", ");
  }

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

    const baseHeight = 50;
    const extra = Math.min(selectedContainer.scrollHeight, 100);
    selectedContainer.parentNode.style.height = baseHeight + extra + "px";
    updateInputValue();
  }

  function addItem(item) {
    if (!selectedItems.includes(item)) {
      selectedItems.push(item);
      renderTags();
    }
    searchInput.value = "";
    dropdown.style.display = "none";
    highlightedIndex = -1;
  }

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

    // Apply unified highlight for hover and keyboard
    if (index === highlightedIndex) {
      option.classList.add("highlighted");
    }

    option.addEventListener("mouseenter", () => {
      highlightedIndex = index;
      renderDropdown();
    });

    option.onclick = () => addItem(item);
    dropdown.appendChild(option);
  });

  dropdown.style.display = filteredItems.length ? "block" : "none";

  // Auto-scroll selected option into view
  const highlighted = dropdown.querySelector(".highlighted");
  if (highlighted) {
    highlighted.scrollIntoView({
      block: "nearest",
      behavior: "smooth"
    });
  }
}


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
      if (highlightedIndex >= 0) addItem(filteredItems[highlightedIndex]);
    } else if (e.key === "Escape") {
      dropdown.style.display = "none";
      highlightedIndex = -1;
    }
  });

  document.addEventListener("click", function (e) {
    if (!dropdown.contains(e.target) && !searchInput.contains(e.target)) {
      dropdown.style.display = "none";
      highlightedIndex = -1;
    }
  });
}

setupMultiSelect("Paddres", ["Zaza", "Zyphe Chin", "Zuojiang Zhuang", "Ghotuo"]);
setupMultiSelect("Qual", ["Reading", "Writing", "Painting", "Sketching", "Photography", "Hiking", "Cycling"]);
