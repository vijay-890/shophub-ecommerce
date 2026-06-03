const API_URL = 'http://localhost:3000/api';

let cart = [];
let products = [];
let wishlist = [];
let productReviews = {};
let subscribers = [];
let currentRating = 5;
let viewingWishlist = false;
let currentProductId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadCartFromLocalStorage();
    loadWishlistFromLocalStorage();
    loadReviewsFromLocalStorage();
});

async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error:', error);
        displayMockProducts();
    }
}

function displayMockProducts() {
    const mockProducts = [
        {
            _id: '1',
            name: 'Wireless Headphones',
            price: 79.99,
            description: 'High-quality wireless headphones',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
            category: 'Electronics',
            rating: 4.8
        },
        {
            _id: '2',
            name: 'Smart Watch',
            price: 199.99,
            description: 'Feature-rich smartwatch with health tracking',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
            category: 'Electronics',
            rating: 4.6
        },
        {
            _id: '3',
            name: 'USB-C Cable',
            price: 12.99,
            description: 'Durable USB-C charging cable',
            image: 'https://images.unsplash.com/photo-1609034227505-5876f6aa4e90?w=400',
            category: 'Accessories',
            rating: 4.9
        },
        {
            _id: '4',
            name: 'Phone Case',
            price: 24.99,
            description: 'Premium protective phone case',
            image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',
            category: 'Accessories',
            rating: 4.7
        },
        {
            _id: '5',
            name: 'Portable Charger',
            price: 49.99,
            description: 'Fast charging portable power bank',
            image: 'https://images.unsplash.com/photo-1609042231871-8a5a694d0e90?w=400',
            category: 'Electronics',
            rating: 4.5
        },
        {
            _id: '6',
            name: 'Screen Protector',
            price: 9.99,
            description: 'Tempered glass screen protector',
            image: 'https://images.unsplash.com/photo-1598301257657-5d02c7b83d1b?w=400',
            category: 'Accessories',
            rating: 4.8
        }
    ];
    products = mockProducts;
    displayProducts(mockProducts);
}

function displayProducts(items) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = items.map(product => {
        const isInWishlist = wishlist.some(w => w.id === product._id);
        const ratingStars = '★'.repeat(Math.round(product.rating || 5)) + '☆'.repeat(5 - Math.round(product.rating || 5));
        return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-body">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">
                    <span class="stars">${ratingStars}</span>
                    <span>(${(product.rating || 5).toFixed(1)}/5)</span>
                </div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-footer">
                    <button class="btn btn-primary btn-small" onclick="addToCart('${product._id}', '${product.name}', ${product.price})">
                        Add to Cart
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="toggleWishlist('${product._id}', '${product.name}')">
                        ${isInWishlist ? '♥' : '♡'} Wishlist
                    </button>
                </div>
                <div style="text-align: center; margin-top: 0.75rem;">
                    <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 0.5rem 0.75rem;" onclick="openReviews('${product._id}')">
                        Reviews
                    </button>
                </div>
            </div>
        </div>
        `}).join('');
    updateWishlistUI();
}

function addToCart(productId, productName, productPrice) {
    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ productId, name: productName, price: productPrice, quantity: 1 });
    }
    saveCartToLocalStorage();
    updateCartUI();
    showNotification(`${productName} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    saveCartToLocalStorage();
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        document.getElementById('cartTotal').textContent = '0.00';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <button class="btn btn-secondary btn-small" onclick="removeFromCart('${item.productId}')">Remove</button>
            </div>
        `).join('');
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('cartTotal').textContent = total.toFixed(2);
    }
}

function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
    document.getElementById('cartOverlay').classList.toggle('open');
}

function goToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    const checkoutItems = document.getElementById('checkoutItems');
    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <span>${item.name} x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('checkoutTotal').textContent = total.toFixed(2);
    document.getElementById('checkoutModal').classList.add('open');
    toggleCart();
}

function submitOrder(event) {
    event.preventDefault();
    const form = event.target;
    const customerName = form.customerName.value;
    const customerEmail = form.customerEmail.value;
    const address = form.address.value;
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderData = { items: cart, totalPrice, customerName, customerEmail, address };

    fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    }).then(response => response.json()).then(order => {
        closeCheckout();
        showSuccessMessage(order._id, customerEmail);
        cart = [];
        saveCartToLocalStorage();
        updateCartUI();
    }).catch(() => {
        closeCheckout();
        showSuccessMessage('DEMO-' + Date.now(), customerEmail);
        cart = [];
        saveCartToLocalStorage();
        updateCartUI();
    });
}

function showSuccessMessage(orderId, email) {
    document.getElementById('orderMessage').textContent = `Your order #${orderId} confirmed! Email sent to ${email}.`;
    document.getElementById('successModal').classList.add('open');
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('open');
}

function closeSuccess() {
    document.getElementById('successModal').classList.remove('open');
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 9999;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

/* SEARCH & FILTER */
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const priceRange = document.getElementById('priceFilter').value;

    let filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || product.category === category;
        const matchesPrice = !priceRange || isInPriceRange(product.price, priceRange);
        return matchesSearch && matchesCategory && matchesPrice;
    });

    if (filtered.length === 0) {
        document.getElementById('noResults').style.display = 'block';
        document.getElementById('productsGrid').style.display = 'none';
    } else {
        document.getElementById('noResults').style.display = 'none';
        document.getElementById('productsGrid').style.display = 'grid';
        displayProducts(filtered);
    }
}

function isInPriceRange(price, range) {
    if (range === '0-50') return price < 50;
    if (range === '50-150') return price >= 50 && price <= 150;
    if (range === '150+') return price > 150;
    return true;
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('priceFilter').value = '';
    displayProducts(products);
}

/* WISHLIST */
function toggleWishlist(productId, productName) {
    const index = wishlist.findIndex(item => item.id === productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification(`Removed from wishlist`);
    } else {
        const product = products.find(p => p._id === productId);
        wishlist.push({ id: productId, name: productName, price: product.price, image: product.image });
        showNotification(`Added to wishlist ❤️`);
    }
    saveWishlistToLocalStorage();
    updateWishlistUI();
    displayProducts(products);
}

function updateWishlistUI() {
    document.getElementById('wishlistCount').textContent = wishlist.length;
}

function toggleWishlistView() {
    if (viewingWishlist) {
        displayProducts(products);
        viewingWishlist = false;
    } else {
        displayWishlistProducts();
        viewingWishlist = true;
    }
}

function displayWishlistProducts() {
    if (wishlist.length === 0) {
        document.getElementById('productsGrid').innerHTML = '<p class="empty-cart" style="grid-column: 1/-1;">Wishlist is empty!</p>';
        return;
    }
    const wishlistProducts = wishlist.map(item => ({
        _id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: 'Wishlist',
        rating: 5,
        description: 'Saved for later'
    }));
    displayProducts(wishlistProducts);
}

function saveWishlistToLocalStorage() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function loadWishlistFromLocalStorage() {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
        wishlist = JSON.parse(saved);
        updateWishlistUI();
    }
}

/* REVIEWS */
function openReviews(productId) {
    currentProductId = productId;
    document.getElementById('reviewsModal').classList.add('open');
    displayReviews(productId);
}

function closeReviews() {
    document.getElementById('reviewsModal').classList.remove('open');
}

function setRating(value) {
    currentRating = value;
    document.querySelectorAll('.star').forEach((btn, index) => {
        if (index < value) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
}

function submitReview(event) {
    event.preventDefault();
    const reviewText = event.target.querySelector('textarea[name="reviewText"]').value;
    const review = { rating: currentRating, text: reviewText, date: new Date().toLocaleDateString() };
    if (!productReviews[currentProductId]) {
        productReviews[currentProductId] = [];
    }
    productReviews[currentProductId].push(review);
    saveReviewsToLocalStorage();
    event.target.reset();
    setRating(5);
    displayReviews(currentProductId);
    showNotification('Review submitted!');
}

function displayReviews(productId) {
    const reviewsList = document.getElementById('reviewsList');
    const reviews = productReviews[productId] || [];
    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p class="empty-cart">No reviews yet.</p>';
        return;
    }
    reviewsList.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div><strong>Customer</strong> - ${review.date}</div>
            <div>★★★★★</div>
            <p>${review.text}</p>
        </div>
    `).join('');
}

function saveReviewsToLocalStorage() {
    localStorage.setItem('reviews', JSON.stringify(productReviews));
}

function loadReviewsFromLocalStorage() {
    const saved = localStorage.getItem('reviews');
    if (saved) {
        productReviews = JSON.parse(saved);
    }
}

/* NEWSLETTER */
function subscribeNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('subscribers', JSON.stringify(subscribers));
        showNotification(`Subscribed with ${email}!`);
        event.target.reset();
    } else {
        showNotification('Already subscribed!');
    }
}
