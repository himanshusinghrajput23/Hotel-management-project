const API_BASE = 'http://localhost:5000/api';
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('login-message');

async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

loginForm.onsubmit = async function(e) {
  e.preventDefault();
  loginMessage.textContent = 'Logging in...';
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  try {
    const result = await loginUser(email, password);
    if (result.token) {
      localStorage.setItem('token', result.token);
      loginMessage.textContent = 'Login successful! Redirecting...';
      setTimeout(() => { window.location.href = 'index.html'; }, 1000);
    } else {
      loginMessage.textContent = result.message || 'Login failed!';
      console.error('Login error:', result);
    }
  } catch (err) {
    loginMessage.textContent = 'Network or server error.';
    console.error('Login fetch error:', err);
  }
};
