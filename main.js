const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navLinks.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});

const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};


ScrollReveal().reveal(".header__container p", {
  ...scrollRevealOption,
});

ScrollReveal().reveal(".header__container h1", {
  ...scrollRevealOption,
  delay: 500,
});


ScrollReveal().reveal(".about__image img", {
  ...scrollRevealOption,
  origin: "left",
});

ScrollReveal().reveal(".about__content .section__subheader", {
  ...scrollRevealOption,
  delay: 500,
});

ScrollReveal().reveal(".about__content .section__header", {
  ...scrollRevealOption,
  delay: 1000,
});

ScrollReveal().reveal(".about__content .section__description", {
  ...scrollRevealOption,
  delay: 1500,
});

ScrollReveal().reveal(".about__btn", {
  ...scrollRevealOption,
  delay: 2000,
});


ScrollReveal().reveal(".room__card", {
  ...scrollRevealOption,
  interval: 500,
});


ScrollReveal().reveal(".service__list li", {
  ...scrollRevealOption,
  interval: 500,
  origin: "right",
});

const API_BASE = 'http://localhost:5000/api';

const navLoginBtn = document.getElementById('nav-login-btn');
const navSignupBtn = document.getElementById('nav-signup-btn');
const profileDropdown = document.getElementById('profile-dropdown');
const profileName = document.getElementById('profile-name');
const profileBtn = document.getElementById('profile-btn');
const logoutBtn = document.getElementById('logout-btn');

function updateUIOnLogin(user) {
  if (navLoginBtn) navLoginBtn.style.display = 'none';
  if (navSignupBtn) navSignupBtn.style.display = 'none';
  if (profileDropdown) profileDropdown.style.display = 'flex';
  if (profileName) profileName.textContent = user && user.name ? user.name : 'My Profile';
}

function updateUIOnLogout() {
  if (navLoginBtn) navLoginBtn.style.display = 'inline-block';
  if (navSignupBtn) navSignupBtn.style.display = 'inline-block';
  if (profileDropdown) profileDropdown.style.display = 'none';
  if (profileName) profileName.textContent = '';
}

logoutBtn.onclick = function() {
  localStorage.removeItem('token');
  updateUIOnLogout();
};

profileBtn.onclick = function() {
  window.location.href = 'profile.html';
};

const searchForm = document.getElementById('search-form');
if (searchForm) {
  searchForm.onsubmit = function(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('location', searchForm.location.value);
    params.set('checkin', searchForm.checkin.value);
    params.set('checkout', searchForm.checkout.value);
    params.set('guests', searchForm.guests.value);
    params.set('roomType', searchForm.roomType.value);
    window.location.href = 'search.html?' + params.toString();
  };
}

const bookingForm = document.querySelector('.booking__form');
if (bookingForm) {
  bookingForm.onsubmit = async function(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      openAuthModal('login');
      return;
    }
    const checkIn = bookingForm.querySelector('input[placeholder="Check In"]').value;
    const checkOut = bookingForm.querySelector('input[placeholder="Check Out"]').value;
    const guest = bookingForm.querySelector('input[placeholder="Guest"]').value;
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ checkIn, checkOut, guest })
    });
    const data = await res.json();
    let feedback = document.getElementById('booking-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.id = 'booking-feedback';
      feedback.className = 'booking-feedback';
      bookingForm.appendChild(feedback);
    }
    if (res.ok) {
      feedback.textContent = 'Booking successful!';
      bookingForm.reset();
    } else {
      feedback.textContent = data.message || 'Booking failed!';
    }
  };
}

const bookNowBtns = document.querySelectorAll('.room__card .btn');
bookNowBtns.forEach(btn => {
  btn.onclick = function(e) {
    e.preventDefault();
    window.scrollTo({ top: document.querySelector('.booking__container').offsetTop - 40, behavior: 'smooth' });
    document.querySelector('.booking__form input[placeholder="Guest"]').focus();
  };
});

window.addEventListener('DOMContentLoaded', async () => {
  const roomList = document.getElementById('room-list');
  if (roomList) {
    fetch('mock-rooms.json')
      .then(res => res.json())
      .then(rooms => {
        roomList.innerHTML = '';
        rooms.filter(room => {
          const removeNames = ['family garden retreat', 'executive cityscape room', 'deluxe ocean view'];
          return !removeNames.includes(room.name.trim().toLowerCase());
        }).slice(0, 6).forEach(room => {
          roomList.innerHTML += `
            <div class="room__card">
              <div class="room__card__image">
                <img src="${room.image}" alt="${room.name}" style="width:100%;height:220px;object-fit:cover;border-radius:12px 12px 0 0;" />
              </div>
              <div class="room__card__details">
                <h4>${room.name}</h4>
                <p>${room.description}</p>
                <p>Price: ₹${room.price}</p>
                <p>Guests: ${room.guests}</p>
                <div class="room__reviews">
                  ${room.reviews.map(r => `<p><b>${r.user}:</b> ${r.comment} (${r.rating}★)</p>`).join('')}
                </div>
                <button class="btn">Book Now</button>
              </div>
            </div>
          `;
        });
      });
  }

  const token = localStorage.getItem('token');
  if (token) {
    try {
      const res = await fetch(`${API_BASE}/users/profile`, {
        headers: { Authorization: 'Bearer ' + token }
      });
      const data = await res.json();
      if (data && data.name) {
        updateUIOnLogin(data);
      } else {
        updateUIOnLogout();
      }
    } catch (e) {
      updateUIOnLogout();
    }
  } else {
    updateUIOnLogout();
  }
});
