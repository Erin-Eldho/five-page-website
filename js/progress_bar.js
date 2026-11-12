export function initBlogReading() {
    const progressBar = document.getElementById("reading-progress");
    let animationFrame;

    // Reading progress bar
    if (progressBar) {
        function updateProgress() {
            const scrollTop = window.scrollY;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;
            progressBar.style.width = `${progress}%`;
            animationFrame = null;
        }

        window.addEventListener("scroll", function () {
            if (!animationFrame) {
                animationFrame = requestAnimationFrame(updateProgress);
            }
        });
        updateProgress();
    }
}
