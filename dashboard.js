const API_BASE = 'http://localhost:5000/api';
const profileDropdown = document.getElementById('profile-dropdown');
const profileName = document.getElementById('profile-name');
const logoutBtn = document.getElementById('logout-btn');
const userProfile = document.getElementById('user-profile');
const userBookings = document.getElementById('user-bookings');
const userReviews = document.getElementById('user-reviews');

function updateUIOnLogin(user) {
  if (profileDropdown) profileDropdown.style.display = 'flex';
  if (profileName) profileName.textContent = user && user.name ? user.name : 'My Profile';
}
function updateUIOnLogout() {
  if (profileDropdown) profileDropdown.style.display = 'none';
  if (profileName) profileName.textContent = '';
  window.location.href = 'login.html';
}
logoutBtn.onclick = function() {
  localStorage.removeItem('token');
  updateUIOnLogout();
};

async function fetchProfile() {
  const token = localStorage.getItem('token');
  if (!token) return updateUIOnLogout();
  const res = await fetch(`${API_BASE}/users/profile`, { headers: { Authorization: 'Bearer ' + token } });
  const user = await res.json();
  if (user && user.name) {
    updateUIOnLogin(user);
    userProfile.innerHTML = `<p><b>Name:</b> ${user.name}</p><p><b>Email:</b> ${user.email}</p>`;
  } else {
    updateUIOnLogout();
  }
}

async function fetchBookings() {
  const token = localStorage.getItem('token');
  if (!token) return;
  const res = await fetch(`${API_BASE}/bookings/my`, { headers: { Authorization: 'Bearer ' + token } });
  const bookings = await res.json();
  if (Array.isArray(bookings)) {
    userBookings.innerHTML = bookings.length ? bookings.map(b => `<div class="booking-card"><b>Room:</b> ${b.room}<br><b>Check-in:</b> ${b.checkIn}<br><b>Check-out:</b> ${b.checkOut}</div>`).join('') : '<p>No bookings yet.</p>';
  } else {
    userBookings.innerHTML = '<p>Unable to load bookings.</p>';
  }
}

async function fetchReviews() {
  const token = localStorage.getItem('token');
  if (!token) return;
  const res = await fetch(`${API_BASE}/reviews/my`, { headers: { Authorization: 'Bearer ' + token } });
  const reviews = await res.json();
  if (Array.isArray(reviews)) {
    userReviews.innerHTML = reviews.length ? reviews.map(r => `<div class="review-card"><b>Room:</b> ${r.room}<br><b>Rating:</b> ${r.rating}<br><b>Comment:</b> ${r.comment}</div>`).join('') : '<p>No reviews yet.</p>';
  } else {
    userReviews.innerHTML = '<p>Unable to load reviews.</p>';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  fetchProfile();
  fetchBookings();
  fetchReviews();
});
