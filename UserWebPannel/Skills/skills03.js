const skillsList = ["HTML","CSS","JavaScript","Python","Node.js","React","SQL","Java","C++"];
let selectedSkills = JSON.parse(localStorage.getItem("selectedSkills")) || [];

const input = document.getElementById("searchInput");
const dropdown = document.getElementById("dropdown");
const selectedContainer = document.getElementById("selectedContainer");

// Render selected skills
function renderSkills() {
    selectedContainer.innerHTML = "";
    selectedSkills.forEach(skillObj => {
        const skill = skillObj.name;
        const percent = skillObj.percent || "100%";

        const tag = document.createElement("div");
        tag.className = "skill-tag";
        tag.innerHTML = `
            <span>${skill}</span>
            <input type="text" value="${percent}" maxlength="4">
            <span class="remove-btn">×</span>
        `;

        // Update percent
        tag.querySelector("input").addEventListener("input", e => {
            skillObj.percent = e.target.value;
        });

        // Remove skill
        tag.querySelector(".remove-btn").addEventListener("click", () => {
            selectedSkills = selectedSkills.filter(s => s.name !== skill);
            renderSkills();
        });

        selectedContainer.appendChild(tag);
    });
}
renderSkills();

// Search filter
input.addEventListener("input", () => {
    const val = input.value.toLowerCase();
    dropdown.innerHTML = "";
    if (val) {
        const filtered = skillsList.filter(skill => skill.toLowerCase().includes(val));
        dropdown.style.display = filtered.length ? "block" : "none";
        filtered.forEach(skill => {
            const div = document.createElement("div");
            div.textContent = skill;
            div.onclick = () => {
                if (!selectedSkills.find(s => s.name === skill)) {
                    selectedSkills.push({ name: skill, percent: "100%" });
                }
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

// Save to localStorage and go back
function saveSkills() {
    localStorage.setItem("selectedSkills", JSON.stringify(selectedSkills));
    alert("Skills saved! You can now submit personal data.");
    // Go back to personal page (adjust filename if needed)
    // window.location.href = "personal.html";
}

// Bind button click
document.getElementById("submitBtn").addEventListener("click", saveSkills);