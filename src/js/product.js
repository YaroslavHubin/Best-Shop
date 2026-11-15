import { addToCart } from './cart.js';

const PRODUCTS_URL = '../assets/data.json';
const CART_BUTTON_TEXT = 'Add To Cart';

let currentProduct = null;
let currentQuantity = 1;

async function loadProducts() {
    try {
        const response = await fetch(PRODUCTS_URL);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const result = await response.json();

        return Array.isArray(result.data) ? result.data : [];
    } catch (error) {
        console.error('Unable to load products:', error);
        return [];
    }
}

function getProductImageUrl(imageUrl) {
    if (!imageUrl) {
        return '';
    }

    if (/^(https?:|data:|\/)/i.test(imageUrl)) {
        return imageUrl;
    }

    return imageUrl.replace(/^\.\.\//, '../../');
}

function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);

    return params.get('id');
}

function renderProduct(product) {
    const name = document.querySelector('#productName');
    const image = document.querySelector('#productMainImage');
    const price = document.querySelector('#productPrice');
    const ratingStars = document.querySelector('#productRatingStars');
    const ratingValue = document.querySelector('#productRatingValue');

    if (!name || !image || !price || !ratingStars || !ratingValue) {
        return;
    }

    name.textContent = product.name;

    image.src = getProductImageUrl(product.imageUrl);
    image.alt = product.name;

    price.textContent = `$${product.price}`;

    const rating = Number(product.rating) || 0;
    const displayedStars = rating >= 4.5 ? 5 : Math.floor(rating);

    ratingStars.textContent =
        '★'.repeat(displayedStars) +
        '☆'.repeat(5 - displayedStars);

    ratingValue.textContent = rating.toFixed(1);

    const reviewsLink = document.querySelector('.product_reviews_link');

    if (reviewsLink) {
        reviewsLink.textContent = 'Clients Review (1)';
    }

    setSelectValue('#productSize', product.size);
    setSelectValue('#productColor', product.color);
    setSelectValue('#productCategory', product.category);

}

function setSelectValue(selector, value) {
    const select = document.querySelector(selector);

    if (!select || !value) {
        return;
    }

    const optionExists = Array.from(select.options).some((option) => {
        return option.value === value;
    });

    if (!optionExists) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    }

    select.value = value;
}

function initQuantitySelector() {
    const quantityDisplay = document.querySelector('#productQuantity');
    const decreaseButton = document.querySelector('#decreaseQuantity');
    const increaseButton = document.querySelector('#increaseQuantity');

    if (!quantityDisplay || !decreaseButton || !increaseButton) {
        return;
    }

    const updateQuantity = () => {
        quantityDisplay.textContent = currentQuantity;
    };

    decreaseButton.addEventListener('click', () => {
        currentQuantity = Math.max(1, currentQuantity - 1);
        updateQuantity();
    });

    increaseButton.addEventListener('click', () => {
        currentQuantity += 1;
        updateQuantity();
    });
}

function initProductAddToCart() {
    const button = document.querySelector('#productAddToCart');
    const message = document.querySelector('#productAddMessage');

    if (!button || !currentProduct) {
        return;
    }

    button.addEventListener('click', () => {
        const sizeSelect = document.querySelector('#productSize');
        const colorSelect = document.querySelector('#productColor');

        const selectedProduct = {
            ...currentProduct,
            size: sizeSelect?.value || currentProduct.size,
            color: colorSelect?.value || currentProduct.color
        };

        addToCart(selectedProduct, currentQuantity);

        if (message) {
            message.textContent =
                `${currentQuantity} item(s) added to your cart.`;
        }

        button.textContent = 'Added!';
        button.classList.add('product_added');

        window.setTimeout(() => {
            button.textContent = CART_BUTTON_TEXT;
            button.classList.remove('product_added');
        }, 1200);
    });
}


function initProductTabs() {
    const tabs = document.querySelectorAll('.product_tab');
    const panels = document.querySelectorAll('.product_tab_panel');

    if (!tabs.length || !panels.length) {
        return;
    }

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const targetPanelId = tab.getAttribute('aria-controls');

            tabs.forEach((item) => {
                item.classList.remove('active');
                item.setAttribute('aria-selected', 'false');
            });

            panels.forEach((panel) => {
                panel.hidden = panel.id !== targetPanelId;
            });

            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
        });
    });

    const reviewsLink = document.querySelector('.product_reviews_link');
    const reviewsTab = document.querySelector('#reviewsTab');

    if (reviewsLink && reviewsTab) {
        reviewsLink.addEventListener('click', (event) => {
            event.preventDefault();

            reviewsTab.click();

            document.querySelector('#reviewsPanel').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
}

function initReviewForm() {
    const form = document.querySelector('#reviewForm');

    if (!form) {
        return;
    }

    const nameInput = document.querySelector('#reviewName');
    const emailInput = document.querySelector('#reviewEmail');
    const reviewInput = document.querySelector('#reviewText');

    const ratingInputs = document.querySelectorAll(
        'input[name="rating"]'
    );

    const ratingLabels = document.querySelectorAll(
        '.review_rating_options label'
    );

    const message = document.querySelector('#reviewFormMessage');

    const nameError = document.querySelector('#reviewNameError');
    const emailError = document.querySelector('#reviewEmailError');
    const reviewError = document.querySelector('#reviewTextError');
    const ratingError = document.querySelector('#ratingError');

    if (
        !nameInput ||
        !emailInput ||
        !reviewInput ||
        !message ||
        !nameError ||
        !emailError ||
        !reviewError ||
        !ratingError
    ) {
        return;
    }

    function updateRating(selectedValue, className) {
        ratingLabels.forEach((label, index) => {
            label.classList.toggle(
                className,
                index < selectedValue
            );
        });
    }

    ratingInputs.forEach((input) => {
        input.addEventListener('change', () => {
            updateRating(Number(input.value), 'is-active');

            ratingError.textContent = '';
        });
    });

    ratingLabels.forEach((label, index) => {
        label.addEventListener('mouseenter', () => {
            updateRating(index + 1, 'is-hovered');
        });

        label.addEventListener('mouseleave', () => {
            updateRating(0, 'is-hovered');
        });
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const review = reviewInput.value.trim();

        const selectedRating = document.querySelector(
            'input[name="rating"]:checked'
        );

        nameError.textContent = '';
        emailError.textContent = '';
        reviewError.textContent = '';
        ratingError.textContent = '';

        message.textContent = '';
        message.className = 'review_form_message';

        let isValid = true;

        if (name.length < 2) {
            nameError.textContent =
                'Name must contain at least 2 characters.';

            isValid = false;
        }

        const emailPattern =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(email)) {
            emailError.textContent =
                'Please enter a valid email address.';

            isValid = false;
        }

        if (review.length < 10) {
            reviewError.textContent =
                'Review must contain at least 10 characters.';

            isValid = false;
        }

        if (!selectedRating) {
            ratingError.textContent =
                'Please select a product rating.';

            isValid = false;
        }

        if (!isValid) {
            message.textContent =
                'Please correct the errors in the form.';

            message.classList.add('error');

            return;
        }

        message.textContent =
            'Your review has been successfully submitted!';

        message.classList.add('success');

        form.reset();

        updateRating(0, 'is-active');
        updateRating(0, 'is-hovered');
    });
}


function getRandomProducts(products, currentProductId, amount = 4) {
    const availableProducts = products.filter((product) => {
        return product.id !== currentProductId;
    });

    for (let i = availableProducts.length - 1; i > 0; i -= 1) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        [availableProducts[i], availableProducts[randomIndex]] =
            [availableProducts[randomIndex], availableProducts[i]];
    }

    return availableProducts.slice(0, amount);
}

function createRecommendedCard(product) {
    const article = document.createElement('article');
    article.className = 'product_card';
    article.dataset.productId = product.id;

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'product_image_wrapper';

    if (product.salesStatus) {
        const saleLabel = document.createElement('span');
        saleLabel.className = 'sale_label';
        saleLabel.textContent = 'SALE';
        imageWrapper.appendChild(saleLabel);
    }

    const image = document.createElement('img');
    image.src = getProductImageUrl(product.imageUrl);
    image.alt = product.name;

    imageWrapper.appendChild(image);

    const title = document.createElement('h3');
    title.textContent = product.name;

    const price = document.createElement('p');
    price.className = 'product_price';
    price.textContent = `$${product.price}`;

    const button = document.createElement('button');
    button.className = 'homepage_button product_button';
    button.type = 'button';
    button.textContent = CART_BUTTON_TEXT;

    article.append(imageWrapper, title, price, button);

    article.addEventListener('click', (event) => {
        if (event.target.closest('button')) {
            return;
        }

        openProduct(product.id);
    });

    button.addEventListener('click', () => {
        addToCart(product);

        button.textContent = 'Added!';
        button.classList.add('product_added');

        window.setTimeout(() => {
            button.textContent = CART_BUTTON_TEXT;
            button.classList.remove('product_added');
        }, 1000);
    });

    return article;
}

function openProduct(productId) {
    window.location.href =
        `./product-details.html?id=${encodeURIComponent(productId)}`;
}

function renderRecommendedProducts(products) {
    const container = document.querySelector('#recommendedProducts');

    if (!container || !currentProduct) {
        return;
    }

    container.innerHTML = '';

    const recommendedProducts = getRandomProducts(
        products,
        currentProduct.id,
        4
    );

    recommendedProducts.forEach((product) => {
        container.appendChild(createRecommendedCard(product));
    });
}

async function initProductDetails() {
    const productId = getProductIdFromUrl();

    if (!productId) {
        showProductError('Product ID is missing.');
        return;
    }

    const products = await loadProducts();

    if (!products.length) {
        showProductError('Products could not be loaded.');
        return;
    }

    currentProduct = products.find((product) => {
        return product.id === productId;
    });

    if (!currentProduct) {
        showProductError('Product not found.');
        return;
    }

    renderProduct(currentProduct);
    initQuantitySelector();
    initProductAddToCart();
    initProductTabs();
    initReviewForm();
    renderRecommendedProducts(products);
}

function showProductError(message) {
    const page = document.querySelector('.product_details_page');

    if (!page) {
        return;
    }

    page.innerHTML = `
        <div class="product_error">
            <h1>${message}</h1>
            <a href="/src/html/catalog.html">Return to Catalog</a>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', initProductDetails);