const STATIC_CACHE = "black-pearl-static-v1";
const API_CACHE = "black-pearl-api-v1";

const PRECACHE_URLS = [
    // HTML pages
    "./",
    "./index.html",
    "./about.html",
    "./blog.html",
    "./contact.html",
    "./services.html",
    "./team.html",
    "./gallery.html",

    // CSS files
    "./css/base.css",
    "./css/components.css",
    "./css/layout.css",
    "./css/main.css",
    "./css/pages.css",

    // Javascript files
    "./js/main.js",
    "./js/blog.js",
    "./js/form_validator.js",
    "./js/gallery_lightbox.js",
    "./js/github_profile.js",
    "./js/home_latest.js",
    "./js/infinite_scroll.js",
    "./js/progress_bar.js",
    "./js/scroll_animations.js",
    "./js/services_search.js",
    "./js/team.js",
    "./js/utils.js",
    "./js/components/accordion.js",
    "./js/components/backToTop.js",
    "./js/components/darkMode.js",
    "./js/components/nav.js",

    // Images and favicon
    "./images/homepage.png",
    "./images/homepage1.png",
    "./favicon.ico",

    // Service worker script
    "./sw.js"
];

// Install event: precache all static resources
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

// Activate event: remove old cache versions
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(
                    name => name.startsWith("black-pearl-") && 
                    name !== STATIC_CACHE &&
                    name !== API_CACHE
                ).map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event: cache-first for static assets
async function cacheFirst(request) {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request, {
        ignoreSearch: true
    });

    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const response = await fetch(request);
        if (response.ok || response.type === "opaque") {
            await cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        if (request.mode === "navigate") {
            const fallback = await cache.match("./index.html");
            if (fallback) {
                return fallback;
            }
        }
        return new Response("Resource unavailable offline.", {
            status: 503,
            statusText: "Service Unavailable"
        });
    }
}

// Fetch event: network-first for API requests
async function networkFirst(request) {
    const cache = await caches.open(API_CACHE);
    try {
        const response = await fetch(request);
        if (response.ok) {
            try {
                await cache.put(request, response.clone());
            } catch (error) {
                console.log("API response could not be cached:", error);
            }
        }
        return response;
    } catch (error) {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return new Response(
            JSON.stringify({ error: "API unavailable offline." }),
            {
                status: 503,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
}

// Handle fetch requests
self.addEventListener("fetch", event => {
    const request = event.request;
    if (request.method !== "GET") {
        return;
    }
    const url = new URL(request.url);
    const staticExtensions = /\.(html|css|js|png|jpe?g|webp|gif|svg|ico|avif)$/i;
    const isStaticRequest = (
        url.origin === self.location.origin && ( 
            request.mode === "navigate" || 
            ["style", "script", "image", "font"].includes(request.destination) || 
            staticExtensions.test(url.pathname)
        )
    ) || request.destination === "image";
    if (isStaticRequest) {
        event.respondWith(cacheFirst(request));
        return;
    }
    
    // Fetch API requests use network-first strategy
    if (request.destination === "") {
        event.respondWith(networkFirst(request));
    }
});
