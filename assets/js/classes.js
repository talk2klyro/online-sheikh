import { fetchJSON, formatCurrency, debounce } from './utils.js';
import { CONFIG } from './config/settings.js';

function createClassCard(c){
  const card = document.createElement('article');
  card.className = 'card';
  card.setAttribute('role', 'listitem');
  card.innerHTML = `
    <div class="meta">
      <div>
        <h3>${escapeHtml(c.title)}</h3>
        <p class="muted">${escapeHtml(c.tutorName)} • ${escapeHtml(c.schedule)}</p>
      </div>
      <div class="price">${formatCurrency(c.price)}</div>
    </div>
    <p class="muted">${escapeHtml(c.short)}</p>
    <div class="actions">
      <a class="btn btn-primary" href="enroll.html?classId=${encodeURIComponent(c.id)}&amount=${encodeURIComponent(c.price)}">Enroll</a>
      <button class="btn btn-outline gc-btn" data-url="${escapeHtml(c.classroomUrl || '')}">Google Classroom</button>
    </div>
  `;
  // accessibility
  card.querySelector('.gc-btn').addEventListener('click', (e)=>{
    const url = e.currentTarget.dataset.url;
    if(!url) return alert('No Google Classroom URL configured for this class.');
    window.Edubridge?.openGoogleClassroomShare(url);
  });
  return card;
}

export async function loadFeatured(){
  const target = document.getElementById('featured-grid');
  if(!target) return;
  try{
    const data = await fetchJSON('data/classes.json');
    target.innerHTML = '';
    data.slice(0,3).forEach(c => target.appendChild(createClassCard(c)));
  } catch(e){
    console.error(e);
    target.innerHTML = '<p class="muted">Failed to load featured classes.</p>';
  }
}

export async function initClasses(){
  const grid = document.getElementById('classes-grid');
  const searchEl = document.getElementById('search');
  if(!grid) return;
  try{
    const classes = await fetchJSON('data/classes.json');
    function render(list){
      grid.innerHTML = '';
      list.forEach(c => grid.appendChild(createClassCard(c)));
    }
    render(classes);

    if(searchEl){
      const onInput = debounce(()=> {
        const q = searchEl.value.trim().toLowerCase();
        if(!q) return render(classes);
        const filtered = classes.filter(c => (c.title + ' ' + c.tutorName + ' ' + c.subject).toLowerCase().includes(q));
        render(filtered);
      }, 200);
      searchEl.addEventListener('input', onInput);
    }
  } catch(e){
    grid.innerHTML = '<p class="muted">Failed to load classes.</p>';
    console.error(e);
  }
}

// small helper to defend against XSS on inserted text
function escapeHtml(s = ''){
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}
