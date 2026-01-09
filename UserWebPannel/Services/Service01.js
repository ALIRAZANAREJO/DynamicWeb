
// ------------------- Full Fixed Service JS -------------------
document.addEventListener("DOMContentLoaded", () => {
  const addServiceBtn = document.getElementById("organizationservviced");
  const sererDocsContainer = document.querySelector(".serv-docs");
  let nextServiceIndex = 1;
  const MAX_SERVICES = 15;
  const MAX_DOCS_PER_ser = 2;

  if (!sererDocsContainer) {
    console.warn(".serv-docs container not found — dynamic Services may not render.");
  }

  // ---------- Add Dynamic Service Row ----------
  if (addServiceBtn) {
    addServiceBtn.addEventListener("click", () => {
      const existing = document.querySelectorAll('.ser-row-wrapper[data-ser-index]');
      if (existing.length >= MAX_SERVICES) {
        alert("You can only add up to 15 Services.");
        return;
      }

      let candidate = nextServiceIndex;
      while (document.querySelector(`.ser-row-wrapper[data-ser-index="${candidate}"]`)) {
        candidate++;
      }
      nextServiceIndex = candidate + 1;

      if (existing.length + 1 === 5) {
        alert(
          "Hey user, you filled 5 Services. These Services will show in your CV.\n" +
          "If you add serwised, please prioritize your top 5 important Services.\n\n" +
          "You can still fill up to 15 Services."
        );
      }

      const html = createServiceHTML(candidate);
      if (sererDocsContainer) sererDocsContainer.insertAdjacentHTML("beforeend", html);
      else document.body.insertAdjacentHTML("beforeend", html);
    });
  }

  // ---------- Service HTML Template ----------
  function createServiceHTML(serIndex) {
    return `
      <div class="ser-row-wrapper" data-ser-index="${serIndex}">
        <div class="ser-row">
          <div class="ser-group">
            <input type="text" id="Organizationtitle_${serIndex}" class="ser-input" placeholder=" " required />
            <label class="ser-label" for="Organizationtitle_${serIndex}">Organization Name</label>
          </div>
                <div class="ser-group">
        <input type="text" id="Organizationprice_${serIndex}" class="ser-input" placeholder=" " required />
        <label class="ser-label" for="Organizationprice_${serIndex}">Position</label>
      </div>
          <div class="ser-group">
            <select id="organizationest_${serIndex}" class="ser-input" required>
              <option value="" disabled selected></option>
              <option value="Months">Months</option>
              <option value="Years">Years</option>
            </select>
            <label class="ser-label" for="organizationest_${serIndex}">Month Or Year</label>
          </div>
          <div class="ser-group">
            <input type="digits" id="organizationdigits_${serIndex}" class="ser-input" placeholder=" " required />
            <label class="ser-label" for="organizationdigits_${serIndex}">Duration digits</label>
          </div>
          <div class="ser-group file-group">
            <input type="file" id="organizationlicence_${serIndex}" class="ser-input" required />
            <label class="ser-label" for="organizationlicence_${serIndex}">ID Card</label>
          </div>

          <div class="serwices-docs"></div>
          <button type="button" class="serwised-doc" data-ser="${serIndex}">+ Add New Documents</button>
          <button type="button" class="remove-service">🗑️ Remove Service</button>
        </div>
      </div>
    `;
  }

  // ---------- Extra Document HTML ----------
  function createserwisedDocHTML(serIndex, docIndex) {
    return `
      <div class="ser-row">
        <div class="ser-group">
          <input type="text" id="serwiseddocname_${serIndex}_${docIndex}" class="ser-input" placeholder=" " required>
          <label class="ser-label" for="serwiseddocname_${serIndex}_${docIndex}">Document Name</label>
        </div>
        <div class="ser-group file-group">
          <input type="file" id="serwiseddocpdf_${serIndex}_${docIndex}" class="ser-input" required>
          <label class="ser-label" for="serwiseddocpdf_${serIndex}_${docIndex}">Choose Img Or PDF</label>
        </div>
        <button type="button" class="remove-doc">🗑️ Remove</button>
      </div>
    `;
  }

  // ---------- Event Delegation for Add/Remove ----------
  document.addEventListener("click", (e) => {
    // Add serwised Docs
    if (e.target.classList.contains("serwised-doc") || e.target.id === "Organizationserwiseddoc") {
      let wrapper = e.target.closest(".ser-row-wrapper") || e.target.closest(".ser-card");
      if (!wrapper) {
        console.warn("Cannot find Service wrapper for Add Doc");
        return;
      }

      if (!wrapper.dataset.serIndex) wrapper.dataset.serIndex = "0";

      const serIndex = wrapper.dataset.serIndex;
      const servDocsContainer = wrapper.querySelector(".serwices-docs");
      if (!servDocsContainer) {
        console.warn("No .serwices-docs found inside wrapper", wrapper);
        return;
      }

      const docCount = servDocsContainer.querySelectorAll(".ser-row").length;
      if (docCount >= MAX_DOCS_PER_ser) {
        alert("You can only add up to 2 additional document sets for this Service.");
        return;
      }

      const docIndex = docCount + 1;
      servDocsContainer.insertAdjacentHTML("beforeend", createserwisedDocHTML(serIndex, docIndex));
      return;
    }

    // Remove Service
    if (e.target.classList.contains("remove-service")) {
      const wrapper = e.target.closest(".ser-row-wrapper") || e.target.closest(".ser-card");
      if (!wrapper) return;

      if (wrapper.dataset.serIndex) {
        wrapper.remove();
      } else {
        const inputs = wrapper.querySelectorAll('input[type="text"], input[type="digits"], select, input[type="file"]');
        inputs.forEach(i => {
          if (i.type === 'file') i.value = '';
          else if (i.tagName.toLowerCase() === 'select') i.selectedIndex = 0;
          else i.value = '';
        });
        const serv = wrapper.querySelectorAll('.serwices-docs .ser-row');
        serv.forEach(node => node.remove());
      }
      return;
    }

    // Remove Document Row
    if (e.target.classList.contains("remove-doc")) {
      const docRow = e.target.closest(".ser-row");
      if (docRow) docRow.remove();
      return;
    }
  });
});
  // ---------- collectservices helper is attached to window below (function definition is reused) ----------
  // Note: we do not define collectservices here to avoid duplication — it's defined below and used by submit.

// ---------- Robust collectservices function (works for static first row = index 0 + dynamic ones) ----------
/*
  This function:
  - Finds every wrapper: any element with class `.ser-row-wrapper` OR element `.ser-card` containing service fields.
  - Derives serIndex:
      - If wrapper.dataset.serIndex exists -> use it
      - else -> 0 (static first row)
  - Reads inputs using ID convention `Organizationtitle_{index}` when present, otherwise looks inside wrapper for inputs.
  - Uploads files to storage under `servviced/{CNIC}/{serIndex}/...`
*/
async function collectServices(cnicValue) {
  // Gather wrappers (static .ser-card that contains the original row may not have data-ser-index)
  const wrappers = [];
  // preferred: serlicit ser-row-wrapper elements (these include dynamic ones)
  document.querySelectorAll('.ser-row-wrapper').forEach(w => wrappers.push(w));
  // also include original .ser-card if present and not already included
  const serCard = document.querySelector('.ser-card');
  if (serCard && !wrappers.includes(serCard)) {
    // But if the ser-card contains .ser-row-wrapper inside it, do not duplicate
    if (!serCard.querySelector('.ser-row-wrapper')) wrappers.unshift(serCard);
    else {
      // if ser-card contains a wrapper, we assume wrapper covers original row
      // do nothing
    }
  }

  // As a final fallback, include any element that looks like an Service row
  if (wrappers.length === 0) {
    document.querySelectorAll('.service-item, .ser-row').forEach(w => wrappers.push(w));
  }

  const results = [];

  // Ensere unique wrappers in order
  const uniqueWrappers = Array.from(new Set(wrappers));

  for (const wrapper of uniqueWrappers) {
    // Determine serIndex
    let serIndex = wrapper.dataset && wrapper.dataset.serIndex !== undefined ? wrapper.dataset.serIndex : null;
    if (serIndex === null) {
      // try to infer from child IDs like Organizationtitle_#
      const anyOrg = wrapper.querySelector('[id^="Organizationtitle_"], [id^="organizationest_"], [id^="organizationdigits_"]');
      if (anyOrg && anyOrg.id) {
        const parts = anyOrg.id.split('_');
        serIndex = (parts.length > 1) ? parts[1] : "0";
      } else {
        serIndex = "0";
      }
    }

    // Ensere it's string
    serIndex = serIndex.toString();

    // Try to locate main inputs by ID first (Organizationtitle_{serIndex}), else fallback to first relevant inputs inside wrapper
    const orgNameEl = maybeGetById(`Organizationtitle_${serIndex}`) || wrapper.querySelector('input[type="text"]');
    const orgPositionEl = maybeGetById(`Organizationprice_${serIndex}`) || wrapper.querySelector('input[type="text01"]');
    const orgestEl = maybeGetById(`organizationest_${serIndex}`) || wrapper.querySelector('select');
    const orgDurationEl = maybeGetById(`organizationdigits_${serIndex}`) || wrapper.querySelector('input[type="digits"]');
    const orgIdentityEl = maybeGetById(`organizationlicence_${serIndex}`) || wrapper.querySelector('input[type="file"]');

    const organizationtitle = orgNameEl ? (orgNameEl.value || "") : "";
    const organizationprice = orgPositionEl ? (orgPositionEl.value || "") : "";
    const durationest = orgestEl ? (orgestEl.value || "") : "";
    const durationdigits = orgDurationEl ? (orgDurationEl.value || "") : "";

    // Upload ID card if present
    let idCardUrl = "";
    if (orgIdentityEl && orgIdentityEl.files && orgIdentityEl.files[0]) {
      try {
        const file = orgIdentityEl.files[0];
        const path = `servviced/${cnicValue}/${serIndex}/idcard/${Date.now()}_${file.name}`;
        const refFile = storageRef(storage, path);
        const snap = await uploadBytes(refFile, file);
        idCardUrl = await getDownloadURL(snap.ref);
      } catch (err) {
        console.warn("ID card upload failed for serIndex", serIndex, err);
        idCardUrl = "";
      }
    }

    // Collect extra documents for this wrapper (local to parent)
    const documents = [];
    // Prefer serwices-docs container within the wrapper
    const extraDocsContainer = wrapper.querySelector('.serwices-docs');
    const docRows = extraDocsContainer ? extraDocsContainer.querySelectorAll('.ser-row') : [];

    // Also check for inputs named using pattern serwiseddocname_{serIndex}_{doc}
    const serwisedNameInputs = wrapper.querySelectorAll(`input[id^="serwiseddocname_${serIndex}_"]`);

    // If pattern-based inputs found, use them (keeps naming consistent)
    if (serwisedNameInputs && serwisedNameInputs.length > 0) {
      for (const nameInputEl of serwisedNameInputs) {
        const nameId = nameInputEl.id;
        const suffix = nameId.slice(`serwiseddocname_${serIndex}_`.length);
        const fileInputEl = wrapper.querySelector(`#serwiseddocpdf_${serIndex}_${suffix}`);
        const docName = nameInputEl.value || "";
        let docFileUrl = "";
        if (fileInputEl && fileInputEl.files && fileInputEl.files[0]) {
          try {
            const file = fileInputEl.files[0];
            const path = `servviced/${cnicValue}/${serIndex}/docs/${Date.now()}_${file.name}`;
            const refFile = storageRef(storage, path);
            const snap = await uploadBytes(refFile, file);
            docFileUrl = await getDownloadURL(snap.ref);
          } catch (err) {
            console.warn("Error uploading doc for", serIndex, suffix, err);
            docFileUrl = "";
          }
        }
        documents.push({ name: docName, url: docFileUrl });
      }
    } else {
      // Otherwise use docRows inside serwices-docs
      for (const docRow of docRows) {
        const docNameEl = docRow.querySelector('input[type="text"]');
        const docFileEl = docRow.querySelector('input[type="file"]');
        const docName = docNameEl?.value || "";
        let docFileUrl = "";
        if (docFileEl && docFileEl.files && docFileEl.files[0]) {
          try {
            const file = docFileEl.files[0];
            const path = `servviced/${cnicValue}/${serIndex}/docs/${Date.now()}_${file.name}`;
            const refFile = storageRef(storage, path);
            const snap = await uploadBytes(refFile, file);
            docFileUrl = await getDownloadURL(snap.ref);
          } catch (err) {
            console.warn("Error uploading docRow for serIndex", serIndex, err);
            docFileUrl = "";
          }
        }
        documents.push({ name: docName, url: docFileUrl });
      }
    }

    // Push service record
    results.push({
      serviceIndex: serIndex.toString(),
      organizationtitle,
      organizationprice,
      durationest,
      durationdigits,
      idCardUrl,
      documents
    });
  } // end for wrappers

  // Ensere services are ordered by numeric serviceIndex (0,1,2,...)
  results.sort((a, b) => {
    const ai = parseInt(a.serviceIndex || "0", 10);
    const bi = parseInt(b.serviceIndex || "0", 10);
    return ai - bi;
  });

  // Convert results into object keyed by index if you want object structure,
  // but we will return array (as your code serects). If you prefer object,
  // you can transform here.
  return results;
}