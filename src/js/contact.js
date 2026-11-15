document.addEventListener("DOMContentLoaded", () => {

    const contactForm = document.getElementById("contactForm");

    const formStatus = document.getElementById(
        "contactFormStatus"
    );

    const nameInput = document.getElementById("contactName");
    const emailInput = document.getElementById("contactEmail");
    const topicInput = document.getElementById("contactTopic");
    const messageInput = document.getElementById("contactMessage");

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


    function validateField(input) {

        const errorElement = input.parentElement.querySelector(
            ".field_error"
        );

        const value = input.value.trim();

        let errorMessage = "";

        if (value === "") {
            errorMessage = "This field is required.";
        }

        else if (
            input === emailInput &&
            !emailRegex.test(value)
        ) {
            errorMessage = "Please enter a valid email address.";
        }

        errorElement.textContent = errorMessage;

        input.classList.toggle(
            "invalid_field",
            errorMessage !== ""
        );

        input.classList.toggle(
            "valid_field",
            errorMessage === "" && value !== ""
        );

        input.setAttribute(
            "aria-invalid",
            errorMessage !== "" ? "true" : "false"
        );

        return errorMessage === "";
    }

    const formInputs = [
        nameInput,
        emailInput,
        topicInput,
        messageInput
    ];

    formInputs.forEach(input => {

        input.addEventListener("input", () => {

            validateField(input);

            formStatus.textContent = "";
            formStatus.className = "contact_form_status";

        });

    });


    contactForm.addEventListener("submit", (event) => {

        event.preventDefault();

        let formIsValid = true;

        formInputs.forEach(input => {

            if (!validateField(input)) {
                formIsValid = false;
            }

        });


        if (!formIsValid) {

            formStatus.textContent =
                "Please correct the errors in the form.";

            formStatus.className =
                "contact_form_status error";

            return;

        }

        formStatus.textContent =
            "Thank you! Your message has been submitted successfully.";

        formStatus.className =
            "contact_form_status success";

        contactForm.reset();

        formInputs.forEach(input => {

            input.classList.remove(
                "valid_field",
                "invalid_field"
            );

            input.removeAttribute("aria-invalid");

            input.parentElement.querySelector(
                ".field_error"
            ).textContent = "";

        });

    });

});
