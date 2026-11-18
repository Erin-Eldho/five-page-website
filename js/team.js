const API_URL = "https://jsonplaceholder.typicode.com/users";

export function initTeamPage() {
    const teamGrid = document.querySelector(".team-grid");
    const departmentFilter = document.getElementById("department-filter");
    const loading = document.getElementById("team-loading");
    const errorContainer = document.getElementById("team-error");
    const errorMessage = document.getElementById("team-error-message");
    const retryButton = document.getElementById("team-retry");
    const noResults = document.getElementById("team-no-results");

    if (!teamGrid || !departmentFilter || !loading || !errorContainer || !errorMessage || !retryButton || !noResults) {
        return;
    }

    let teamMembers = [];
    let isLoading = false;

    // Assign departments to API users
    function getDepartment(userId) {
        return userId <= 5 ? "Engineering and Technology" : "Business and Operations";
    }

    // Create loading skeleton cards
    function showSkeletons() {
        removeSkeletons();

        for (let i = 0; i < 3; i++) {
            const skeleton = document.createElement("article");
            skeleton.className = "team-card team-skeleton";
            skeleton.setAttribute("aria-hidden", "true");
            for (let j = 0; j < 4; j++) {
                const line = document.createElement("span");
                line.className = "skeleton-line";
                if (j === 0) {
                    line.classList.add("skeleton-title");
                }
                skeleton.appendChild(line);
            }
            teamGrid.appendChild(skeleton);
        }
    }

    // Remove loading skeleton cards
    function removeSkeletons() {
        teamGrid.querySelectorAll(".team-skeleton").forEach(function (card) {
            card.remove();
        });
    }

    // Create a team member detail
    function createDetail(label, value) {
        const paragraph = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = `${label}: `;
        paragraph.append(strong, document.createTextNode(value || "Not available"));
        return paragraph;
    }

    // Create a team member card
    function createTeamCard(user) {
        const card = document.createElement("article");
        card.className = "team-card";
        card.dataset.department = user.department;
        const heading = document.createElement("h3");
        heading.textContent = `Team Member ${user.id}`;
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        image.src = `https://picsum.photos/seed/member${user.id}/300/300`;
        image.alt = `Placeholder portrait for ${user.name}`;
        image.width = 150;
        image.height = 150;
        image.loading = "lazy";
        const caption = document.createElement("figcaption");
        caption.textContent = user.name;
        figure.append(image, caption);

        const username = createDetail("Username", user.username);
        const email = createDetail("Email", user.email);
        const phone = createDetail("Phone", user.phone);
        const company = createDetail("Company", user.company.name);
        const website = createDetail("Website", user.website);
        const department = createDetail("Department", user.department);

        card.append(heading, figure, username, email, phone, company, website, department);
        return card;
    }

    // Render team members
    function renderTeam() {
        teamGrid.querySelectorAll(".team-card:not(.team-skeleton)").forEach(
            function (card) {
                card.remove();
            }
        );
        teamMembers.forEach(function (user) {
            teamGrid.appendChild(createTeamCard(user));
        });
        filterTeam();
    }

    // Filter team members by department
    function filterTeam() {
        const selectedDepartment = departmentFilter.value;
        let visibleCount = 0;
        const cards = teamGrid.querySelectorAll(".team-card:not(.team-skeleton)");

        cards.forEach(function (card) {
            const matches = selectedDepartment === "all" || card.dataset.department === selectedDepartment;
            card.hidden = !matches;
            if (matches) {
                visibleCount++;
            }
        });
        noResults.hidden = visibleCount !== 0;
    }

    // Fetch team members from JSONPlaceholder
    async function loadTeam() {
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
                throw new Error("Unable to load team members. Please try again.");
            }
            const users = await response.json();
            if (!Array.isArray(users)) {
                throw new Error("Invalid team data received.");
            }
            teamMembers = users.map(function (user) {
                return {
                    ...user,
                    department: getDepartment(user.id)
                };
            });
            renderTeam();
        } catch (error) {
            errorMessage.textContent = error.message;
            errorContainer.hidden = false;
        } finally {
            isLoading = false;
            loading.hidden = true;
            removeSkeletons();
        }
    }

    // Filter when department changes
    departmentFilter.addEventListener("change", filterTeam);

    // Retry failed API request
    retryButton.addEventListener("click", loadTeam);

    // Initial loading
    loadTeam();
}
