import { addToCart } from './cart.js';

const PRODUCTS_URL = '../assets/data.json';
const PRODUCTS_PER_PAGE = 12;

const TOP_BEST_SETS = [
    {
        image: '../../images for Capstone Projects/Catalog Page/set of suitcases black - small.png',
        description: 'Primis in faucibus aenean laoreet rhoncus ipsum eget.',
        price: 1200,
        rating: 5
    },
    {
        image: '../../images for Capstone Projects/Catalog Page/set of suitcases blue - small.png',
        description: 'Vestibulum in elementum erat interdum et malesuada fames.',
        price: 2100,
        rating: 4
    },
    {
        image: '../../images for Capstone Projects/Catalog Page/set of suitcases green - small.png',
        description: 'Laoreet rhoncus ipsum eget tempus praesent convallis.',
        price: 1100,
        rating: 4
    },
    {
        image: '../../images for Capstone Projects/Catalog Page/set of suitcases red - small.png',
        description: 'Interdum et malesuada fames ante ipsum primis in faucibus.',
        price: 1000,
        rating: 5
    },
    {
        image: '../../images for Capstone Projects/Catalog Page/set of suitcases yellow - small.png',
        description: 'Rhoncus ipsum eget tempus praesent convallis fermentum.',
        price: 1500,
        rating: 4
    }
];

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let currentSort = 'default';

const filters = {
    size: '',
    color: '',
    category: '',
    sales: false
};

function getProductImageUrl(imageUrl) {
    if (!imageUrl) {
        return '';
    }

    if (/^(https?:|data:|\/)/i.test(imageUrl)) {
        return imageUrl;
    }

    return imageUrl
        .replace(/^\.\.\//, '../../')
        .replace(/Catalog page/g, 'Catalog Page');
}

function shuffleArray(items) {
    const shuffled = [...items];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[randomIndex]] =
            [shuffled[randomIndex], shuffled[index]];
    }

    return shuffled;
}

async function loadProducts() {
    try {
        const response = await fetch(PRODUCTS_URL);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const result = await response.json();
        return Array.isArray(result.data) ? result.data : [];
    } catch (error) {
        console.error('Unable to load catalog products:', error);
        return [];
    }
}

function createProductCard(product) {
    const article = document.createElement('article');
    article.className = 'catalog_product_card';
    article.dataset.productId = product.id;
    article.tabIndex = 0;
    article.setAttribute('role', 'link');
    article.setAttribute('aria-label', `View ${product.name}`);

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'catalog_product_image_wrapper';

    if (product.salesStatus) {
        const saleLabel = document.createElement('span');
        saleLabel.className = 'catalog_sale_label';
        saleLabel.textContent = 'SALE';
        imageWrapper.appendChild(saleLabel);
    }

    const image = document.createElement('img');
    image.src = getProductImageUrl(product.imageUrl);
    image.alt = product.name;
    image.loading = 'lazy';
    image.addEventListener('error', () => {
        image.classList.add('catalog_image_error');
        image.removeAttribute('src');
    }, { once: true });
    imageWrapper.appendChild(image);

    const name = document.createElement('h2');
    name.className = 'catalog_product_name';
    name.textContent = product.name;

    const price = document.createElement('p');
    price.className = 'catalog_product_price';
    price.textContent = `$${Number(product.price).toFixed(2)}`;

    const button = document.createElement('button');
    button.className = 'catalog_add_button';
    button.type = 'button';
    button.textContent = 'Add To Cart';

    button.addEventListener('click', (event) => {
        event.stopPropagation();
        addToCart(product);

        button.textContent = 'Added!';
        button.classList.add('is_added');

        window.setTimeout(() => {
            button.textContent = 'Add To Cart';
            button.classList.remove('is_added');
        }, 1000);
    });

    article.append(imageWrapper, name, price, button);

    article.addEventListener('click', () => openProduct(product.id));
    article.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openProduct(product.id);
        }
    });

    return article;
}

function openProduct(productId) {
    window.location.href =
        `./product-details.html?id=${encodeURIComponent(productId)}`;
}

function renderProducts() {
    const grid = document.querySelector('#catalogProductGrid');
    const resultsCount = document.querySelector('#catalogResultsCount');
    const pagination = document.querySelector('#catalogPagination');

    if (!grid || !resultsCount || !pagination) {
        return;
    }

    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);

    if (total === 0) {
        grid.innerHTML = '<p class="catalog_no_results">No products found.</p>';
        resultsCount.textContent = 'Showing 0–0 of 0 Results';
        pagination.innerHTML = '';
        return;
    }

    currentPage = Math.min(currentPage, totalPages);

    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const pageProducts = filteredProducts.slice(
        startIndex,
        startIndex + PRODUCTS_PER_PAGE
    );

    grid.innerHTML = '';
    pageProducts.forEach((product) => {
        grid.appendChild(createProductCard(product));
    });

    const firstResult = startIndex + 1;
    const lastResult = Math.min(startIndex + PRODUCTS_PER_PAGE, total);
    resultsCount.textContent = `Showing ${firstResult}–${lastResult} of ${total} Results`;

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const pagination = document.querySelector('#catalogPagination');
    pagination.innerHTML = '';

    if (totalPages <= 1) {
        return;
    }

    const previousButton = document.createElement('button');
    previousButton.type = 'button';
    previousButton.className = 'catalog_page_arrow';
    previousButton.textContent = 'PREV';
    previousButton.disabled = currentPage === 1;
    previousButton.addEventListener('click', () => changePage(currentPage - 1));
    pagination.appendChild(previousButton);

    for (let page = 1; page <= totalPages; page += 1) {
        const pageButton = document.createElement('button');
        pageButton.type = 'button';
        pageButton.className = 'catalog_page_number';
        pageButton.textContent = page;
        pageButton.classList.toggle('active', page === currentPage);
        pageButton.setAttribute('aria-label', `Page ${page}`);
        pageButton.setAttribute('aria-current', page === currentPage ? 'page' : 'false');
        pageButton.addEventListener('click', () => changePage(page));
        pagination.appendChild(pageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.className = 'catalog_page_arrow';
    nextButton.textContent = 'NEXT';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => changePage(currentPage + 1));
    pagination.appendChild(nextButton);
}

function changePage(page) {
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

    if (page < 1 || page > totalPages) {
        return;
    }

    currentPage = page;
    renderProducts();

    document.querySelector('.catalog_controls')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function applyFilters() {
    filteredProducts = allProducts.filter((product) => {
        const matchesSize = !filters.size || product.size === filters.size;
        const matchesColor = !filters.color || product.color === filters.color;
        const matchesCategory = !filters.category || product.category === filters.category;
        const matchesSales = !filters.sales || product.salesStatus === true;

        return matchesSize && matchesColor && matchesCategory && matchesSales;
    });

    applySorting();
    currentPage = 1;
    renderProducts();
}

function applySorting() {
    const sorters = {
        'price-asc': (a, b) => Number(a.price) - Number(b.price),
        'price-desc': (a, b) => Number(b.price) - Number(a.price),
        popularity: (a, b) => Number(b.popularity) - Number(a.popularity),
        rating: (a, b) => Number(b.rating) - Number(a.rating)
    };

    const sorter = sorters[currentSort];

    if (sorter) {
        filteredProducts.sort(sorter);
    } else {
        const originalOrder = new Map(
            allProducts.map((product, index) => [product.id, index])
        );

        filteredProducts.sort((a, b) => {
            return originalOrder.get(a.id) - originalOrder.get(b.id);
        });
    }
}

function initFilterControls() {
    const size = document.querySelector('#filterSize');
    const color = document.querySelector('#filterColor');
    const category = document.querySelector('#filterCategory');
    const sales = document.querySelector('#filterSales');

    const controls = [size, color, category, sales];

    size.addEventListener('change', () => {
        filters.size = size.value;
        size.closest('.filter_field').classList.toggle('is_selected', Boolean(size.value));
        applyFilters();
    });

    color.addEventListener('change', () => {
        filters.color = color.value;
        color.closest('.filter_field').classList.toggle('is_selected', Boolean(color.value));
        applyFilters();
    });

    category.addEventListener('change', () => {
        filters.category = category.value;
        category.closest('.filter_field').classList.toggle('is_selected', Boolean(category.value));
        applyFilters();
    });

    sales.addEventListener('change', () => {
        filters.sales = sales.checked;
        sales.closest('.filter_field').classList.toggle('is_selected', sales.checked);
        applyFilters();
    });

    document.querySelector('#clearFilters').addEventListener('click', () => {
        controls.forEach((control) => {
            if (control.type === 'checkbox') {
                control.checked = false;
            } else {
                control.value = '';
            }

            control.closest('.filter_field').classList.remove('is_selected');
        });

        filters.size = '';
        filters.color = '';
        filters.category = '';
        filters.sales = false;
        currentSort = 'default';
        document.querySelector('#catalogSort').value = 'default';

        applyFilters();
    });
}

function initToolbar() {
    const filterToggle = document.querySelector('#filterToggle');
    const filterPanel = document.querySelector('#catalogFilters');
    const hideFilters = document.querySelector('#hideFilters');
    const sort = document.querySelector('#catalogSort');

    function toggleFilters(show) {
        filterPanel.hidden = !show;
        filterToggle.setAttribute('aria-expanded', String(show));
        filterToggle.classList.toggle('is_active', show);
    }

    filterToggle.addEventListener('click', () => {
        toggleFilters(filterPanel.hidden);
    });

    hideFilters.addEventListener('click', () => toggleFilters(false));

    sort.addEventListener('change', () => {
        currentSort = sort.value;
        applySorting();
        currentPage = 1;
        renderProducts();
    });
}

function showNotFoundModal() {
    const modal = document.querySelector('#catalogNotFoundModal');

    if (!modal) {
        alert('Product not found.');
        return;
    }

    modal.showModal();

    const okButton = document.querySelector('#catalogModalOk');

    okButton?.focus();
}

function closeNotFoundModal() {
    const modal = document.querySelector('#catalogNotFoundModal');

    if (!modal?.open) {
        return;
    }

    modal.close();
}

function initSearch() {
    const form = document.querySelector('#catalogSearchForm');
    const input = document.querySelector('#catalogSearchInput');

    if (!form || !input) {
        console.warn('Catalog search elements were not found.');
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const query = input.value.trim().toLowerCase();

        if (!query) {
            applyFilters();
            return;
        }

        const foundProduct = allProducts.find((product) => {
            return product.name.toLowerCase().includes(query) ||
                product.id.toLowerCase() === query;
        });

        if (foundProduct) {
            openProduct(foundProduct.id);
        } else {
            showNotFoundModal();
        }
    });

    const closeButton = document.querySelector('#catalogModalClose');
    const okButton = document.querySelector('#catalogModalOk');
    const modal = document.querySelector('#catalogNotFoundModal');

    if (closeButton) {
        closeButton.addEventListener('click', closeNotFoundModal);
    }

    if (okButton) {
        okButton.addEventListener('click', closeNotFoundModal);
    }

    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeNotFoundModal();
            }
        });
    }

}

function renderTopBestSets() {
    const container = document.querySelector('#topBestSets');

    if (!container) {
        return;
    }

    const shuffledSets = shuffleArray(TOP_BEST_SETS);

    container.innerHTML = '';

    shuffledSets.forEach((set) => {
        const item = document.createElement('article');
        item.className = 'top_best_set_item';

        const image = document.createElement('img');
        image.src = set.image;
        image.alt = 'Luggage set';
        image.loading = 'lazy';

        const details = document.createElement('div');
        details.className = 'top_best_set_details';

        const description = document.createElement('p');
        description.textContent = set.description;

        const rating = document.createElement('div');
        rating.className = 'top_best_set_rating';
        rating.setAttribute(
            'aria-label',
            `${set.rating} out of 5 stars`
        );

        rating.innerHTML = Array.from({ length: 5 }, (_, index) => `
            <span class="star ${index < set.rating ? 'star_filled' : 'star_empty'}">
                ★
            </span>
        `).join('');

        const price = document.createElement('span');
        price.className = 'top_best_set_price';
        price.textContent = `$${set.price}`;

        details.append(description, rating, price);
        item.append(image, details);
        container.appendChild(item);
    });
}

async function initCatalog() {
    const grid = document.querySelector('#catalogProductGrid');

    if (!grid) {
        return;
    }

    initToolbar();
    initFilterControls();
    initSearch();
    renderTopBestSets();

    allProducts = await loadProducts();
    filteredProducts = [...allProducts];

    if (!allProducts.length) {
        grid.innerHTML = '<p class="catalog_no_results">Products could not be loaded.</p>';
        document.querySelector('#catalogResultsCount').textContent = 'Showing 0–0 of 0 Results';
        return;
    }

    renderProducts();
}

export { initCatalog };
