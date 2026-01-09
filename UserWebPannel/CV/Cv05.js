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

  let selectedSaved = localStorage.getItem('selectedDesign');

  // ---------- UTIL ----------
  function clearSelectedVisual(el){
    el.querySelectorAll('.cv-card').forEach(c=>c.classList.remove('selected'));
  }

  function showStartScreen(){
    startScreen.style.display='block';
    grid.style.display='none';
    newCvGrid && (newCvGrid.style.display='none');
    previewWrap.style.display='none';
    document.querySelector('.actions').style.display='none';
    backToStart.style.display='none';
    previewFrame.src='about:blank';
    fallback.style.display='none';
  }

  // ---------- INIT ----------
  showStartScreen();
  clearSelectedVisual(grid);
  newCvGrid && clearSelectedVisual(newCvGrid);

  if(selectedSaved){
    const prev=cards.find(c=>c.dataset.design===selectedSaved);
    prev && prev.classList.add('selected');
  }

  // ---------- GRID SELECT ----------
  [...cards, ...(newCvGrid?newCvGrid.querySelectorAll('.cv-card'):[])].forEach(card=>{
    card.tabIndex=0;
    card.addEventListener('click',()=>{
      clearSelectedVisual(card.closest('.grid'));
      card.classList.add('selected');
      if(card.closest('#cvGrid')){
        selectedSaved=card.dataset.design;
        localStorage.setItem('selectedDesign',selectedSaved);
      }
    });
    card.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){e.preventDefault();card.click();}
    });
  });

  clearBtn.addEventListener('click',()=>{
    clearSelectedVisual(grid);
    selectedSaved=null;
    localStorage.removeItem('selectedDesign');
  });

  // ---------- CONTINUE ----------
  continueBtn.addEventListener('click',()=>{
    const activeGrid = newCvGrid && newCvGrid.style.display==='grid' ? newCvGrid : grid;
    const selected = activeGrid.querySelector('.cv-card.selected');
    if(!selected){ alert('Please select a card first!'); return; }

    const url = selected.dataset.design;

    previewWrap.style.display='block';
    previewFrame.src = url;
    openInNewTab.href = url;

    grid.style.display='none';
    newCvGrid && (newCvGrid.style.display='none');
    document.querySelector('.actions').style.display='none';
    fallback.style.display='none';

    history.pushState({view:'preview',design:url},'', '#preview');
  });

  // ---------- BACK ----------
  backBtn02.addEventListener('click',()=>{
    previewFrame.src='about:blank';
    previewWrap.style.display='none';
    fallback.style.display='none';

    if(newCvGrid && newCvGrid.style.display==='grid'){
      newCvGrid.style.display='grid';
    }else{
      grid.style.display='grid';
      document.querySelector('.actions').style.display='flex';
    }
  });

  backToStart.addEventListener('click',showStartScreen);

  // ---------- START SCREEN ----------
  btnContinueSaved.addEventListener('click',()=>{
    startScreen.style.display='none';
    grid.style.display='grid';
    document.querySelector('.actions').style.display='flex';
    backToStart.style.display='inline-block';
  });

  btnNewCV.addEventListener('click',()=>{
    startScreen.style.display='none';
    newCvGrid && (newCvGrid.style.display='grid');
    document.querySelector('.actions').style.display='flex';
    backToStart.style.display='inline-block';
  });

  // ---------- IFRAME ----------
  previewFrame.addEventListener('error',()=>{
    previewFrame.style.display='none';
    fallback.style.display='';
  });

  previewFrame.addEventListener('load',()=>{
    if(!previewFrame.src||previewFrame.src==='about:blank')return;
    previewFrame.style.display='';
    fallback.style.display='none';
  });

  // ---------- HISTORY ----------
  window.addEventListener('popstate',e=>{
    if(e.state?.view==='preview'){
      previewWrap.style.display='block';
      previewFrame.src=e.state.design;
      grid.style.display='none';
      newCvGrid && (newCvGrid.style.display='none');
      document.querySelector('.actions').style.display='none';
    }else{
      showStartScreen();
    }
  });

})();
