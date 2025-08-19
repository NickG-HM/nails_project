// STICKLS Website - Component Scripts
// Author: Assistant
// Description: Advanced interactive components and features

'use strict';

// ===== VIRTUAL TRY-ON INTEGRATION =====
class VirtualTryOn {
    constructor() {
        this.isSupported = this.checkSupport();
        this.isActive = false;
        this.init();
    }
    
    checkSupport() {
        // Check for camera and WebRTC support
        return !!(navigator.mediaDevices && 
                 navigator.mediaDevices.getUserMedia && 
                 window.MediaRecorder);
    }
    
    init() {
        this.bindEvents();
        this.createTryOnButton();
    }
    
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-try-on]') || e.target.closest('[data-try-on]')) {
                e.preventDefault();
                this.openTryOn();
            }
        });
    }
    
    createTryOnButton() {
        const productPages = document.querySelectorAll('[data-product-id]');
        
        productPages.forEach(product => {
            if (!product.querySelector('.try-on-btn')) {
                const tryOnBtn = document.createElement('button');
                tryOnBtn.className = 'btn btn-secondary try-on-btn';
                tryOnBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                        <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                    Try On with AR
                `;
                tryOnBtn.setAttribute('data-try-on', 'true');
                
                const actionContainer = product.querySelector('.product-actions') || 
                                      product.querySelector('.hero-actions');
                
                if (actionContainer) {
                    actionContainer.appendChild(tryOnBtn);
                }
            }
        });
    }
    
    async openTryOn() {
        if (!this.isSupported) {
            this.showUnsupportedMessage();
            return;
        }
        
        try {
            await this.startCamera();
            this.createTryOnInterface();
            this.isActive = true;
            trackEvent('virtual_try_on_opened');
        } catch (error) {
            console.error('Virtual try-on error:', error);
            this.showErrorMessage();
        }
    }
    
    async startCamera() {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'user'
            }
        });
        
        this.stream = stream;
        return stream;
    }
    
    createTryOnInterface() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay try-on-modal active';
        modal.innerHTML = `
            <div class="modal-content try-on-content">
                <div class="modal-header">
                    <h3>Virtual Try-On</h3>
                    <button class="modal-close" aria-label="Close virtual try-on">&times;</button>
                </div>
                <div class="try-on-container">
                    <div class="camera-container">
                        <video id="try-on-video" autoplay muted playsinline></video>
                        <canvas id="try-on-canvas"></canvas>
                        <div class="hand-guides">
                            <div class="hand-guide left"></div>
                            <div class="hand-guide right"></div>
                        </div>
                    </div>
                    <div class="try-on-controls">
                        <div class="nail-selector">
                            <h4>Select Design</h4>
                            <div class="design-options">
                                ${this.createDesignOptions()}
                            </div>
                        </div>
                        <div class="try-on-actions">
                            <button class="btn btn-secondary" id="capture-photo">
                                📸 Capture
                            </button>
                            <button class="btn btn-primary" id="add-to-cart-tryon">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Start video stream
        const video = modal.querySelector('#try-on-video');
        video.srcObject = this.stream;
        
        // Bind close events
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.closeTryOn());
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeTryOn();
        });
        
        // Initialize hand tracking (simulated)
        this.initHandTracking(video, modal.querySelector('#try-on-canvas'));
        
        // Bind control events
        this.bindTryOnControls(modal);
    }
    
    createDesignOptions() {
        const designs = [
            { id: 'rose-gold', name: 'Rose Gold', color: '#E8B4B8' },
            { id: 'burgundy', name: 'Burgundy', color: '#8B2635' },
            { id: 'nude', name: 'Nude', color: '#F5E6E8' },
            { id: 'black', name: 'Midnight', color: '#1A1918' }
        ];
        
        return designs.map(design => `
            <button class="design-option ${design.id === 'rose-gold' ? 'active' : ''}" 
                    data-design="${design.id}">
                <div class="design-preview" style="background-color: ${design.color}"></div>
                <span>${design.name}</span>
            </button>
        `).join('');
    }
    
    initHandTracking(video, canvas) {
        // This would integrate with a hand tracking library like MediaPipe
        // For now, we'll simulate the hand tracking functionality
        
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        
        // Simulated hand tracking
        setInterval(() => {
            if (this.isActive) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw simulated nail overlays (in real implementation, this would be based on hand detection)
                this.drawNailOverlays(ctx, canvas.width, canvas.height);
            }
        }, 100);
    }
    
    drawNailOverlays(ctx, width, height) {
        // Simulated nail positions (in real implementation, these would be detected from hand tracking)
        const nailPositions = [
            { x: width * 0.3, y: height * 0.6, width: 15, height: 20 },
            { x: width * 0.35, y: height * 0.55, width: 12, height: 18 },
            { x: width * 0.4, y: height * 0.53, width: 10, height: 16 },
            { x: width * 0.45, y: height * 0.58, width: 8, height: 14 },
            { x: width * 0.48, y: height * 0.65, width: 10, height: 12 }
        ];
        
        const selectedDesign = document.querySelector('.design-option.active');
        const color = selectedDesign ? 
                     selectedDesign.querySelector('.design-preview').style.backgroundColor : 
                     '#E8B4B8';
        
        ctx.fillStyle = color;
        nailPositions.forEach(pos => {
            ctx.beginPath();
            ctx.ellipse(pos.x, pos.y, pos.width/2, pos.height/2, 0, 0, 2 * Math.PI);
            ctx.fill();
        });
    }
    
    bindTryOnControls(modal) {
        // Design selection
        const designOptions = modal.querySelectorAll('.design-option');
        designOptions.forEach(option => {
            option.addEventListener('click', function() {
                designOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                trackEvent('design_selected', { design: this.dataset.design });
            });
        });
        
        // Capture photo
        const captureBtn = modal.querySelector('#capture-photo');
        captureBtn.addEventListener('click', () => {
            this.capturePhoto();
        });
        
        // Add to cart
        const addToCartBtn = modal.querySelector('#add-to-cart-tryon');
        addToCartBtn.addEventListener('click', () => {
            const selectedDesign = modal.querySelector('.design-option.active');
            if (selectedDesign && window.STICKLS_CART) {
                const product = {
                    id: selectedDesign.dataset.design,
                    name: selectedDesign.textContent.trim(),
                    price: 24.99,
                    image: 'assets/product-placeholder.jpg'
                };
                
                window.STICKLS_CART.add(product);
                this.closeTryOn();
                trackEvent('add_to_cart_from_tryon', { product_id: product.id });
            }
        });
    }
    
    capturePhoto() {
        const video = document.querySelector('#try-on-video');
        const canvas = document.querySelector('#try-on-canvas');
        
        if (video && canvas) {
            const captureCanvas = document.createElement('canvas');
            const ctx = captureCanvas.getContext('2d');
            
            captureCanvas.width = video.videoWidth;
            captureCanvas.height = video.videoHeight;
            
            // Draw video frame
            ctx.drawImage(video, 0, 0);
            
            // Draw nail overlays
            ctx.drawImage(canvas, 0, 0);
            
            // Convert to blob and offer download
            captureCanvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `stickls-tryon-${Date.now()}.jpg`;
                a.click();
                
                URL.revokeObjectURL(url);
                trackEvent('photo_captured');
            }, 'image/jpeg', 0.9);
        }
    }
    
    closeTryOn() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        const modal = document.querySelector('.try-on-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        }
        
        this.isActive = false;
        trackEvent('virtual_try_on_closed');
    }
    
    showUnsupportedMessage() {
        alert('Virtual try-on requires a device with camera support. Please try on a mobile device or modern browser.');
    }
    
    showErrorMessage() {
        alert('Unable to access camera. Please check your permissions and try again.');
    }
}

// ===== INTERACTIVE SIZE GUIDE =====
class InteractiveSizeGuide {
    constructor() {
        this.measurements = {};
        this.init();
    }
    
    init() {
        this.createSizeGuideModal();
        this.bindEvents();
    }
    
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-size-guide]') || e.target.closest('[data-size-guide]')) {
                e.preventDefault();
                this.openSizeGuide();
            }
        });
    }
    
    createSizeGuideModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay size-guide-modal';
        modal.id = 'size-guide-modal';
        modal.innerHTML = `
            <div class="modal-content size-guide-content">
                <div class="modal-header">
                    <h3>Find Your Perfect Size</h3>
                    <button class="modal-close" aria-label="Close size guide">&times;</button>
                </div>
                <div class="size-guide-steps">
                    <div class="step-indicator">
                        <div class="step active" data-step="1">1</div>
                        <div class="step" data-step="2">2</div>
                        <div class="step" data-step="3">3</div>
                    </div>
                    
                    <div class="size-step active" data-step="1">
                        <h4>Step 1: Measure Your Nails</h4>
                        <div class="measurement-guide">
                            <img src="assets/nail-measurement-guide.jpg" alt="How to measure your nails" loading="lazy">
                            <div class="measurement-tips">
                                <h5>Measuring Tips:</h5>
                                <ul>
                                    <li>Use a ruler or measuring tape</li>
                                    <li>Measure the widest part of your nail</li>
                                    <li>Measure from cuticle to tip for length</li>
                                    <li>Record measurements for all 10 nails</li>
                                </ul>
                            </div>
                        </div>
                        <div class="nail-inputs">
                            ${this.createNailInputs()}
                        </div>
                        <button class="btn btn-primary" id="next-step-1">Next Step</button>
                    </div>
                    
                    <div class="size-step" data-step="2">
                        <h4>Step 2: Select Nail Shape</h4>
                        <div class="shape-selector">
                            ${this.createShapeOptions()}
                        </div>
                        <button class="btn btn-secondary" id="prev-step-2">Previous</button>
                        <button class="btn btn-primary" id="next-step-2">Next Step</button>
                    </div>
                    
                    <div class="size-step" data-step="3">
                        <h4>Step 3: Your Recommended Sizes</h4>
                        <div class="size-results">
                            <div class="size-chart">
                                <!-- Results will be populated here -->
                            </div>
                            <div class="size-actions">
                                <button class="btn btn-primary" id="save-sizes">Save My Sizes</button>
                                <button class="btn btn-secondary" id="start-over">Start Over</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.bindModalEvents(modal);
    }
    
    createNailInputs() {
        const fingers = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'];
        const hands = ['Left', 'Right'];
        
        return hands.map(hand => `
            <div class="hand-measurements">
                <h5>${hand} Hand</h5>
                <div class="finger-inputs">
                    ${fingers.map((finger, index) => `
                        <div class="finger-input">
                            <label for="${hand.toLowerCase()}-${finger.toLowerCase()}">
                                ${finger}
                                <input type="number" 
                                       id="${hand.toLowerCase()}-${finger.toLowerCase()}" 
                                       name="${hand.toLowerCase()}-${finger.toLowerCase()}"
                                       placeholder="Width (mm)" 
                                       min="8" 
                                       max="20" 
                                       step="0.5">
                            </label>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }
    
    createShapeOptions() {
        const shapes = [
            { id: 'square', name: 'Square', image: 'assets/shape-square.jpg' },
            { id: 'oval', name: 'Oval', image: 'assets/shape-oval.jpg' },
            { id: 'almond', name: 'Almond', image: 'assets/shape-almond.jpg' },
            { id: 'coffin', name: 'Coffin', image: 'assets/shape-coffin.jpg' }
        ];
        
        return shapes.map(shape => `
            <div class="shape-option" data-shape="${shape.id}">
                <img src="${shape.image}" alt="${shape.name} nail shape" loading="lazy">
                <h6>${shape.name}</h6>
            </div>
        `).join('');
    }
    
    bindModalEvents(modal) {
        // Close modal
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.closeSizeGuide());
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeSizeGuide();
        });
        
        // Step navigation
        const nextStep1 = modal.querySelector('#next-step-1');
        const nextStep2 = modal.querySelector('#next-step-2');
        const prevStep2 = modal.querySelector('#prev-step-2');
        
        nextStep1.addEventListener('click', () => {
            if (this.validateMeasurements()) {
                this.goToStep(2);
            }
        });
        
        nextStep2.addEventListener('click', () => {
            if (this.validateShape()) {
                this.calculateSizes();
                this.goToStep(3);
            }
        });
        
        prevStep2.addEventListener('click', () => this.goToStep(1));
        
        // Shape selection
        const shapeOptions = modal.querySelectorAll('.shape-option');
        shapeOptions.forEach(option => {
            option.addEventListener('click', function() {
                shapeOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
        
        // Save sizes
        const saveSizes = modal.querySelector('#save-sizes');
        saveSizes.addEventListener('click', () => {
            this.saveMeasurements();
            this.closeSizeGuide();
        });
        
        // Start over
        const startOver = modal.querySelector('#start-over');
        startOver.addEventListener('click', () => {
            this.resetGuide();
            this.goToStep(1);
        });
    }
    
    openSizeGuide() {
        const modal = document.getElementById('size-guide-modal');
        modal.classList.add('active');
        
        // Load saved measurements if available
        this.loadSavedMeasurements();
        
        trackEvent('size_guide_opened');
    }
    
    closeSizeGuide() {
        const modal = document.getElementById('size-guide-modal');
        modal.classList.remove('active');
    }
    
    goToStep(stepNumber) {
        const modal = document.getElementById('size-guide-modal');
        const steps = modal.querySelectorAll('.step');
        const stepContents = modal.querySelectorAll('.size-step');
        
        // Update step indicators
        steps.forEach((step, index) => {
            step.classList.toggle('active', index + 1 <= stepNumber);
            step.classList.toggle('completed', index + 1 < stepNumber);
        });
        
        // Update step content
        stepContents.forEach((content, index) => {
            content.classList.toggle('active', index + 1 === stepNumber);
        });
    }
    
    validateMeasurements() {
        const inputs = document.querySelectorAll('.finger-input input');
        let valid = true;
        
        inputs.forEach(input => {
            const value = parseFloat(input.value);
            if (!value || value < 8 || value > 20) {
                input.style.borderColor = '#dc2626';
                valid = false;
            } else {
                input.style.borderColor = '';
                this.measurements[input.name] = value;
            }
        });
        
        if (!valid) {
            alert('Please enter valid measurements (8-20mm) for all nails.');
        }
        
        return valid;
    }
    
    validateShape() {
        const selectedShape = document.querySelector('.shape-option.selected');
        if (!selectedShape) {
            alert('Please select a nail shape.');
            return false;
        }
        
        this.measurements.shape = selectedShape.dataset.shape;
        return true;
    }
    
    calculateSizes() {
        // Size mapping based on measurements
        const sizeChart = {
            'XS': { min: 8, max: 10 },
            'S': { min: 10, max: 12 },
            'M': { min: 12, max: 14 },
            'L': { min: 14, max: 16 },
            'XL': { min: 16, max: 18 },
            'XXL': { min: 18, max: 20 }
        };
        
        const fingers = ['thumb', 'index', 'middle', 'ring', 'pinky'];
        const hands = ['left', 'right'];
        const results = {};
        
        hands.forEach(hand => {
            results[hand] = {};
            fingers.forEach(finger => {
                const measurement = this.measurements[`${hand}-${finger}`];
                const size = Object.keys(sizeChart).find(size => 
                    measurement >= sizeChart[size].min && measurement < sizeChart[size].max
                ) || 'XL';
                
                results[hand][finger] = size;
            });
        });
        
        this.displayResults(results);
    }
    
    displayResults(results) {
        const sizeChart = document.querySelector('.size-chart');
        const fingers = ['thumb', 'index', 'middle', 'ring', 'pinky'];
        
        sizeChart.innerHTML = `
            <div class="size-table">
                <table>
                    <thead>
                        <tr>
                            <th>Finger</th>
                            <th>Left Hand</th>
                            <th>Right Hand</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${fingers.map(finger => `
                            <tr>
                                <td>${finger.charAt(0).toUpperCase() + finger.slice(1)}</td>
                                <td>${results.left[finger]}</td>
                                <td>${results.right[finger]}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div class="size-summary">
                <h5>Most Common Size: ${this.getMostCommonSize(results)}</h5>
                <p>Save these measurements for future orders!</p>
            </div>
        `;
    }
    
    getMostCommonSize(results) {
        const allSizes = [];
        Object.values(results).forEach(hand => {
            Object.values(hand).forEach(size => allSizes.push(size));
        });
        
        const sizeCount = {};
        allSizes.forEach(size => {
            sizeCount[size] = (sizeCount[size] || 0) + 1;
        });
        
        return Object.keys(sizeCount).reduce((a, b) => 
            sizeCount[a] > sizeCount[b] ? a : b
        );
    }
    
    saveMeasurements() {
        localStorage.setItem('stickls-measurements', JSON.stringify(this.measurements));
        trackEvent('measurements_saved');
        
        // Show success message
        const notification = document.createElement('div');
        notification.textContent = 'Your measurements have been saved!';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--color-forest-green);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius-lg);
            z-index: 9999;
            box-shadow: var(--shadow-lg);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
    
    loadSavedMeasurements() {
        const saved = localStorage.getItem('stickls-measurements');
        if (saved) {
            this.measurements = JSON.parse(saved);
            
            // Populate form fields
            Object.keys(this.measurements).forEach(key => {
                const input = document.querySelector(`input[name="${key}"]`);
                if (input) {
                    input.value = this.measurements[key];
                }
            });
            
            // Select saved shape
            if (this.measurements.shape) {
                const shapeOption = document.querySelector(`[data-shape="${this.measurements.shape}"]`);
                if (shapeOption) {
                    shapeOption.classList.add('selected');
                }
            }
        }
    }
    
    resetGuide() {
        this.measurements = {};
        
        // Clear form fields
        const inputs = document.querySelectorAll('.finger-input input');
        inputs.forEach(input => {
            input.value = '';
            input.style.borderColor = '';
        });
        
        // Clear shape selection
        const shapeOptions = document.querySelectorAll('.shape-option');
        shapeOptions.forEach(option => option.classList.remove('selected'));
        
        // Clear results
        const sizeChart = document.querySelector('.size-chart');
        sizeChart.innerHTML = '';
    }
}

// ===== PRODUCT QUICK VIEW =====
class ProductQuickView {
    constructor() {
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-quick-view]') || e.target.closest('[data-quick-view]')) {
                e.preventDefault();
                const productId = e.target.closest('[data-quick-view]').dataset.quickView;
                this.openQuickView(productId);
            }
        });
    }
    
    async openQuickView(productId) {
        try {
            const product = await this.fetchProduct(productId);
            this.createQuickViewModal(product);
            trackEvent('quick_view_opened', { product_id: productId });
        } catch (error) {
            console.error('Error loading product:', error);
        }
    }
    
    async fetchProduct(productId) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: productId,
                    name: 'Rose Gold Elegance',
                    price: 24.99,
                    images: [
                        'assets/product-1.jpg',
                        'assets/product-1-alt.jpg'
                    ],
                    description: 'Premium press-on nails with rose gold finish',
                    colors: ['Rose Gold', 'Champagne', 'Nude'],
                    sizes: ['XS', 'S', 'M', 'L', 'XL'],
                    rating: 4.8,
                    reviews: 127
                });
            }, 500);
        });
    }
    
    createQuickViewModal(product) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay quick-view-modal active';
        modal.innerHTML = `
            <div class="modal-content quick-view-content">
                <button class="modal-close" aria-label="Close quick view">&times;</button>
                <div class="quick-view-grid">
                    <div class="product-images">
                        <div class="main-image">
                            <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
                        </div>
                        <div class="image-thumbnails">
                            ${product.images.map((img, index) => `
                                <img src="${img}" alt="${product.name} view ${index + 1}" 
                                     class="${index === 0 ? 'active' : ''}" loading="lazy">
                            `).join('')}
                        </div>
                    </div>
                    <div class="product-details">
                        <h3>${product.name}</h3>
                        <div class="product-rating">
                            <div class="stars">${this.renderStars(product.rating)}</div>
                            <span class="review-count">(${product.reviews} reviews)</span>
                        </div>
                        <div class="product-price">$${product.price}</div>
                        
                        <div class="product-options">
                            <div class="color-selector">
                                <h5>Color</h5>
                                <div class="color-options">
                                    ${product.colors.map((color, index) => `
                                        <button class="color-option ${index === 0 ? 'selected' : ''}" 
                                                data-color="${color}" 
                                                title="${color}">
                                            <span class="color-swatch" style="background: ${this.getColorValue(color)}"></span>
                                            ${color}
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div class="size-selector">
                                <h5>Size</h5>
                                <div class="size-options">
                                    ${product.sizes.map((size, index) => `
                                        <button class="size-option ${index === 2 ? 'selected' : ''}" 
                                                data-size="${size}">
                                            ${size}
                                        </button>
                                    `).join('')}
                                </div>
                                <a href="#" data-size-guide class="size-guide-link">Size Guide</a>
                            </div>
                        </div>
                        
                        <div class="product-actions">
                            <button class="btn btn-primary add-to-cart-quick" 
                                    data-product-id="${product.id}">
                                Add to Cart
                            </button>
                            <button class="btn btn-secondary" data-try-on>
                                Try On
                            </button>
                        </div>
                        
                        <div class="product-description">
                            <p>${product.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.bindQuickViewEvents(modal, product);
    }
    
    bindQuickViewEvents(modal, product) {
        // Close modal
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.closeQuickView(modal));
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeQuickView(modal);
        });
        
        // Image switching
        const thumbnails = modal.querySelectorAll('.image-thumbnails img');
        const mainImage = modal.querySelector('.main-image img');
        
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                mainImage.src = this.src;
            });
        });
        
        // Color selection
        const colorOptions = modal.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                colorOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
        
        // Size selection
        const sizeOptions = modal.querySelectorAll('.size-option');
        sizeOptions.forEach(option => {
            option.addEventListener('click', function() {
                sizeOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
        
        // Add to cart
        const addToCartBtn = modal.querySelector('.add-to-cart-quick');
        addToCartBtn.addEventListener('click', () => {
            const selectedColor = modal.querySelector('.color-option.selected').dataset.color;
            const selectedSize = modal.querySelector('.size-option.selected').dataset.size;
            
            const cartProduct = {
                ...product,
                selectedColor,
                selectedSize,
                variantId: `${product.id}-${selectedColor}-${selectedSize}`
            };
            
            if (window.STICKLS_CART) {
                window.STICKLS_CART.add(cartProduct);
                this.closeQuickView(modal);
            }
        });
    }
    
    closeQuickView(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }
    
    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<span class="star filled">★</span>';
        }
        
        if (hasHalfStar) {
            stars += '<span class="star half">☆</span>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<span class="star">☆</span>';
        }
        
        return stars;
    }
    
    getColorValue(colorName) {
        const colors = {
            'Rose Gold': '#E8B4B8',
            'Champagne': '#F7E7CE',
            'Nude': '#F5E6E8',
            'Burgundy': '#8B2635',
            'Black': '#1A1918'
        };
        
        return colors[colorName] || '#E8B4B8';
    }
}

// ===== WISHLIST FUNCTIONALITY =====
class Wishlist {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('stickls-wishlist') || '[]');
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateWishlistUI();
    }
    
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-wishlist]') || e.target.closest('[data-wishlist]')) {
                e.preventDefault();
                const productId = e.target.closest('[data-wishlist]').dataset.wishlist;
                this.toggleItem(productId);
            }
        });
    }
    
    toggleItem(productId) {
        const exists = this.items.find(item => item.id === productId);
        
        if (exists) {
            this.removeItem(productId);
        } else {
            this.addItem(productId);
        }
    }
    
    addItem(productId) {
        // In a real app, this would fetch product details
        const product = {
            id: productId,
            name: 'Product Name',
            price: 24.99,
            image: 'assets/product-placeholder.jpg',
            addedAt: Date.now()
        };
        
        this.items.push(product);
        this.saveToStorage();
        this.updateWishlistUI();
        
        trackEvent('wishlist_add', { product_id: productId });
        this.showNotification('Added to wishlist!');
    }
    
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
        this.updateWishlistUI();
        
        trackEvent('wishlist_remove', { product_id: productId });
        this.showNotification('Removed from wishlist');
    }
    
    saveToStorage() {
        localStorage.setItem('stickls-wishlist', JSON.stringify(this.items));
    }
    
    updateWishlistUI() {
        const wishlistButtons = document.querySelectorAll('[data-wishlist]');
        
        wishlistButtons.forEach(button => {
            const productId = button.dataset.wishlist;
            const isInWishlist = this.items.some(item => item.id === productId);
            
            button.classList.toggle('active', isInWishlist);
            button.innerHTML = isInWishlist ? '❤️' : '🤍';
            button.setAttribute('aria-label', 
                isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'
            );
        });
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--color-deep-burgundy);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: var(--border-radius-lg);
            z-index: 9999;
            font-size: var(--font-size-sm);
            box-shadow: var(--shadow-lg);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 2000);
    }
}

// ===== INITIALIZE COMPONENTS =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all component classes
    new VirtualTryOn();
    new InteractiveSizeGuide();
    new ProductQuickView();
    new Wishlist();
    
    console.log('STICKLS components initialized');
}); 