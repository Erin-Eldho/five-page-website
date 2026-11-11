import { debounce } from "./utils.js";

export function initServicesSearch() {
    // Select search elements and service cards
    const searchInput = document.getElementById("service-search");
    const clearButton = document.getElementById("clear-search");
    const noResults = document.getElementById("no-results");
    const serviceCards = document.querySelectorAll(".service-card");
    if (!searchInput || !clearButton || !noResults) {
        return;
    }

    // Remove existing highlights
    function removeHighlights(card) {
        const highlights = card.querySelectorAll(".highlight");
        highlights.forEach(function (highlight) {
            highlight.replaceWith(document.createTextNode(highlight.textContent));
        });
        card.normalize();
    }

    // Highlight matching text inside a card
    function highlightMatches(card, searchTerm) {
        const regex = new RegExp(
            searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            "gi"
        );
        const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
        const textNodes = [];
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        textNodes.forEach(function (node) {
            const text = node.nodeValue;
            if (!regex.test(text)) {
                regex.lastIndex = 0;
                return;
            }
            regex.lastIndex = 0;
            const fragment = document.createDocumentFragment();
            let lastIndex = 0;
            let match;
            while ((match = regex.exec(text)) !== null) {
                fragment.appendChild(
                    document.createTextNode(text.slice(lastIndex, match.index))
                );
                const highlight = document.createElement("span");
                highlight.className = "highlight";
                highlight.textContent = match[0];
                fragment.appendChild(highlight);
                lastIndex = regex.lastIndex;
            }
            fragment.appendChild(
                document.createTextNode(text.slice(lastIndex))
            );
            node.parentNode.replaceChild(fragment, node);
        });
    }

    // Filter service cards
    function filterServices() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;
        serviceCards.forEach(function (card) {
            removeHighlights(card);
            const matches = card.textContent.toLowerCase().includes(searchTerm);
            if (matches) {
                card.style.display = "";
                visibleCount++;
                if (searchTerm !== "") {
                    highlightMatches(card, searchTerm);
                }
            } else {
                card.style.display = "none";
            }
        });
        noResults.hidden = visibleCount !== 0;
    }

    // Update the URL with the current search term
    function updateURL() {
        const url = new URL(window.location.href);
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            url.searchParams.set("q", searchTerm);
        } else {
            url.searchParams.delete("q");
        }
        if (url.href !== window.location.href) {
            history.pushState({ search: searchTerm }, "", url);
        }
    }

    // Restore search from URL
    function restoreSearchFromURL() {
        const url = new URL(window.location.href);
        searchInput.value = url.searchParams.get("q") || "";
        clearButton.hidden = searchInput.value.length === 0;
        filterServices();
    }

    // Live search using debounce
    searchInput.addEventListener("input", debounce(function () {
        clearButton.hidden = searchInput.value.length === 0;
        filterServices();
        updateURL();
    }, 300));

    // Clear search input
    clearButton.addEventListener("click", function () {
        searchInput.value = "";
        clearButton.hidden = true;
        filterServices();
        updateURL();
        searchInput.focus();
    });

    // Restore previous search when using browser back/forward
    window.addEventListener("popstate", function () {
        restoreSearchFromURL();
    });

    // Apply URL search when the page loads
    restoreSearchFromURL();
}
