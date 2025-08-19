// STICKLS Website - Main JavaScript
// Author: Assistant
// Description: Interactive functionality for the STICKLS eCommerce website

'use strict';

// ===== GLOBAL VARIABLES & UTILITIES =====
const STICKLS = {
    // Configuration
    config: {
        breakpoints: {
            mobile: 480,
            tablet: 768,
            desktop: 1024
        },
        animation: {
            duration: 300,
            easing: 'ease-in-out'
        }
    },
    
    // Utility functions
    utils: {
        // Debounce function for performance
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // Check if element is in viewport
        isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },
        
        // Smooth scroll to element
        scrollTo(element, offset = 0) {
            const targetPosition = element.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        },
        
        // Format currency
        formatCurrency(amount, currency = 'USD') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency
            }).format(amount);
        }
    }
};

// ===== DOM READY INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    // Initialize all components
    initNavigation();
    initHeroSection();
    initCollectionsGrid();
    initHowItWorks();
    initCustomerGallery();
    initReviewsCarousel();
    initNewsletterForm();
    initInstagramFeed();
    initScrollAnimations();
    initAccessibilityFeatures();
    
    console.log('STICKLS website initialized successfully');
}

// ===== NAVIGATION FUNCTIONALITY =====
function initNavigation() {
    const header = document.querySelector('.header');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const searchInput = document.querySelector('.search-input');
    const cartCount = document.querySelector('.cart-count');
    
    // Sticky header on scroll
    let lastScrollY = window.scrollY;
    
    const handleScroll = STICKLS.utils.debounce(() => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header based on scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    }, 10);
    
    window.addEventListener('scroll', handleScroll);
    
    // Mobile menu toggle
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
    }
    
    // Search functionality
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length > 2) {
                searchTimeout = setTimeout(() => {
                    performSearch(query);
                }, 300);
            }
        });
        
        // Search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value.trim());
            }
        });
    }
    
    // Cart functionality
    initCart();
    
    // Mega menu hover effects
    initMegaMenu();
}

function performSearch(query) {
    console.log('Searching for:', query);
    // In a real implementation, this would make an API call
    // For now, we'll simulate a search
    
    // Show search results or redirect to search page
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
}

function initCart() {
    const cartCount = document.querySelector('.cart-count');
    let cartItems = JSON.parse(localStorage.getItem('stickls-cart') || '[]');
    
    function updateCartDisplay() {
        if (cartCount) {
            const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }
    
    // Public methods for cart management
    window.STICKLS_CART = {
        add(product) {
            const existingItem = cartItems.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cartItems.push({ ...product, quantity: 1 });
            }
            
            localStorage.setItem('stickls-cart', JSON.stringify(cartItems));
            updateCartDisplay();
            showCartNotification('Item added to cart!');
        },
        
        remove(productId) {
            cartItems = cartItems.filter(item => item.id !== productId);
            localStorage.setItem('stickls-cart', JSON.stringify(cartItems));
            updateCartDisplay();
        },
        
        getItems() {
            return cartItems;
        },
        
        clear() {
            cartItems = [];
            localStorage.setItem('stickls-cart', JSON.stringify(cartItems));
            updateCartDisplay();
        }
    };
    
    updateCartDisplay();
}

function showCartNotification(message) {
    // Create and show a toast notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--color-deep-burgundy);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius-lg);
        z-index: 9999;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: var(--shadow-lg);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function initMegaMenu() {
    const navItems = document.querySelectorAll('.nav-item[aria-haspopup="true"]');
    
    navItems.forEach(item => {
        const megaMenu = item.querySelector('.mega-menu');
        let hoverTimeout;
        
        if (megaMenu) {
            item.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                megaMenu.style.display = 'block';
                requestAnimationFrame(() => {
                    megaMenu.classList.add('active');
                });
            });
            
            item.addEventListener('mouseleave', () => {
                megaMenu.classList.remove('active');
                hoverTimeout = setTimeout(() => {
                    megaMenu.style.display = 'none';
                }, 300);
            });
        }
    });
}

// ===== HERO SECTION =====
function initHeroSection() {
    const hero = document.querySelector('.hero');
    const heroVideo = document.querySelector('.hero-video-overlay video');
    
    if (heroVideo) {
        // Pause video if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            heroVideo.pause();
            heroVideo.style.display = 'none';
        }
        
        // Play/pause video on hover (desktop only)
        if (window.innerWidth > STICKLS.config.breakpoints.tablet) {
            hero.addEventListener('mouseenter', () => {
                heroVideo.play().catch(console.log);
            });
            
            hero.addEventListener('mouseleave', () => {
                heroVideo.pause();
            });
        }
    }
    
    // Parallax effect for hero background (if enabled)
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const handleHeroParallax = STICKLS.utils.debounce(() => {
            const scrolled = window.pageYOffset;
            const parallax = hero.querySelector('.hero-image');
            
            if (parallax && scrolled < hero.offsetHeight) {
                const speed = scrolled * 0.5;
                parallax.style.transform = `translateY(${speed}px)`;
            }
        }, 10);
        
        window.addEventListener('scroll', handleHeroParallax);
    }
}

// ===== COLLECTIONS GRID =====
function initCollectionsGrid() {
    const collectionCards = document.querySelectorAll('.collection-card');
    
    collectionCards.forEach(card => {
        // Add hover effects and analytics tracking
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Track collection clicks
        card.addEventListener('click', function() {
            const collectionName = this.querySelector('h3')?.textContent || 'Unknown';
            trackEvent('collection_click', { collection_name: collectionName });
        });
    });
}

// ===== HOW IT WORKS SECTION =====
function initHowItWorks() {
    const playButton = document.querySelector('.play-button');
    const demoVideo = document.querySelector('.demo-video');
    
    if (playButton && demoVideo) {
        playButton.addEventListener('click', function() {
            // In a real implementation, this would open a video modal
            // For now, we'll simulate the action
            openVideoModal('tutorial-video-url');
        });
    }
}

function openVideoModal(videoUrl) {
    // Create video modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay video-modal';
    modal.innerHTML = `
        <div class="modal-content video-content">
            <div class="modal-header">
                <h3>How to Apply STICKLS</h3>
                <button class="modal-close" aria-label="Close video">&times;</button>
            </div>
            <div class="video-container">
                <video controls autoplay>
                    <source src="${videoUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    requestAnimationFrame(() => {
        modal.classList.add('active');
    });
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // ESC key to close
    function handleEscape(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    }
    
    document.addEventListener('keydown', handleEscape);
}

// ===== CUSTOMER GALLERY =====
function initCustomerGallery() {
    const galleryGrid = document.getElementById('customer-gallery');
    const shareButton = document.getElementById('share-your-look');
    
    if (galleryGrid) {
        // Load customer photos (simulated data)
        loadCustomerPhotos();
    }
    
    if (shareButton) {
        shareButton.addEventListener('click', function(e) {
            e.preventDefault();
            openShareModal();
        });
    }
}

function loadCustomerPhotos() {
    // Simulated customer photos data
    const customerPhotos = [
        {
            id: 1,
            user: '@sarah_nails',
            product: 'Rose Gold Elegance',
            image: 'assets/customer-1.jpg',
            alt: 'Customer wearing Rose Gold Elegance nails'
        },
        {
            id: 2,
            user: '@makeup_maven',
            product: 'Classic French',
            image: 'assets/customer-2.jpg',
            alt: 'Customer wearing Classic French nails'
        },
        {
            id: 3,
            user: '@nail_artist_pro',
            product: 'Burgundy Dreams',
            image: 'assets/customer-3.jpg',
            alt: 'Customer wearing Burgundy Dreams nails'
        },
        {
            id: 4,
            user: '@beauty_blogger',
            product: 'Autumn Vibes',
            image: 'assets/customer-4.jpg',
            alt: 'Customer wearing Autumn Vibes nails'
        },
        {
            id: 5,
            user: '@style_queen',
            product: 'Midnight Glam',
            image: 'assets/customer-5.jpg',
            alt: 'Customer wearing Midnight Glam nails'
        },
        {
            id: 6,
            user: '@wellness_guru',
            product: 'Natural Nude',
            image: 'assets/customer-6.jpg',
            alt: 'Customer wearing Natural Nude nails'
        }
    ];
    
    const galleryGrid = document.getElementById('customer-gallery');
    
    if (galleryGrid) {
        galleryGrid.innerHTML = customerPhotos.map(photo => `
            <div class="gallery-item" data-aos="fade-up" data-aos-delay="${photo.id * 100}">
                <img src="${photo.image}" alt="${photo.alt}" loading="lazy">
                <div class="gallery-overlay">
                    <div class="gallery-user">${photo.user}</div>
                    <div class="gallery-product">${photo.product}</div>
                </div>
            </div>
        `).join('');
        
        // Add click handlers for gallery items
        const galleryItems = galleryGrid.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                openImageModal(img.src, img.alt);
            });
        });
    }
}

function openImageModal(src, alt) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay image-modal';
    modal.innerHTML = `
        <div class="modal-content image-content">
            <button class="modal-close" aria-label="Close image">&times;</button>
            <img src="${src}" alt="${alt}" style="max-width: 100%; max-height: 80vh; border-radius: var(--border-radius-lg);">
        </div>
    `;
    
    document.body.appendChild(modal);
    
    requestAnimationFrame(() => {
        modal.classList.add('active');
    });
    
    // Close functionality
    const closeBtn = modal.querySelector('.modal-close');
    
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.tagName === 'IMG') {
            closeModal();
        }
    });
}

function openShareModal() {
    // Implementation for user-generated content submission
    console.log('Opening share modal for user submissions');
    // This would integrate with social media APIs or file upload
}

// ===== REVIEWS CAROUSEL =====
function initReviewsCarousel() {
    const reviewsCarousel = document.getElementById('reviews-carousel');
    
    if (reviewsCarousel) {
        loadReviews();
    }
}

function loadReviews() {
    // Simulated reviews data
    const reviews = [
        {
            id: 1,
            text: "These press-on nails are absolutely amazing! They look so natural and last for weeks. The quality is outstanding and the application is so easy.",
            rating: 5,
            author: {
                name: "Sarah M.",
                location: "New York, NY",
                avatar: "assets/reviewer-1.jpg"
            }
        },
        {
            id: 2,
            text: "I've tried so many press-on nail brands, but STICKLS is by far the best. The fit is perfect, and they're actually reusable! Love the sustainability aspect.",
            rating: 5,
            author: {
                name: "Jessica L.",
                location: "Los Angeles, CA",
                avatar: "assets/reviewer-2.jpg"
            }
        },
        {
            id: 3,
            text: "As someone who's always on the go, these are perfect. I can have salon-quality nails in minutes. The designs are gorgeous and so trendy!",
            rating: 5,
            author: {
                name: "Emily R.",
                location: "Chicago, IL",
                avatar: "assets/reviewer-3.jpg"
            }
        }
    ];
    
    const reviewsCarousel = document.getElementById('reviews-carousel');
    const indicatorsContainer = document.querySelector('.reviews-indicators');
    
    if (reviewsCarousel) {
        // Create reviews HTML
        reviewsCarousel.innerHTML = `
            <div class="reviews-container">
                ${reviews.map(review => `
                    <div class="review-card">
                        <div class="review-content">
                            <div class="review-rating">
                                ${Array(5).fill().map((_, i) => `
                                    <svg class="star ${i < review.rating ? 'filled' : ''}" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                `).join('')}
                            </div>
                            <p class="review-text">"${review.text}"</p>
                        </div>
                        <div class="review-author">
                            <img src="${review.author.avatar}" alt="${review.author.name}" class="review-avatar" loading="lazy">
                            <div class="review-author-info">
                                <h4>${review.author.name}</h4>
                                <p>${review.author.location}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="reviews-nav prev" aria-label="Previous review">‹</button>
            <button class="reviews-nav next" aria-label="Next review">›</button>
        `;
        
        // Create indicators
        if (indicatorsContainer) {
            indicatorsContainer.innerHTML = reviews.map((_, index) => `
                <button class="indicator ${index === 0 ? 'active' : ''}" data-slide="${index}" aria-label="Go to review ${index + 1}"></button>
            `).join('');
        }
        
        // Initialize carousel functionality
        let currentSlide = 0;
        const totalSlides = reviews.length;
        const reviewsContainer = reviewsCarousel.querySelector('.reviews-container');
        const indicators = indicatorsContainer?.querySelectorAll('.indicator');
        const prevBtn = reviewsCarousel.querySelector('.prev');
        const nextBtn = reviewsCarousel.querySelector('.next');
        
        function updateCarousel() {
            const translateX = -currentSlide * 100;
            reviewsContainer.style.transform = `translateX(${translateX}%)`;
            
            // Update indicators
            if (indicators) {
                indicators.forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === currentSlide);
                });
            }
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }
        
        // Event listeners
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        
        if (indicators) {
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    currentSlide = index;
                    updateCarousel();
                });
            });
        }
        
        // Auto-advance carousel
        let autoAdvance = setInterval(nextSlide, 5000);
        
        // Pause auto-advance on hover
        reviewsCarousel.addEventListener('mouseenter', () => {
            clearInterval(autoAdvance);
        });
        
        reviewsCarousel.addEventListener('mouseleave', () => {
            autoAdvance = setInterval(nextSlide, 5000);
        });
        
        // Pause auto-advance when user interacts
        [nextBtn, prevBtn, ...indicators].forEach(el => {
            if (el) {
                el.addEventListener('click', () => {
                    clearInterval(autoAdvance);
                    autoAdvance = setInterval(nextSlide, 5000);
                });
            }
        });
    }
}

// ===== NEWSLETTER FORM =====
function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    const emailInput = form?.querySelector('input[type="email"]');
    const errorMessage = document.getElementById('email-error');
    
    if (form && emailInput) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            const submitBtn = this.querySelector('button[type="submit"]');
            
            // Validate email
            if (!isValidEmail(email)) {
                showError('Please enter a valid email address.');
                return;
            }
            
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            hideError();
            
            try {
                // Simulate API call
                await submitNewsletterSignup(email);
                
                // Success
                showSuccess('Thank you for subscribing! Check your email for your 10% off code.');
                form.reset();
                
                // Track conversion
                trackEvent('newsletter_signup', { email: email });
                
            } catch (error) {
                showError('Something went wrong. Please try again.');
                console.error('Newsletter signup error:', error);
            } finally {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
        
        // Real-time validation
        emailInput.addEventListener('blur', function() {
            const email = this.value.trim();
            if (email && !isValidEmail(email)) {
                showError('Please enter a valid email address.');
            } else {
                hideError();
            }
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.classList.add('show');
        }
    }
    
    function hideError() {
        if (errorMessage) {
            errorMessage.classList.remove('show');
        }
    }
    
    function showSuccess(message) {
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--color-forest-green);
            color: white;
            padding: 1rem 2rem;
            border-radius: var(--border-radius-lg);
            z-index: 9999;
            max-width: 90%;
            text-align: center;
            box-shadow: var(--shadow-lg);
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
        });
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }
    
    async function submitNewsletterSignup(email) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success (90% success rate)
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Network error'));
                }
            }, 1000);
        });
    }
}

// ===== INSTAGRAM FEED =====
function initInstagramFeed() {
    const instagramGrid = document.getElementById('instagram-feed');
    
    if (instagramGrid) {
        loadInstagramPosts();
    }
}

function loadInstagramPosts() {
    // Simulated Instagram posts
    const posts = [
        { id: 1, image: 'assets/insta-1.jpg', alt: 'STICKLS Instagram post 1' },
        { id: 2, image: 'assets/insta-2.jpg', alt: 'STICKLS Instagram post 2' },
        { id: 3, image: 'assets/insta-3.jpg', alt: 'STICKLS Instagram post 3' },
        { id: 4, image: 'assets/insta-4.jpg', alt: 'STICKLS Instagram post 4' },
        { id: 5, image: 'assets/insta-5.jpg', alt: 'STICKLS Instagram post 5' },
        { id: 6, image: 'assets/insta-6.jpg', alt: 'STICKLS Instagram post 6' }
    ];
    
    const instagramGrid = document.getElementById('instagram-feed');
    
    if (instagramGrid) {
        instagramGrid.innerHTML = posts.map(post => `
            <div class="instagram-item">
                <img src="${post.image}" alt="${post.alt}" loading="lazy">
                <div class="instagram-overlay">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                </div>
            </div>
        `).join('');
        
        // Add click handlers to open Instagram posts
        const instagramItems = instagramGrid.querySelectorAll('.instagram-item');
        instagramItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                // In a real implementation, this would open the Instagram post
                window.open('https://instagram.com/stickls', '_blank');
                trackEvent('instagram_click', { post_index: index });
            });
        });
    }
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    if (animatedElements.length === 0) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.aosDelay || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== ACCESSIBILITY FEATURES =====
function initAccessibilityFeatures() {
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.getElementById('main-content');
    
    if (skipLink && mainContent) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            mainContent.focus();
            STICKLS.utils.scrollTo(mainContent, 100);
        });
    }
    
    // Keyboard navigation for carousels
    document.addEventListener('keydown', function(e) {
        const activeElement = document.activeElement;
        
        // Review carousel keyboard navigation
        if (activeElement.classList.contains('indicator')) {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                const indicators = Array.from(document.querySelectorAll('.indicator'));
                const currentIndex = indicators.indexOf(activeElement);
                let nextIndex;
                
                if (e.key === 'ArrowLeft') {
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : indicators.length - 1;
                } else {
                    nextIndex = currentIndex < indicators.length - 1 ? currentIndex + 1 : 0;
                }
                
                indicators[nextIndex].click();
                indicators[nextIndex].focus();
            }
        }
    });
    
    // High contrast mode detection
    if (window.matchMedia('(prefers-contrast: high)').matches) {
        document.body.classList.add('high-contrast');
    }
    
    // Reduced motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduced-motion');
        
        // Disable auto-advancing carousels
        const autoAdvanceElements = document.querySelectorAll('[data-auto-advance]');
        autoAdvanceElements.forEach(element => {
            element.removeAttribute('data-auto-advance');
        });
    }
    
    // Focus management for modals
    document.addEventListener('focusin', function(e) {
        const modal = document.querySelector('.modal-overlay.active');
        if (modal && !modal.contains(e.target)) {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }
    });
}

// ===== ANALYTICS & TRACKING =====
function trackEvent(eventName, properties = {}) {
    // In a real implementation, this would send data to analytics service
    console.log('Tracking event:', eventName, properties);
    
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    
    // Example: Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, properties);
    }
}

// ===== PERFORMANCE MONITORING =====
function initPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
        window.webVitals.getLCP(console.log);
        window.webVitals.getFID(console.log);
        window.webVitals.getCLS(console.log);
    }
    
    // Monitor loading performance
    window.addEventListener('load', function() {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        trackEvent('page_load_time', { duration: loadTime });
    });
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    
    // In production, send errors to error tracking service
    // trackEvent('javascript_error', {
    //     message: e.message,
    //     filename: e.filename,
    //     lineno: e.lineno
    // });
});

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Initialize performance monitoring
initPerformanceMonitoring(); 