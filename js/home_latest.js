const API_URL = "https://jsonplaceholder.typicode.com/posts";

export function initLatestPosts() {
    const newsGrid = document.getElementById("latest-news-grid");
    const loading = document.getElementById("latest-loading");
    const errorContainer = document.getElementById("latest-error");
    const errorMessage = document.getElementById("latest-error-message");
    const retryButton = document.getElementById("latest-retry");

    if (!newsGrid || !loading || !errorContainer || !errorMessage || !retryButton) {
        return;
    }
    let isLoading = false;

    // Create loading skeleton cards
    function showSkeletons() {
        newsGrid.replaceChildren();
        for (let i = 0; i < 3; i++) {
            const skeleton = document.createElement("div");
            skeleton.className = "news-card latest-skeleton";
            skeleton.setAttribute("aria-hidden", "true");
            for (let j = 0; j < 4; j++) {
                const line = document.createElement("span");
                line.className = "skeleton-line";
                if (j === 0) {
                    line.classList.add("skeleton-title");
                }
                skeleton.appendChild(line);
            }
            newsGrid.appendChild(skeleton);
        }
    }

    // Remove loading skeleton cards
    function removeSkeletons() {
        newsGrid.querySelectorAll(".latest-skeleton").forEach(function (card) {
            card.remove();
        });
    }

    // Create a news card
    function createNewsCard(post) {
        const card = document.createElement("article");
        card.className = "news-card";

        const title = document.createElement("h3");
        title.textContent = post.title;

        const description = document.createElement("p");
        description.textContent = post.body;

        const link = document.createElement("a");
        link.href = "blog.html";
        link.textContent = "Read More";

        card.append(title, description, link);
        return card;
    }

    // Fetch the three latest posts
    async function loadLatestPosts() {
        if (isLoading) {
            return;
        }
        isLoading = true;
        loading.hidden = false;
        errorContainer.hidden = true;
        showSkeletons();

        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error("Unable to load latest posts. Please try again.");
            }

            const posts = await response.json();
            if (!Array.isArray(posts)) {
                throw new Error("Invalid posts data received.");
            }

            const latestPosts = posts.sort(function (a, b) {return b.id - a.id;}).slice(0, 3);
            if (latestPosts.length !== 3) {
                throw new Error("Unable to load three latest posts.");
            }

            newsGrid.replaceChildren();
            latestPosts.forEach(function (post) {
                newsGrid.appendChild(createNewsCard(post));
            });

        } catch (error) {
            errorMessage.textContent = error.message;
            errorContainer.hidden = false;
        } finally {
            isLoading = false;
            loading.hidden = true;
            removeSkeletons();
        }
    }

    // Retry failed API request
    retryButton.addEventListener("click", loadLatestPosts);

    // Initial loading
    loadLatestPosts();
}
