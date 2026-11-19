export function initScrollAnimations() {
    const main = document.querySelector("main");
    if (!main) {
        return;
    }
    const selector = "section h2, article, .news-card";

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

    function observeElements(root) {
        if (root.matches && root.matches(selector)) {
            observer.observe(root);
        }
        root.querySelectorAll?.(selector).forEach(function (element) {
            observer.observe(element);
        });
    }
    observeElements(main);

    const mutationObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (node) {
                if (node instanceof Element) {
                    observeElements(node);
                }
            });
        });
    });

    mutationObserver.observe(main, {
        childList: true,
        subtree: true
    });
}
