// ================= Ball and Form JS =================
const ballContainer = document.getElementById('ball-container');
const ball = document.getElementById('ball');
const segments = document.querySelectorAll('#ball .segment');
const forms = document.querySelectorAll('.edu-card');

// ================= Helpers =================
function resetCards() {
  forms.forEach(card => {
    card.classList.remove('active', 'dimmed', 'shift-left', 'shift-right');
  });
  // ballContainer.style.transform = 'translate(-50%, -50%) scale(1)';
}

// Apply selection logic
function selectCard(selectedCard) {
  forms.forEach((card, index) => {
    card.classList.remove('active', 'dimmed', 'shift-left', 'shift-right');
    if (card === selectedCard) card.classList.add('active');
    else {
      card.classList.add('dimmed');
      const selectedIndex = Array.from(forms).indexOf(selectedCard);
      if (index < selectedIndex) card.classList.add('shift-left');
      if (index > selectedIndex) card.classList.add('shift-right');
    }
  });
}

// ================= Ball Segment Click =================
segments.forEach(seg => {
  seg.addEventListener('click', () => {
    const formName = seg.dataset.form;
    const targetCard = document.querySelector(`.edu-card[data-form="${formName}"]`);
    if (!targetCard) return;
    selectCard(targetCard);
    // ballContainer.style.transform = 'translate(50%, -50%) scale(0.4)';
  });
});

// ================= Card Click =================
forms.forEach(card => {
  card.addEventListener('click', e => {
    e.stopPropagation();
    selectCard(card);
    // ballContainer.style.transform = 'translate(50%, -50%) scale(0.4)';
  });
});

// ================= Click Outside =================
document.addEventListener('click', e => {
  if (!e.target.closest('.edu-card') && !e.target.closest('.segment')) resetCards();
});

// ================= Add Document functionality =================
document.querySelectorAll('.add-doc').forEach(btn => {
  btn.addEventListener('click', () => {
    const container = btn.previousElementSibling;
    const docDiv = document.createElement('div');
    docDiv.classList.add('extra-doc-item');
    docDiv.innerHTML = `
  <div class="float-card">
          <input type="text" class="float-input" placeholder=" " required>
          <label class="float-label">Document Name</label>
        </div>      
          <div class="float-card">
          <input type="file" accept=".pdf,.jpg,.png" class="float-input" required>
          <label class="float-label" >Upload Img Or PDF</label>
        </div>    `;
    container.appendChild(docDiv);
  });
});

/// ================= Education Div Animation =================
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

let educationLoaded = false;

async function loadEducationAnimation() {
  const educationDiv = document.getElementById('education');
  if (!educationDiv || educationLoaded) return;

  educationLoaded = true;

  // Reset ball to center with slight scale-up
  ballContainer.style.transition = 'transform 0.8s ease, top 0.8s ease';
  // ballContainer.style.left = '50%';
  // ballContainer.style.transform = 'translate(-50%, -50%) scale(1.2)';

  await new Promise(resolve => setTimeout(resolve, 300));
  // ballContainer.style.transform = 'translate(-50%, -50%) scale(1)';

  // Hide all cards initially
  forms.forEach(card => card.classList.remove('show'));

  // Start rotation
  ball.classList.add('rotate');

  // Wait 2 seconds for rotation
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Stop rotation
  ball.classList.remove('rotate');

  // Move ball smoothly to top with small scale
  ballContainer.classList.add('small');

  // Staggered card display
  forms.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('show');
    }, index * 150); // 150ms delay between each card
  });

  // Start floating after transition
  await new Promise(resolve => setTimeout(resolve, 1));
  ballContainer.classList.add('float');
}

// Trigger on education div click
const educationDiv = document.getElementById('education');
if (educationDiv) {
  educationDiv.addEventListener('click', loadEducationAnimation);
}


// Remove previous scroll/load triggers
// window.addEventListener('load', loadEducationAnimation);
// window.addEventListener('scroll', loadEducationAnimation);

// Trigger on load & scroll
window.addEventListener('load', loadEducationAnimation);
window.addEventListener('scroll', loadEducationAnimation);
