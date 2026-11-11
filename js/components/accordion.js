export function initAccordion() {
    const accordionButtons = document.querySelectorAll(".accordion-toggle");
    if (accordionButtons.length === 0) {
        return;
    }
    const storageKey = "openAccordionPanel";

    // Open one panel and close all other panels
    function openAccordion(button) {
        accordionButtons.forEach(function (currentButton) {
            const panelId = currentButton.getAttribute("aria-controls");
            const panel = document.getElementById(panelId);
            const isOpen = currentButton === button;
            currentButton.setAttribute("aria-expanded", String(isOpen));
            panel.hidden = !isOpen;
        });

        // Save the open panel in sessionStorage
        if (button) {
            sessionStorage.setItem(storageKey, button.id);
        } else {
            sessionStorage.removeItem(storageKey);
        }
    }

    // Handle button clicks
    accordionButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const isExpanded = button.getAttribute("aria-expanded") === "true";
            if (isExpanded) {
                openAccordion(null);
            } else {
                openAccordion(button);
            }
        });

        // Handle keyboard navigation
        button.addEventListener("keydown", function (event) {
            const buttons = Array.from(accordionButtons);
            const currentIndex = buttons.indexOf(button);
            let nextIndex;
            switch (event.key) {
                case "ArrowDown":
                    nextIndex = (currentIndex + 1) % buttons.length;
                    break;
                case "ArrowUp":
                    nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
                    break;
                case "Home":
                    nextIndex = 0;
                    break;
                case "End":
                    nextIndex = buttons.length - 1;
                    break;
                default:
                    return;
            }
            event.preventDefault();
            buttons[nextIndex].focus();
        });
    });

    // Restore the previously open panel
    const savedPanelId = sessionStorage.getItem(storageKey);
    if (savedPanelId) {
        const savedButton = document.getElementById(savedPanelId);
        if (savedButton && savedButton.classList.contains("accordion-toggle")) {
            openAccordion(savedButton);
        }
    }
}
