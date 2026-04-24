let activePage = window.location.hash.replace('#', '') || 'kontakt';

async function loadPage(pageName) {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) return;

    if (contentDiv.dataset.loadedPage === pageName) return;

    try {
        const response = await fetch(`pages/${pageName}.html`);
        if (!response.ok) throw new Error('Network response was not ok');

        const html = await response.text();
        contentDiv.innerHTML = html;
        contentDiv.dataset.loadedPage = pageName;

        activePage = pageName;

        // Aktualizace menu
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('menu_selected', link.dataset.page === pageName);
        });

        updateBackground(pageName);

        // načte galerii
        if (pageName === 'foto') {
            loadGalleryScript();
        }

    } catch (error) {
        console.error('Chyba při načítání:', error);
        contentDiv.innerHTML = "<h2>Chyba při načítání stránky.</h2>";
    }
}

function updateBackground(pageName) {
    const targetLayer = document.getElementById(`bg-${pageName}`);
    if (!targetLayer || targetLayer.classList.contains('active')) return;

    const layers = document.querySelectorAll('.background-layer');
    layers.forEach(layer => {
        layer.classList.remove('active');
    });

    targetLayer.classList.add('active');
}

if (window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener('mouseover', (e) => {
        const link = e.target.closest('.nav-link');
        if (link) updateBackground(link.dataset.page);
    });

    document.addEventListener('mouseout', (e) => {
        const link = e.target.closest('.nav-link');
        if (link) updateBackground(activePage);
    });
}

window.addEventListener('hashchange', () => {
    const newPage = window.location.hash.replace('#', '') || 'kontakt';
    loadPage(newPage);
});

// Inicializace při načtení
window.addEventListener('DOMContentLoaded', () => {
    loadPage(activePage);

    if (sessionStorage.getItem('introPlayed')) {
        document.body.classList.remove('animate-in');
    } else {
        setTimeout(() => {
            document.body.classList.remove('animate-in');
            sessionStorage.setItem('introPlayed', 'true');
        }, 5000);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const mainTitle = document.querySelector('h1');

    if (mainTitle) {
        mainTitle.addEventListener('click', () => {
            mainTitle.classList.add('pre-expanded');
        });
    }
});

function loadGalleryScript() {
    if (document.getElementById('gallery-js')) return;

    const script = document.createElement('script');
    script.src = 'gallery.js';
    script.id = 'gallery-js';
    script.defer = true;
    document.body.appendChild(script);
}
