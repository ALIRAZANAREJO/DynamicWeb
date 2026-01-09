document.addEventListener("DOMContentLoaded", () => {
  const addExperienceBtn = document.getElementById("organizationexperiance");
  const experDocsContainer = document.querySelector(".exper-docs");
  let experienceCount = 1;
  const MAX_EXPERIENCES = 15;

  // Function: Add new document inputs (with unique IDs)
  function addDocumentInputs(rowWrapper, expIndex) {
    const moressDocs = rowWrapper.querySelector(".moress-docs");
    const docCount = moressDocs.querySelectorAll(".extra-docs").length;

    if (docCount >= 2) {
      alert("You can only add up to 2 additional document sets for this experience.");
      return;
    }

    const docIndex = docCount + 1;
    const newDocSet = document.createElement("div");
    newDocSet.className = "extra-docs";
    newDocSet.innerHTML = `
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
    moressDocs.appendChild(newDocSet);
  }

  // Global click handlers
  document.addEventListener("click", (e) => {
    // Add new documents to specific experience
    if (e.target.classList.contains("more-doc")) {
      const rowWrapper = e.target.closest(".exp-row-wrapper");
      const expIndex = rowWrapper.getAttribute("data-exp-index");
      addDocumentInputs(rowWrapper, expIndex);
    }

    // Remove a document
    if (e.target.classList.contains("remove-doc")) {
      e.target.closest(".extra-docs").remove();
    }

    // Remove an experience
    if (e.target.classList.contains("remove-experience")) {
      const row = e.target.closest(".exp-row-wrapper");
      row.classList.add("fade-out");
      setTimeout(() => row.remove(), 400);
      experienceCount--;
    }
  });

  // Add new experience row
  addExperienceBtn.addEventListener("click", () => {
    if (experienceCount >= MAX_EXPERIENCES) {
      alert("You can only add up to 15 experiences.");
      return;
    }

    experienceCount++;

    if (experienceCount === 6) {
      alert(
        "Hey user, you filled 5 experiences. These experiences will show in your CV.\n" +
        "If you add more, please prioritize your top 5 important experiences.\n\n" +
        "You can still fill up to 15 experiences."
      );
    }

    const expIndex = experienceCount;
    const newRow = document.createElement("div");
    newRow.className = "exp-row-wrapper";
    newRow.setAttribute("data-exp-index", expIndex);

    newRow.innerHTML = `
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

        <div class="moress-docs"></div>
        <button type="button" class="more-doc">+ Add New Documents</button>
        <button type="button" class="remove-experience">🗑️ Remove Experience</button>
      </div>
    `;
    experDocsContainer.appendChild(newRow);
  });
});
