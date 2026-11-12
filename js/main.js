import { initMobileNav } from "./components/nav.js";
import { initDarkMode } from "./components/darkMode.js";
import { initAccordion } from "./components/accordion.js";
import { initGitHubProfile } from "./github_profile.js";
import { initServicesSearch } from "./services_search.js";
import { initGalleryLightbox } from "./gallery_lightbox.js";
import { initScrollAnimations } from "./scroll_animations.js";
import { initBlogComments } from "./blog.js";
import { initInfiniteScroll } from "./infinite_scroll.js";
import { initBlogReading } from "./progress_bar.js";

// Initialize shared components
initMobileNav();
initDarkMode();

// Initialize Home page functionality
if (document.querySelector(".features-grid")) {
    initScrollAnimations();
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

// Initialize Gallery page functionality
if (document.getElementById("lightbox")) {
    initGalleryLightbox();
}

// Initialize Blog page functionality
if (document.getElementById("reading-progress")) {
    initBlogReading();
    initBlogComments();
    initInfiniteScroll();
}
