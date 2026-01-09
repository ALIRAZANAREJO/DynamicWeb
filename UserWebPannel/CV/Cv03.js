(function(){
  // ---------- ELEMENTS ----------
  const grid = document.getElementById('cvGrid');
  const cards = Array.from(grid.querySelectorAll('.cv-card'));
  const continueBtn = document.getElementById('continueBtn');
  const clearBtn = document.getElementById('clearSelection');
  const previewWrap = document.getElementById('previewWrap');
  const previewFrame = document.getElementById('previewFrame');
  const fallback = document.getElementById('previewFallback');
  const openInNewTab = document.getElementById('openInNewTab');
  const backBtn02 = document.getElementById('backBtn02');

  const startScreen = document.getElementById('cvStartScreen');
  const backToStart = document.getElementById('backToStart');

  const btnContinueSaved = document.getElementById('btnContinueSaved');
  const btnNewCV = document.getElementById('btnNewCV');

  const newCvGrid = document.getElementById('newCvGrid');

  let selectedSaved = localStorage.getItem('selectedDesign') || null;

  // ---------- UTILITIES ----------
  function clearSelectedVisual(gridContainer){
    gridContainer.querySelectorAll('.cv-card').forEach(c => c.classList.remove('selected'));
  }

  function showStartScreen(){
    startScreen.style.display = 'block';
    grid.style.display = 'none';
    newCvGrid && (newCvGrid.style.display = 'none');
    previewWrap.style.display = 'none';
    document.querySelector('.actions').style.display = 'none';
    backToStart.style.display = 'none';
    previewFrame.src = 'about:blank';
    fallback.style.display = 'none';
  }

  // ---------- INITIAL STATE ----------
  showStartScreen();
  clearSelectedVisual(grid);
  if(newCvGrid) clearSelectedVisual(newCvGrid);

  // Restore previous saved CV selection
  if(selectedSaved){
    const prev = cards.find(c => c.dataset.design === selectedSaved);
    if(prev) prev.classList.add('selected');
  }

  // ---------- SAVED CV GRID ----------
  cards.forEach(card => {
    card.addEventListener('click', () => {
      if(!card.dataset.design || card.dataset.design.trim() === ''){
        alert('Dear User this design will be available soon');
        return;
      }
      clearSelectedVisual(grid);
      card.classList.add('selected');
      selectedSaved = card.dataset.design;
      localStorage.setItem('selectedDesign', selectedSaved);
    });
    card.tabIndex = 0;
    card.addEventListener('keydown', ev => {
      if(ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); card.click(); }
    });
  });

  clearBtn.addEventListener('click', () => {
    clearSelectedVisual(grid);
    selectedSaved = null;
    localStorage.removeItem('selectedDesign');
  });

  // ---------- NEW CV GRID ----------
  if(newCvGrid){
    newCvGrid.querySelectorAll('.cv-card').forEach(card => {
      card.addEventListener('click', () => {
        if(!card.dataset.design || card.dataset.design.trim() === ''){
          alert('Dear User this design will be available soon');
          return;
        }
        clearSelectedVisual(newCvGrid);
        card.classList.add('selected');
      });
      card.tabIndex = 0;
      card.addEventListener('keydown', ev => {
        if(ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); card.click(); }
      });
    });
  }

  // ---------- CONTINUE BUTTON ----------
  continueBtn.addEventListener('click', () => {
    // Check which grid is active
    if(newCvGrid && newCvGrid.style.display === 'grid'){
      const selectedCard = newCvGrid.querySelector('.cv-card.selected');
      if(!selectedCard){ alert('Please select a card first!'); return; }

      previewWrap.style.display = 'block';
      previewFrame.src = selectedCard.dataset.design;
      openInNewTab.href = selectedCard.dataset.design;
      newCvGrid.style.display = 'none';
      document.querySelector('.actions').style.display = 'none';
      fallback.style.display = 'none';

      try { history.pushState({ view:'preview', design:selectedCard.dataset.design }, '', '#preview'); } catch(e){}
      return;
    }

    // Saved CV
    const selectedCard = grid.querySelector('.cv-card.selected');
    if(!selectedCard){ alert('Please select a card first!'); return; }

    previewWrap.style.display = 'block';
    previewFrame.src = selectedCard.dataset.design;
    openInNewTab.href = selectedCard.dataset.design;
    grid.style.display = 'none';
    newCvGrid && (newCvGrid.style.display = 'none');
    document.querySelector('.actions').style.display = 'none';
    fallback.style.display = 'none';

    try { history.pushState({ view:'preview', design:selectedCard.dataset.design }, '', '#preview'); } catch(e){}
  });

  // ---------- BACK BUTTONS ----------
  backBtn02.addEventListener('click', () => {
    previewFrame.src = 'about:blank';
    previewWrap.style.display = 'none';
    fallback.style.display = 'none';

    if(newCvGrid && newCvGrid.style.display === 'grid'){
      newCvGrid.style.display = 'grid';
    } else {
      grid.style.display = 'grid';
      document.querySelector('.actions').style.display = 'flex';
    }
  });

  backToStart.addEventListener('click', showStartScreen);

  // ---------- START SCREEN BUTTONS ----------
  btnContinueSaved.addEventListener('click', () => {
    startScreen.style.display = 'none';
    grid.style.display = 'grid';
    document.querySelector('.actions').style.display = 'flex';
    previewWrap.style.display = 'none';
    newCvGrid && (newCvGrid.style.display = 'none');
    backToStart.style.display = 'inline-block';
  });

  btnNewCV.addEventListener('click', () => {
    startScreen.style.display = 'none';
    grid.style.display = 'none';
    newCvGrid && (newCvGrid.style.display = 'grid');
    document.querySelector('.actions').style.display = 'flex';
    previewWrap.style.display = 'none';
    backToStart.style.display = 'inline-block';
  });

  // ---------- PREVIEW IFRAME ----------
  previewFrame.addEventListener('error', () => { previewFrame.style.display='none'; fallback.style.display=''; });
  previewFrame.addEventListener('load', () => {
    if(previewFrame.src === 'about:blank' || previewFrame.src === '') return;
    fallback.style.display = 'none';
    previewFrame.style.display = '';
  });

  // ---------- POPSTATE ----------
  window.addEventListener('popstate', (e) => {
    const state = e.state || {};
    if(state.view === 'preview'){
      previewWrap.style.display = 'block';
      previewFrame.src = state.design || '';
      grid.style.display = 'none';
      newCvGrid && (newCvGrid.style.display = 'none');
      document.querySelector('.actions').style.display = 'none';
    } else {
      showStartScreen();
    }
  });

})();
