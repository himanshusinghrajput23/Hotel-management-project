
async function fetchRooms() {
  const res = await fetch('mock-rooms.json');
  return res.json();
}

function getSearchParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    location: params.get('location') || '',
    checkin: params.get('checkin') || '',
    checkout: params.get('checkout') || '',
    guests: parseInt(params.get('guests'), 10) || 1,
    roomType: params.get('roomType') || ''
  };
}

function filterRooms(params, rooms) {

  const guests = isNaN(params.guests) || params.guests < 1 ? 1 : params.guests;
  console.log('Filtering with params:', params);
  return rooms.filter(room => {
    console.log('Checking room:', room);

    if (params.location && params.location.trim() !== '' && !room.location.toLowerCase().includes(params.location.trim().toLowerCase())) {
      console.log('Filtered out by location:', room.location);
      return false;
    }
    if (params.roomType && room.type !== params.roomType) {
      console.log('Filtered out by roomType:', room.type);
      return false;
    }
    if (guests && room.guests < guests) {
      console.log('Filtered out by guests:', room.guests);
      return false;
    }
    return true;
  });
}

function renderRooms(rooms, params) {

  let roomsToShow = rooms;
  if (rooms.length < 10) {

    fetch('mock-rooms.json')
      .then(res => res.json())
      .then(allRooms => {
 
        const ids = new Set(rooms.map(r => r.id));
        const extras = allRooms.filter(r => !ids.has(r.id));
        roomsToShow = rooms.concat(extras.slice(0, 10 - rooms.length));
        renderRoomsDisplay(roomsToShow, params);
      });
    return;
  }
  renderRoomsDisplay(roomsToShow, params);
}


function renderRoomsDisplay(roomsToShow, params) {
  const resultsList = document.getElementById('results-list');
  resultsList.innerHTML = '';
  // Debug info
  const debug = document.createElement('div');
  debug.style.fontSize = '12px';
  debug.style.color = '#888';
  debug.style.marginBottom = '10px';
  debug.innerHTML = `<b>Rooms found:</b> ${roomsToShow.length} <br><b>Params:</b> ${JSON.stringify(params)}`;
  resultsList.appendChild(debug);
  if (!roomsToShow.length) {
    resultsList.innerHTML += '<p>No rooms found matching your criteria.</p>';
    return;
  }
  roomsToShow.forEach(room => {
    // Create a card container with flex layout
    const card = document.createElement('div');
    card.className = 'search-room-card';
    card.style.display = 'flex';
    card.style.alignItems = 'stretch';
    card.style.margin = '2rem 0';
    card.style.background = '#fff';
    card.style.borderRadius = '12px';
    card.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)';
    card.style.overflow = 'hidden';
    card.style.padding = '0 0 16px 0';

    const imgDiv = document.createElement('div');
    imgDiv.style.flex = '0 0 455px';
    imgDiv.style.maxWidth = '455px';
    imgDiv.style.height = '412px';
    imgDiv.style.overflow = 'hidden';
    imgDiv.style.borderRadius = '12px 12px 0 0';
    imgDiv.style.marginTop = '18px';

    const img = document.createElement('img');
    img.src = room.image ? room.image : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
    img.alt = room.name;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    imgDiv.appendChild(img);

    const infoDiv = document.createElement('div');
    infoDiv.style.flex = '1';
    infoDiv.style.padding = '0 2rem 1.5rem 2rem';
    infoDiv.style.display = 'flex';
    infoDiv.style.flexDirection = 'column';
    infoDiv.style.justifyContent = 'flex-start';
    infoDiv.style.marginLeft = '32px';
    infoDiv.style.marginTop = '0';

    const header = document.createElement('div');
    header.className = 'room-card__header';
    const title = document.createElement('h3');
    title.className = 'room-card__title';
    title.textContent = room.name;
    header.appendChild(title);
    infoDiv.appendChild(header);

    const meta = document.createElement('div');
    meta.className = 'room-card__meta';
    const guests = document.createElement('span');
    guests.className = 'room-card__guests';
    guests.title = 'Guest Capacity';
    guests.innerHTML = `👤 ${room.guests} Guest${room.guests > 1 ? 's' : ''}`;
    meta.appendChild(guests);
    const type = document.createElement('span');
    type.className = 'room-card__type';
    type.textContent = room.type.charAt(0).toUpperCase() + room.type.slice(1);
    meta.appendChild(type);
    const location = document.createElement('span');
    location.className = 'room-card__location';
    location.innerHTML = `📍 ${room.location}`;
    meta.appendChild(location);
    meta.style.marginBottom = '0.7rem';
    infoDiv.appendChild(meta);

    // Show only 5-6 features (amenities) horizontally
    const amenitiesList = [
      'Free Wifi', 'Modern wardrobe', 'Twin Single Bed', 'King Sized Bed', 'Queen Sized Bed',
      'AC', 'TV', 'Power backup', 'Geyser', 'In-house Restaurant', 'Card payment',
      'CCTV cameras', 'Pet friendly', 'Reception', 'Toiletries available', 'Bedside Table / Desk',
      'Security', '24/7 check-in', 'Dress Hanger', 'Daily housekeeping', 'Fire extinguisher',
      'First-aid kit', 'Attached bathroom'
    ];
    // Shuffle and select 5-6 features
    const shuffled = amenitiesList.slice().sort(() => Math.random() - 0.5);
    const count = 5 + Math.floor(Math.random() * 2); // 5-6 features
    const selected = shuffled.slice(0, count);
    // Create a horizontal (inline) feature list
    const featuresDiv = document.createElement('div');
    featuresDiv.style.display = 'flex';
    featuresDiv.style.flexWrap = 'wrap';
    featuresDiv.style.gap = '10px';
    featuresDiv.style.margin = '0 0 0.7rem 0';
    selected.forEach(am => {
      const feat = document.createElement('span');
      feat.textContent = am;
      feat.style.background = '#f0f0f0';
      feat.style.borderRadius = '6px';
      feat.style.padding = '2px 10px';
      feat.style.fontSize = '13px';
      feat.style.color = '#444';
      featuresDiv.appendChild(feat);
    });
    infoDiv.appendChild(featuresDiv);

    if (room.description) {
      const desc = document.createElement('div');
      desc.textContent = room.description;
      desc.style.marginBottom = '0.7rem';
      infoDiv.appendChild(desc);
    }

    // Margin before reviews
    let reviewMargin = document.createElement('div');
    reviewMargin.style.height = '0.5rem';
    infoDiv.appendChild(reviewMargin);

    // --- Add Review Form ---
    const reviewForm = document.createElement('form');
    reviewForm.style.display = 'flex';
    reviewForm.style.flexDirection = 'column';
    reviewForm.style.gap = '4px';
    reviewForm.style.margin = '8px 0 16px 0';
    reviewForm.onsubmit = (e) => {
      e.preventDefault();
      const user = reviewForm.elements['user'].value.trim();
      const rating = parseInt(reviewForm.elements['rating'].value, 10);
      const comment = reviewForm.elements['comment'].value.trim();
      if (!user || !comment || !rating) {
        alert('Please fill all fields and select a rating.');
        return;
      }
      // Add new review to room
      if (!room.reviews) room.reviews = [];
      room.reviews.push({ user, rating, comment });
      // Re-render the rooms display
      renderRoomsDisplay(roomsToShow, params);
    };
    // Name input
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.name = 'user';
    nameInput.placeholder = 'Your name';
    nameInput.required = true;
    nameInput.style.padding = '4px 8px';
    nameInput.style.borderRadius = '4px';
    nameInput.style.border = '1px solid #ccc';
    reviewForm.appendChild(nameInput);
    // Rating select
    const ratingSelect = document.createElement('select');
    ratingSelect.name = 'rating';
    ratingSelect.required = true;
    for (let i = 5; i >= 1; i--) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = '★'.repeat(i);
      ratingSelect.appendChild(opt);
    }
    ratingSelect.style.padding = '4px 8px';
    ratingSelect.style.borderRadius = '4px';
    ratingSelect.style.border = '1px solid #ccc';
    reviewForm.appendChild(ratingSelect);
    // Comment input
    const commentInput = document.createElement('input');
    commentInput.type = 'text';
    commentInput.name = 'comment';
    commentInput.placeholder = 'Your comment';
    commentInput.required = true;
    commentInput.style.padding = '4px 8px';
    commentInput.style.borderRadius = '4px';
    commentInput.style.border = '1px solid #ccc';
    reviewForm.appendChild(commentInput);
    // Submit button
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Add Review';
    submitBtn.style.background = '#2980b9';
    submitBtn.style.color = '#fff';
    submitBtn.style.border = 'none';
    submitBtn.style.padding = '6px 16px';
    submitBtn.style.fontSize = '1rem';
    submitBtn.style.borderRadius = '6px';
    submitBtn.style.cursor = 'pointer';
    reviewForm.appendChild(submitBtn);
    infoDiv.appendChild(reviewForm);
    // --- End Add Review Form ---
    if (room.reviews && room.reviews.length > 0) {
      const ratingDiv = document.createElement('div');
      let avgRating = 0;
      room.reviews.forEach(r => { avgRating += r.rating; });
      avgRating = (avgRating / room.reviews.length).toFixed(1);
      ratingDiv.innerHTML = `<b>Rating:</b> ${avgRating} ★ (${room.reviews.length} reviews)`;
      ratingDiv.style.margin = '0.25rem 0 0.5rem 0';
      infoDiv.appendChild(ratingDiv);

      const reviewsSection = document.createElement('div');
      reviewsSection.className = 'review-section';
      room.reviews.forEach(r => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        const avatar = document.createElement('div');
        avatar.className = 'review-avatar';
        avatar.textContent = r.user.charAt(0).toUpperCase();
        reviewCard.appendChild(avatar);
        const details = document.createElement('div');
        details.className = 'review-details';
        const user = document.createElement('span');
        user.className = 'review-user';
        user.textContent = r.user;
        details.appendChild(user);
        const rating = document.createElement('span');
        rating.className = 'review-rating';
        rating.innerHTML = `${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}`;
        details.appendChild(rating);
        const comment = document.createElement('div');
        comment.className = 'review-comment';
        comment.textContent = r.comment;
        comment.style.marginTop = '-2px'; // Minimize gap between rating and comment
        comment.style.marginBottom = '0.2rem';
        details.appendChild(comment);
        reviewCard.appendChild(details);
        reviewsSection.appendChild(reviewCard);
      });
      infoDiv.appendChild(reviewsSection);
    }
    card.appendChild(imgDiv);
    card.appendChild(infoDiv);
    // Add price and Book Now button horizontally aligned at bottom right
    const actionRow = document.createElement('div');
    actionRow.style.display = 'flex';
    actionRow.style.justifyContent = 'flex-end';
    actionRow.style.alignItems = 'center';
    actionRow.style.gap = '60px';
    actionRow.style.marginTop = '24px';

    const price = document.createElement('span');
    price.className = 'room-card__price';
    price.textContent = `₹${room.price}`;
    price.style.fontWeight = 'bold';
    price.style.fontSize = '1.2rem';
    price.style.color = '#27ae60';
    actionRow.appendChild(price);

    const bookBtn = document.createElement('button');
    bookBtn.textContent = 'Book Now';
    bookBtn.className = 'book-now-btn';
    bookBtn.style.background = '#27ae60';
    bookBtn.style.color = '#fff';
    bookBtn.style.border = 'none';
    bookBtn.style.padding = '10px 24px';
    bookBtn.style.fontSize = '1rem';
    bookBtn.style.borderRadius = '6px';
    bookBtn.style.cursor = 'pointer';
    // Optionally, add click handler for booking
    bookBtn.onclick = () => {
      // Create modal overlay
      const modalBg = document.createElement('div');
      modalBg.style.position = 'fixed';
      modalBg.style.top = '0';
      modalBg.style.left = '0';
      modalBg.style.width = '100vw';
      modalBg.style.height = '100vh';
      modalBg.style.background = 'rgba(0,0,0,0.4)';
      modalBg.style.display = 'flex';
      modalBg.style.alignItems = 'center';
      modalBg.style.justifyContent = 'center';
      modalBg.style.zIndex = '9999';

      // Modal window
      const modal = document.createElement('div');
      modal.style.background = '#fff';
      modal.style.borderRadius = '10px';
      modal.style.padding = '32px 32px 24px 32px';
      modal.style.boxShadow = '0 4px 24px rgba(0,0,0,0.16)';
      modal.style.minWidth = '320px';
      modal.style.display = 'flex';
      modal.style.flexDirection = 'column';
      modal.style.alignItems = 'center';

      // Modal title
      const modalTitle = document.createElement('h2');
      modalTitle.textContent = `Book ${room.name}`;
      modalTitle.style.marginBottom = '16px';
      modal.appendChild(modalTitle);

      // Booking form
      const bookingForm = document.createElement('form');
      bookingForm.style.display = 'flex';
      bookingForm.style.flexDirection = 'column';
      bookingForm.style.gap = '10px';
      bookingForm.onsubmit = (e) => {
        e.preventDefault();
        // Simulate booking confirmation
        modal.innerHTML = `<h2 style='color:#27ae60;'>Booking Confirmed!</h2><p>Thank you, <b>${bookingForm.elements['name'].value}</b>.<br>Your booking for <b>${room.name}</b> (${room.type}, ₹${room.price}) is confirmed.<br>Confirmation sent to <b>${bookingForm.elements['email'].value}</b>.</p>`;
        setTimeout(() => {
          if (modalBg.parentNode) modalBg.parentNode.removeChild(modalBg);
        }, 2500);
      };
      // Name
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.name = 'name';
      nameInput.placeholder = 'Your name';
      nameInput.required = true;
      nameInput.style.padding = '8px';
      nameInput.style.borderRadius = '5px';
      nameInput.style.border = '1px solid #ccc';
      bookingForm.appendChild(nameInput);
// Email
      const emailInput = document.createElement('input');
      emailInput.type = 'email';
      emailInput.name = 'email';
      emailInput.placeholder = 'Your email';
      emailInput.required = true;
      emailInput.style.padding = '8px';
      emailInput.style.borderRadius = '5px';
      emailInput.style.border = '1px solid #ccc';
      bookingForm.appendChild(emailInput);
// Submit
      const submitBtn = document.createElement('button');
      submitBtn.type = 'submit';
      submitBtn.textContent = 'Confirm Booking';
      submitBtn.style.background = '#27ae60';
      submitBtn.style.color = '#fff';
      submitBtn.style.border = 'none';
      submitBtn.style.padding = '10px 24px';
      submitBtn.style.fontSize = '1rem';
      submitBtn.style.borderRadius = '6px';
      submitBtn.style.cursor = 'pointer';
      bookingForm.appendChild(submitBtn);
// Cancel
      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.textContent = 'Cancel';
      cancelBtn.style.background = '#eee';
      cancelBtn.style.color = '#333';
      cancelBtn.style.border = 'none';
      cancelBtn.style.padding = '8px 18px';
      cancelBtn.style.marginTop = '4px';
      cancelBtn.style.fontSize = '1rem';
      cancelBtn.style.borderRadius = '6px';
      cancelBtn.style.cursor = 'pointer';
      cancelBtn.onclick = () => {
        if (modalBg.parentNode) modalBg.parentNode.removeChild(modalBg);
      };
      bookingForm.appendChild(cancelBtn);
      modal.appendChild(bookingForm);
      modalBg.appendChild(modal);
      document.body.appendChild(modalBg);
    };
    actionRow.appendChild(bookBtn);
    infoDiv.appendChild(actionRow);
    resultsList.appendChild(card);
  });
}


document.addEventListener('DOMContentLoaded', async () => {
  const params = getSearchParams();
  const rooms = await fetchRooms();
  const filtered = filterRooms(params, rooms);
  renderRooms(filtered, params);
});
