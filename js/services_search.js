import { debounce } from "./utils.js";
const API_URL = "https://jsonplaceholder.typicode.com/posts?_limit=99";
const SERVICE_CATEGORIES = [
    "Web Development",
    "Cloud Solutions",
    "AI & Automation"
];

export function initServicesSearch() {
    // Select search elements and service cards
    const searchInput = document.getElementById("service-search");
    const categoryFilter = document.getElementById("service-category");
    const clearButton = document.getElementById("clear-search");
    const noResults = document.getElementById("no-results");
    const serviceGrid = document.querySelector(".service-grid");
    const loading = document.getElementById("service-loading");
    const errorContainer = document.getElementById("service-error");
    const errorMessage = document.getElementById("service-error-message");
    const retryButton = document.getElementById("service-retry");

    if (
        !searchInput ||
        !categoryFilter ||
        !clearButton ||
        !noResults ||
        !serviceGrid ||
        !loading ||
        !errorContainer ||
        !errorMessage ||
        !retryButton
    ) {
        return;
    }

    let services = [];
    let isLoading = false;

    // Create loading skeleton cards
    function showSkeletons() {
        serviceGrid.querySelectorAll(".service-card").forEach(function (card) {
            card.remove();
        });
        for (let i = 0; i < 3; i++) {
            const skeleton = document.createElement("article");
            skeleton.className = "service-card service-skeleton";
            skeleton.setAttribute("aria-hidden", "true");
            for (let j = 0; j < 4; j++) {
                const line = document.createElement("span");
                line.className = "skeleton-line";
                if (j === 0) {
                    line.classList.add("skeleton-title");
                }
                skeleton.appendChild(line);
            }
            serviceGrid.appendChild(skeleton);
        }
    }

    // Remove loading skeleton cards
    function removeSkeletons() {
        serviceGrid.querySelectorAll(".service-skeleton").forEach(function (card) {
            card.remove();
        });
    }

    // Fetch services from JSONPlaceholder
    async function loadServices() {
        if (isLoading) {
            return;
        }
        isLoading = true;
        loading.hidden = false;
        errorContainer.hidden = true;
        noResults.hidden = true;
        showSkeletons();
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error("Unable to load services. Please try again.");
            }
            const posts = await response.json();
            if (!Array.isArray(posts)) {
                throw new Error("Invalid services data received.");
            }
            services = posts.map(function (post) {
                return {
                    ...post,
                    category: SERVICE_CATEGORIES[(post.userId - 1) % SERVICE_CATEGORIES.length]
                };
            });
            restoreFiltersFromURL();
        } catch (error) {
            errorMessage.textContent = error.message;
            errorContainer.hidden = false;
        } finally {
            isLoading = false;
            loading.hidden = true;
            removeSkeletons();
        }
    }

    // Highlight matching text inside a card
    function highlightMatches(card, searchTerm) {
        const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
        const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
        const textNodes = [];
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        textNodes.forEach(function (node) {
            const text = node.nodeValue;
            regex.lastIndex = 0;
            if (!regex.test(text)) {
                return;
            }
            regex.lastIndex = 0;
            const fragment = document.createDocumentFragment();
            let lastIndex = 0;
            let match;
            while ((match = regex.exec(text)) !== null) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
                const highlight = document.createElement("span");
                highlight.className = "highlight";
                highlight.textContent = match[0];
                fragment.appendChild(highlight);
                lastIndex = regex.lastIndex;
            }
            fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
            node.parentNode.replaceChild(fragment, node);
        });
    }

    // Create a service card
    function createServiceCard(service, searchTerm) {
        const card = document.createElement("article");
        card.className = "service-card";

        const title = document.createElement("h2");
        title.textContent = service.title;

        const category = document.createElement("p");
        category.className = "service-category";
        category.textContent = `Category: ${service.category}`;

        const description = document.createElement("p");
        description.textContent = service.body;

        const link = document.createElement("a");
        link.href = "contact.html";
        link.textContent = "Discuss This Service";

        card.append(title, category, description, link);
        if (searchTerm) {
            highlightMatches(card, searchTerm);
        }
        return card;
    }

    // Filter services by search term and category
    function filterServices() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const selectedCategory = categoryFilter.value;
        const filteredServices = services.filter(function (service) {
            const matchesSearch = 
            service.title.toLowerCase().includes(searchTerm) ||
            service.body.toLowerCase().includes(searchTerm) ||
            service.category.toLowerCase().includes(searchTerm);

            const matchesCategory = 
            selectedCategory === "" ||
            service.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });

        serviceGrid.querySelectorAll(".service-card").forEach(function (card) {
            card.remove();
        });

        filteredServices.forEach(function (service) {
            serviceGrid.appendChild(createServiceCard(service, searchTerm));
        });

        noResults.hidden = filteredServices.length !== 0;
    }

    // Update the URL with the current search and category
    function updateURL() {
        const url = new URL(window.location.href);
        const searchTerm = searchInput.value.trim();
        const selectedCategory = categoryFilter.value;
        if (searchTerm) {
            url.searchParams.set("q", searchTerm);
        } else {
            url.searchParams.delete("q");
        }
        if (selectedCategory) {
            url.searchParams.set("category", selectedCategory);
        } else {
            url.searchParams.delete("category");
        }
        if (url.href !== window.location.href) {
            history.pushState(
                {
                    search: searchTerm,
                    category: selectedCategory
                },
                "",
                url
            );
        }
    }

    // Restore search and category from the URL
    function restoreFiltersFromURL() {
        const url = new URL(window.location.href);
        searchInput.value = url.searchParams.get("q") || "";
        const category = url.searchParams.get("category") || "";
        categoryFilter.value = SERVICE_CATEGORIES.includes(category) ? category : "";
        clearButton.hidden = searchInput.value.length === 0;
        filterServices();
    }

    // Live search using debounce
    searchInput.addEventListener("input", debounce(function () {
        clearButton.hidden = searchInput.value.length === 0;
        filterServices();
        updateURL();
    }, 300));

    // Filter when the category changes
    categoryFilter.addEventListener("change", function () {
        filterServices();
        updateURL();
    });

    // Clear search input
    clearButton.addEventListener("click", function () {
        searchInput.value = "";
        clearButton.hidden = true;
        filterServices();
        updateURL();
        searchInput.focus();
    });

    // Retry failed API request
    retryButton.addEventListener("click", function () {
        loadServices();
    });

    // Restore filters when using browser back/forward
    window.addEventListener("popstate", function () {
        restoreFiltersFromURL();
    });

    // Fetch services when the page loads
    loadServices();
}
