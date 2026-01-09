const input = document.getElementById("Paddres");

// Hide real input
input.style.opacity = "0";
input.style.position = "absolute";
input.style.pointerEvents = "none";

// Containers
const selectedContainer = document.createElement("div");
selectedContainer.className = "selected-container";
input.parentNode.insertBefore(selectedContainer, input);

const dropdown = document.createElement("div");
dropdown.className = "dropdown";
input.parentNode.appendChild(dropdown);

let selectedLanguages = [];
let languages = []; // Will load from CSV

// Load CSV dynamically (replace 'languages.csv' with your CSV file path)
Papa.parse("languages.csv", {
    download: true,
    header: true,
    complete: function(results) {
        // Assuming your CSV has a column named 'Language'
        languages = results.data.map(row => row.Language).filter(Boolean);
        console.log("Loaded languages:", languages.length);
    }
});

// Update hidden input value
function updateInputValue() {
    input.value = selectedLanguages.join(", ");
}

// Render tags
function renderTags() {
    selectedContainer.innerHTML = "";
    selectedLanguages.forEach(lang => {
        const tag = document.createElement("div");
        tag.className = "tag";
        tag.innerHTML = `${lang} <span onclick="removeLanguage('${lang}')">&times;</span>`;
        selectedContainer.appendChild(tag);
    });
}

// Add language
function addLanguage(lang) {
    if (!selectedLanguages.includes(lang)) {
        selectedLanguages.push(lang);
        renderTags();
        updateInputValue();
    }
    searchInput.value = "";
    dropdown.style.display = "none";
}

// Remove language
function removeLanguage(lang) {
    selectedLanguages = selectedLanguages.filter(l => l !== lang);
    renderTags();
    updateInputValue();
}

// Search input
const searchInput = document.createElement("input");
searchInput.type = "text";
searchInput.placeholder = "Search languages...";
searchInput.style.width = "100%";
searchInput.style.padding = "8px";
searchInput.style.marginBottom = "5px";
searchInput.style.boxSizing = "border-box";
selectedContainer.parentNode.insertBefore(searchInput, selectedContainer.nextSibling);

// Handle search
searchInput.addEventListener("input", function () {
    const value = this.value.toLowerCase();
    dropdown.innerHTML = "";
    if (!value) { dropdown.style.display = "none"; return; }

    const filtered = languages.filter(l => l.toLowerCase().includes(value));
    filtered.forEach(l => {
        const option = document.createElement("div");
        option.className = "dropdown-item";
        option.textContent = l;
        option.onclick = () => addLanguage(l);
        dropdown.appendChild(option);
    });
    dropdown.style.display = filtered.length ? "block" : "none";
});

// Handle Enter
searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && dropdown.firstChild) {
        e.preventDefault();
        addLanguage(dropdown.firstChild.textContent);
    }
});
