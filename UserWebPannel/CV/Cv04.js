// Paste/replace this whole block (safe: waits for DOM and guards elements)
document.addEventListener('DOMContentLoaded', () => {
  const cvRoot = document.getElementById('cv');
  if (!cvRoot) return;

  const startScreen = document.getElementById('cvStartScreen');
  const backToStart = document.getElementById('backToStart');
  const grid = document.getElementById('cvGrid');
  const actions = document.querySelector('.actions');
  const previewWrap = document.getElementById('previewWrap');
  const btnContinueSaved = document.getElementById('btnContinueSaved');
  const btnNewCV = document.getElementById('btnNewCV');

  // ensure required elements exist
  if (!startScreen || !backToStart || !grid || !actions || !previewWrap || !btnContinueSaved || !btnNewCV) {
    console.warn('CV UI: one or more required elements are missing.');
    return;
  }

  // initial UI state
  grid.style.display = 'none';
  actions.style.display = 'none';
  previewWrap.style.display = 'none';
  backToStart.style.display = 'none';

  // dynamic container for loading ResumeBuilder without replacing #cv
  let newCvContainer = document.getElementById('newCvContainer');
  if (!newCvContainer) {
    newCvContainer = document.createElement('div');
    newCvContainer.id = 'newCvContainer';
    newCvContainer.style.display = 'none';
    cvRoot.appendChild(newCvContainer);
  }

  // Continue with saved data -> show grid
  btnContinueSaved.addEventListener('click', () => {
    startScreen.style.display = 'none';
    grid.style.display = 'grid';
    actions.style.display = 'flex';
    previewWrap.style.display = 'none';
    newCvContainer.style.display = 'none';
    backToStart.style.display = 'inline-block';
  });

  // Create New Local CV -> load ResumeBulder.html into container
  btnNewCV.addEventListener('click', () => {
    startScreen.style.display = 'none';
    grid.style.display = 'none';
    actions.style.display = 'none';
    previewWrap.style.display = 'none';
    newCvContainer.style.display = 'block';
    backToStart.style.display = 'inline-block';

    fetch('/UserWebPannel/Resume/Resume.html')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch ResumeBulder.html');
        return res.text();
      })
      .then(html => {
        newCvContainer.innerHTML = html;

        // add internal back button (non-refresh)
        const internalBack = document.createElement('button');
        internalBack.textContent = '← Back';
        internalBack.className = 'btn';
        internalBack.style.marginBottom = '15px';
        internalBack.addEventListener('click', () => {
          newCvContainer.style.display = 'none';
          startScreen.style.display = 'block';
          backToStart.style.display = 'none';
        });

        newCvContainer.prepend(internalBack);
      })
      .catch(err => {
        console.error(err);
        newCvContainer.innerHTML = '<p>Could not load ResumeBulder.html.</p>';
      });
  });

  // Back button from grid/preview -> go to start screen
  backToStart.addEventListener('click', () => {
    grid.style.display = 'none';
    actions.style.display = 'none';
    previewWrap.style.display = 'none';
    newCvContainer.style.display = 'none';
    startScreen.style.display = 'block';
    backToStart.style.display = 'none';
  });
});


