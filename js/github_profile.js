const GITHUB_API = "https://api.github.com/users";

export function initGitHubProfile() {
    const githubForm = document.getElementById("github-form");
    const usernameInput = document.getElementById("github-username");
    const githubStatus = document.getElementById("github-status");
    const githubError = document.getElementById("github-error");
    const githubResult = document.getElementById("github-result");
    const githubRepos = document.getElementById("github-repos");
    if (!githubForm || !usernameInput) {
        return;
    }
    let controller = null;

    // Fetch JSON and handle GitHub API errors
    async function fetchGitHub(url, signal) {
        const response = await fetch(url, { signal });
        if (response.status === 404) {
            throw new Error("GitHub user not found. Please check the username.");
        }
        if (response.status === 403 || response.status === 429) {
            throw new Error(
                "GitHub API rate limit reached. Please try again later."
            );
        }
        if (!response.ok) {
            throw new Error("Unable to fetch GitHub data. Please try again.");
        }
        return response.json();
    }

    // Fetch all public repositories
    async function fetchRepositories(username, signal) {
        const repositories = [];
        let page = 1;
        while (true) {
            const url = `${GITHUB_API}/${username}/repos?per_page=100&page=${page}`;
            const data = await fetchGitHub(url, signal);
            repositories.push(...data);
            if (data.length < 100) {
                break;
            }
            page++;
        }
        return repositories;
    }

    // Display GitHub profile
    function displayProfile(user) {
        const avatar = document.getElementById("github-avatar");
        avatar.src = user.avatar_url;
        avatar.alt = `${user.login}'s avatar`;
        document.getElementById("github-name").textContent = user.name || user.login;
        document.getElementById("github-bio").textContent = user.bio || "No bio available.";
        document.getElementById("github-location").textContent = `Location: ${user.location || "Not provided"}`;
        document.getElementById("github-followers").textContent = `Followers: ${user.followers}`;
        document.getElementById("github-following").textContent = `Following: ${user.following}`;
    }

    // Display top 6 repositories by stars
    function displayRepositories(repositories) {
        githubRepos.replaceChildren();
        const topRepos = repositories
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 6);
        if (topRepos.length === 0) {
            githubRepos.textContent = "No public repositories found.";
            return;
        }
        topRepos.forEach((repo) => {
            const card = document.createElement("article");
            card.className = "github-repo-card";
            const name = document.createElement("h4");
            const link = document.createElement("a");
            link.href = repo.html_url;
            link.textContent = repo.name;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            name.appendChild(link);
            const description = document.createElement("p");
            description.textContent = repo.description || "No description available.";
            const language = document.createElement("span");
            language.className = "github-language";
            language.textContent = repo.language || "Not specified";
            const stars = document.createElement("p");
            stars.textContent = `Stars: ${repo.stargazers_count}`;
            card.append(name, description, language, stars);
            githubRepos.appendChild(card);
        });
    }

    // Load GitHub profile and repositories
    async function loadGitHubProfile(username) {
        if (controller) {
            controller.abort();
        }
        controller = new AbortController();
        const currentController = controller;
        githubError.textContent = "";
        githubStatus.textContent = "Loading GitHub profile...";
        githubResult.hidden = true;
        try {
            const user = await fetchGitHub(
                `${GITHUB_API}/${encodeURIComponent(username)}`,
                currentController.signal
            );
            const repositories = await fetchRepositories(
                encodeURIComponent(username),
                currentController.signal
            );
            if (currentController.signal.aborted) {
                return;
            }
            displayProfile(user);
            displayRepositories(repositories);
            githubResult.hidden = false;
            githubStatus.textContent = "";
        } catch (error) {
            if (
                error.name === "AbortError" ||
                currentController.signal.aborted
            ) {
                return;
            }
            githubStatus.textContent = "";
            githubError.textContent = error.message;
        } finally {
            if (controller === currentController) {
                controller = null;
            }
        }
    }

    // Cancel previous requests when username changes
    usernameInput.addEventListener("input", function () {
        if (controller) {
            controller.abort();
            controller = null;
        }
        githubResult.hidden = true;
        githubStatus.textContent = "";
        githubError.textContent = "";
    });

    // Search for GitHub username
    githubForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const username = usernameInput.value.trim();
        if (username) {
            loadGitHubProfile(username);
        }
    });
}
