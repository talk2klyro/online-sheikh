import { fetchJSON } from './utils.jimport { fetchJSON } from './utils.js';

function createTutorCard(t){
  const el = document.createElement('div');
  el.className = 'card tutor';
  el.setAttribute('role', 'listitem');
  const photo = t.photo || 'assets/images/avatar-placeholder.png';
  el.innerHTML = `
    <img loading="lazy" src="${photo}" alt="${escapeHtml(t.name)}">
    <div>
      <h3>${escapeHtml(t.name)}</h3>
      <p class="muted">${escapeHtml((t.subjects || []).join(', '))}</p>
      <p class="muted">Rating: ${t.rating} ⭐</p>
    </div>
  `;
  return el;
}

export async function initTutors(){
  const grid = document.getElementById('tutors-grid');
  if(!grid) return;
  try{
    const data = await fetchJSON('data/tutors.json');
    grid.innerHTML = '';
    data.forEach(t => grid.appendChild(createTutorCard(t)));
  } catch(e){
    grid.innerHTML = '<p class="muted">Failed to load tutors.</p>';
    console.error(e);
  }
}

function escapeHtml(s = '') {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
