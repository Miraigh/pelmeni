document.addEventListener('DOMContentLoaded', () => {
    loadSeries();
    loadCharacters();
});

function switchTab(tabName) {
    const sections = document.querySelectorAll('.view-section');
    sections.forEach(sec => {
        sec.style.display = 'none';
        sec.classList.remove('active');
    });

    const activeSection = document.getElementById(`view-${tabName}`);
    if (activeSection) {
        activeSection.style.display = 'block';
        setTimeout(() => activeSection.classList.add('active'), 10);
    }

    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// === ОБНОВЛЕННАЯ ФУНКЦИЯ ЗАГРУЗКИ СЕРИЙ ===
function loadSeries() {
    const listContainer = document.getElementById('episode-list-container');
    const player = document.getElementById('main-player');
    const title = document.getElementById('now-playing-title');
    const desc = document.getElementById('now-playing-desc');
    
    const episodes = siteContent.series;

    if (episodes.length > 0) {
        playEpisode(episodes[0], 0);
    }

    episodes.forEach((ep, index) => {
        const item = document.createElement('div');
        item.className = 'episode-item';
        item.id = `ep-btn-${index}`;
        
        // Тут мы создаем HTML для элемента списка: картинка + текст
        item.innerHTML = `
            <div class="ep-thumb-wrapper">
                <img src="${ep.poster}" alt="Thumb">
            </div>
            <div class="ep-info">
                <span class="episode-title">${ep.title}</span>
                <span class="episode-meta">Смотреть ▶</span>
            </div>
        `;
        
        item.addEventListener('click', () => {
            playEpisode(ep, index);
            player.play();
        });

        listContainer.appendChild(item);
    });

    function playEpisode(ep, index) {
        player.src = ep.videoFile;
        player.poster = ep.poster || "";
        title.innerText = ep.title;
        desc.innerText = ep.description;

        document.querySelectorAll('.episode-item').forEach(el => el.classList.remove('active'));
        const currentBtn = document.getElementById(`ep-btn-${index}`);
        if(currentBtn) currentBtn.classList.add('active');
    }
}

function loadCharacters() {
    const grid = document.getElementById('char-grid-container');
    const chars = siteContent.characters;

    chars.forEach(char => {
        const item = document.createElement('div');
        item.className = 'char-avatar-item';
        
        item.innerHTML = `
            <div class="avatar-circle">
                <img src="${char.avatar}" alt="${char.name}">
            </div>
            <div class="avatar-name">${char.name}</div>
        `;

        item.addEventListener('click', () => {
            openModal(char);
        });

        grid.appendChild(item);
    });
}

// МОДАЛКА
const modal = document.getElementById('char-modal');
const modalImg = document.getElementById('modal-img');
const modalName = document.getElementById('modal-name');
const modalDesc = document.getElementById('modal-desc');
const formsContainer = document.getElementById('modal-forms-buttons');

// ЛАЙТБОКС
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

function openModal(char) {
    modalName.innerText = char.name;
    formsContainer.innerHTML = '';

    if (char.forms.length > 1) {
        char.forms.forEach((form, index) => {
            const btn = document.createElement('button');
            btn.className = 'form-btn';
            btn.innerText = form.formName;
            if (index === 0) btn.classList.add('active');

            btn.addEventListener('click', () => {
                setFormData(form);
                document.querySelectorAll('.form-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });

            formsContainer.appendChild(btn);
        });
    }

    setFormData(char.forms[0]);
    modal.style.display = 'flex';
}

function setFormData(form) {
    modalImg.src = form.img;
    modalDesc.innerText = form.desc;
}

function closeModal() {
    modal.style.display = 'none';
}

modalImg.addEventListener('click', () => {
    lightbox.style.display = 'flex';
    lightboxImg.src = modalImg.src;
});

function closeLightbox() {
    lightbox.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
    if (event.target == lightbox) {
        closeLightbox();
    }
}
