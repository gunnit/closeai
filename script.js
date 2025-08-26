// Global variables
let mobileMenuOpen = false;
let currentPlan = 'professional';
let isAnnualPricing = false;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize application
function initializeApp() {
    // Set up smooth scrolling for anchor links
    setupSmoothScrolling();
    
    // Initialize pricing toggle
    initializePricingToggle();
    
    // Initialize FAQ accordions
    initializeFAQ();
    
    // Initialize animations on scroll
    initializeScrollAnimations();
    
    // Initialize demo modal
    initializeDemoModal();
    
    // Add keyboard navigation
    initializeKeyboardNavigation();
    
    // Initialize form handlers
    initializeFormHandlers();
    
    console.log('CloseAI landing page initialized successfully');
}

// Smooth scrolling for internal links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll to section utility function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Mobile menu functionality
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const toggleButton = document.querySelector('.mobile-menu-toggle');
    
    mobileMenuOpen = !mobileMenuOpen;
    
    if (mobileMenuOpen) {
        mobileMenu.classList.add('active');
        toggleButton.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        mobileMenu.classList.remove('active');
        toggleButton.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const toggleButton = document.querySelector('.mobile-menu-toggle');
    
    mobileMenuOpen = false;
    mobileMenu.classList.remove('active');
    toggleButton.classList.remove('active');
    document.body.style.overflow = '';
}

// Pricing toggle functionality
function initializePricingToggle() {
    const toggle = document.getElementById('pricingToggle');
    if (toggle) {
        toggle.addEventListener('change', togglePricing);
    }
}

function togglePricing() {
    const toggle = document.getElementById('pricingToggle');
    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const annualPrices = document.querySelectorAll('.annual-price');
    
    isAnnualPricing = toggle.checked;
    
    if (isAnnualPricing) {
        // Show annual prices
        monthlyPrices.forEach(price => price.classList.add('hidden'));
        annualPrices.forEach(price => price.classList.remove('hidden'));
    } else {
        // Show monthly prices
        monthlyPrices.forEach(price => price.classList.remove('hidden'));
        annualPrices.forEach(price => price.classList.add('hidden'));
    }
    
    // Add animation effect
    document.querySelectorAll('.pricing-card').forEach(card => {
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    });
}

// Plan selection
function selectPlan(planType) {
    currentPlan = planType;
    
    // Track the selection (you can integrate with analytics here)
    trackEvent('plan_selected', { plan: planType, billing: isAnnualPricing ? 'annual' : 'monthly' });
    
    // In a real application, this would redirect to a signup/checkout page
    showPlanSelectionModal(planType);
}

function showPlanSelectionModal(planType) {
    const planNames = {
        'starter': 'Starter',
        'professional': 'Professional', 
        'team': 'Team'
    };
    
    const message = `You've selected the ${planNames[planType]} plan with ${isAnnualPricing ? 'annual' : 'monthly'} billing. This would normally redirect to our secure checkout page.`;
    
    alert(message);
}

// FAQ functionality
function initializeFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => toggleFAQ(question));
    });
}

function toggleFAQ(questionElement) {
    const isActive = questionElement.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-question').forEach(q => {
        q.classList.remove('active');
    });
    
    document.querySelectorAll('.faq-answer').forEach(a => {
        a.style.maxHeight = '0';
    });
    
    // Open clicked item if it wasn't already active
    if (!isActive) {
        questionElement.classList.add('active');
        const answer = questionElement.nextElementSibling;
        answer.style.maxHeight = answer.scrollHeight + 'px';
    }
}

// Demo modal functionality
function initializeDemoModal() {
    const modal = document.getElementById('demoModal');
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeDemo();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeDemo();
        }
    });
}

function openDemo() {
    const modal = document.getElementById('demoModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        trackEvent('demo_opened');
    }
}

function closeDemo() {
    const modal = document.getElementById('demoModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        trackEvent('demo_closed');
    }
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special handling for stats counters
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
                
                // Special handling for progress bars
                if (entry.target.classList.contains('bar')) {
                    animateProgressBar(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card, .problem-item, .step, .stat-number, .bar').forEach(el => {
        observer.observe(el);
    });
}

// Animate counters
function animateCounter(element) {
    const target = element.textContent;
    const number = target.match(/\d+/);
    
    if (number) {
        const targetNumber = parseInt(number[0]);
        const duration = 2000;
        const increment = targetNumber / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
                current = targetNumber;
                clearInterval(timer);
            }
            
            element.textContent = target.replace(/\d+/, Math.floor(current).toString());
        }, 16);
    }
}

// Animate progress bars
function animateProgressBar(barElement) {
    const width = barElement.style.width;
    barElement.style.width = '0%';
    
    setTimeout(() => {
        barElement.style.width = width;
    }, 500);
}

// Keyboard navigation
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Tab navigation enhancements
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
        
        // Quick navigation shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    scrollToSection('features');
                    break;
                case '2':
                    e.preventDefault();
                    scrollToSection('pricing');
                    break;
                case '3':
                    e.preventDefault();
                    scrollToSection('testimonials');
                    break;
                case '4':
                    e.preventDefault();
                    scrollToSection('faq');
                    break;
            }
        }
    });
    
    // Remove keyboard navigation class on mouse use
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Form handlers
function initializeFormHandlers() {
    // Newsletter signup (if you add one)
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', handleNewsletterSignup);
    });
    
    // Contact forms (if you add them)
    const contactForms = document.querySelectorAll('.contact-form');
    contactForms.forEach(form => {
        form.addEventListener('submit', handleContactForm);
    });
}

function handleNewsletterSignup(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Validate email
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // In a real application, this would submit to your backend
    showNotification('Thank you for subscribing! We\'ll keep you updated on CloseAI.', 'success');
    e.target.reset();
    
    trackEvent('newsletter_signup', { email: email });
}

function handleContactForm(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!data.name || !data.email || !data.message) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (!isValidEmail(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // In a real application, this would submit to your backend
    showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
    e.target.reset();
    
    trackEvent('contact_form_submitted', data);
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#6366F1'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-weight: 500;
        max-width: 400px;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Analytics tracking (placeholder)
function trackEvent(eventName, properties = {}) {
    // In a real application, you would integrate with Google Analytics, Mixpanel, etc.
    console.log('Event tracked:', eventName, properties);
    
    // Example Google Analytics 4 integration:
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    
    // Example Mixpanel integration:
    if (typeof mixpanel !== 'undefined') {
        mixpanel.track(eventName, properties);
    }
}

// Performance monitoring
function initializePerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', function() {
        const perfData = performance.getEntriesByType('navigation')[0];
        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
        
        trackEvent('page_load_performance', {
            load_time: Math.round(loadTime),
            dom_content_loaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart)
        });
    });
    
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            getCLS(console.log);
            getFID(console.log);
            getFCP(console.log);
            getLCP(console.log);
            getTTFB(console.log);
        });
    }
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        line: e.lineno,
        column: e.colno
    });
});

// Initialize performance monitoring
document.addEventListener('DOMContentLoaded', initializePerformanceMonitoring);

// Scroll-based navbar styling
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        // Add background when scrolled
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
    }
    
    lastScrollTop = scrollTop;
}, { passive: true });

// Add CSS for scroll effects
const scrollStyles = document.createElement('style');
scrollStyles.textContent = `
    .navbar {
        transition: all 0.3s ease;
    }
    
    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    .keyboard-navigation *:focus {
        outline: 2px solid #6366F1 !important;
        outline-offset: 2px !important;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .notification {
        font-family: var(--font-family);
    }
    
    /* Loading states for interactive elements */
    .btn-primary:disabled,
    .btn-secondary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
    }
    
    .btn-primary.loading::after,
    .btn-secondary.loading::after {
        content: "";
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-left: 8px;
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
    
    /* Hover effects for cards */
    .feature-card,
    .testimonial-card,
    .pricing-card {
        transition: all 0.3s ease;
    }
    
    .feature-card:hover,
    .testimonial-card:hover {
        transform: translateY(-4px);
    }
    
    .pricing-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-2xl);
    }
    
    .pricing-card.featured:hover {
        transform: scale(1.05) translateY(-2px);
    }
`;

document.head.appendChild(scrollStyles);

// Copy to clipboard functionality for demo
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('copy-btn')) {
        const suggestionText = e.target.previousElementSibling.textContent;
        
        // Extract just the suggestion without the emoji and label
        const cleanText = suggestionText.replace(/💡\s*[\w\s]*:\s*/, '');
        
        navigator.clipboard.writeText(cleanText).then(() => {
            const originalText = e.target.textContent;
            e.target.textContent = 'Copied!';
            e.target.style.background = 'rgba(16, 185, 129, 0.3)';
            
            setTimeout(() => {
                e.target.textContent = originalText;
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }, 2000);
            
            trackEvent('demo_suggestion_copied', { suggestion: cleanText });
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            showNotification('Failed to copy to clipboard', 'error');
        });
    }
});

// Initialize tooltips for feature highlights
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const text = e.target.getAttribute('data-tooltip');
    const tooltip = document.createElement('div');
    
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    
    setTimeout(() => tooltip.style.opacity = '1', 10);
    
    e.target.tooltipElement = tooltip;
}

function hideTooltip(e) {
    if (e.target.tooltipElement) {
        e.target.tooltipElement.style.opacity = '0';
        setTimeout(() => {
            if (e.target.tooltipElement && e.target.tooltipElement.parentNode) {
                e.target.tooltipElement.parentNode.removeChild(e.target.tooltipElement);
            }
        }, 200);
    }
}

// Initialize tooltips when DOM is ready
document.addEventListener('DOMContentLoaded', initializeTooltips);

console.log('CloseAI JavaScript loaded successfully! 🚀');