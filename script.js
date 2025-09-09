document.addEventListener("DOMContentLoaded", () => {
    const accordionHeaders = document.querySelectorAll(".accordion-header");

    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            // Find the parent accordion-item
            const accordionItem = header.parentElement;

            // Toggle the 'active' class on the parent item
            accordionItem.classList.toggle("active");
        });
    });
});