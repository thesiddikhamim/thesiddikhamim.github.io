document.addEventListener("DOMContentLoaded", () => {
    // --- Refined Accordion Logic ---
    const accordionHeaders = document.querySelectorAll(".accordion-header");
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const currentItem = header.parentElement;
            const wasActive = currentItem.classList.contains("active");

            // Close all accordion items first
            accordionItems.forEach(item => {
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
    
    // Close menu when clicking outside of it - optimized with passive event listener
    body.addEventListener('click', (e) => {
        if (hamburger.classList.contains('active') && !navMenu.contains(e.target)) {
            closeMenu();
        }
    }, { passive: true });

    // --- Enhanced "Show More" Certificates Logic ---
    const showMoreBtn = document.getElementById('show-more-certs-btn');
    if (showMoreBtn) {
        const certsContainer = document.querySelector('.certificates-container');
        const allCards = Array.from(certsContainer.getElementsByClassName('certificate-card'));
        const progressBar = document.getElementById('certificates-progress-bar');
        const itemsPerLoad = 4;
        let currentlyVisible = itemsPerLoad;
        let isAnimating = false;

        // Initialize cards with staggered animation
        const initializeCards = () => {
            allCards.forEach((card, index) => {
                if (index < itemsPerLoad) {
                    card.classList.add('visible');
                } else {
                    card.classList.add('hidden');
                }
            });
        };

        const updateProgressBar = () => {
            const progress = (currentlyVisible / allCards.length) * 100;
            progressBar.style.width = `${progress}%`;
        };

        const showCardsWithAnimation = (startIndex, endIndex) => {
            return new Promise((resolve) => {
                let completed = 0;
                const total = endIndex - startIndex;
                
                if (total === 0) {
                    resolve();
                    return;
                }

                // Use requestAnimationFrame for better performance
                const animateCards = (index) => {
                    if (index >= endIndex) {
                        resolve();
                        return;
                    }
                    
                    const card = allCards[index];
                    card.classList.remove('hidden');
                    card.classList.add('visible');
                    
                    requestAnimationFrame(() => {
                        setTimeout(() => animateCards(index + 1), 50); // Reduced delay for faster animation
                    });
                };
                
                animateCards(startIndex);
            });
        };

        const hideCardsWithAnimation = (startIndex, endIndex) => {
            return new Promise((resolve) => {
                const total = endIndex - startIndex;
                
                if (total === 0) {
                    resolve();
                    return;
                }

                // Use requestAnimationFrame for better performance
                const animateCards = (index) => {
                    if (index >= endIndex) {
                        resolve();
                        return;
                    }
                    
                    const card = allCards[index];
                    card.classList.remove('visible');
                    card.classList.add('hidden');
                    
                    requestAnimationFrame(() => {
                        setTimeout(() => animateCards(index + 1), 25); // Faster hide animation
                    });
                };
                
                animateCards(startIndex);
            });
        };

        const updateButtonState = () => {
            const buttonText = showMoreBtn.querySelector('.button-text');
            if (currentlyVisible >= allCards.length) {
                buttonText.textContent = 'View Less';
                showMoreBtn.classList.add('less');
            } else {
                buttonText.textContent = 'View More';
                showMoreBtn.classList.remove('less');
            }
        };

        // Initial setup
        if (allCards.length <= itemsPerLoad) {
            showMoreBtn.style.display = 'none';
            progressBar.style.display = 'none';
        } else {
            initializeCards();
            updateProgressBar();
            updateButtonState();
        }

        showMoreBtn.addEventListener('click', async () => {
            if (isAnimating) return;
            
            isAnimating = true;
            showMoreBtn.classList.add('loading');
            
            try {
                if (currentlyVisible >= allCards.length) {
                    // "Show Less" was clicked
                    const hideStartIndex = itemsPerLoad;
                    const hideEndIndex = currentlyVisible;
                    
                    await hideCardsWithAnimation(hideStartIndex, hideEndIndex);
                    currentlyVisible = itemsPerLoad;
                } else {
                    // "Show More" was clicked
                    const showStartIndex = currentlyVisible;
                    const showEndIndex = Math.min(currentlyVisible + itemsPerLoad, allCards.length);
                    
                    await showCardsWithAnimation(showStartIndex, showEndIndex);
                    currentlyVisible = showEndIndex;
                }
                
                updateProgressBar();
                updateButtonState();
            } finally {
                showMoreBtn.classList.remove('loading');
                isAnimating = false;
            }
        });

        // Add intersection observer for scroll-triggered animations and lazy loading
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    
                    // Lazy load images
                    const img = entry.target.querySelector('img');
                    if (img && img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                }
            });
        }, observerOptions);

        // Observe all certificate cards
        allCards.forEach(card => {
            observer.observe(card);
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
        // Set initial state for animation
        zoomedImage.style.opacity = '0';
        stage.appendChild(zoomedImage);

        // Controls
        const controls = document.createElement('div');
        controls.classList.add('image-zoom-controls');
        const zoomOutBtn = document.createElement('button');
        zoomOutBtn.classList.add('image-zoom-ctrl');
        zoomOutBtn.setAttribute('aria-label', 'Zoom out');
        zoomOutBtn.textContent = '−';
        zoomOutBtn.title = 'Zoom Out';
        const resetBtn = document.createElement('button');
        resetBtn.classList.add('image-zoom-ctrl');
        resetBtn.setAttribute('aria-label', 'Reset zoom');
        resetBtn.textContent = 'Reset';
        resetBtn.title = 'Reset Zoom';
        const zoomInBtn = document.createElement('button');
        zoomInBtn.classList.add('image-zoom-ctrl');
        zoomInBtn.setAttribute('aria-label', 'Zoom in');
        zoomInBtn.textContent = '+';
        zoomInBtn.title = 'Zoom In';
        // Add zoom level indicator
        const zoomIndicator = document.createElement('div');
        zoomIndicator.classList.add('zoom-level-indicator');
        zoomIndicator.textContent = '100%';
        zoomIndicator.style.cssText = `
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.8rem;
            font-weight: 600;
            border: 2px solid rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            min-width: 50px;
            text-align: center;
        `;

        controls.appendChild(zoomOutBtn);
        controls.appendChild(resetBtn);
        controls.appendChild(zoomInBtn);
        controls.appendChild(zoomIndicator);

        const closeButton = document.createElement('button');
        closeButton.classList.add('image-zoom-close-btn');
        closeButton.innerHTML = '&times;';
        closeButton.setAttribute('aria-label', 'Close image viewer (ESC)');
        closeButton.title = 'Close (ESC)';

        let scale = 1; // Start scale at 1, but will be overridden
        let minScale = 0.3; // Allow zoom out to 30%
        let maxScale = 5; // Allow zoom in to 500%
        let translateX = 0;
        let translateY = 0;
        let isPanning = false;
        let lastX = 0;
        let lastY = 0;
        let lastTouchDistance = null;
        let doubleTapTimeout = null;

        const render = () => {
            // Apply panning to the stage, but scaling to the image
            stage.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
            zoomedImage.style.transform = `scale(${scale})`;
            stage.style.cursor = scale > 1 ? 'grab' : 'default';
            
            // Update zoom level indicator
            zoomIndicator.textContent = `${Math.round(scale * 100)}%`;
        };

        // Center the image initially
        const centerImage = () => {
            // Reset to center
            translateX = 0;
            translateY = 0;
            render();
        };

        // Fit image to screen at optimal zoom level - maximize size
        const fitImageToScreen = () => {
            const naturalWidth = zoomedImage.naturalWidth;
            const naturalHeight = zoomedImage.naturalHeight;

            if (naturalWidth === 0 || naturalHeight === 0) {
                centerImage();
                return;
            }
            
            // Get the available content area inside the overlay, respecting the padding.
            const overlayStyle = window.getComputedStyle(overlay);
            const availableWidth = overlay.clientWidth - (parseFloat(overlayStyle.paddingLeft) + parseFloat(overlayStyle.paddingRight));
            const availableHeight = overlay.clientHeight - (parseFloat(overlayStyle.paddingTop) + parseFloat(overlayStyle.paddingBottom));
            
            let initialScale;
            const isMobile = window.innerWidth <= 768;
            
            if (isMobile) {
                // On mobile, prioritize filling the width for a more impactful view.
                initialScale = availableWidth / naturalWidth;
            } else {
                // On desktop, fit the entire image within the available space.
                const scaleBasedOnWidth = availableWidth / naturalWidth;
                const scaleBasedOnHeight = availableHeight / naturalHeight;
                initialScale = Math.min(scaleBasedOnWidth, scaleBasedOnHeight);
            }
            
            scale = initialScale;
            translateX = 0;
            translateY = 0;
            render();
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
            fitImageToScreen();
        };

        const closeOverlay = () => {
            overlay.classList.remove('visible');
            overlay.addEventListener('transitionend', () => {
                overlay.remove();
                document.body.classList.remove('no-scroll');
                document.removeEventListener('keydown', handleEsc);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            }, { once: true });
        };

        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closeOverlay();
            }
        };

        // Mouse wheel zoom (desktop) - optimized for better responsiveness
        overlay.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY < 0 ? 1.15 : 0.85; // Better zoom increment
            zoomAtPoint(delta, e.clientX, e.clientY);
        }, { passive: false });

        // Double-click zoom toggle (desktop) - improved zoom levels
        overlay.addEventListener('dblclick', (e) => {
            e.preventDefault();
            if (scale < 2) {
                zoomAtPoint(2.5, e.clientX, e.clientY); // Zoom to 2.5x on double-click
            } else {
                resetView(); // Reset to fit-to-screen
            }
        });

        // Drag to pan (mouse) - optimized with requestAnimationFrame
        let animationFrame;
        stage.addEventListener('mousedown', (e) => {
            if (scale <= 1) return;
            e.preventDefault();
            isPanning = true;
            lastX = e.clientX;
            lastY = e.clientY;
            stage.style.cursor = 'grabbing';
        });
        
        const handleMouseMove = (e) => {
            if (!isPanning) return;
            e.preventDefault();
            cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(() => {
                translateX += e.clientX - lastX;
                translateY += e.clientY - lastY;
                lastX = e.clientX;
                lastY = e.clientY;
                render();
            });
        };
        
        const handleMouseUp = () => {
            isPanning = false;
            stage.style.cursor = scale > 1 ? 'grab' : 'default';
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

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
                e.preventDefault();
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
            const rect = overlay.getBoundingClientRect();
            zoomAtPoint(1.2, rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
        zoomOutBtn.addEventListener('click', () => {
            const rect = overlay.getBoundingClientRect();
            zoomAtPoint(0.8, rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
        resetBtn.addEventListener('click', resetView);

        closeButton.addEventListener('click', closeOverlay);
        
        // Close when clicking outside the image
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeOverlay();
            }
        });

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

        zoomedImage.onload = () => {
            // 1. Set initial scale to 0 before animation
            scale = 0;
            render();

            // 2. Make the overlay visible
            overlay.classList.add('visible');

            // 3. In the next frame, calculate final size and animate
            requestAnimationFrame(() => {
                fitImageToScreen();
                zoomedImage.style.opacity = '1';
            });
        };

        document.addEventListener('keydown', handleEsc);
    };    

    // Add zoom functionality to project images on main page
    document.querySelectorAll('.project-image').forEach(image => {
        image.addEventListener('click', (e) => {
            e.preventDefault();
            openImageModal(image.src);
        });
    });

    document.querySelectorAll('.blog-content img').forEach(image => {
        let touchStartTime = 0;
        let touchStartX = 0;
        let touchStartY = 0;
        let hasMoved = false;

        image.addEventListener('click', (e) => {
            openImageModal(e.currentTarget.src);
        });

        image.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            hasMoved = false;
        }, { passive: true });

        image.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                const deltaX = Math.abs(touch.clientX - touchStartX);
                const deltaY = Math.abs(touch.clientY - touchStartY);
                
                // If the touch has moved more than 10px, consider it a scroll
                if (deltaX > 10 || deltaY > 10) {
                    hasMoved = true;
                }
            }
        }, { passive: true });

        image.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            const deltaX = Math.abs(e.changedTouches[0].clientX - touchStartX);
            const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY);
            
            // Only open zoom if it was a quick tap (less than 300ms) and didn't move much
            if (touchDuration < 300 && !hasMoved && deltaX < 10 && deltaY < 10) {
                e.preventDefault();
                openImageModal(image.src);
            }
        }, { passive: false });
    });
});
