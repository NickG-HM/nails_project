// STICKLS Website - Analytics & Tracking
// Author: Assistant
// Description: Analytics tracking for eCommerce events and user behavior

'use strict';

// ===== ANALYTICS CONFIGURATION =====
const ANALYTICS_CONFIG = {
    // Google Analytics 4 Configuration
    ga4: {
        measurementId: 'G-XXXXXXXXXX', // Replace with actual GA4 ID
        enabled: true
    },
    
    // Facebook Pixel Configuration
    facebook: {
        pixelId: 'XXXXXXXXXXXXXXXXX', // Replace with actual Pixel ID
        enabled: true
    },
    
    // Pinterest Conversion API
    pinterest: {
        tagId: 'XXXXXXXXXXXXXXXXX', // Replace with actual Tag ID
        enabled: true
    },
    
    // TikTok Pixel
    tiktok: {
        pixelId: 'XXXXXXXXXXXXXXXXX', // Replace with actual Pixel ID
        enabled: true
    },
    
    // Custom Analytics Endpoint
    custom: {
        endpoint: '/api/analytics',
        enabled: true
    }
};

// ===== ANALYTICS INITIALIZATION =====
class STICKLSAnalytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        this.pageLoadTime = Date.now();
        this.events = [];
        
        this.init();
    }
    
    init() {
        this.initializeTrackers();
        this.setupAutoTracking();
        this.trackPageView();
        
        console.log('STICKLS Analytics initialized');
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getUserId() {
        let userId = localStorage.getItem('stickls-user-id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('stickls-user-id', userId);
        }
        return userId;
    }
    
    initializeTrackers() {
        // Initialize Google Analytics 4
        if (ANALYTICS_CONFIG.ga4.enabled && ANALYTICS_CONFIG.ga4.measurementId) {
            this.initGA4();
        }
        
        // Initialize Facebook Pixel
        if (ANALYTICS_CONFIG.facebook.enabled && ANALYTICS_CONFIG.facebook.pixelId) {
            this.initFacebookPixel();
        }
        
        // Initialize Pinterest Tag
        if (ANALYTICS_CONFIG.pinterest.enabled && ANALYTICS_CONFIG.pinterest.tagId) {
            this.initPinterestTag();
        }
        
        // Initialize TikTok Pixel
        if (ANALYTICS_CONFIG.tiktok.enabled && ANALYTICS_CONFIG.tiktok.pixelId) {
            this.initTikTokPixel();
        }
    }
    
    initGA4() {
        // Load GA4 script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.ga4.measurementId}`;
        document.head.appendChild(script);
        
        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
            window.dataLayer.push(arguments);
        };
        
        gtag('js', new Date());
        gtag('config', ANALYTICS_CONFIG.ga4.measurementId, {
            user_id: this.userId,
            session_id: this.sessionId,
            send_page_view: false // We'll send manually
        });
    }
    
    initFacebookPixel() {
        // Facebook Pixel code
        !function(f,b,e,v,n,t,s) {
            if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
        
        fbq('init', ANALYTICS_CONFIG.facebook.pixelId);
    }
    
    initPinterestTag() {
        // Pinterest Tag code
        !function(e){if(!window.pintrk){window.pintrk = function () {
        window.pintrk.queue.push(Array.prototype.slice.call(arguments))};
        var n=window.pintrk;n.queue=[],n.version="3.0";var t=document.createElement("script");
        t.async=!0,t.src=e;var r=document.getElementsByTagName("script")[0];
        r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
        
        pintrk('load', ANALYTICS_CONFIG.pinterest.tagId);
    }
    
    initTikTokPixel() {
        // TikTok Pixel code
        !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
        }(window, document, 'ttq');
        
        ttq.load(ANALYTICS_CONFIG.tiktok.pixelId);
    }
    
    setupAutoTracking() {
        // Auto-track clicks on important elements
        document.addEventListener('click', (e) => {
            this.autoTrackClick(e);
        });
        
        // Auto-track form submissions
        document.addEventListener('submit', (e) => {
            this.autoTrackFormSubmission(e);
        });
        
        // Auto-track scroll depth
        this.setupScrollTracking();
        
        // Auto-track page engagement
        this.setupEngagementTracking();
        
        // Auto-track errors
        this.setupErrorTracking();
    }
    
    autoTrackClick(event) {
        const element = event.target.closest('[data-track]');
        if (!element) return;
        
        const trackingData = element.dataset.track;
        const eventData = {
            element_type: element.tagName.toLowerCase(),
            element_text: element.textContent?.trim().substring(0, 100) || '',
            element_class: element.className || '',
            page_url: window.location.href,
            timestamp: Date.now()
        };
        
        this.track(trackingData, eventData);
    }
    
    autoTrackFormSubmission(event) {
        const form = event.target;
        if (!form.matches('form')) return;
        
        const formData = new FormData(form);
        const eventData = {
            form_id: form.id || '',
            form_action: form.action || '',
            form_method: form.method || 'get',
            field_count: formData.keys().length,
            page_url: window.location.href,
            timestamp: Date.now()
        };
        
        this.track('form_submission', eventData);
    }
    
    setupScrollTracking() {
        let maxScroll = 0;
        let scrollMilestones = [25, 50, 75, 90];
        let trackedMilestones = new Set();
        
        const trackScroll = this.debounce(() => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            maxScroll = Math.max(maxScroll, scrollPercent);
            
            scrollMilestones.forEach(milestone => {
                if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
                    trackedMilestones.add(milestone);
                    this.track('scroll_depth', {
                        percentage: milestone,
                        page_url: window.location.href,
                        timestamp: Date.now()
                    });
                }
            });
        }, 250);
        
        window.addEventListener('scroll', trackScroll);
        
        // Track max scroll on page unload
        window.addEventListener('beforeunload', () => {
            if (maxScroll > 0) {
                this.track('page_scroll_complete', {
                    max_scroll_percentage: maxScroll,
                    page_url: window.location.href,
                    timestamp: Date.now()
                });
            }
        });
    }
    
    setupEngagementTracking() {
        let timeOnPage = 0;
        let isActive = true;
        let engagementTimer;
        
        const trackEngagement = () => {
            if (isActive) {
                timeOnPage += 1;
                
                // Track engagement milestones
                if ([30, 60, 120, 300].includes(timeOnPage)) {
                    this.track('page_engagement', {
                        time_on_page: timeOnPage,
                        engagement_level: this.getEngagementLevel(timeOnPage),
                        page_url: window.location.href,
                        timestamp: Date.now()
                    });
                }
            }
        };
        
        engagementTimer = setInterval(trackEngagement, 1000);
        
        // Track when user becomes inactive
        document.addEventListener('visibilitychange', () => {
            isActive = !document.hidden;
        });
        
        // Track when user leaves page
        window.addEventListener('beforeunload', () => {
            clearInterval(engagementTimer);
            this.track('page_exit', {
                total_time_on_page: timeOnPage,
                engagement_level: this.getEngagementLevel(timeOnPage),
                page_url: window.location.href,
                timestamp: Date.now()
            });
        });
    }
    
    getEngagementLevel(timeOnPage) {
        if (timeOnPage < 30) return 'low';
        if (timeOnPage < 120) return 'medium';
        if (timeOnPage < 300) return 'high';
        return 'very_high';
    }
    
    setupErrorTracking() {
        window.addEventListener('error', (event) => {
            this.track('javascript_error', {
                error_message: event.message,
                error_filename: event.filename,
                error_line: event.lineno,
                error_column: event.colno,
                page_url: window.location.href,
                user_agent: navigator.userAgent,
                timestamp: Date.now()
            });
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            this.track('promise_rejection', {
                error_message: event.reason?.message || 'Promise rejected',
                page_url: window.location.href,
                timestamp: Date.now()
            });
        });
    }
    
    // ===== PUBLIC TRACKING METHODS =====
    
    track(eventName, properties = {}) {
        const eventData = {
            event: eventName,
            properties: {
                ...properties,
                session_id: this.sessionId,
                user_id: this.userId,
                page_url: window.location.href,
                page_title: document.title,
                referrer: document.referrer || 'direct',
                user_agent: navigator.userAgent,
                screen_resolution: `${window.screen.width}x${window.screen.height}`,
                viewport_size: `${window.innerWidth}x${window.innerHeight}`,
                timestamp: Date.now()
            }
        };
        
        // Store event locally
        this.events.push(eventData);
        
        // Send to all configured platforms
        this.sendToGA4(eventName, eventData.properties);
        this.sendToFacebook(eventName, eventData.properties);
        this.sendToPinterest(eventName, eventData.properties);
        this.sendToTikTok(eventName, eventData.properties);
        this.sendToCustomEndpoint(eventData);
        
        console.log('Analytics Event:', eventName, eventData.properties);
    }
    
    trackPageView() {
        const pageData = {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname,
            content_group1: this.getContentGroup(),
            custom_map: {
                dimension1: this.getUserSegment(),
                dimension2: this.getDeviceType()
            }
        };
        
        this.track('page_view', pageData);
    }
    
    trackEcommerce(action, data) {
        const ecommerceData = {
            ...data,
            currency: 'USD',
            timestamp: Date.now()
        };
        
        switch (action) {
            case 'view_item':
                this.track('view_item', {
                    item_id: data.item_id,
                    item_name: data.item_name,
                    item_category: data.item_category || 'Press-On Nails',
                    item_brand: 'STICKLS',
                    price: data.price,
                    currency: 'USD'
                });
                break;
                
            case 'add_to_cart':
                this.track('add_to_cart', {
                    ...ecommerceData,
                    value: data.price * data.quantity
                });
                break;
                
            case 'remove_from_cart':
                this.track('remove_from_cart', ecommerceData);
                break;
                
            case 'begin_checkout':
                this.track('begin_checkout', {
                    ...ecommerceData,
                    value: data.value,
                    items: data.items
                });
                break;
                
            case 'purchase':
                this.track('purchase', {
                    transaction_id: data.transaction_id,
                    value: data.value,
                    currency: 'USD',
                    items: data.items,
                    coupon: data.coupon || null
                });
                break;
        }
    }
    
    trackCustomEvent(category, action, label = null, value = null) {
        this.track('custom_event', {
            event_category: category,
            event_action: action,
            event_label: label,
            event_value: value
        });
    }
    
    // ===== PLATFORM-SPECIFIC SENDING =====
    
    sendToGA4(eventName, properties) {
        if (!ANALYTICS_CONFIG.ga4.enabled || typeof gtag === 'undefined') return;
        
        gtag('event', eventName, properties);
    }
    
    sendToFacebook(eventName, properties) {
        if (!ANALYTICS_CONFIG.facebook.enabled || typeof fbq === 'undefined') return;
        
        // Map custom events to Facebook standard events
        const fbEventMap = {
            'page_view': 'PageView',
            'view_item': 'ViewContent',
            'add_to_cart': 'AddToCart',
            'begin_checkout': 'InitiateCheckout',
            'purchase': 'Purchase',
            'newsletter_signup': 'Lead',
            'virtual_try_on_opened': 'CustomizeProduct'
        };
        
        const fbEvent = fbEventMap[eventName] || 'CustomEvent';
        
        if (fbEvent === 'CustomEvent') {
            fbq('trackCustom', eventName, properties);
        } else {
            fbq('track', fbEvent, properties);
        }
    }
    
    sendToPinterest(eventName, properties) {
        if (!ANALYTICS_CONFIG.pinterest.enabled || typeof pintrk === 'undefined') return;
        
        // Map to Pinterest events
        const pinterestEventMap = {
            'page_view': 'pagevisit',
            'view_item': 'viewcategory',
            'add_to_cart': 'addtocart',
            'begin_checkout': 'checkout',
            'newsletter_signup': 'signup'
        };
        
        const pinterestEvent = pinterestEventMap[eventName];
        if (pinterestEvent) {
            pintrk('track', pinterestEvent, properties);
        }
    }
    
    sendToTikTok(eventName, properties) {
        if (!ANALYTICS_CONFIG.tiktok.enabled || typeof ttq === 'undefined') return;
        
        // Map to TikTok events
        const tiktokEventMap = {
            'page_view': 'Browse',
            'view_item': 'ViewContent',
            'add_to_cart': 'AddToCart',
            'begin_checkout': 'InitiateCheckout',
            'purchase': 'PlaceAnOrder'
        };
        
        const tiktokEvent = tiktokEventMap[eventName];
        if (tiktokEvent) {
            ttq.track(tiktokEvent, properties);
        }
    }
    
    sendToCustomEndpoint(eventData) {
        if (!ANALYTICS_CONFIG.custom.enabled) return;
        
        // Send to custom analytics endpoint (batched)
        this.batchEvents.push(eventData);
        
        if (this.batchEvents.length >= 10) {
            this.flushBatch();
        }
    }
    
    // ===== UTILITY METHODS =====
    
    getContentGroup() {
        const path = window.location.pathname;
        
        if (path === '/') return 'homepage';
        if (path.startsWith('/product/')) return 'product';
        if (path.startsWith('/collections/')) return 'collection';
        if (path.startsWith('/cart')) return 'cart';
        if (path.startsWith('/checkout')) return 'checkout';
        
        return 'other';
    }
    
    getUserSegment() {
        // Determine user segment based on behavior
        const cartItems = JSON.parse(localStorage.getItem('stickls-cart') || '[]');
        const recentlyViewed = JSON.parse(localStorage.getItem('stickls-recently-viewed') || '[]');
        
        if (cartItems.length > 0) return 'cart_user';
        if (recentlyViewed.length > 3) return 'engaged_browser';
        if (document.referrer.includes('google')) return 'search_visitor';
        if (document.referrer.includes('facebook') || document.referrer.includes('instagram')) return 'social_visitor';
        
        return 'new_visitor';
    }
    
    getDeviceType() {
        const width = window.innerWidth;
        
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }
    
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
    }
    
    // ===== BATCH SENDING =====
    
    batchEvents = [];
    
    flushBatch() {
        if (this.batchEvents.length === 0) return;
        
        fetch(ANALYTICS_CONFIG.custom.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                events: this.batchEvents,
                session_id: this.sessionId,
                user_id: this.userId
            })
        }).catch(error => {
            console.error('Analytics batch send failed:', error);
        });
        
        this.batchEvents = [];
    }
    
    // ===== ENHANCED ECOMMERCE TRACKING =====
    
    trackProductImpression(products) {
        products.forEach((product, index) => {
            this.track('view_item_list', {
                item_list_id: product.list_id || 'general',
                item_list_name: product.list_name || 'Product List',
                items: [{
                    item_id: product.id,
                    item_name: product.name,
                    item_category: product.category || 'Press-On Nails',
                    item_brand: 'STICKLS',
                    price: product.price,
                    index: index
                }]
            });
        });
    }
    
    trackProductClick(product, listName = 'Product List') {
        this.track('select_item', {
            item_list_id: 'general',
            item_list_name: listName,
            items: [{
                item_id: product.id,
                item_name: product.name,
                item_category: product.category || 'Press-On Nails',
                item_brand: 'STICKLS',
                price: product.price
            }]
        });
    }
    
    trackSearch(searchTerm, resultCount = null) {
        this.track('search', {
            search_term: searchTerm,
            search_results: resultCount
        });
    }
    
    trackPromotion(promotionId, promotionName, creativeName = null, creativeSlot = null) {
        this.track('view_promotion', {
            promotion_id: promotionId,
            promotion_name: promotionName,
            creative_name: creativeName,
            creative_slot: creativeSlot
        });
    }
    
    // ===== USER IDENTIFICATION =====
    
    identifyUser(userId, userProperties = {}) {
        this.userId = userId;
        localStorage.setItem('stickls-user-id', userId);
        
        // Send identification to all platforms
        if (typeof gtag !== 'undefined') {
            gtag('config', ANALYTICS_CONFIG.ga4.measurementId, {
                user_id: userId,
                custom_map: userProperties
            });
        }
        
        if (typeof fbq !== 'undefined') {
            fbq('track', 'identify', userProperties);
        }
        
        this.track('user_identified', {
            user_id: userId,
            ...userProperties
        });
    }
    
    // ===== CONVERSION TRACKING =====
    
    trackConversion(conversionType, value = null, currency = 'USD') {
        this.track('conversion', {
            conversion_type: conversionType,
            conversion_value: value,
            currency: currency
        });
        
        // Send to conversion APIs
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Purchase', {
                value: value,
                currency: currency
            });
        }
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', // Replace with actual conversion ID
                value: value,
                currency: currency
            });
        }
    }
}

// ===== GLOBAL ANALYTICS INSTANCE =====
let analytics;

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    analytics = new STICKLSAnalytics();
    
    // Make analytics available globally
    window.STICKLS_ANALYTICS = analytics;
    
    // Override the global trackEvent function
    window.trackEvent = function(eventName, properties) {
        analytics.track(eventName, properties);
    };
});

// ===== PERFORMANCE MONITORING =====
if ('PerformanceObserver' in window) {
    // Monitor Core Web Vitals
    const vitalsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (analytics) {
                analytics.track('core_web_vital', {
                    metric_name: entry.name,
                    metric_value: entry.value,
                    metric_rating: entry.value < entry.threshold ? 'good' : 'poor'
                });
            }
        }
    });
    
    vitalsObserver.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
}

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = STICKLSAnalytics;
} 