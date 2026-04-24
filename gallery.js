if (window.galleryState) {
    window.galleryState = null;
}

window.galleryState = {
    currentImgIndex: 0,
    allImages: [],
    isAnimating: false,
    touchStartX: 0,
    currentScale: 1
};

function getPhotos() {
    return Array.from(document.querySelectorAll('.gallery_photo'));
}

function showImage(index) {
    const state = window.galleryState;
    const photos = getPhotos();
    const img1 = document.getElementById('lightbox-img');
    const img2 = document.getElementById('lightbox-img-back');

    if (photos[index] && img1 && img2) {
        state.allImages = photos;
        state.currentImgIndex = index;
        state.currentScale = 1;

        img1.src = photos[index].src;
        img1.className = 'lightbox-content';
        img1.style.display = 'block';
        img1.style.zIndex = '1005';
        img1.style.transform = 'translate(-50%, -50%) scale(1)';

        img2.style.display = 'none';
        img2.src = '';

        state.isAnimating = false;
    }
}

function changeImage(step) {
    const state = window.galleryState;
    const photos = getPhotos();
    if (photos.length === 0 || state.isAnimating) return;

    const img1 = document.getElementById('lightbox-img');
    const img2 = document.getElementById('lightbox-img-back');
    if (!img1 || !img2) return;

    state.isAnimating = true;

    const currentImg = (img1.style.display !== 'none') ? img1 : img2;
    const nextImg = (currentImg === img1) ? img2 : img1;

    state.currentImgIndex = (state.currentImgIndex + step + photos.length) % photos.length;
    nextImg.src = photos[state.currentImgIndex].src;

    nextImg.onload = () => {
        const outClass = step > 0 ? 'slide-out-left' : 'slide-out-right';
        const inClass = step > 0 ? 'slide-in-right' : 'slide-in-left';

        nextImg.style.display = 'block';
        nextImg.style.zIndex = '1005';
        currentImg.style.zIndex = '1000';

        requestAnimationFrame(() => {
            currentImg.className = 'lightbox-content ' + outClass;
            nextImg.className = 'lightbox-content ' + inClass;
        });

        setTimeout(() => {
            currentImg.style.display = 'none';
            currentImg.className = 'lightbox-content';
            currentImg.src = '';
            nextImg.className = 'lightbox-content';
            nextImg.style.transform = 'translate(-50%, -50%)';
            state.isAnimating = false;
        }, 450);
    };
}


if (!window.galleryInitialized) {
    const lightbox = document.getElementById('lightbox');

    document.addEventListener('click', (e) => {
        const state = window.galleryState;
        if (!state) return;

        if (e.target.classList.contains('gallery_photo')) {
            const photos = getPhotos();
            showImage(photos.indexOf(e.target));
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        if (e.target.id === 'lightbox' || e.target.classList.contains('lightbox-close')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
            state.isAnimating = false;
        }

        if (e.target.classList.contains('next')) changeImage(1);
        if (e.target.classList.contains('prev')) changeImage(-1);
    });

    // TOUCH EVENTY PRO SWIPE
    lightbox.addEventListener('touchstart', (e) => {
        window.galleryState.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        const state = window.galleryState;
        if (state.isAnimating) return;

        const touchEndX = e.changedTouches[0].screenX;
        const diff = state.touchStartX - touchEndX;
        const threshold = 50;
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                changeImage(1);
            } else {
                changeImage(-1);
            }
        }
    }, { passive: true });

    document.addEventListener('keydown', (e) => {
        const state = window.galleryState;
        if (!lightbox.classList.contains('active') || state.isAnimating) return;
        if (e.key === "ArrowRight") changeImage(1);
        if (e.key === "ArrowLeft") changeImage(-1);
        if (e.key === "Escape") {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    window.galleryInitialized = true;
}