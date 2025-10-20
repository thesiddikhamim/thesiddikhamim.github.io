document.addEventListener("DOMContentLoaded", () => {
    // --- Refined Accordion Logic ---
    const accordionHeaders = document.querySelectorAll(".accordion-header");

    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const currentItem = header.parentElement;
            const wasActive = currentItem.classList.contains("active");

            // Close all accordion items first
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });

            // If the clicked item wasn't the one already active, open it
            if (!wasActive) {
                currentItem.classList.add("active");
            }
        });
    });

    // --- Improved Mobile Navigation Logic ---
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const body = document.body;

    const closeMenu = () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        body.classList.remove("no-scroll");
    };

    hamburger.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevents the click from bubbling up to the body
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
        body.classList.toggle("no-scroll");
    });

    // Close menu when a link is clicked
    document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", closeMenu));
    
    // Close menu when clicking outside of it
    body.addEventListener('click', (e) => {
        if (hamburger.classList.contains('active') && !navMenu.contains(e.target)) {
            closeMenu();
        }
    });

    // --- "Show More" Certificates Logic ---
    const certsContainer = document.querySelector('.certificates-container');
    if (certsContainer) {
        const showMoreBtn = document.getElementById('show-more-certs-btn');
        const certificateCards = Array.from(certsContainer.getElementsByClassName('certificate-card'));
        const itemsPerLoad = 4;
        let visibleItems = itemsPerLoad;

        // Initially hide all cards beyond the initial limit
        certificateCards.forEach((card, index) => {
            if (index >= visibleItems) {
                card.classList.add('hidden');
            }
        });

        // Hide the "Show More" button if there are not enough cards to hide
        if (certificateCards.length <= visibleItems) {
            showMoreBtn.style.display = 'none';
        }

        showMoreBtn.addEventListener('click', () => {
            const nextVisibleItems = visibleItems + itemsPerLoad;
            certificateCards.slice(visibleItems, nextVisibleItems).forEach(card => card.classList.remove('hidden'));
            visibleItems = nextVisibleItems;
            if (visibleItems >= certificateCards.length) showMoreBtn.style.display = 'none';
        });
    }

    // --- Image Zoom Functionality for Project Pages ---
    const viewportMeta = document.querySelector('meta[name="viewport"]');

    const openImageModal = (imageSrc) => {
        const overlay = document.createElement('div');
        overlay.classList.add('image-zoom-overlay');
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Image viewer');

        const zoomedImage = document.createElement('img');
        zoomedImage.src = imageSrc;

        const closeButton = document.createElement('button');
        closeButton.classList.add('image-zoom-close-btn');
        closeButton.innerHTML = '&times;';
        closeButton.setAttribute('aria-label', 'Close image viewer');

        const closeOverlay = () => {
            overlay.classList.remove('visible');
            overlay.addEventListener('transitionend', () => {
                overlay.remove();
                document.body.classList.remove('no-scroll');
                document.removeEventListener('keydown', handleEsc);
            }, { once: true });
        };

        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closeOverlay();
            }
        };

        closeButton.addEventListener('click', closeOverlay);

        // Prevent background scroll/zoom on touch devices
        overlay.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });

        overlay.appendChild(zoomedImage);
        overlay.appendChild(closeButton);
        document.body.appendChild(overlay);
        document.body.classList.add('no-scroll');

        // Trigger the fade-in animation
        requestAnimationFrame(() => {
            overlay.classList.add('visible');
        });

        document.addEventListener('keydown', handleEsc);
    };

    document.querySelectorAll('.blog-content img').forEach(image => {
        image.addEventListener('click', (e) => {
            openImageModal(e.currentTarget.src);
        });
        image.addEventListener('touchstart', (e) => {
            e.preventDefault();
            openImageModal(e.currentTarget.src);
        });
    });
});
