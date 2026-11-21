/* global navigator */
import { initMobileNav } from "./components/nav.js";
import { initDarkMode } from "./components/darkMode.js";
import { initAccordion } from "./components/accordion.js";
import { initBackToTop } from "./components/backToTop.js";
import { initGitHubProfile } from "./github_profile.js";
import { initServicesSearch } from "./services_search.js";
import { initGalleryLightbox } from "./gallery_lightbox.js";
import { initScrollAnimations } from "./scroll_animations.js";
import { initBlogComments } from "./blog.js";
import { initInfiniteScroll } from "./infinite_scroll.js";
import { initBlogReading } from "./progress_bar.js";
import { initContactForm } from "./form_validator.js";
import { initTeamPage } from "./team.js";
import { initLatestPosts } from "./home_latest.js";

// Initialize shared components
initMobileNav();
initDarkMode();
initBackToTop();

// Initialize Home page functionality
if (document.querySelector(".features-grid")) {
    initScrollAnimations();
    initLatestPosts();
}

// Initialize Blog page functionality
if (document.getElementById("reading-progress")) {
    initBlogReading();
    initBlogComments();
    initInfiniteScroll();
}

// Initialize About page functionality
if (document.getElementById("github-form")) {
    initGitHubProfile();
}

// Initialize Services page functionality
if (document.getElementById("service-search")) {
    initServicesSearch();
    initAccordion();
}

// Initialize Team page functionality
initTeamPage();

// Initialize Contact page functionality
if (document.getElementById("contact-form")) {
    initContactForm();
}

// Initialize Gallery page functionality
if (document.getElementById("lightbox")) {
    initGalleryLightbox();
}

// Register Service Worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
        try {
            const registration = await navigator.serviceWorker.register("./sw.js");

            console.log("Service Worker registered:", registration.scope);
        } catch (error) {
            console.error("Service Worker registration failed:", error);
        }
    });
}

// Show custom PWA install button when installation is available
function initPWAInstall() {
    let deferredInstallPrompt = null;
    const installButton = document.createElement("button");
    installButton.type = "button";
    installButton.id = "install-app";
    installButton.className = "install-app-button";
    installButton.textContent = "Install App";
    installButton.hidden = true;
    const navigation = document.getElementById("mobile-nav");

    if (navigation) {
        navigation.appendChild(installButton);
    } else {
        document.body.appendChild(installButton);
    }

    // Listen for the installation prompt
    window.addEventListener("beforeinstallprompt", event => {
        event.preventDefault();
        deferredInstallPrompt = event;
        installButton.hidden = false;
        console.log("PWA installation is available.");
    });

    // Show the browser installation prompt
    installButton.addEventListener("click", async () => {
        if (!deferredInstallPrompt) {
            return;
        }
        const promptEvent = deferredInstallPrompt;
        deferredInstallPrompt = null;
        try {
            const result = await promptEvent.prompt();
            console.log("Install prompt outcome:", result.outcome);
        } catch (error) {
            console.error("Installation prompt failed:", error);
        }
        installButton.hidden = true;
    });

    // Hide button after successful installation
    window.addEventListener("appinstalled", () => {
        deferredInstallPrompt = null;
        installButton.hidden = true;
        console.log("Black Pearl Solutions installed successfully.");
    });
}

initPWAInstall();
