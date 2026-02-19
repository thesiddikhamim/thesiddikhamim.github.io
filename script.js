document.addEventListener("DOMContentLoaded", () => {
    // ═══════════════════════════════════════════════════════════
    // Scroll Reveal for [data-animate] Elements
    // ═══════════════════════════════════════════════════════════
    const animatedElements = document.querySelectorAll('[data-animate]');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

    animatedElements.forEach(el => revealObserver.observe(el));

    // ═══════════════════════════════════════════════════════════
    // Navbar — background on scroll + active link highlight
    // ═══════════════════════════════════════════════════════════
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section[id], .skills-section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const updateNavbar = () => {
        // Solid background after scrolling past 60px
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active-link');
            }
        });
    };

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    // ═══════════════════════════════════════════════════════════
    // Accordion
    // ═══════════════════════════════════════════════════════════
    const accordionHeaders = document.querySelectorAll(".accordion-header");
    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const currentItem = header.parentElement;
            const wasActive = currentItem.classList.contains("active");

            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });

            if (!wasActive) {
                currentItem.classList.add("active");
            }
        });
    });

    // ═══════════════════════════════════════════════════════════
    // Mobile Navigation
    // ═══════════════════════════════════════════════════════════
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const body = document.body;

    const closeMenu = () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        body.classList.remove("no-scroll");
    };

    hamburger.addEventListener("click", (e) => {
        e.stopPropagation();
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
        body.classList.toggle("no-scroll");
    });

    document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", closeMenu));

    body.addEventListener('click', (e) => {
        if (hamburger.classList.contains('active') && !navMenu.contains(e.target)) {
            closeMenu();
        }
    });

    // ═══════════════════════════════════════════════════════════
    // "Show More" Certificates
    // ═══════════════════════════════════════════════════════════
    const showMoreBtn = document.getElementById('show-more-certs-btn');
    if (showMoreBtn) {
        const certsContainer = document.querySelector('.certificates-container');
        const allCards = Array.from(certsContainer.getElementsByClassName('certificate-card'));
        const progressBar = document.getElementById('certificates-progress-bar');
        const itemsPerLoad = 4;
        let currentlyVisible = itemsPerLoad;
        let isAnimating = false;

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
                if (total === 0) { resolve(); return; }

                allCards.slice(startIndex, endIndex).forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.remove('hidden');
                        card.classList.add('visible');
                        completed++;
                        if (completed === total) resolve();
                    }, index * 100);
                });
            });
        };

        const hideCardsWithAnimation = (startIndex, endIndex) => {
            return new Promise((resolve) => {
                let completed = 0;
                const total = endIndex - startIndex;
                if (total === 0) { resolve(); return; }

                allCards.slice(startIndex, endIndex).forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.remove('visible');
                        card.classList.add('hidden');
                        completed++;
                        if (completed === total) resolve();
                    }, index * 50);
                });
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
                    await hideCardsWithAnimation(itemsPerLoad, currentlyVisible);
                    currentlyVisible = itemsPerLoad;
                } else {
                    const showEnd = Math.min(currentlyVisible + itemsPerLoad, allCards.length);
                    await showCardsWithAnimation(currentlyVisible, showEnd);
                    currentlyVisible = showEnd;
                }
                updateProgressBar();
                updateButtonState();
            } finally {
                showMoreBtn.classList.remove('loading');
                isAnimating = false;
            }
        });

        const certObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        allCards.forEach(card => certObserver.observe(card));
    }

    // ═══════════════════════════════════════════════════════════
    // Image Zoom (Project Pages)
    // ═══════════════════════════════════════════════════════════
    const openImageModal = (imageSrc) => {
        const overlay = document.createElement('div');
        overlay.classList.add('image-zoom-overlay');
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Image viewer');

        const stage = document.createElement('div');
        stage.classList.add('image-zoom-stage');

        const zoomedImage = document.createElement('img');
        zoomedImage.src = imageSrc;
        stage.appendChild(zoomedImage);

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

        let scale = 1, minScale = 1, maxScale = 5;
        let translateX = 0, translateY = 0;
        let isPanning = false, lastX = 0, lastY = 0;
        let lastTouchDistance = null, doubleTapTimeout = null, panAnimationId = null;

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
            translateX = translateX - offsetX * (scaleFactor - 1);
            translateY = translateY - offsetY * (scaleFactor - 1);
            scale = newScale;
            render();
        };

        const resetView = () => { scale = 1; translateX = 0; translateY = 0; render(); };

        const closeOverlay = () => {
            overlay.classList.remove('visible');
            overlay.addEventListener('transitionend', () => {
                overlay.remove();
                document.body.classList.remove('no-scroll');
                document.removeEventListener('keydown', handleEsc);
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            }, { once: true });
        };

        const handleEsc = (e) => {
            if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
            if (e.key === 'Escape' || e.key === 'Esc') closeOverlay();
            else if (e.key === '+' || e.key === '=') zoomInBtn.click();
            else if (e.key === '-' || e.key === '_') zoomOutBtn.click();
            else if (e.key === '0' || e.key === 'r') resetView();
            else if (e.key.startsWith('Arrow')) {
                e.preventDefault();
                if (scale > 1) {
                    const p = 30;
                    if (e.key === 'ArrowUp') translateY += p;
                    if (e.key === 'ArrowDown') translateY -= p;
                    if (e.key === 'ArrowLeft') translateX += p;
                    if (e.key === 'ArrowRight') translateX -= p;
                    render();
                }
            }
        };

        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeOverlay(); });
        overlay.addEventListener('wheel', (e) => {
            e.preventDefault();
            zoomAtPoint(e.deltaY < 0 ? 1.15 : 0.87, e.clientX, e.clientY);
        }, { passive: false });
        overlay.addEventListener('dblclick', (e) => {
            e.preventDefault();
            scale === 1 ? zoomAtPoint(2, e.clientX, e.clientY) : resetView();
        });

        const handleMouseMove = (e) => {
            if (!isPanning) return;
            const dx = e.clientX - lastX, dy = e.clientY - lastY;
            lastX = e.clientX; lastY = e.clientY;
            if (panAnimationId) cancelAnimationFrame(panAnimationId);
            panAnimationId = requestAnimationFrame(() => {
                translateX += dx; translateY += dy; render(); panAnimationId = null;
            });
        };
        const handleMouseUp = () => {
            isPanning = false;
            stage.style.cursor = scale > 1 ? 'grab' : 'default';
            if (panAnimationId) { cancelAnimationFrame(panAnimationId); panAnimationId = null; }
        };

        stage.addEventListener('mousedown', (e) => {
            if (scale <= 1) return;
            isPanning = true; lastX = e.clientX; lastY = e.clientY;
            stage.style.cursor = 'grabbing';
        });
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        // Touch events
        overlay.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                if (doubleTapTimeout) {
                    clearTimeout(doubleTapTimeout); doubleTapTimeout = null;
                    const t = e.touches[0];
                    scale === 1 ? zoomAtPoint(2, t.clientX, t.clientY) : resetView();
                } else {
                    doubleTapTimeout = setTimeout(() => { doubleTapTimeout = null; }, 250);
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
                    translateX += t.clientX - lastX; translateY += t.clientY - lastY; render();
                }
                lastX = t.clientX; lastY = t.clientY;
            } else if (e.touches.length === 2) {
                e.preventDefault();
                const [t1, t2] = e.touches;
                const d = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
                if (lastTouchDistance) zoomAtPoint(d / lastTouchDistance, (t1.clientX + t2.clientX) / 2, (t1.clientY + t2.clientY) / 2);
                lastTouchDistance = d;
            }
        }, { passive: false });

        overlay.addEventListener('touchend', () => { lastTouchDistance = null; lastX = null; lastY = null; });

        zoomInBtn.addEventListener('click', () => {
            const r = stage.getBoundingClientRect();
            zoomAtPoint(1.2, r.left + r.width / 2, r.top + r.height / 2);
        });
        zoomOutBtn.addEventListener('click', () => {
            const r = stage.getBoundingClientRect();
            zoomAtPoint(0.83, r.left + r.width / 2, r.top + r.height / 2);
        });
        resetBtn.addEventListener('click', resetView);
        closeButton.addEventListener('click', closeOverlay);

        overlay.addEventListener('touchmove', (e) => {
            if (e.touches.length < 2 && scale === 1) return;
            e.preventDefault();
        }, { passive: false });

        overlay.appendChild(stage);
        overlay.appendChild(controls);
        overlay.appendChild(closeButton);
        document.body.appendChild(overlay);
        document.body.classList.add('no-scroll');
        requestAnimationFrame(() => overlay.classList.add('visible'));
        document.addEventListener('keydown', handleEsc);
        render();
    };

    document.querySelectorAll('.blog-content img').forEach(image => {
        let touchStartTime = 0, touchStartX = 0, touchStartY = 0, hasMoved = false;

        image.addEventListener('click', (e) => openImageModal(e.currentTarget.src));

        image.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY;
            hasMoved = false;
        }, { passive: true });

        image.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                const t = e.touches[0];
                if (Math.abs(t.clientX - touchStartX) > 10 || Math.abs(t.clientY - touchStartY) > 10) hasMoved = true;
            }
        }, { passive: true });

        image.addEventListener('touchend', (e) => {
            const dur = Date.now() - touchStartTime;
            const dx = Math.abs(e.changedTouches[0].clientX - touchStartX);
            const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
            if (dur < 300 && !hasMoved && dx < 10 && dy < 10) {
                e.preventDefault(); openImageModal(image.src);
            }
        }, { passive: false });
    });

    // ═══════════════════════════════════════════════════════════
    // Projects Section Scroll Animation
    // ═══════════════════════════════════════════════════════════
    const projectCards = document.querySelectorAll('.project-card');
    const projectObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    projectCards.forEach(card => projectObserver.observe(card));
});
