// ------------------- Full Fixed Project JS -------------------
document.addEventListener("DOMContentLoaded", () => {
  const addProjectBtn = document.getElementById("organizationprojected");
  const projectDocsContainer = document.querySelector(".prod-docs");
  let nextProjectIndex = 1;
  const MAX_PROJECTS = 15;
  const MAX_DOCS_PER_PROJECT = 2;

  if (!projectDocsContainer) {
    console.warn(".prod-docs container not found — dynamic Projects may not render.");
  }

  // ---------- Add Dynamic Project Row ----------
  if (addProjectBtn) {
    addProjectBtn.addEventListener("click", () => {
      const existing = document.querySelectorAll('.pro-row-wrapper[data-pro-index]');
      if (existing.length >= MAX_PROJECTS) {
        alert("You can only add up to 15 Projects.");
        return;
      }

      let candidate = nextProjectIndex;
      while (document.querySelector(`.pro-row-wrapper[data-pro-index="${candidate}"]`)) {
        candidate++;
      }
      nextProjectIndex = candidate + 1;

      if (existing.length + 1 === 5) {
        alert(
          "Hey user, you filled 5 Projects. These Projects will show in your CV.\n" +
          "If you add more, please prioritize your top 5 important ones.\n\n" +
          "You can still fill up to 15 Projects."
        );
      }

      const html = createProjectHTML(candidate);
      if (projectDocsContainer) projectDocsContainer.insertAdjacentHTML("beforeend", html);
      else document.body.insertAdjacentHTML("beforeend", html);
    });
  }

  // ---------- Project HTML Template ----------
  function createProjectHTML(proIndex) {
    return `
      <div class="pro-row-wrapper" data-pro-index="${proIndex}">
        <div class="pro-row">
          <div class="pro-group">
            <input type="text" id="Organizationcategory_${proIndex}" class="pro-input" placeholder=" " required />
            <label class="pro-label" for="Organizationcategory_${proIndex}">Category Name</label>
          </div>

          <div class="pro-group">
            <input type="text" id="Organizationproname_${proIndex}" class="pro-input" placeholder=" " required />
            <label class="pro-label" for="Organizationproname_${proIndex}">Projects Name</label>
          </div>

          <div class="pro-group">
            <input type="text01" id="organizationprourl_${proIndex}" class="pro-input" placeholder=" " required />
            <label class="pro-label" for="organizationprourl_${proIndex}">Projects Url</label>
          </div>

          <div class="pro-group file-group">
            <input type="file" id="Organizationlicence_${proIndex}" class="pro-input" required />
            <label class="pro-label" for="Organizationlicence_${proIndex}">Projects Image</label>
          </div>

          <div class="prowices-docs"></div>
          <button type="button" class="prowised-doc" data-pro="${proIndex}">+ Add New Documents</button>
          <button type="button" class="remove-project">🗑️ Remove Project</button>
        </div>
      </div>
    `;
  }

  // ---------- Extra Document HTML ----------
  function createProwisedDocHTML(proIndex, docIndex) {
    return `
      <div class="pro-row">
        <div class="pro-group">
          <input type="text" id="prowisedname_${proIndex}_${docIndex}" class="pro-input" placeholder=" " required>
          <label class="pro-label" for="prowisedname_${proIndex}_${docIndex}">Document Name</label>
        </div>
        <div class="pro-group file-group">
          <input type="file" id="prowisedfile_${proIndex}_${docIndex}" class="pro-input" required>
          <label class="pro-label" for="prowisedfile_${proIndex}_${docIndex}">Choose Img Or PDF</label>
        </div>
        <button type="button" class="remove-pro-doc">🗑️ Remove</button>
      </div>
    `;
  }

  // ---------- Event Delegation ----------
  document.addEventListener("click", (e) => {
    // Add Project Docs
    if (e.target.classList.contains("prowised-doc") || e.target.id === "Organizationprowised") {
      let wrapper = e.target.closest(".pro-row-wrapper") || e.target.closest(".pro-card");
      if (!wrapper) {
        console.warn("Cannot find Project wrapper for Add Doc");
        return;
      }

      if (!wrapper.dataset.proIndex) wrapper.dataset.proIndex = "0";

      const proIndex = wrapper.dataset.proIndex;
      const docsContainer = wrapper.querySelector(".prowices-docs");
      if (!docsContainer) {
        console.warn("No .prowices-docs found inside wrapper", wrapper);
        return;
      }

      const docCount = docsContainer.querySelectorAll(".pro-row").length;
      if (docCount >= MAX_DOCS_PER_PROJECT) {
        alert("You can only add up to 2 additional document sets for this Project.");
        return;
      }

      const docIndex = docCount + 1;
      docsContainer.insertAdjacentHTML("beforeend", createProwisedDocHTML(proIndex, docIndex));
      return;
    }

    // Remove Project
    if (e.target.classList.contains("remove-project")) {
      const wrapper = e.target.closest(".pro-row-wrapper") || e.target.closest(".pro-card");
      if (!wrapper) return;

      if (wrapper.dataset.proIndex) {
        wrapper.remove();
      } else {
        const inputs = wrapper.querySelectorAll('input[type="text"], input[type="text01"], input[type="file"]');
        inputs.forEach(i => {
          if (i.type === 'file') i.value = '';
          else i.value = '';
        });
        const docs = wrapper.querySelectorAll('.prowices-docs .pro-row');
        docs.forEach(node => node.remove());
      }
      return;
    }

    // Remove Document Row
    if (e.target.classList.contains("remove-pro-doc")) {
      const docRow = e.target.closest(".pro-row");
      if (docRow) docRow.remove();
      return;
    }
  });
});

// ---------- collectProjects function ----------
async function collectProjects(cnicValue) {
  const wrappers = [];
  document.querySelectorAll('.pro-row-wrapper').forEach(w => wrappers.push(w));

  const proCard = document.querySelector('.pro-card');
  if (proCard && !wrappers.includes(proCard)) {
    if (!proCard.querySelector('.pro-row-wrapper')) wrappers.unshift(proCard);
  }

  if (wrappers.length === 0) {
    document.querySelectorAll('.project-item, .pro-row').forEach(w => wrappers.push(w));
  }

  const results = [];
  const uniqueWrappers = Array.from(new Set(wrappers));

  for (const wrapper of uniqueWrappers) {
    let proIndex = wrapper.dataset && wrapper.dataset.proIndex !== undefined ? wrapper.dataset.proIndex : null;
    if (proIndex === null) {
      const anyPro = wrapper.querySelector('[id^="Organizationcategory_"], [id^="organizationprourl_"]');
      if (anyPro && anyPro.id) {
        const parts = anyPro.id.split('_');
        proIndex = (parts.length > 1) ? parts[1] : "0";
      } else {
        proIndex = "0";
      }
    }

    proIndex = proIndex.toString();

    const categoryEl = document.getElementById(`Organizationcategory_${proIndex}`) || wrapper.querySelector('input[type="text"]');
    const nameEl = document.getElementById(`Organizationproname_${proIndex}`) || wrapper.querySelector('input[type="text01"]');
    const urlEl = document.getElementById(`organizationprourl_${proIndex}`) || wrapper.querySelector('input[type="text01"]');
    const imageEl = document.getElementById(`Organizationlicence_${proIndex}`) || wrapper.querySelector('input[type="file"]');

    const category = categoryEl ? categoryEl.value : "";
    const projectName = nameEl ? nameEl.value : "";
    const projectUrl = urlEl ? urlEl.value : "";

    // Upload main project image
    let imageUrl = "";
    if (imageEl && imageEl.files && imageEl.files[0]) {
      try {
        const file = imageEl.files[0];
        const path = `projected/${cnicValue}/${proIndex}/image/${Date.now()}_${file.name}`;
        const refFile = storageRef(storage, path);
        const snap = await uploadBytes(refFile, file);
        imageUrl = await getDownloadURL(snap.ref);
      } catch (err) {
        console.warn("Image upload failed for proIndex", proIndex, err);
        imageUrl = "";
      }
    }

    // Collect extra documents
    const documents = [];
    const extraDocsContainer = wrapper.querySelector('.prowices-docs');
    const docRows = extraDocsContainer ? extraDocsContainer.querySelectorAll('.pro-row') : [];

    for (const docRow of docRows) {
      const docNameEl = docRow.querySelector('input[type="text"]');
      const docFileEl = docRow.querySelector('input[type="file"]');
      const docName = docNameEl?.value || "";
      let docFileUrl = "";
      if (docFileEl && docFileEl.files && docFileEl.files[0]) {
        try {
          const file = docFileEl.files[0];
          const path = `projected/${cnicValue}/${proIndex}/docs/${Date.now()}_${file.name}`;
          const refFile = storageRef(storage, path);
          const snap = await uploadBytes(refFile, file);
          docFileUrl = await getDownloadURL(snap.ref);
        } catch (err) {
          console.warn("Error uploading doc for project", proIndex, err);
          docFileUrl = "";
        }
      }
      documents.push({ name: docName, url: docFileUrl });
    }

    results.push({
      projectIndex: proIndex,
      category,
      projectName,
      projectUrl,
      imageUrl,
      documents
    });
  }

  results.sort((a, b) => parseInt(a.projectIndex) - parseInt(b.projectIndex));
  return results;
}
