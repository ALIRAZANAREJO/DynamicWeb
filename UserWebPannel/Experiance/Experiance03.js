document.addEventListener("DOMContentLoaded", () => {
  const addExperienceBtn = document.getElementById("organizationexperiance");
  const experDocsContainer = document.querySelector(".exper-docs");
  let experienceCount = 1;
  const MAX_EXPERIENCES = 15;

  // Function: Create Experience HTML
  function createExperienceHTML(expIndex) {
    return `
      <div class="exp-row-wrapper" data-exp-index="${expIndex}">
        <div class="exp-row">
          <div class="exp-group">
            <input type="text" id="Organizationname_${expIndex}" class="exp-input" placeholder=" " required />
            <label class="exp-label" for="Organizationname_${expIndex}">Organization Name</label>
          </div>

          <div class="exp-group">
            <select id="Organizationunit_${expIndex}" class="exp-input" required>
              <option value="" disabled selected></option>
              <option value="Months">Months</option>
              <option value="Years">Years</option>
            </select>
            <label class="exp-label" for="Organizationunit_${expIndex}">Month Or Year</label>
          </div>

          <div class="exp-group">
            <input type="number" id="Organizationduration_${expIndex}" class="exp-input" placeholder=" " required />
            <label class="exp-label" for="Organizationduration_${expIndex}">Duration Number</label>
          </div>

          <div class="exp-group file-group">
            <input type="file" id="Organizationidentity_${expIndex}" class="exp-input" required />
            <label class="exp-label" for="Organizationidentity_${expIndex}">ID Card</label>
          </div>
        </div>

        <div class="moress-docs"></div>
        <button type="button" class="more-doc" data-exp="${expIndex}">+ Add New Documents</button>
        <button type="button" class="remove-experience">🗑️ Remove Experience</button>
      </div>
    `;
  }

  // Function: Create MoreDoc HTML
  function createMoreDocHTML(expIndex, docIndex) {
    return `
      <div class="exp-row">
        <div class="exp-group">
          <input type="text" id="moredocname_${expIndex}_${docIndex}" class="exp-input" placeholder=" " required>
          <label class="exp-label" for="moredocname_${expIndex}_${docIndex}">Document Name</label>
        </div>

        <div class="exp-group file-group">
          <input type="file" id="moredocpdf_${expIndex}_${docIndex}" class="exp-input" required>
          <label class="exp-label" for="moredocpdf_${expIndex}_${docIndex}">Choose Img Or PDF</label>
        </div>

        <button type="button" class="remove-doc">🗑️ Remove</button>
      </div>
    `;
  }

  // Add new Experience
  addExperienceBtn.addEventListener("click", () => {
    if (experienceCount >= MAX_EXPERIENCES) {
      alert(`Maximum ${MAX_EXPERIENCES} experiences allowed.`);
      return;
    }
    experienceCount++;
    experDocsContainer.insertAdjacentHTML("beforeend", createExperienceHTML(experienceCount));
  });

  // Event delegation for Add MoreDoc + Remove
  experDocsContainer.addEventListener("click", (e) => {
    // Add MoreDoc
    if (e.target.classList.contains("more-doc")) {
      const expIndex = e.target.dataset.exp;
      const moressDocsContainer = e.target.previousElementSibling;
      const docIndex = moressDocsContainer.querySelectorAll(".exp-row").length + 1;
      moressDocsContainer.insertAdjacentHTML("beforeend", createMoreDocHTML(expIndex, docIndex));
    }

    // Remove Experience
    if (e.target.classList.contains("remove-experience")) {
      e.target.closest(".exp-row-wrapper").remove();
    }

    // Remove Document
    if (e.target.classList.contains("remove-doc")) {
      e.target.closest(".exp-row").remove();
    }
  });
});
