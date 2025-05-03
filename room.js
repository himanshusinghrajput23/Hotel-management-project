const API_BASE = 'http://localhost:5000/api';
const profileDropdown = document.getElementById('profile-dropdown');
const profileName = document.getElementById('profile-name');
const logoutBtn = document.getElementById('logout-btn');
const roomInfo = document.getElementById('room-info');
const roomReviews = document.getElementById('room-reviews');
const reviewForm = document.getElementById('reviewForm');
const reviewMessage = document.getElementById('review-message');
const bookRoomBtn = document.getElementById('book-room-btn');
const paymentSection = document.getElementById('payment-section');
const paymentForm = document.getElementById('paymentForm');
const paymentMessage = document.getElementById('payment-message');

// Utility to get roomId from URL (e.g., room.html?id=ROOM_ID)
function getRoomId() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('id'), 10);
}

// Sample room data (should match search.js)
const sampleRooms = [
  {
    id: 1,
    name: "Deluxe Suite",
    price: 120,
    images: ["images/room1.jpg", "images/room1b.jpg"],
    description: "Spacious suite with king bed, balcony, and free Wi-Fi. Includes breakfast and city view.",
    type: "suite",
    location: "New York",
    guests: 2,
    amenities: ["Free Wi-Fi", "Balcony", "Breakfast Included", "King Bed"],
    reviews: [
      { name: "Alice", rating: 5, comment: "Amazing room, great service!" },
      { name: "Bob", rating: 4, comment: "Very comfortable and clean." }
    ]
  },
  {
    id: 2,
    name: "Single Room",
    price: 80,
    images: ["images/room2.jpg"],
    description: "Cozy single room with all essentials included.",
    type: "single",
    location: "New York",
    guests: 1,
    amenities: ["Free Wi-Fi", "Single Bed"],
    reviews: [
      { name: "Charlie", rating: 4, comment: "Good value for money." }
    ]
  },
  {
    id: 3,
    name: "Double Deluxe",
    price: 100,
    images: ["images/room3.jpg"],
    description: "Modern double room with city view.",
    type: "double",
    location: "Los Angeles",
    guests: 2,
    amenities: ["Free Wi-Fi", "City View", "Double Bed"],
    reviews: []
  }
];

function renderRoom(room) {
  const info = document.getElementById('room-info');
  if (!room) {
    info.innerHTML = '<p>Room not found.</p>';
    return;
  }
  // Gallery
  let galleryHtml = '';
  if (room.images && room.images.length > 0) {
    galleryHtml = `<div class="room-gallery">` +
      room.images.map(img => `<img src="${img}" alt="${room.name}" />`).join('') +
      `</div>`;
  }
  // Amenities
  let amenitiesHtml = '';
  if (room.amenities && room.amenities.length > 0) {
    amenitiesHtml = `<ul class="amenities">` + room.amenities.map(a => `<li>${a}</li>`).join('') + `</ul>`;
  }
  info.innerHTML = `
    <h1>${room.name}</h1>
    ${galleryHtml}
    <p><strong>Price:</strong> $${room.price}/night</p>
    <p><strong>Type:</strong> ${room.type}</p>
    <p><strong>Guests:</strong> ${room.guests}</p>
    <p>${room.description}</p>
    <h3>Amenities</h3>
    ${amenitiesHtml}
  `;
}

function renderReviews(room) {
  const reviewsDiv = document.getElementById('room-reviews');
  if (!room || !room.reviews || room.reviews.length === 0) {
    reviewsDiv.innerHTML = '<p>No reviews yet.</p>';
    return;
  }
  reviewsDiv.innerHTML = room.reviews.map(r => `
    <div class="review">
      <strong>${r.name}</strong> - <span>${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
      <p>${r.comment}</p>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const roomId = getRoomId();
  const room = sampleRooms.find(r => r.id === roomId);
  renderRoom(room);
  renderReviews(room);
  // Book Now button
  const bookBtn = document.getElementById('book-room-btn');
  const bookingSection = document.getElementById('booking-section');
  const paymentSection = document.getElementById('payment-section');
  if (bookBtn && bookingSection && paymentSection) {
    bookBtn.onclick = () => {
      bookingSection.style.display = 'none';
      paymentSection.style.display = 'block';
    };
  }
  // Review form (for demo, always hidden unless you want to enable it)
  // You could add logic to allow logged-in users to submit reviews
});


function updateUIOnLogin(user) {
  if (profileDropdown) profileDropdown.style.display = 'flex';
  if (profileName) profileName.textContent = user && user.name ? user.name : 'My Profile';
  if (reviewForm) reviewForm.style.display = 'block';
}
function updateUIOnLogout() {
  if (profileDropdown) profileDropdown.style.display = 'none';
  if (profileName) profileName.textContent = '';
  if (reviewForm) reviewForm.style.display = 'none';
}
logoutBtn.onclick = function() {
  localStorage.removeItem('token');
  updateUIOnLogout();
  window.location.href = 'login.html';
};

async function fetchRoom() {
  const roomId = getRoomId();
  if (!roomId) return roomInfo.innerHTML = '<p>Room not found.</p>';
  const res = await fetch(`${API_BASE}/rooms/${roomId}`);
  const room = await res.json();
  if (room && room._id) {
    roomInfo.innerHTML = `<h1>${room.name}</h1><p>${room.description || ''}</p><p><b>Price:</b> $${room.price}/night</p>`;
  } else {
    roomInfo.innerHTML = '<p>Room not found.</p>';
  }
}

async function fetchReviews() {
  const roomId = getRoomId();
  if (!roomId) return;
  const res = await fetch(`${API_BASE}/reviews/room/${roomId}`);
  const reviews = await res.json();
  if (Array.isArray(reviews)) {
    roomReviews.innerHTML = reviews.length ? reviews.map(r => `<div class="review-card"><b>${r.user?.name || 'User'}</b>: <b>${r.rating}</b>/5<br>${r.comment}</div>`).join('') : '<p>No reviews yet.</p>';
  } else {
    roomReviews.innerHTML = '<p>Unable to load reviews.</p>';
  }
}

reviewForm.onsubmit = async function(e) {
  e.preventDefault();
  reviewMessage.textContent = 'Submitting...';
  const token = localStorage.getItem('token');
  if (!token) {
    reviewMessage.textContent = 'Login required.';
    return;
  }
  const roomId = getRoomId();
  const rating = document.getElementById('reviewRating').value;
  const comment = document.getElementById('reviewComment').value;
  const res = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify({ room: roomId, rating, comment })
  });
  const data = await res.json();
  if (res.ok) {
    reviewMessage.textContent = 'Review submitted!';
    fetchReviews();
    reviewForm.reset();
  } else {
    reviewMessage.textContent = data.message || 'Review failed!';
  }
};

bookRoomBtn.onclick = function() {
  paymentSection.style.display = 'block';
  bookRoomBtn.style.display = 'none';
};

paymentForm.onsubmit = async function(e) {
  e.preventDefault();
  paymentMessage.textContent = 'Processing payment...';
  const token = localStorage.getItem('token');
  if (!token) {
    paymentMessage.textContent = 'Login required.';
    return;
  }
  // For demo, just mock payment
  const res = await fetch(`${API_BASE}/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify({
      room: getRoomId(),
      cardNumber: document.getElementById('cardNumber').value,
      expiry: document.getElementById('expiry').value,
      cvv: document.getElementById('cvv').value
    })
  });
  const data = await res.json();
  if (res.ok) {
    paymentMessage.textContent = 'Payment successful! Booking confirmed.';
    paymentForm.reset();
  } else {
    paymentMessage.textContent = data.message || 'Payment failed!';
  }
};

window.addEventListener('DOMContentLoaded', async () => {
  // Auth state
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const res = await fetch(`${API_BASE}/users/profile`, {
        headers: { Authorization: 'Bearer ' + token }
      });
      const data = await res.json();
      if (data && data.name) updateUIOnLogin(data);
      else updateUIOnLogout();
    } catch {
      updateUIOnLogout();
    }
  } else {
    updateUIOnLogout();
  }
  fetchRoom();
  fetchReviews();
});
