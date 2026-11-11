export function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        "main section h2, article"
    );

    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        animatedElements.forEach(function (element) {
            observer.observe(element);
        });
    }
}
