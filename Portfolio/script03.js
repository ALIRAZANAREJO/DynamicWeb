// ===================== SERVICE DISPLAY =====================
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

// Select target container
const serviceWrap = document.getElementById("serviceListContainer");

// Helper: choose icon based on service title keywords
function getServiceIcon(title = "") {
  const t = title.toLowerCase();

  if (t.includes("web") || t.includes("development") || t.includes("website"))
    return "fa fa-code fa-2x text-dark";
  if (t.includes("design") || t.includes("graphic"))
    return "fa fa-paint-brush fa-2x text-dark";
  if (t.includes("app") || t.includes("mobile"))
    return "fa fa-mobile-alt fa-2x text-dark";
  if (t.includes("marketing") || t.includes("seo"))
    return "fa fa-bullhorn fa-2x text-dark";
  if (t.includes("security") || t.includes("protection"))
    return "fa fa-shield-alt fa-2x text-dark";
  if (t.includes("writing") || t.includes("content"))
    return "fa fa-pen-nib fa-2x text-dark";
  
  // Default icon
  return "fa fa-cog fa-2x text-dark";
}

// Helper: safely escape null/undefined
function safe(value) {
  return value == null ? "" : value;
}

// Load and display services for a given CNIC
async function loadServicesFor(cnicValue) {
  if (!cnicValue) {
    console.error("CNIC value is required to load services.");
    return;
  }

  const db = getDatabase();
  const dbRef = ref(db);
  const path = `resContainer9/${cnicValue}/Services`;

  try {
    const snapshot = await get(child(dbRef, path));

    serviceWrap.innerHTML = ""; // clear old cards

    if (snapshot.exists()) {
      const services = snapshot.val();

      // Sort services by numeric keys (0,1,2...)
      const sortedKeys = Object.keys(services).sort((a, b) => Number(a) - Number(b));

      sortedKeys.forEach((key) => {
        const s = services[key];
        const col = document.createElement("div");
        col.className = "col-lg-6";

        // Determine icon based on title
        const iconClass = getServiceIcon(s.organizationtitle || "");

        col.innerHTML = `
          <div class="service-item d-flex flex-column flex-sm-row bg-white rounded h-100 p-4 p-lg-5">
            <div class="bg-icon flex-shrink-0 mb-3">
              <i class="${iconClass}"></i>
            </div>
            <div class="ms-sm-4">
              <h4 class="mb-3" id="organizationtitle">${safe(s.organizationtitle)}</h4>
              <h6 class="mb-3">Role: 
                <span class="text-primary" id="organizationprice">${safe(s.organizationprice)}</span>
              </h6>
              <h6 class="mb-3">Experience: 
                <span class="text-success" id="durationdigits">${safe(s.durationdigits)}</span>
                <span id="durationest">${safe(s.durationest)}</span>
              </h6>
              <p id="pera">${safe(s.pera)}</p>
            </div>
          </div>
        `;

        serviceWrap.appendChild(col);
      });
    } else {
      // Default card if no data
      serviceWrap.innerHTML = `
        <div class="col-lg-6">
          <div class="service-item d-flex flex-column flex-sm-row bg-white rounded h-100 p-4 p-lg-5">
            <div class="bg-icon flex-shrink-0 mb-3">
              <i class="fa fa-crop-alt fa-2x text-dark"></i>
            </div>
            <div class="ms-sm-4">
              <h4 class="mb-3">No Services Found</h4>
              <h6 class="mb-3">Please add your service details.</h6>
            </div>
          </div>
        </div>
      `;
    }
  } catch (err) {
    console.error("Error loading services:", err);
  }
}

// ===================== CALL FUNCTION =====================
// Example usage: (replace with your actual CNIC variable)
const cnicValue = "35201-1234567-8"; 
loadServicesFor(cnicValue);
