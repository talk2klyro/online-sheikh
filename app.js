// Refresh balance animation
const refreshBtn = document.querySelector('.view-details');
refreshBtn.addEventListener('click', () => {
  refreshBtn.textContent = 'Refreshing...';
  setTimeout(() => {
    refreshBtn.textContent = 'View Details';
    alert('Balance refreshed successfully!');
  }, 1500);
});
