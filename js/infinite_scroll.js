export function initInfiniteScroll() {
    const API_URL = "https://jsonplaceholder.typicode.com/posts";
    const POSTS_PER_PAGE = 10;
    const TOTAL_POSTS = 100;
    const blogFeed = document.getElementById("blog-feed");
    const loading = document.getElementById("feed-loading");
    const errorContainer = document.getElementById("feed-error");
    const errorMessage = document.getElementById("feed-error-message");
    const retryButton = document.getElementById("feed-retry");
    const endMessage = document.getElementById("feed-end");
    const sentinel = document.getElementById("feed-sentinel");

    if (
        !blogFeed ||
        !loading ||
        !errorContainer ||
        !errorMessage ||
        !retryButton ||
        !endMessage ||
        !sentinel
    ) {
        return;
    }

    let start = 0;
    let isLoading = false;
    let hasError = false;
    let isFinished = false;

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (
                entry.isIntersecting &&
                !isLoading &&
                !hasError &&
                !isFinished
            ) {
                fetchPosts();
            }
        });
    });

    // Fetch the next 10 posts
    async function fetchPosts() {
        if (isLoading || isFinished) {
            return;
        }
        isLoading = true;
        hasError = false;
        observer.unobserve(sentinel);
        loading.hidden = false;
        errorContainer.hidden = true;
        try {
            const response = await fetch(
                `${API_URL}?_start=${start}&_limit=${POSTS_PER_PAGE}`
            );
            if (!response.ok) {
                throw new Error("Unable to load posts. Please try again.");
            }
            const posts = await response.json();
            displayPosts(posts);
            start += posts.length;
            if (start >= TOTAL_POSTS || posts.length < POSTS_PER_PAGE) {
                isFinished = true;
                endMessage.hidden = false;
            }
        } catch (error) {
            hasError = true;
            errorMessage.textContent = error.message;
            errorContainer.hidden = false;
        } finally {
            isLoading = false;
            loading.hidden = true;
            if (!isFinished && !hasError) {
                observer.observe(sentinel);
            }
        }
    }

    // Display fetched posts
    function displayPosts(posts) {
        posts.forEach(function (post) {
            const article = document.createElement("article");
            article.className = "feed-post";
            const title = document.createElement("h3");
            title.textContent = post.title;
            const body = document.createElement("p");
            body.textContent = post.body;
            article.append(title, body);
            blogFeed.appendChild(article);
        });
    }

    // Retry a failed request
    retryButton.addEventListener("click", function () {
        if (hasError) {
            fetchPosts();
        }
    });

    // Load the first 10 posts
    fetchPosts();
}
