const CART_STORAGE_KEY = 'bestShopCart';

const SHIPPING_COST = 30;
const DISCOUNT_THRESHOLD = 3000;
const DISCOUNT_RATE = 0.10;

const EMPTY_CART_MESSAGE =
    'Your cart is empty. Use the catalog to add new items.';

const CHECKOUT_SUCCESS_MESSAGE =
    'Thank you for your purchase.';

function getCart() {
    try {
        const cart = JSON.parse(
            localStorage.getItem(CART_STORAGE_KEY)
        );

        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        console.error('Unable to read cart:', error);
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
    );

    updateCartCounter();

    window.dispatchEvent(
        new CustomEvent('cartUpdated', {
            detail: { cart }
        })
    );
}

function getCartItemKey(product) {
    const normalize = (value) => {
        return String(value ?? '').trim().toLowerCase();
    };

    return JSON.stringify([
        normalize(product.name),
        normalize(product.size),
        normalize(product.color)
    ]);
}

function getCartCount() {
    return getCart().reduce((total, product) => {
        return total + (Number(product.quantity) || 0);
    }, 0);
}

function updateCartCounter() {
    const counters = document.querySelectorAll('.cart_counter');
    const total = getCartCount();

    counters.forEach((counter) => {
        counter.textContent = total;

        counter.setAttribute(
            'aria-label',
            `Items in cart: ${total}`
        );

        counter.hidden = total === 0;
    });
}

function addToCart(product, quantity = 1) {
    if (!product?.name) {
        console.error('Invalid product:', product);
        return;
    }

    const cart = getCart();
    const productKey = getCartItemKey(product);

    const existingProduct = cart.find((item) => {
        return getCartItemKey(item) === productKey;
    });

    const quantityToAdd = Math.max(
        1,
        Math.floor(Number(quantity) || 1)
    );

    if (existingProduct) {
        existingProduct.quantity =
            (Number(existingProduct.quantity) || 0) + quantityToAdd;
    } else {
        cart.push({
            ...product,
            quantity: quantityToAdd
        });
    }

    saveCart(cart);
}

function updateCartItemQuantity(productKey, quantity) {
    const cart = getCart();

    const product = cart.find((item) => {
        return getCartItemKey(item) === productKey;
    });

    if (!product) {
        return;
    }

    product.quantity = Math.max(
        1,
        Math.floor(Number(quantity) || 1)
    );

    saveCart(cart);
}

function removeFromCart(productKey) {
    const cart = getCart().filter((product) => {
        return getCartItemKey(product) !== productKey;
    });

    saveCart(cart);
}

function clearCart() {
    saveCart([]);

    return EMPTY_CART_MESSAGE;
}

function checkout() {
    saveCart([]);

    return CHECKOUT_SUCCESS_MESSAGE;
}

function getCartSummary() {
    const cart = getCart();

    const subtotal = cart.reduce((total, product) => {
        const price = Number(product.price) || 0;
        const quantity = Number(product.quantity) || 0;

        return total + price * quantity;
    }, 0);

    const discount = subtotal >= DISCOUNT_THRESHOLD
        ? subtotal * DISCOUNT_RATE
        : 0;

    const shipping = cart.length > 0
        ? SHIPPING_COST
        : 0;

    const total = subtotal - discount + shipping;

    return {
        subtotal,
        discount,
        shipping,
        total
    };
}

function initCart() {
    updateCartCounter();

    window.addEventListener('storage', (event) => {
        if (event.key === CART_STORAGE_KEY) {
            updateCartCounter();
        }
    });

    window.addEventListener('cartUpdated', () => {
        updateCartCounter();
    });
}

export {
    getCart,
    getCartCount,
    getCartItemKey,
    getCartSummary,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    checkout,
    updateCartCounter,
    initCart
};
