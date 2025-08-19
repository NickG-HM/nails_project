// STICKLS Product Page - Interactive Functionality
// Author: Assistant
// Description: Product-specific features and interactions

'use strict';

// ===== PRODUCT PAGE INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.product-detail')) {
        initProductPage();
    }
});

function initProductPage() {
    initImageGallery();
    initSkinToneSelector();
    initProductOptions();
    initQuantitySelector();
    initProductTabs();
    initReviewsSection();
    initRelatedProducts();
    initProductActions();
    
    console.log('Product page initialized');
}

// ===== IMAGE GALLERY =====
function initImageGallery() {
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const zoomBtn = document.querySelector('.zoom-btn');
    
    if (!mainImage || !thumbnails.length) return;
    
    // Thumbnail switching
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const newImageSrc = this.dataset.image;
            const newImageAlt = this.querySelector('img').alt;
            
            // Update active thumbnail
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            this.classList.add('active');
            
            // Update main image with fade effect
            mainImage.style.opacity = '0';
            
            setTimeout(() => {
                mainImage.src = newImageSrc;
                mainImage.alt = newImageAlt;
                mainImage.style.opacity = '1';
            }, 150);
            
            trackEvent('product_image_change', { 
                image: newImageSrc,
                product_id: document.querySelector('[data-product-id]').dataset.productId 
            });
        });
        
        // Preload images on hover
        thumbnail.addEventListener('mouseenter', function() {
            const img = new Image();
            img.src = this.dataset.image;
        });
    });
    
    // Image zoom functionality
    if (zoomBtn) {
        zoomBtn.addEventListener('click', function() {
            openImageZoom(mainImage.src, mainImage.alt);
        });
    }
    
    // Click on main image to zoom
    mainImage.addEventListener('click', function() {
        openImageZoom(this.src, this.alt);
    });
}

function openImageZoom(src, alt) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay image-zoom-modal active';
    modal.innerHTML = `
        <div class="modal-content image-zoom-content">
            <button class="modal-close" aria-label="Close zoom">&times;</button>
            <div class="zoom-container">
                <img src="${src}" alt="${alt}" class="zoom-image">
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => closeImageZoom(modal));
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target === this.querySelector('.zoom-container')) {
            closeImageZoom(modal);
        }
    });
    
    // ESC key to close
    function handleEscape(e) {
        if (e.key === 'Escape') {
            closeImageZoom(modal);
            document.removeEventListener('keydown', handleEscape);
        }
    }
    
    document.addEventListener('keydown', handleEscape);
    
    trackEvent('product_image_zoom', { image: src });
}

function closeImageZoom(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
    }, 300);
}

// ===== SKIN TONE SELECTOR =====
function initSkinToneSelector() {
    const skinToneButtons = document.querySelectorAll('.skin-tone');
    const mainImage = document.getElementById('main-product-image');
    
    if (!skinToneButtons.length || !mainImage) return;
    
    // Base image URLs for different skin tones
    const skinToneImages = {
        'light': 'assets/product-rose-gold-light.jpg',
        'medium': 'assets/product-rose-gold-medium.jpg',
        'olive': 'assets/product-rose-gold-olive.jpg',
        'deep': 'assets/product-rose-gold-deep.jpg',
        'dark': 'assets/product-rose-gold-dark.jpg'
    };
    
    skinToneButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedTone = this.dataset.tone;
            
            // Update active state
            skinToneButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update main image
            const newImageSrc = skinToneImages[selectedTone];
            if (newImageSrc) {
                mainImage.style.opacity = '0';
                setTimeout(() => {
                    mainImage.src = newImageSrc;
                    mainImage.alt = `Rose Gold Elegance on ${selectedTone} skin tone`;
                    mainImage.style.opacity = '1';
                }, 150);
            }
            
            trackEvent('skin_tone_selected', { 
                tone: selectedTone,
                product_id: document.querySelector('[data-product-id]').dataset.productId 
            });
        });
    });
}

// ===== PRODUCT OPTIONS =====
function initProductOptions() {
    initLengthOptions();
    initShapeOptions();
    initSizeOptions();
}

function initLengthOptions() {
    const lengthOptions = document.querySelectorAll('.length-option');
    
    lengthOptions.forEach(option => {
        option.addEventListener('click', function() {
            lengthOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            updateProductPrice();
            trackEvent('length_selected', { 
                length: this.dataset.length,
                product_id: document.querySelector('[data-product-id]').dataset.productId 
            });
        });
    });
}

function initShapeOptions() {
    const shapeOptions = document.querySelectorAll('.shape-option');
    
    shapeOptions.forEach(option => {
        option.addEventListener('click', function() {
            shapeOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            updateProductPrice();
            trackEvent('shape_selected', { 
                shape: this.dataset.shape,
                product_id: document.querySelector('[data-product-id]').dataset.productId 
            });
        });
    });
}

function initSizeOptions() {
    const sizeOptions = document.querySelectorAll('.size-option');
    
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            sizeOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            trackEvent('size_selected', { 
                size: this.dataset.size,
                product_id: document.querySelector('[data-product-id]').dataset.productId 
            });
        });
    });
}

function updateProductPrice() {
    // In a real implementation, this would calculate price based on selected options
    const currentPriceElement = document.querySelector('.current-price');
    if (currentPriceElement) {
        // Simulate price calculation
        const basePrice = 24.99;
        const selectedLength = document.querySelector('.length-option.selected')?.dataset.length;
        const selectedShape = document.querySelector('.shape-option.selected')?.dataset.shape;
        
        let price = basePrice;
        
        // Add length premium
        if (selectedLength === 'long') {
            price += 3.00;
        } else if (selectedLength === 'medium') {
            price += 1.50;
        }
        
        // Add shape premium for complex shapes
        if (selectedShape === 'coffin' || selectedShape === 'almond') {
            price += 2.00;
        }
        
        currentPriceElement.textContent = `$${price.toFixed(2)}`;
    }
}

// ===== QUANTITY SELECTOR =====
function initQuantitySelector() {
    const quantityInput = document.querySelector('.quantity-input');
    const decreaseBtn = document.querySelector('.quantity-btn.decrease');
    const increaseBtn = document.querySelector('.quantity-btn.increase');
    
    if (!quantityInput || !decreaseBtn || !increaseBtn) return;
    
    decreaseBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        const minValue = parseInt(quantityInput.min) || 1;
        
        if (currentValue > minValue) {
            quantityInput.value = currentValue - 1;
            updateAddToCartButton();
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        const maxValue = parseInt(quantityInput.max) || 10;
        
        if (currentValue < maxValue) {
            quantityInput.value = currentValue + 1;
            updateAddToCartButton();
        }
    });
    
    quantityInput.addEventListener('change', function() {
        const value = parseInt(this.value);
        const min = parseInt(this.min) || 1;
        const max = parseInt(this.max) || 10;
        
        if (value < min) this.value = min;
        if (value > max) this.value = max;
        
        updateAddToCartButton();
    });
}

function updateAddToCartButton() {
    const quantity = parseInt(document.querySelector('.quantity-input').value);
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    
    if (addToCartBtn) {
        const btnText = quantity > 1 ? `Add ${quantity} to Cart` : 'Add to Cart';
        addToCartBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            ${btnText}
        `;
    }
}

// ===== PRODUCT TABS =====
function initProductTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    if (!tabBtns.length || !tabPanels.length) return;
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Update button states
            tabBtns.forEach(button => button.classList.remove('active'));
            this.classList.add('active');
            
            // Update panel states
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.dataset.panel === targetTab) {
                    panel.classList.add('active');
                }
            });
            
            // Load content if needed
            if (targetTab === 'reviews') {
                loadReviews();
            }
            
            trackEvent('product_tab_clicked', { 
                tab: targetTab,
                product_id: document.querySelector('[data-product-id]').dataset.productId 
            });
        });
    });
}

// ===== REVIEWS SECTION =====
function initReviewsSection() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const loadMoreBtn = document.querySelector('.load-more-reviews');
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(button => button.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            filterReviews(filter);
            
            trackEvent('reviews_filtered', { filter: filter });
        });
    });
    
    // Load more button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMoreReviews();
        });
    }
    
    // Initialize with default reviews
    loadReviews();
}

function loadReviews() {
    const reviewsList = document.getElementById('reviews-list');
    if (!reviewsList) return;
    
    // Simulated reviews data
    const reviews = [
        {
            id: 1,
            rating: 5,
            title: "Absolutely love these!",
            text: "These are the best press-on nails I've ever used. The rose gold finish is gorgeous and they lasted over a week with heavy use. Definitely ordering more colors!",
            author: "Sarah M.",
            verified: true,
            helpful: 24,
            date: "2024-01-15",
            photos: ['assets/review-photo-1.jpg']
        },
        {
            id: 2,
            rating: 5,
            title: "Perfect for special occasions",
            text: "Wore these to my wedding and received so many compliments. They looked salon-perfect and didn't budge during the entire day. The application was easier than expected.",
            author: "Jessica L.",
            verified: true,
            helpful: 18,
            date: "2024-01-12",
            photos: ['assets/review-photo-2.jpg', 'assets/review-photo-2b.jpg']
        },
        {
            id: 3,
            rating: 4,
            title: "Great quality, minor fit issue",
            text: "The nails are beautiful and high quality. Had to file down one nail slightly for the perfect fit, but overall very happy with the purchase. Will definitely buy again.",
            author: "Emily R.",
            verified: true,
            helpful: 12,
            date: "2024-01-10",
            photos: []
        },
        {
            id: 4,
            rating: 5,
            title: "Reusable and stunning",
            text: "I've used these 3 times now and they still look amazing. The eco-friendly aspect is a huge plus for me. The rose gold color is so elegant and goes with everything.",
            author: "Maria C.",
            verified: true,
            helpful: 15,
            date: "2024-01-08",
            photos: ['assets/review-photo-4.jpg']
        },
        {
            id: 5,
            rating: 5,
            title: "Customer service was amazing too",
            text: "Not only are the nails perfect, but when I had a question about sizing, customer service was incredibly helpful. Fast shipping and beautiful product!",
            author: "Amanda K.",
            verified: true,
            helpful: 9,
            date: "2024-01-05",
            photos: []
        }
    ];
    
    displayReviews(reviews);
}

function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviews-list');
    if (!reviewsList) return;
    
    reviewsList.innerHTML = reviews.map(review => `
        <div class="review-item" data-rating="${review.rating}">
            <div class="review-header">
                <div class="review-meta">
                    <div class="review-rating">
                        ${Array(5).fill().map((_, i) => `
                            <span class="star ${i < review.rating ? 'filled' : ''}">★</span>
                        `).join('')}
                    </div>
                    <h4 class="review-title">${review.title}</h4>
                </div>
                <div class="review-date">${formatDate(review.date)}</div>
            </div>
            
            <div class="review-body">
                <p class="review-text">${review.text}</p>
                
                ${review.photos.length > 0 ? `
                    <div class="review-photos">
                        ${review.photos.map(photo => `
                            <img src="${photo}" alt="Customer photo" class="review-photo" loading="lazy">
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            
            <div class="review-footer">
                <div class="review-author">
                    <span class="author-name">${review.author}</span>
                    ${review.verified ? '<span class="verified-badge">✓ Verified Purchase</span>' : ''}
                </div>
                <div class="review-actions">
                    <button class="helpful-btn" data-review-id="${review.id}">
                        👍 Helpful (${review.helpful})
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Bind review photo clicks
    const reviewPhotos = reviewsList.querySelectorAll('.review-photo');
    reviewPhotos.forEach(photo => {
        photo.addEventListener('click', function() {
            openImageModal(this.src, this.alt);
        });
    });
    
    // Bind helpful buttons
    const helpfulBtns = reviewsList.querySelectorAll('.helpful-btn');
    helpfulBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const reviewId = this.dataset.reviewId;
            markReviewHelpful(reviewId, this);
        });
    });
}

function filterReviews(filter) {
    const reviewItems = document.querySelectorAll('.review-item');
    
    reviewItems.forEach(item => {
        const rating = parseInt(item.dataset.rating);
        const hasPhotos = item.querySelector('.review-photos') !== null;
        
        let show = true;
        
        switch (filter) {
            case 'all':
                show = true;
                break;
            case '5':
                show = rating === 5;
                break;
            case '4':
                show = rating === 4;
                break;
            case 'with-photos':
                show = hasPhotos;
                break;
            default:
                show = true;
        }
        
        item.style.display = show ? 'block' : 'none';
    });
}

function loadMoreReviews() {
    // Simulate loading more reviews
    const loadMoreBtn = document.querySelector('.load-more-reviews');
    if (loadMoreBtn) {
        loadMoreBtn.textContent = 'Loading...';
        loadMoreBtn.disabled = true;
        
        setTimeout(() => {
            loadMoreBtn.textContent = 'No more reviews';
            loadMoreBtn.disabled = true;
        }, 1000);
    }
}

function markReviewHelpful(reviewId, button) {
    // Simulate marking review as helpful
    const currentCount = parseInt(button.textContent.match(/\d+/)[0]);
    button.innerHTML = `👍 Helpful (${currentCount + 1})`;
    button.disabled = true;
    button.style.opacity = '0.6';
    
    trackEvent('review_marked_helpful', { review_id: reviewId });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// ===== PRODUCT ACTIONS =====
function initProductActions() {
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const buyNowBtn = document.querySelector('.buy-now-btn');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            addToCart();
        });
    }
    
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function() {
            buyNow();
        });
    }
}

function addToCart() {
    const productData = getSelectedProductData();
    
    if (!productData) {
        alert('Please select all required options before adding to cart.');
        return;
    }
    
    // Add loading state
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const originalText = addToCartBtn.innerHTML;
    
    addToCartBtn.innerHTML = `
        <div class="btn-loading"></div>
        Adding to Cart...
    `;
    addToCartBtn.disabled = true;
    addToCartBtn.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        if (window.STICKLS_CART) {
            window.STICKLS_CART.add(productData);
        }
        
        // Success state
        addToCartBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>
            Added to Cart!
        `;
        addToCartBtn.classList.remove('loading');
        addToCartBtn.style.backgroundColor = 'var(--color-forest-green)';
        
        trackEvent('add_to_cart', productData);
        
        // Reset button after 2 seconds
        setTimeout(() => {
            addToCartBtn.innerHTML = originalText;
            addToCartBtn.disabled = false;
            addToCartBtn.style.backgroundColor = '';
        }, 2000);
        
    }, 1000);
}

function buyNow() {
    const productData = getSelectedProductData();
    
    if (!productData) {
        alert('Please select all required options before proceeding.');
        return;
    }
    
    // Add to cart and redirect to checkout
    if (window.STICKLS_CART) {
        window.STICKLS_CART.clear(); // Clear existing items for buy now
        window.STICKLS_CART.add(productData);
    }
    
    trackEvent('buy_now', productData);
    
    // Redirect to checkout
    window.location.href = '/checkout';
}

function getSelectedProductData() {
    const productElement = document.querySelector('[data-product-id]');
    if (!productElement) return null;
    
    const productId = productElement.dataset.productId;
    const selectedLength = document.querySelector('.length-option.selected')?.dataset.length;
    const selectedShape = document.querySelector('.shape-option.selected')?.dataset.shape;
    const selectedSize = document.querySelector('.size-option.selected')?.dataset.size;
    const quantity = parseInt(document.querySelector('.quantity-input').value);
    
    // Validate required selections
    if (!selectedLength || !selectedShape || !selectedSize) {
        return null;
    }
    
    const currentPrice = parseFloat(document.querySelector('.current-price').textContent.replace('$', ''));
    
    return {
        id: `${productId}-${selectedLength}-${selectedShape}-${selectedSize}`,
        productId: productId,
        name: document.querySelector('.product-title').textContent,
        price: currentPrice,
        quantity: quantity,
        options: {
            length: selectedLength,
            shape: selectedShape,
            size: selectedSize
        },
        image: document.getElementById('main-product-image').src
    };
}

// ===== RELATED PRODUCTS =====
function initRelatedProducts() {
    loadRelatedProducts();
    loadRecentlyViewed();
    
    // Track product view
    trackProductView();
}

function loadRelatedProducts() {
    const relatedGrid = document.querySelector('.related-products .products-grid');
    if (!relatedGrid) return;
    
    // Simulated related products
    const relatedProducts = [
        {
            id: 'champagne-dreams',
            name: 'Champagne Dreams',
            price: 24.99,
            image: 'assets/product-champagne.jpg',
            rating: 4.7,
            reviews: 89
        },
        {
            id: 'burgundy-passion',
            name: 'Burgundy Passion',
            price: 26.99,
            image: 'assets/product-burgundy.jpg',
            rating: 4.9,
            reviews: 156
        },
        {
            id: 'nude-perfection',
            name: 'Nude Perfection',
            price: 22.99,
            image: 'assets/product-nude.jpg',
            rating: 4.6,
            reviews: 234
        },
        {
            id: 'midnight-glam',
            name: 'Midnight Glam',
            price: 27.99,
            image: 'assets/product-midnight.jpg',
            rating: 4.8,
            reviews: 178
        }
    ];
    
    relatedGrid.innerHTML = relatedProducts.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="product-overlay">
                    <button class="btn btn-outline" data-quick-view="${product.id}">Quick View</button>
                    <button class="wishlist-btn" data-wishlist="${product.id}" aria-label="Add to wishlist">🤍</button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">
                    <a href="/product/${product.id}">${product.name}</a>
                </h3>
                <div class="product-rating">
                    <div class="stars">
                        ${Array(5).fill().map((_, i) => `
                            <span class="star ${i < Math.floor(product.rating) ? 'filled' : ''}">★</span>
                        `).join('')}
                    </div>
                    <span class="rating-value">${product.rating}</span>
                    <span class="review-count">(${product.reviews})</span>
                </div>
                <div class="product-price">$${product.price}</div>
            </div>
        </div>
    `).join('');
    
    // Initialize product card interactions
    initProductCards(relatedGrid);
}

function loadRecentlyViewed() {
    // Get recently viewed products from localStorage
    const recentlyViewed = JSON.parse(localStorage.getItem('stickls-recently-viewed') || '[]');
    
    if (recentlyViewed.length === 0) {
        const recentlyViewedSection = document.querySelector('.recently-viewed');
        if (recentlyViewedSection) {
            recentlyViewedSection.style.display = 'none';
        }
        return;
    }
    
    const recentlyViewedGrid = document.querySelector('.recently-viewed .products-carousel');
    if (!recentlyViewedGrid) return;
    
    recentlyViewedGrid.innerHTML = recentlyViewed.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="product-overlay">
                    <button class="btn btn-outline" data-quick-view="${product.id}">Quick View</button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">
                    <a href="/product/${product.id}">${product.name}</a>
                </h3>
                <div class="product-price">$${product.price}</div>
            </div>
        </div>
    `).join('');
    
    initProductCards(recentlyViewedGrid);
}

function initProductCards(container) {
    const productCards = container.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Track product clicks
        const productLink = card.querySelector('.product-name a');
        if (productLink) {
            productLink.addEventListener('click', function() {
                const productId = card.dataset.productId;
                trackEvent('related_product_click', { product_id: productId });
            });
        }
    });
}

function trackProductView() {
    const productElement = document.querySelector('[data-product-id]');
    if (!productElement) return;
    
    const productId = productElement.dataset.productId;
    const productName = document.querySelector('.product-title').textContent;
    const productPrice = parseFloat(document.querySelector('.current-price').textContent.replace('$', ''));
    const productImage = document.getElementById('main-product-image').src;
    
    // Add to recently viewed
    let recentlyViewed = JSON.parse(localStorage.getItem('stickls-recently-viewed') || '[]');
    
    // Remove if already exists
    recentlyViewed = recentlyViewed.filter(item => item.id !== productId);
    
    // Add to beginning
    recentlyViewed.unshift({
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        viewedAt: Date.now()
    });
    
    // Keep only last 6 items
    recentlyViewed = recentlyViewed.slice(0, 6);
    
    localStorage.setItem('stickls-recently-viewed', JSON.stringify(recentlyViewed));
    
    // Track view event
    trackEvent('product_view', {
        product_id: productId,
        product_name: productName,
        product_price: productPrice
    });
}

// ===== UTILITY FUNCTIONS =====
function openImageModal(src, alt) {
    // Reuse the image modal function from components.js
    if (window.openImageModal) {
        window.openImageModal(src, alt);
    }
}

function trackEvent(eventName, properties = {}) {
    // Reuse the tracking function from main.js
    if (window.trackEvent) {
        window.trackEvent(eventName, properties);
    }
}

// ===== PRODUCT PAGE SPECIFIC STYLES =====
const productPageStyles = `
    .review-item {
        border: 1px solid var(--color-soft-gray);
        border-radius: var(--border-radius-lg);
        padding: var(--space-lg);
        margin-bottom: var(--space-lg);
        background: var(--color-white);
    }
    
    .review-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: var(--space-md);
    }
    
    .review-title {
        font-family: var(--font-sans);
        font-size: var(--font-size-lg);
        font-weight: var(--weight-semibold);
        margin: var(--space-xs) 0;
        color: var(--color-dark-gray);
    }
    
    .review-date {
        font-size: var(--font-size-sm);
        color: var(--color-warm-gray);
    }
    
    .review-photos {
        display: flex;
        gap: var(--space-sm);
        margin-top: var(--space-md);
        flex-wrap: wrap;
    }
    
    .review-photo {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: var(--border-radius-md);
        cursor: pointer;
        transition: transform var(--transition-fast);
    }
    
    .review-photo:hover {
        transform: scale(1.05);
    }
    
    .review-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: var(--space-lg);
    }
    
    .review-author {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
    }
    
    .author-name {
        font-weight: var(--weight-medium);
        color: var(--color-dark-gray);
    }
    
    .verified-badge {
        font-size: var(--font-size-xs);
        color: var(--color-forest-green);
        font-weight: var(--weight-medium);
    }
    
    .helpful-btn {
        background: none;
        border: 1px solid var(--color-soft-gray);
        border-radius: var(--border-radius-md);
        padding: var(--space-xs) var(--space-md);
        cursor: pointer;
        font-size: var(--font-size-sm);
        transition: all var(--transition-fast);
    }
    
    .helpful-btn:hover:not(:disabled) {
        border-color: var(--color-deep-burgundy);
        background: var(--color-light-gray);
    }
    
    .product-card {
        border-radius: var(--border-radius-lg);
        overflow: hidden;
        box-shadow: var(--shadow-md);
        transition: all var(--transition-normal);
        background: var(--color-white);
    }
    
    .product-card:hover {
        box-shadow: var(--shadow-xl);
    }
    
    .product-image {
        position: relative;
        aspect-ratio: 1;
        overflow: hidden;
    }
    
    .product-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform var(--transition-slow);
    }
    
    .product-card:hover .product-image img {
        transform: scale(1.05);
    }
    
    .product-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(26, 25, 24, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-md);
        opacity: 0;
        transition: opacity var(--transition-normal);
    }
    
    .product-card:hover .product-overlay {
        opacity: 1;
    }
    
    .product-card .product-info {
        padding: var(--space-lg);
    }
    
    .product-name {
        margin-bottom: var(--space-sm);
    }
    
    .product-name a {
        color: var(--color-dark-gray);
        text-decoration: none;
        transition: color var(--transition-fast);
    }
    
    .product-name a:hover {
        color: var(--color-deep-burgundy);
    }
    
    .image-zoom-content {
        max-width: 90vw;
        max-height: 90vh;
        padding: 0;
        background: transparent;
        border-radius: 0;
    }
    
    .zoom-container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .zoom-image {
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
        border-radius: var(--border-radius-lg);
    }
    
    .image-zoom-modal .modal-close {
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        z-index: 10;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = productPageStyles;
document.head.appendChild(styleSheet); 