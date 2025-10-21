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
    // Fetch English and Arabic in parallel
    const englishUrl = `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/en.asad`;
    const arabicUrl = `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/ar.alafasy`;

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
