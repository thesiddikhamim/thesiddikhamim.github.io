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