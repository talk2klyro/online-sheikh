export async function fetchJSON(path){
  const res = await fetch(path, {cache: "no-cache"});
  if(!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return res.json();
}

export function formatCurrency(n){
  try {
    return '₦' + Number(n).toLocaleString();
  } catch(e) {
    return '₦' + n;
  }
}

export function getQueryParam(key){
  const url = typeof window !== 'undefined' ? new URL(window.location.href) : null;
  return url ? url.searchParams.get(key) : null;
}

export function debounce(fn, wait = 250){
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

export function createEl(tag='div', className=''){
  const d = document.createElement(tag);
  if(className) d.className = className;
  return d;
}
