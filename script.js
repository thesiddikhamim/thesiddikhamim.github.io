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

        // Stage to apply transforms and enable safe panning
        const stage = document.createElement('div');
        stage.classList.add('image-zoom-stage');

        const zoomedImage = document.createElement('img');
        zoomedImage.src = imageSrc;
        stage.appendChild(zoomedImage);

        // Controls
        const controls = document.createElement('div');
        controls.classList.add('image-zoom-controls');
        const zoomOutBtn = document.createElement('button');
        zoomOutBtn.classList.add('image-zoom-ctrl');
        zoomOutBtn.setAttribute('aria-label', 'Zoom out');
        zoomOutBtn.textContent = '−';
        const resetBtn = document.createElement('button');
        resetBtn.classList.add('image-zoom-ctrl');
        resetBtn.setAttribute('aria-label', 'Reset zoom');
        resetBtn.textContent = 'Reset';
        const zoomInBtn = document.createElement('button');
        zoomInBtn.classList.add('image-zoom-ctrl');
        zoomInBtn.setAttribute('aria-label', 'Zoom in');
        zoomInBtn.textContent = '+';
        controls.appendChild(zoomOutBtn);
        controls.appendChild(resetBtn);
        controls.appendChild(zoomInBtn);

        const closeButton = document.createElement('button');
        closeButton.classList.add('image-zoom-close-btn');
        closeButton.innerHTML = '&times;';
        closeButton.setAttribute('aria-label', 'Close image viewer');

        let scale = 1;
        let minScale = 1;
        let maxScale = 5;
        let translateX = 0;
        let translateY = 0;
        let isPanning = false;
        let lastX = 0;
        let lastY = 0;
        let lastTouchDistance = null;
        let doubleTapTimeout = null;

        const render = () => {
            stage.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
            stage.style.cursor = scale > 1 ? 'grab' : 'default';
        };

        const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

        const zoomAtPoint = (deltaScale, clientX, clientY) => {
            const rect = stage.getBoundingClientRect();
            const offsetX = clientX - (rect.left + rect.width / 2);
            const offsetY = clientY - (rect.top + rect.height / 2);

            const newScale = clamp(scale * deltaScale, minScale, maxScale);
            const scaleFactor = newScale / scale;

            // Adjust translation so the zoom centers around the pointer
            translateX = translateX - offsetX * (scaleFactor - 1);
            translateY = translateY - offsetY * (scaleFactor - 1);
            scale = newScale;
            render();
        };

        const resetView = () => {
            scale = 1;
            translateX = 0;
            translateY = 0;
            render();
        };

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

        // Mouse wheel zoom (desktop)
        overlay.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY < 0 ? 1.15 : 0.87;
            zoomAtPoint(delta, e.clientX, e.clientY);
        }, { passive: false });

        // Double-click zoom toggle (desktop)
        overlay.addEventListener('dblclick', (e) => {
            e.preventDefault();
            if (scale === 1) {
                zoomAtPoint(2, e.clientX, e.clientY);
            } else {
                resetView();
            }
        });

        // Drag to pan (mouse)
        stage.addEventListener('mousedown', (e) => {
            if (scale <= 1) return;
            isPanning = true;
            lastX = e.clientX;
            lastY = e.clientY;
            stage.style.cursor = 'grabbing';
        });
        window.addEventListener('mousemove', (e) => {
            if (!isPanning) return;
            translateX += e.clientX - lastX;
            translateY += e.clientY - lastY;
            lastX = e.clientX;
            lastY = e.clientY;
            render();
        });
        window.addEventListener('mouseup', () => {
            isPanning = false;
            stage.style.cursor = scale > 1 ? 'grab' : 'default';
        });

        // Touch: double-tap to zoom, pinch to zoom, single-finger pan
        overlay.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                // double-tap detection
                if (doubleTapTimeout) {
                    clearTimeout(doubleTapTimeout);
                    doubleTapTimeout = null;
                    const t = e.touches[0];
                    if (scale === 1) {
                        zoomAtPoint(2, t.clientX, t.clientY);
                    } else {
                        resetView();
                    }
                } else {
                    doubleTapTimeout = setTimeout(() => {
                        doubleTapTimeout = null;
                    }, 250);
                }
            }
            if (e.touches.length === 2) {
                e.preventDefault();
                const [t1, t2] = e.touches;
                lastTouchDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
            }
        }, { passive: false });

        overlay.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && scale > 1) {
                const t = e.touches[0];
                if (lastX !== null && lastY !== null) {
                    translateX += t.clientX - lastX;
                    translateY += t.clientY - lastY;
                    render();
                }
                lastX = t.clientX;
                lastY = t.clientY;
            } else if (e.touches.length === 2) {
                e.preventDefault();
                const [t1, t2] = e.touches;
                const currentDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
                if (lastTouchDistance) {
                    const deltaScale = currentDistance / lastTouchDistance;
                    const centerX = (t1.clientX + t2.clientX) / 2;
                    const centerY = (t1.clientY + t2.clientY) / 2;
                    zoomAtPoint(deltaScale, centerX, centerY);
                }
                lastTouchDistance = currentDistance;
            }
        }, { passive: false });

        overlay.addEventListener('touchend', () => {
            lastTouchDistance = null;
            lastX = null;
            lastY = null;
        });

        zoomInBtn.addEventListener('click', () => {
            const rect = stage.getBoundingClientRect();
            zoomAtPoint(1.2, rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
        zoomOutBtn.addEventListener('click', () => {
            const rect = stage.getBoundingClientRect();
            zoomAtPoint(0.83, rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
        resetBtn.addEventListener('click', resetView);

        closeButton.addEventListener('click', closeOverlay);

        // Prevent background scroll/zoom on touch devices
        overlay.addEventListener('touchmove', (e) => {
            if (e.touches.length < 2 && scale === 1) return;
            e.preventDefault();
        }, { passive: false });

        overlay.appendChild(stage);
        overlay.appendChild(controls);
        overlay.appendChild(closeButton);
        document.body.appendChild(overlay);
        document.body.classList.add('no-scroll');

        // Trigger the fade-in animation
        requestAnimationFrame(() => {
            overlay.classList.add('visible');
        });

        document.addEventListener('keydown', handleEsc);
        render();
    };

    document.querySelectorAll('.blog-content img').forEach(image => {
        image.addEventListener('click', (e) => {
            openImageModal(e.currentTarget.src);
        });
        image.addEventListener('touchstart', (e) => {
            // prevent 300ms delay and native zoom while opening
            e.preventDefault();
            openImageModal(e.currentTarget.src);
        }, { passive: false });
    });
});
