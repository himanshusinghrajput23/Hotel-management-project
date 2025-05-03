const API_BASE = 'http://localhost:5000/api';
const profileForm = document.getElementById('profile-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const profileMsg = document.getElementById('profile-msg');
const deleteBtn = document.getElementById('delete-btn');

function showMsg(msg, success = false) {
  profileMsg.textContent = msg;
  profileMsg.style.color = success ? 'green' : 'var(--primary-color)';
}

async function fetchProfile() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }
  const res = await fetch(`${API_BASE}/users/profile`, { headers: { Authorization: 'Bearer ' + token } });
  if (!res.ok) return showMsg('Failed to load profile');
  const user = await res.json();
  nameInput.value = user.name || '';
  emailInput.value = user.email || '';
}

profileForm.onsubmit = async function(e) {
  e.preventDefault();
  showMsg('Updating...');
  const token = localStorage.getItem('token');
  if (!token) return showMsg('Not authenticated');
  const res = await fetch(`${API_BASE}/users/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify({ name: nameInput.value, email: emailInput.value })
  });
  if (res.ok) {
    showMsg('Profile updated!', true);
  } else {
    const data = await res.json();
    showMsg(data.message || 'Update failed');
  }
};

deleteBtn.onclick = async function() {
  if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
  const token = localStorage.getItem('token');
  if (!token) return showMsg('Not authenticated');
  const res = await fetch(`${API_BASE}/users/profile`, {
    method: 'DELETE',
    headers: { Authorization: 'Bearer ' + token }
  });
  if (res.ok) {
    localStorage.removeItem('token');
    showMsg('Account deleted. Redirecting...', true);
    setTimeout(() => { window.location.href = 'signup.html'; }, 1500);
  } else {
    const data = await res.json();
    showMsg(data.message || 'Delete failed');
  }
};

window.addEventListener('DOMContentLoaded', fetchProfile);
