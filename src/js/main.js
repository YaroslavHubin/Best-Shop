import { initCart } from './cart.js';
import { initCartPage } from './cart-page.js';
import { initHome, initTravelCards } from './home.js';
import { initCatalog } from './catalog.js';

document.addEventListener('DOMContentLoaded', () => {

    initCart();
    initCartPage();
    initCatalog();
    initHome();
    initTravelCards();

    const navigationLinks = document.querySelectorAll('.headers_link_a');

    const currentPath = window.location.pathname.replace(/\/$/, '');

    navigationLinks.forEach((link) => {
        const linkPath = new URL(link.href).pathname.replace(/\/$/, '');

        link.classList.remove('active');
        link.removeAttribute('aria-current');

        if (linkPath === currentPath) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });

    const menuToggle = document.querySelector('#mobileMenuToggle');
    const mainNavigation = document.querySelector('#mainNavigation');

    if (menuToggle && mainNavigation) {
        function closeMobileMenu() {
            mainNavigation.classList.remove('is_open');
            menuToggle.classList.remove('is_active');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Open navigation menu');
        }

        menuToggle.addEventListener('click', () => {
            const isOpen = mainNavigation.classList.toggle('is_open');

            menuToggle.classList.toggle('is_active', isOpen);
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            menuToggle.setAttribute(
                'aria-label',
                isOpen ? 'Close navigation menu' : 'Open navigation menu'
            );
        });

        mainNavigation.querySelectorAll('.headers_link_a').forEach((link) => {
            link.addEventListener('click', closeMobileMenu);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeMobileMenu();
            }
        });

        document.addEventListener('click', (event) => {
            if (
                !mainNavigation.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMobileMenu();
            }
        });
    }


    const accountButton = document.querySelector('.account_button');
    const loginModal = document.querySelector('#loginModal');

    if (!accountButton || !loginModal) {
        return;
    }

    const closeButton = document.querySelector('.login_close');
    const loginForm = document.querySelector('#loginForm');
    const emailInput = document.querySelector('#loginEmail');
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordInput = document.querySelector('#loginPassword');
    const passwordToggle = document.querySelector('.password_toggle');

    function openModal() {
        loginModal.showModal();

        emailInput.focus();
    }

    function closeModal() {
        if (loginModal.open) {
            loginModal.close();
        }

        loginForm.reset();

        passwordInput.type = 'password';

        passwordToggle.setAttribute('aria-label', 'Show password');
        passwordToggle.setAttribute('aria-pressed', 'false');

        accountButton.focus();
    }

    accountButton.addEventListener('click', openModal);

    closeButton.addEventListener('click', closeModal);

    loginModal.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            closeModal();
        }
    });

    loginModal.addEventListener('cancel', (event) => {
        event.preventDefault();
        closeModal();
    });

    passwordToggle.addEventListener('click', () => {
        const isPasswordHidden = passwordInput.type === 'password';

        passwordInput.type = isPasswordHidden ? 'text' : 'password';

        passwordToggle.setAttribute(
            'aria-label',
            isPasswordHidden ? 'Hide password' : 'Show password'
        );

        passwordToggle.setAttribute(
            'aria-pressed',
            String(isPasswordHidden)
        );
    });

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();

        if (!emailRegex.test(email)) {
            emailInput.setCustomValidity('Please enter a valid email address.');
            emailInput.reportValidity();
            emailInput.setCustomValidity('');
            emailInput.focus();

            return;
        }

        if (!loginForm.checkValidity()) {
            loginForm.reportValidity();
            return;
        }

        closeModal();

        console.log('Login form is valid!');
    });

    emailInput.addEventListener('input', () => {
        emailInput.setCustomValidity('');
    });

});