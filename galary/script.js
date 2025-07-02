document.addEventListener('DOMContentLoaded', async function () {
    const apiKey = 'U4vEew9aA1UkCcFlp78y5Dbmqf6EBcqvs3SynHMVHD7VIFJjfDvHPGmf'; // ← Replace with your real API key
    const categories = ['nature', 'architecture', 'people', 'animals'];
    const gallery = document.querySelector('.gallery');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxCategory = document.getElementById('lightbox-category');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    let currentImageIndex = 0;
    let currentImages = [];

    // Load images from Pexels dynamically
    async function loadImages(category, perPage = 6) {
        try {
            const res = await fetch(`https://api.pexels.com/v1/search?query=${category}&per_page=${perPage}`, {
                headers: {
                    Authorization: apiKey
                }
            });
            const data = await res.json();

            data.photos.forEach(photo => {
                const item = document.createElement('div');
                item.classList.add('gallery-item');
                item.setAttribute('data-category', category);
                item.innerHTML = `
                    <img src="${photo.src.medium}" alt="${photo.alt}" loading="lazy">
                    <div class="overlay">
                        <h3>${photo.photographer}</h3>
                        <p>${category}</p>
                    </div>
                `;

                item.addEventListener('click', function () {
                    const filteredIndex = currentImages.indexOf(item);
                    openLightbox(photo.src.large, photo.photographer, category, filteredIndex);
                });

                gallery.appendChild(item);
            });
        } catch (err) {
            console.error(`Failed to load ${category} images`, err);
        }
    }

    // Load all category images
    for (let cat of categories) {
        await loadImages(cat);
    }

    // Filtering functionality
    function filterImages(category) {
        const galleryItems = document.querySelectorAll('.gallery-item');

        galleryItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.5s ease-in-out';
            } else {
                item.style.display = 'none';
            }
        });

        updateCurrentImages(category);
    }

    // Update filtered image list for lightbox navigation
    function updateCurrentImages(category) {
        const allItems = Array.from(document.querySelectorAll('.gallery-item'));
        currentImages = allItems.filter(item => category === 'all' || item.dataset.category === category);
    }

    // Add click handlers to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterImages(this.dataset.filter);
        });
    });

    // Lightbox functions
    function openLightbox(imgSrc, title, category, index) {
        lightboxImg.src = imgSrc;
        lightboxTitle.textContent = title;
        lightboxCategory.textContent = category;
        lightbox.style.display = 'flex';
        currentImageIndex = index;
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % currentImages.length;
        updateLightboxImage();
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
        updateLightboxImage();
    }

    function updateLightboxImage() {
        const currentItem = currentImages[currentImageIndex];
        const img = currentItem.querySelector('img');
        const title = currentItem.querySelector('h3').textContent;
        const category = currentItem.querySelector('p').textContent;

        lightboxImg.src = img.src;
        lightboxTitle.textContent = title;
        lightboxCategory.textContent = category;
    }

    // Lightbox event listeners
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });
    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);

    document.addEventListener('keydown', function (e) {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') closeLightbox();
            else if (e.key === 'ArrowRight') showNextImage();
            else if (e.key === 'ArrowLeft') showPrevImage();
        }
    });

    // Default filter on load
    updateCurrentImages('all');

    // CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .gallery-item {
            transition: all 0.3s ease;
        }
        .gallery-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
    `;
    document.head.appendChild(style);
});
