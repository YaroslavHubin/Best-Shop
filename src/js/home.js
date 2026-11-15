import { addToCart } from './cart.js';

const PRODUCTS_URL = './assets/data.json';
const PRODUCT_DETAILS_URL = './html/product-details.html';

async function loadProducts() {
    try {
        const response = await fetch(PRODUCTS_URL);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const result = await response.json();

        return result.data;
    } catch (error) {
        console.error('Unable to load products:', error);
        return [];
    }
}

function createProductCard(product, buttonText) {
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

    if (
        product.imageUrl &&
        !product.imageUrl.startsWith('REPLACE_IMAGE_')
    ) {
        image.src = product.imageUrl;
    } else {
        image.classList.add('product_image_placeholder');
    }

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
    button.textContent = buttonText;

    article.append(
        imageWrapper,
        title,
        price,
        button
    );

    article.addEventListener('click', (event) => {
        if (event.target.closest('button')) {
            return;
        }

        window.location.href =
            `${PRODUCT_DETAILS_URL}?id=${encodeURIComponent(product.id)}`;
    });

    button.addEventListener('click', () => {
        if (buttonText === 'Add To Cart') {
            addToCart(product);

            button.textContent = 'Added!';
            button.classList.add('product_added');

            setTimeout(() => {
                button.textContent = 'Add To Cart';
                button.classList.remove('product_added');
            }, 1000);
        } else {
            window.location.href =
                `${PRODUCT_DETAILS_URL}?id=${encodeURIComponent(product.id)}`;
        }
    });

    return article;
}

function renderProductSection(products, sectionName, buttonText) {
    const section = document.querySelector(sectionName);

    if (!section) {
        return;
    }

    const container = section.querySelector('.product_cards');

    if (!container) {
        return;
    }

    container.innerHTML = '';

    products.forEach((product) => {
        container.appendChild(
            createProductCard(product, buttonText)
        );
    });
}

async function initHome() {
    const selectedSection = document.querySelector('.selected_products');
    const newProductsSection = document.querySelector('.new_products_arrival');

    if (!selectedSection && !newProductsSection) {
        return;
    }

    const products = await loadProducts();

    const selectedProducts = products.filter((product) => {
        return product.blocks.includes('Selected Products');
    });

    const newProducts = products.filter((product) => {
        return product.blocks.includes('New Products Arrival');
    });

    renderProductSection(
        selectedProducts,
        '.selected_products',
        'Add To Cart'
    );

    renderProductSection(
        newProducts,
        '.new_products_arrival',
        'View Product'
    );
}

function initTravelSlider() {
    const slider = document.querySelector('.travel_cards');
    const previousButton = document.querySelector('.travel_slider_previous');
    const nextButton = document.querySelector('.travel_slider_next');

    if (!slider || !previousButton || !nextButton) {
        return;
    }

    let currentIndex = 0;

    const cards = Array.from(slider.children);

    const updateSlider = () => {
        let visibleCards;

        if (window.innerWidth <= 600) {
            visibleCards = 1;
        } else if (window.innerWidth <= 900) {
            visibleCards = 2;
        } else {
            visibleCards = 4;
        }

        const maxIndex = Math.max(0, cards.length - visibleCards);

        currentIndex = Math.min(currentIndex, maxIndex);

        const cardWidth = cards[0].getBoundingClientRect().width;
        const gap = parseFloat(getComputedStyle(slider).columnGap) || 0;

        slider.style.transform =
            `translateX(-${currentIndex * (cardWidth + gap)}px)`;

        previousButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex >= maxIndex;
    };

    previousButton.addEventListener('click', () => {
        currentIndex = Math.max(0, currentIndex - 1);
        updateSlider();
    });

    nextButton.addEventListener('click', () => {
        let visibleCards;
            
        if (window.innerWidth <= 600) {
            visibleCards = 1;
        } else if (window.innerWidth <= 900) {
            visibleCards = 2;
        } else {
            visibleCards = 4;
        }

        const maxIndex = Math.max(0, cards.length - visibleCards);

        currentIndex = Math.min(maxIndex, currentIndex + 1);
        updateSlider();
    });

    window.addEventListener('resize', updateSlider);

    updateSlider();
}


function randomizeTravelText() {
    const descriptions = [
        {
            title: 'Ready for your next adventure?',
            text: 'Discover suitcases designed for every journey.'
        },
        {
            title: 'Travel in your own style.',
            text: 'Find the perfect companion for your next trip.'
        },
        {
            title: 'Every journey starts here.',
            text: 'Choose comfort, quality and a unique design.'
        },
        {
            title: 'Explore the world with confidence.',
            text: 'Your next destination deserves the right suitcase.'
        }
    ];

    const cards = document.querySelectorAll('.travel_card_content');

    cards.forEach((card) => {
        const randomDescription =
            descriptions[Math.floor(Math.random() * descriptions.length)];

        const title = document.createElement('h3');
        title.textContent = randomDescription.title;

        const text = document.createElement('p');
        text.textContent = randomDescription.text;

        card.replaceChildren(title, text);
    });
}


function initTravelCards() {
    randomizeTravelText();
    initTravelSlider();
}

export {
    initHome,
    initTravelCards
};