export function initBackToTop() {
    const backToTopButton = document.getElementById("back-to-top");
    if (!backToTopButton) {
        return;
    }
    function updateButtonVisibility() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add("visible");
        } else {
            backToTopButton.classList.remove("visible");
        }
    }
    window.addEventListener("scroll", updateButtonVisibility);
    backToTopButton.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    updateButtonVisibility();
}
