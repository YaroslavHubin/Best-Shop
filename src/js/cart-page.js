import {
    getCart,
    getCartItemKey,
    getCartSummary,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    checkout
} from './cart.js';

const EMPTY_CART_MESSAGE =
    'Your cart is empty. Use the catalog to add new items.';

let cartMessage = '';
let cartMessageType = '';

function formatPrice(price) {
    return `$${Number(price).toFixed(2)}`;
}

function getCartImageUrl(imageUrl) {
    if (!imageUrl) {
        return '';
    }

    if (/^(https?:|data:|\/)/i.test(imageUrl)) {
        return imageUrl;
    }

    return imageUrl.replace(/^\.\.\//, '../../');
}

function createCartRow(product) {
    const row = document.createElement('tr');
    const productKey = getCartItemKey(product);

    const imageCell = document.createElement('td');
    const image = document.createElement('img');

    image.className = 'cart_product_image';
    image.src = getCartImageUrl(product.imageUrl);
    image.alt = product.name;

    imageCell.appendChild(image);

    const nameCell = document.createElement('td');
    const name = document.createElement('span');

    name.className = 'cart_product_name';
    name.textContent = product.name;

    nameCell.appendChild(name);

    if (product.size || product.color) {
        const options = document.createElement('small');

        options.textContent = [
            product.size ? `Size: ${product.size}` : '',
            product.color ? `Color: ${product.color}` : ''
        ].filter(Boolean).join(' | ');

        options.style.display = 'block';
        nameCell.appendChild(options);
    }

    const priceCell = document.createElement('td');

    priceCell.className = 'cart_product_price';
    priceCell.textContent = formatPrice(product.price);

    const quantityCell = document.createElement('td');
    const quantityWrapper = document.createElement('div');

    quantityWrapper.className = 'cart_quantity';

    const decreaseButton = document.createElement('button');

    decreaseButton.type = 'button';
    decreaseButton.className = 'cart_quantity_button';
    decreaseButton.textContent = '-';
    decreaseButton.dataset.action = 'decrease';
    decreaseButton.dataset.key = productKey;
    decreaseButton.setAttribute('aria-label', 'Decrease quantity');

    const quantityValue = document.createElement('span');

    quantityValue.className = 'cart_quantity_value';
    quantityValue.textContent = product.quantity;

    const increaseButton = document.createElement('button');

    increaseButton.type = 'button';
    increaseButton.className = 'cart_quantity_button';
    increaseButton.textContent = '+';
    increaseButton.dataset.action = 'increase';
    increaseButton.dataset.key = productKey;
    increaseButton.setAttribute('aria-label', 'Increase quantity');

    quantityWrapper.append(
        decreaseButton,
        quantityValue,
        increaseButton
    );

    quantityCell.appendChild(quantityWrapper);

    const totalCell = document.createElement('td');

    totalCell.className = 'cart_product_total';
    totalCell.textContent = formatPrice(
        Number(product.price) * Number(product.quantity)
    );

    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    const deleteIcon = document.createElement('img');

    deleteButton.type = 'button';
    deleteButton.className = 'cart_delete_button';
    deleteButton.dataset.action = 'remove';
    deleteButton.dataset.key = productKey;
    deleteButton.setAttribute('aria-label', 'Remove product');

    deleteIcon.src =
        '../../images for Capstone Projects/My Cart/icon-1.png';

    deleteIcon.alt = '';
    deleteIcon.className = 'cart_delete_icon';

    deleteButton.appendChild(deleteIcon);
    deleteCell.appendChild(deleteButton);

    row.append(
        imageCell,
        nameCell,
        priceCell,
        quantityCell,
        totalCell,
        deleteCell
    );

    return row;
}

function renderCartSummary() {
    const summary = getCartSummary();

    const subtotal = document.querySelector('#cartSubtotal');
    const discount = document.querySelector('#cartDiscount');
    const discountRow = document.querySelector('#discountRow');
    const shipping = document.querySelector('#cartShipping');
    const total = document.querySelector('#cartTotal');

    subtotal.textContent = formatPrice(summary.subtotal);

    discount.textContent = `${formatPrice(summary.discount)}`;
    discountRow.hidden = summary.discount === 0;

    shipping.textContent = formatPrice(summary.shipping);
    total.textContent = formatPrice(summary.total);
}

function renderCart() {
    const cart = getCart();

    const itemsContainer = document.querySelector('#cartItems');
    const tableWrapper = document.querySelector('#cartTableWrapper');
    const summary = document.querySelector('#cartSummary');

    const emptyMessage = document.querySelector('#cartEmptyMessage');
    const checkoutMessage = document.querySelector('#checkoutMessage');

    if (!itemsContainer) {
        return;
    }

    itemsContainer.innerHTML = '';

    if (cart.length === 0) {
        tableWrapper.hidden = true;
        summary.hidden = true;

        if (cartMessageType === 'checkout') {
            emptyMessage.hidden = true;

            checkoutMessage.textContent = cartMessage;
            checkoutMessage.hidden = false;
        } else {
            checkoutMessage.hidden = true;

            emptyMessage.textContent =
                cartMessageType === 'empty'
                    ? cartMessage
                    : EMPTY_CART_MESSAGE;

            emptyMessage.hidden = false;
        }

        return;
    }

    cartMessage = '';
    cartMessageType = '';

    emptyMessage.hidden = true;
    checkoutMessage.hidden = true;

    tableWrapper.hidden = false;
    summary.hidden = false;

    cart.forEach((product) => {
        itemsContainer.appendChild(createCartRow(product));
    });

    renderCartSummary();
}

function initCartItemActions() {
    const itemsContainer = document.querySelector('#cartItems');

    itemsContainer.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-action]');

        if (!button) {
            return;
        }

        const productKey = button.dataset.key;
        const action = button.dataset.action;

        const product = getCart().find((item) => {
            return getCartItemKey(item) === productKey;
        });

        if (!product) {
            return;
        }

        if (action === 'increase') {
            updateCartItemQuantity(
                productKey,
                Number(product.quantity) + 1
            );
        }

        if (action === 'decrease') {
            updateCartItemQuantity(
                productKey,
                Math.max(1, Number(product.quantity) - 1)
            );
        }

        if (action === 'remove') {
            removeFromCart(productKey);
        }
    });
}

function initClearCartButton() {
    const button = document.querySelector('#clearCartButton');

    if (!button) {
        return;
    }

    button.addEventListener('click', () => {
        cartMessage = clearCart();
        cartMessageType = 'empty';

        renderCart();
    });
}

function initCheckoutButton() {
    const button = document.querySelector('#checkoutButton');

    if (!button) {
        return;
    }

    button.addEventListener('click', () => {
        if (getCart().length === 0) {
            return;
        }

        cartMessage = checkout();
        cartMessageType = 'checkout';

        renderCart();
    });
}

function initCartPage() {
    const itemsContainer = document.querySelector('#cartItems');

    if (!itemsContainer) {
        return;
    }

    initCartItemActions();
    initClearCartButton();
    initCheckoutButton();

    window.addEventListener('cartUpdated', () => {
        renderCart();
    });

    window.addEventListener('storage', (event) => {
        if (event.key === 'bestShopCart') {
            cartMessage = '';
            cartMessageType = '';

            renderCart();
        }
    });

    renderCart();
}

export {
    initCartPage,
    renderCart
};
