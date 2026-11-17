import { showToast } from "./utils.js";

export class FormValidator {
    constructor(form) {
        this.form = form;
        this.submitButton = form.querySelector('button[type="submit"]');
        this.originalButtonText = this.submitButton.textContent;
        this.fields = {
            name: {
                input: form.elements.name,
                error: form.querySelector("#name-error"),
                message: "Name must contain at least 2 characters.",
                validate: function (value) {
                    return value.length >= 2;
                }
            },
            email: {
                input: form.elements.email,
                error: form.querySelector("#email-error"),
                message: "Please enter a valid email address.",
                validate: function (value) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
                }
            },
            phone: {
                input: form.elements.phone,
                error: form.querySelector("#phone-error"),
                message: "Please enter a valid phone number.",
                validate: function (value) {
                    if (value === "") {
                        return true;
                    }
                    const digits = value.replace(/\D/g, "");
                    
                    return /^[0-9\s()-]+$/.test(value) && digits.length === 10;
                }
            },
            department: {
                input: form.elements.department,
                error: form.querySelector("#department-error"),
                message: "Please select a department.",
                validate: function (value) {
                    return value !== "";
                }
            },
            message: {
                input: form.elements.message,
                error: form.querySelector("#message-error"),
                message: "Message must contain at least 20 characters.",
                validate: function (value) {
                    return value.length >= 20;
                }
            }
        };

        this.form.addEventListener("submit", this.handleSubmit.bind(this));

        Object.entries(this.fields).forEach(([name, field]) => {
            const eventType = field.input.tagName === "SELECT" ? "change" : "input";
            field.input.addEventListener(eventType, () => {
                if (field.input.getAttribute("aria-invalid") === "true") {
                    this.validateField(name);
                }
            });
        });
    }

    validateField(name) {
        const field = this.fields[name];
        const value = field.input.value.trim();
        const isValid = field.validate(value, field.input);
        field.error.textContent = isValid ? "" : field.message;
        field.error.hidden = isValid;
        field.input.setAttribute("aria-invalid", String(!isValid));
        return isValid;
    }

    validateForm() {
        return Object.keys(this.fields).map((name) => {
            this.validateField(name);
            return this.fields[name].input.getAttribute("aria-invalid") !== "true";
        }).every(Boolean);
    }

    clearErrors() {
        Object.values(this.fields).forEach((field) => {
            field.error.textContent = "";
            field.error.hidden = true;
            field.input.removeAttribute("aria-invalid");
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        if (!this.validateForm()) {
            const firstInvalidField = Object.values(this.fields).find(
                (field) => field.input.getAttribute("aria-invalid") === "true"
            );
            firstInvalidField.input.focus();
            return;
        }

        this.submitButton.disabled = true;
        this.submitButton.textContent = "Sending...";
        this.form.setAttribute("aria-busy", "true");

        await new Promise((resolve) => {
            setTimeout(resolve, 1500);
        });

        this.form.reset();
        this.clearErrors();
        this.submitButton.disabled = false;
        this.submitButton.textContent = this.originalButtonText;
        this.form.removeAttribute("aria-busy");
        showToast("Your message has been submitted successfully!");
    }
}

export function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) {
        return;
    }
    new FormValidator(form);
}
