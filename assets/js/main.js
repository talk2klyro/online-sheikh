// main application bootstrap - uses dynamic imports to lazy-load page scripts
import { CONFIG } from './config/settings.js';
import { debounce } from './utils.js';

function openGoogleClassroomShare(url){
  if(!url) url = window.location.href;
  const shareUrl = CONFIG.GOOGLE_CLASSROOM_SHARE_BASE + encodeURIComponent(url);
  window.open(shareUrl, '_blank', 'noopener,noreferrer');
}

function initNavGCButtons(){
  const btn = document.getElementById('gc-nav-btn') || document.getElementById('gc-nav-btn-2');
  if(btn) btn.addEventListener('click', ()=> openGoogleClassroomShare(window.location.href));
}

// lazy image loader for better performance
function initLazyImages(){
  if('IntersectionObserver' in window){
    const imgs = document.querySelectorAll('img[loading="lazy"]');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if(e.isIntersecting){
          const img = e.target;
          if(img.dataset.src){
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          io.unobserve(img);
        }
      });
    }, {rootMargin: '200px'});
    imgs.forEach(i => io.observe(i));
  }
}

// Dynamically load page-specific script modules
async function loadPageModules(){
  try{
    if(document.getElementById('classes-grid')){
      const module = await import('./classes.js');
      module.initClasses();
    }
    if(document.getElementById('tutors-grid') && !document.querySelector('main.enroll-page')){
      const module = await import('./tutors.js');
      module.initTutors();
    }
    if(document.getElementById('class-summary') || document.getElementById('jotform-embed')){
      const module = await import('./enroll.js');
      module.initEnrollPage();
    }
    // front page featured/tutor previews
    if(document.getElementById('featured-grid')){
      // classes module also exposes a featured loader
      const module = await import('./classes.js');
      if(module.loadFeatured) module.loadFeatured();
    }
  } catch(err){
    console.error('Error loading page modules', err);
  }
}

document.addEventListener('DOMContentLoaded', ()=> {
  initNavGCButtons();
  initLazyImages();
  loadPageModules();
});

// Expose small utilities to window for quick debugging in dev
window.Edubridge = {
  openGoogleClassroomShare
};
