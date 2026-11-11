export function initGalleryLightbox() {
    const galleryImages = document.querySelectorAll("section figure img");
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const closeButton = document.getElementById("lightbox-close");
    const prevButton = document.getElementById("lightbox-prev");
    const nextButton = document.getElementById("lightbox-next");

    if (
        galleryImages.length === 0 ||
        !lightbox ||
        !lightboxImage ||
        !lightboxCaption ||
        !closeButton ||
        !prevButton ||
        !nextButton
    ) {
        return;
    }

    let currentIndex = 0;
    let previousFocus = null;
    let previousOverflow = "";
    let touchStartX = 0;

    // Display an image
    function showImage(index) {
        currentIndex = (index + galleryImages.length) % galleryImages.length;
        const selectedImage = galleryImages[currentIndex];
        const figure = selectedImage.closest("figure");
        const caption = figure.querySelector("figcaption");
        lightboxImage.src = selectedImage.src;
        lightboxImage.alt = selectedImage.alt;
        lightboxCaption.textContent = caption.textContent;
    }

    // Open the lightbox
    function openLightbox(index) {
        previousFocus = galleryImages[index];
        previousOverflow = document.body.style.overflow;
        showImage(index);
        lightbox.hidden = false;
        document.body.style.overflow = "hidden";
        closeButton.focus();
    }

    // Close the lightbox
    function closeLightbox() {
        lightbox.hidden = true;
        document.body.style.overflow = previousOverflow;

        previousFocus.focus();
    }

    // Navigate through images
    function showNextImage() {
        showImage(currentIndex + 1);
    }

    function showPreviousImage() {
        showImage(currentIndex - 1);
    }

    // Make gallery images keyboard accessible
    galleryImages.forEach(function (image, index) {
        image.setAttribute("tabindex", "0");
        image.setAttribute("role", "button");
        image.addEventListener("click", function () {
            openLightbox(index);
        });
        image.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openLightbox(index);
            }
        });
    });

    // Button event listeners
    closeButton.addEventListener("click", closeLightbox);
    nextButton.addEventListener("click", showNextImage);
    prevButton.addEventListener("click", showPreviousImage);

    // Keyboard navigation
    document.addEventListener("keydown", function (event) {
        if (lightbox.hidden) {
            return;
        }

        if (event.key === "Escape") {
            closeLightbox();
            return;
        }

        if (event.key === "ArrowRight") {
            event.preventDefault();
            showNextImage();
        }

        if (event.key === "ArrowLeft") {
            event.preventDefault();
            showPreviousImage();
        }

        // Keep keyboard focus inside the lightbox
        if (event.key === "Tab") {
            const focusableButtons = [
                closeButton,
                prevButton,
                nextButton
            ];
            const firstButton = focusableButtons[0];
            const lastButton = focusableButtons[focusableButtons.length - 1];
            const currentFocusIndex = focusableButtons.indexOf(
                document.activeElement
            );

            if (event.shiftKey) {
                if (currentFocusIndex === 0 || currentFocusIndex === -1) {
                    event.preventDefault();
                    lastButton.focus();
                }
            } else if (
                currentFocusIndex === focusableButtons.length - 1 ||
                currentFocusIndex === -1
            ) {
                event.preventDefault();
                firstButton.focus();
            }
        }
    });

    // Touch swipe navigation
    lightbox.addEventListener("touchstart", function (event) {
        touchStartX = event.changedTouches[0].screenX;
    });

    lightbox.addEventListener("touchend", function (event) {
        const touchEndX = event.changedTouches[0].screenX;
        const swipeDistance = touchEndX - touchStartX;
        if (swipeDistance > 50) {
            showPreviousImage();
        } else if (swipeDistance < -50) {
            showNextImage();
        }
    });
}
