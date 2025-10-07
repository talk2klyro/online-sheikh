import import { fetchJSON, getQueryParam, formatCurrency } from './utils.js';
import { CONFIG } from './config/settings.js';

// Show class summary and prefill JotForm iframe with class data
export async function initEnrollPage(){
  const summary = document.getElementById('class-summary');
  const iframe = document.getElementById('jotform-frame');
  const payBtn = document.getElementById('paystack-btn');

  const id = getQueryParam('classId');
  const amountParam = getQueryParam('amount');

  try {
    const classes = await fetchJSON('data/classes.json');
    if(id){
      const c = classes.find(x => String(x.id) === String(id));
      if(c){
        if(summary) summary.innerHTML = `<strong>${c.title}</strong> by ${c.tutorName} — ${formatCurrency(c.price)}<br>${c.short}`;
        // prefill JotForm iframe by adding query params (JotForm supports prefill by field name in your form)
        if(iframe){
          const src = new URL(iframe.src);
          // commonly you prefill by field IDs/names e.g. 'class_title', 'class_id', 'amount'
          src.searchParams.set('classId', c.id);
          src.searchParams.set('classTitle', c.title);
          src.searchParams.set('amount', c.price);
          iframe.src = src.toString();
        }
      } else {
        if(summary) summary.textContent = 'Class not found.';
      }
    } else {
      if(summary) summary.textContent = 'Please choose a class to enroll.';
    }
  } catch(e){
    console.error(e);
    if(summary) summary.textContent = 'Failed to load class details.';
  }

  if(payBtn){
    payBtn.addEventListener('click', ()=> {
      const amount = Number(amountParam || (getQueryParam('amount') || 2000));
      payWithPaystack({
        email: CONFIG.PAYSTACK_DEFAULT_EMAIL,
        amount,
        onSuccess: (ref) => {
          // production: call your server to verify the transaction and persist records
          alert('Payment done — reference: ' + ref);
        },
        onClose: ()=> {
          console.log('Paystack dialog closed');
        }
      });
    });
  }
}

// Client-only paystack inline (for demos only). Production requires server verification.
function payWithPaystack({email, amount, onSuccess, onClose}){
  if(!window.PaystackPop){
    alert('Paystack script not loaded. Ensure https://js.paystack.co/v1/inline.js is included.');
    return;
  }
  if(!CONFIG.PAYSTACK_PUBLIC_KEY || CONFIG.PAYSTACK_PUBLIC_KEY.includes('replace')){
    alert('Paystack public key not set. Update assets/js/config/settings.js');
    return;
  }
  const handler = window.PaystackPop.setup({
    key: CONFIG.PAYSTACK_PUBLIC_KEY,
    email: email || CONFIG.PAYSTACK_DEFAULT_EMAIL,
    amount: Math.round(Number(amount) * 100), // kobo
    currency: 'NGN',
    ref: 'EDUBRIDGE_' + Math.floor(Math.random() * 1000000000),
    onClose: function(){
      if(typeof onClose === 'function') onClose();
    },
    callback: function(resp){
      if(typeof onSuccess === 'function') onSuccess(resp.reference);
      // Recommended: POST resp.reference to your server to verify and then show receipt
    }
  });
  handler.openIframe();
}
