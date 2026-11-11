export function initMobileNav() {
    const navToggle = document.getElementById("nav-toggle");
    const mobileNav = document.getElementById("mobile-nav");
    const navOverlay = document.getElementById("nav-overlay");

    if (navToggle && mobileNav && navOverlay) {
        const navLinks = mobileNav.querySelectorAll("a[href]");
        let previousBodyOverflow = "";

        // Open the navigation drawer
        function openDrawer() {
            previousBodyOverflow = document.body.style.overflow;
            mobileNav.classList.add("open");
            navOverlay.classList.add("open");
            navToggle.setAttribute("aria-expanded", "true");
            document.body.style.overflow = "hidden";
            if (navLinks.length > 0) {
                navLinks[0].focus();
            }
        }

        // Close the navigation drawer
        function closeDrawer() {
            mobileNav.classList.remove("open");
            navOverlay.classList.remove("open");
            navToggle.setAttribute("aria-expanded", "false");
            document.body.style.overflow = previousBodyOverflow;
            navToggle.focus();
        }

        // Toggle the navigation drawer
        navToggle.addEventListener("click", function () {
            if (mobileNav.classList.contains("open")) {
                closeDrawer();
            } else {
                openDrawer();
            }
        });

        // Close the drawer when the overlay is clicked
        navOverlay.addEventListener("click", closeDrawer);

        // Handle Escape key and keyboard focus trap
        document.addEventListener("keydown", function (event) {
            if (!mobileNav.classList.contains("open")) {
                return;
            }
            if (event.key === "Escape") {
                event.preventDefault();
                closeDrawer();
                return;
            }
            if (event.key === "Tab") {
                const firstLink = navLinks[0];
                const lastLink = navLinks[navLinks.length - 1];
                if (event.shiftKey && document.activeElement === firstLink) {
                    event.preventDefault();
                    lastLink.focus();
                } else if (
                    !event.shiftKey &&
                    document.activeElement === lastLink
                ) {
                    event.preventDefault();
                    firstLink.focus();
                } else if (!mobileNav.contains(document.activeElement)) {
                    event.preventDefault();
                    if (event.shiftKey) {
                        lastLink.focus();
                    } else {
                        firstLink.focus();
                    }
                }
            }
        });
    }
}
