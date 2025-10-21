const findVerseBtn = document.getElementById('find-verse');
const verseGrid = document.getElementById('verse-grid');
const errorPopup = document.getElementById('error-popup');
const closePopup = document.getElementById('close-popup');

findVerseBtn.addEventListener('click', async () => {
  const surah = document.getElementById('surah').value.trim();
  const ayah = document.getElementById('ayah').value.trim();

  if (!surah || !ayah) {
    showErrorPopup();
    return;
  }

  findVerseBtn.disabled = true;
  findVerseBtn.textContent = "Loading...";

  try {
    // Fetch English and Arabic text in parallel
    const englishUrl = `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/en.asad`;
    const arabicUrl = `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/ar`; // <-- use text edition

    const [englishRes, arabicRes] = await Promise.all([fetch(englishUrl), fetch(arabicUrl)]);
    const englishData = await englishRes.json();
    const arabicData = await arabicRes.json();

    if (englishData.code === 200 && arabicData.code === 200) {
      const englishVerse = englishData.data;
      const arabicVerse = arabicData.data;

      // Random border color
      const colors = ['#ff6f61', '#6dd5ed', '#fbc531', '#9b59b6', '#2ecc71', '#e67e22'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      const card = document.createElement('div');
      card.className = 'verse-card';
      card.style.borderTop = `5px solid ${color}`;
      card.innerHTML = `
        <p class="arabic">${arabicVerse.text}</p>
        <p class="translation"><strong>${englishVerse.edition.englishName}</strong>: ${englishVerse.text}</p>
        <p class="ref">Surah ${arabicVerse.surah.number}, Ayah ${arabicVerse.numberInSurah}</p>
      `;

      verseGrid.prepend(card);
    } else {
      showErrorPopup();
    }
  } catch (error) {
    console.error(error);
    showErrorPopup();
  } finally {
    findVerseBtn.disabled = false;
    findVerseBtn.textContent = "Find Verse";
  }
});

// Show popup function
function showErrorPopup() {
  errorPopup.style.display = "block";
}

// Close popup
closePopup.addEventListener('click', () => {
  errorPopup.style.display = "none";
});
const findVerseBtn = document.getElementById('find-verse');
const verseGrid = document.getElementById('verse-grid');
const errorPopup = document.getElementById('error-popup');
const closePopup = document.getElementById('close-popup');

findVerseBtn.addEventListener('click', async () => {
  const surah = document.getElementById('surah').value.trim();
  const ayah = document.getElementById('ayah').value.trim();

  if (!surah || !ayah) {
    showErrorPopup();
    return;
  }

  findVerseBtn.disabled = true;
  findVerseBtn.textContent = "Loading...";

  try {
    // Fetch English and Arabic text in parallel
    const englishUrl = `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/en.asad`;
    const arabicUrl = `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/ar`;

    const [englishRes, arabicRes] = await Promise.all([fetch(englishUrl), fetch(arabicUrl)]);
    const englishData = await englishRes.json();
    const arabicData = await arabicRes.json();

    if (englishData.code === 200 && arabicData.code === 200) {
      const englishVerse = englishData.data;
      const arabicVerse = arabicData.data;

      // Random border color
      const colors = ['#ff6f61', '#6dd5ed', '#fbc531', '#9b59b6', '#2ecc71', '#e67e22'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      // Create verse card
      const card = document.createElement('div');
      card.className = 'verse-card';
      card.style.borderTop = `5px solid ${color}`;
      card.innerHTML = `
        <p class="arabic">${arabicVerse.text}</p>
        <p class="translation"><strong>${englishVerse.edition.englishName}</strong>: ${englishVerse.text}</p>
        <p class="ref">Surah ${arabicVerse.surah.number}, Ayah ${arabicVerse.numberInSurah}</p>
      `;

      // Create button container
      const statusContainer = document.createElement('div');
      statusContainer.style.display = 'flex';
      statusContainer.style.gap = '5px';
      statusContainer.style.marginTop = '10px';

      // Learned button
      const learnedBtn = document.createElement('button');
      learnedBtn.textContent = 'Learned';
      learnedBtn.style.backgroundColor = '#2ecc71';
      learnedBtn.style.color = 'white';
      learnedBtn.style.border = 'none';
      learnedBtn.style.padding = '5px 10px';
      learnedBtn.style.cursor = 'pointer';
      learnedBtn.style.borderRadius = '5px';
      learnedBtn.addEventListener('click', () => {
        card.style.backgroundColor = '#d4f7dc'; // light green
      });

      // Still Learning button
      const learningBtn = document.createElement('button');
      learningBtn.textContent = 'Still Learning';
      learningBtn.style.backgroundColor = '#f1c40f';
      learningBtn.style.color = 'white';
      learningBtn.style.border = 'none';
      learningBtn.style.padding = '5px 10px';
      learningBtn.style.cursor = 'pointer';
      learningBtn.style.borderRadius = '5px';
      learningBtn.addEventListener('click', () => {
        card.style.backgroundColor = '#fff3cd'; // light yellow
      });

      // Confused button
      const confusedBtn = document.createElement('button');
      confusedBtn.textContent = 'Confused';
      confusedBtn.style.backgroundColor = '#e74c3c';
      confusedBtn.style.color = 'white';
      confusedBtn.style.border = 'none';
      confusedBtn.style.padding = '5px 10px';
      confusedBtn.style.cursor = 'pointer';
      confusedBtn.style.borderRadius = '5px';
      confusedBtn.addEventListener('click', () => {
        card.style.backgroundColor = '#f8d7da'; // light red
      });

      // Append buttons to container and container to card
      statusContainer.appendChild(learnedBtn);
      statusContainer.appendChild(learningBtn);
      statusContainer.appendChild(confusedBtn);
      card.appendChild(statusContainer);

      verseGrid.prepend(card);
    } else {
      showErrorPopup();
    }
  } catch (error) {
    console.error(error);
    showErrorPopup();
  } finally {
    findVerseBtn.disabled = false;
    findVerseBtn.textContent = "Find Verse";
  }
});

// Show popup function
function showErrorPopup() {
  errorPopup.style.display = "block";
}

// Close popup
closePopup.addEventListener('click', () => {
  errorPopup.style.display = "none";
});
