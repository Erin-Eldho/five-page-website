// Apply the saved theme before the page renders
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
} else {
    document.documentElement.removeAttribute("data-theme");
}

export function initDarkMode() {
    const themeToggle = document.getElementById("dark-mode-toggle");
    if (!themeToggle) {
        return;
    }

    // Restore the button state
    const isDarkMode =
        document.documentElement.getAttribute("data-theme") === "dark";
    themeToggle.setAttribute("aria-pressed", isDarkMode);

    // Toggle dark mode when the button is clicked
    themeToggle.addEventListener("click", function () {
        const isDarkMode =
            document.documentElement.getAttribute("data-theme") !== "dark";
        if (isDarkMode) {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("theme", "light");
        }

        // Synchronize aria-pressed with the current state
        themeToggle.setAttribute("aria-pressed", isDarkMode);
    });
}
