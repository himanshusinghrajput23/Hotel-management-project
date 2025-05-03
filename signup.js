const API_BASE = 'http://localhost:5000/api';
const registerForm = document.getElementById('registerForm');
const registerMessage = document.getElementById('register-message');

async function registerUser(name, email, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  return res.json();
}

registerForm.onsubmit = async function(e) {
  e.preventDefault();
  registerMessage.textContent = 'Registering...';
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  try {
    const result = await registerUser(name, email, password);
    if (result.token) {
      localStorage.setItem('token', result.token);
      registerMessage.textContent = 'Registration successful! Redirecting...';
      setTimeout(() => { window.location.href = 'index.html'; }, 1000);
    } else {
      registerMessage.textContent = result.message || 'Registration failed!';
      console.error('Register error:', result);
    }
  } catch (err) {
    registerMessage.textContent = 'Network or server error.';
    console.error('Register fetch error:', err);
  }
};
