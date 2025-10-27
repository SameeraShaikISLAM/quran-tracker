const findVerseBtn = document.getElementById('find-verse');
const verseGrid = document.getElementById('verse-grid');
const errorPopup = document.getElementById('error-popup');
const closePopup = document.getElementById('close-popup');
const errorMsg = errorPopup.querySelector('p');

const learnedCountEl = document.getElementById('learned-count');
const learningCountEl = document.getElementById('learning-count');
const confusedCountEl = document.getElementById('confused-count');
const gregorianDateEl = document.getElementById('gregorian-date');
const hijriDateEl = document.getElementById('hijri-date');

// ===== Date Functions =====
function updateDates() {
  const today = new Date();
  gregorianDateEl.textContent = `Gregorian: ${today.toDateString()}`;

  // Fetch Hijri date from API
  fetch(`https://api.aladhan.com/v1/gToH?date=${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`)
    .then(res => res.json())
    .then(data => {
      const hijri = data.data.hijri;
      hijriDateEl.textContent = `Hijri: ${hijri.day} ${hijri.month.en} ${hijri.year}`;
    })
    .catch(() => {
      hijriDateEl.textContent = 'Hijri date unavailable';
    });
}
updateDates();

// ===== Error Popup =====
function showErrorPopup(message) {
  if (!errorPopup || !errorMsg) return;

  errorPopup.style.display = 'none'; // reset before showing
  errorMsg.textContent = message;
  errorPopup.style.display = 'block';

  setTimeout(() => {
    errorPopup.style.display = 'none';
  }, 3000);
}

closePopup.addEventListener('click', () => {
  errorPopup.style.display = 'none';
});

// ===== Toast Notification =====
function showToast(message) {
  let toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ===== Status Count Update =====
function updateCounts() {
  let learned = 0, learning = 0, confused = 0;
  document.querySelectorAll('.verse-card').forEach(card => {
    const bg = window.getComputedStyle(card).backgroundColor;
    if (bg.includes('212, 247, 220')) learned++;      // green
    else if (bg.includes('255, 243, 205')) learning++; // yellow
    else if (bg.includes('248, 215, 218')) confused++; // red
  });
  learnedCountEl.textContent = learned;
  learningCountEl.textContent = learning;
  confusedCountEl.textContent = confused;
}

// ===== Verse Fetching Logic =====
findVerseBtn.addEventListener('click', async () => {
  const surah = document.getElementById('surah').value.trim();
  const ayah = document.getElementById('ayah').value.trim();

  if (!surah || !ayah) {
    showErrorPopup("Please enter both Surah and Ayah numbers.");
    return;
  }

  // Duplicate check
  const exists = Array.from(verseGrid.querySelectorAll('.ref')).some(ref =>
    ref.textContent.includes(`Surah ${surah}, Ayah ${ayah}`)
  );

  if (exists) {
    showErrorPopup("This verse is already displayed on the screen!");
    return;
  }

  findVerseBtn.disabled = true;
  findVerseBtn.textContent = "Loading...";

  try {
    const englishUrl = `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/en.asad`;
    const arabicUrl = `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/ar`;

    const [englishRes, arabicRes] = await Promise.all([fetch(englishUrl), fetch(arabicUrl)]);
    const englishData = await englishRes.json();
    const arabicData = await arabicRes.json();

    if (englishData.code !== 200 || arabicData.code !== 200) {
      showErrorPopup("Verse not found! Please check the Surah and Ayah numbers.");
      return;
    }

    const englishVerse = englishData.data;
    const arabicVerse = arabicData.data;

    const colors = ['#ff6f61', '#6dd5ed', '#fbc531', '#9b59b6', '#2ecc71', '#e67e22'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const card = document.createElement('div');
    card.className = 'verse-card';
    card.style.borderTop = `5px solid ${color}`;
    card.style.position = 'relative';

    // ===== Add Favorite Star =====
    const starBtn = document.createElement('span');
    starBtn.className = 'favorite-star';
    starBtn.innerHTML = '☆';
    starBtn.title = 'Mark as Favorite';

    // Unique key for each verse
    const verseKey = `surah${arabicVerse.surah.number}-ayah${arabicVerse.numberInSurah}`;

    // Check if already favorited
    if (localStorage.getItem(verseKey) === 'favorite') {
      starBtn.classList.add('active');
      starBtn.innerHTML = '★';
    }

    // Toggle favorite
    starBtn.addEventListener('click', () => {
      const isFav = starBtn.classList.toggle('active');
      starBtn.innerHTML = isFav ? '★' : '☆';
      if (isFav) {
        localStorage.setItem(verseKey, 'favorite');
      } else {
        localStorage.removeItem(verseKey);
      }
    });

    card.innerHTML = `
      <p class="arabic">${arabicVerse.text}</p>
      <p class="translation"><strong>${englishVerse.edition.englishName}</strong>: ${englishVerse.text}</p>
      <p class="ref">Surah ${arabicVerse.surah.number}, Ayah ${arabicVerse.numberInSurah}</p>
    `;

    // Append the favorite star
    card.appendChild(starBtn);

    // ===== Status Buttons =====
    const statusContainer = document.createElement('div');
    statusContainer.style.display = 'flex';
    statusContainer.style.gap = '5px';
    statusContainer.style.marginTop = '10px';

    const learnedBtn = document.createElement('button');
    learnedBtn.textContent = 'Learned';
    learnedBtn.style.backgroundColor = '#2ecc71';
    learnedBtn.style.color = 'white';
    learnedBtn.style.border = 'none';
    learnedBtn.style.padding = '5px 10px';
    learnedBtn.style.cursor = 'pointer';
    learnedBtn.style.borderRadius = '5px';
    learnedBtn.addEventListener('click', () => {
      card.style.backgroundColor = '#d4f7dc';
      updateCounts();
    });

    const learningBtn = document.createElement('button');
    learningBtn.textContent = 'Still Learning';
    learningBtn.style.backgroundColor = '#f1c40f';
    learningBtn.style.color = 'white';
    learningBtn.style.border = 'none';
    learningBtn.style.padding = '5px 10px';
    learningBtn.style.cursor = 'pointer';
    learningBtn.style.borderRadius = '5px';
    learningBtn.addEventListener('click', () => {
      card.style.backgroundColor = '#fff3cd';
      updateCounts();
    });

    const confusedBtn = document.createElement('button');
    confusedBtn.textContent = 'Confused';
    confusedBtn.style.backgroundColor = '#e74c3c';
    confusedBtn.style.color = 'white';
    confusedBtn.style.border = 'none';
    confusedBtn.style.padding = '5px 10px';
    confusedBtn.style.cursor = 'pointer';
    confusedBtn.style.borderRadius = '5px';
    confusedBtn.addEventListener('click', () => {
      card.style.backgroundColor = '#f8d7da';
      updateCounts();
    });

    statusContainer.appendChild(learnedBtn);
    statusContainer.appendChild(learningBtn);
    statusContainer.appendChild(confusedBtn);
    card.appendChild(statusContainer);

    verseGrid.prepend(card);
    updateCounts();

  } catch (error) {
    console.error(error);
    showErrorPopup("Something went wrong while fetching the verse. Please try again.");
  } finally {
    findVerseBtn.disabled = false;
    findVerseBtn.textContent = "Find Verse";
  }
});

// ===== Clear All Verses (Keep Favorites) =====
const clearVersesBtn = document.getElementById('clear-verses');

if (clearVersesBtn) {
  clearVersesBtn.addEventListener('click', () => {
    const cards = verseGrid.querySelectorAll('.verse-card');
    let removed = 0;

    cards.forEach(card => {
      const star = card.querySelector('.favorite-star');
      const isFav = star && star.classList.contains('active');
      if (!isFav) {
        card.remove();
        removed++;
      }
    });

    updateCounts();

    if (removed > 0) {
      showToast(`${removed} non-favorite verses cleared.`);
    } else {
      showToast("No non-favorite verses to remove!");
    }
  });
}
