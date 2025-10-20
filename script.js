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
    document.querySelectorAll('.blog-content img').forEach(image => {
        image.addEventListener('click', () => {
            // Create overlay element
            const overlay = document.createElement('div');
            overlay.classList.add('image-zoom-overlay');

            // Create image element for the overlay
            const zoomedImage = document.createElement('img');
            zoomedImage.src = image.src;

            // Add image to overlay
            overlay.appendChild(zoomedImage);

            // Add overlay to the body
            document.body.appendChild(overlay);
            document.body.classList.add('no-scroll'); // Prevent background scrolling

            // Remove overlay when clicked
            overlay.addEventListener('click', () => {
                overlay.remove();
                document.body.classList.remove('no-scroll');
            });
        });
    });
});
