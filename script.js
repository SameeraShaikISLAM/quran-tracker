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

  const url = `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/en.asad`;
  findVerseBtn.disabled = true;
  findVerseBtn.textContent = "Loading...";

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.code === 200) {
      const verse = data.data;

      // Random border color
      const colors = ['#ff6f61', '#6dd5ed', '#fbc531', '#9b59b6', '#2ecc71', '#e67e22'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      const card = document.createElement('div');
      card.className = 'verse-card';
      card.style.borderTop = `5px solid ${color}`;
      card.innerHTML = `
        <p class="arabic">${verse.text}</p>
        <p class="translation"><strong>${verse.edition.englishName}</strong>: ${verse.text}</p>
        <p class="ref">Surah ${verse.surah.number}, Ayah ${verse.numberInSurah}</p>
      `;

      verseGrid.prepend(card);
    } else {
      showErrorPopup();
    }
  } catch (error) {
    showErrorPopup();
    console.error(error);
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
