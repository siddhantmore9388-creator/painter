/**
 * MANOJ COLOURS - PROFESSIONAL PAINTING SERVICE
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initStickyHeader();
    initSmoothScroll();
    initFAQ();
    initGalleryTabs();
    initContactForm();
    initScrollAnimations();
});

/**
 * Mobile Menu Functionality
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuClose = document.querySelector('.mobile-menu-close');
    const overlay = document.querySelector('.overlay');
    const mobileLinks = document.querySelectorAll('.mobile-menu-nav a');

    if (!menuBtn || !mobileMenu) return;

    // Open menu
    menuBtn.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close menu function
    function closeMenu() {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Close on button click
    if (menuClose) {
        menuClose.addEventListener('click', closeMenu);
    }

    // Close on overlay click
    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    // Close on link click
    mobileLinks.forEach(function(link) {
        link.addEventListener('click', closeMenu);
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

/**
 * Sticky Header
 */
function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * FAQ Accordion
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                // Close other items
                faqItems.forEach(function(otherItem) {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
}

/**
 * Gallery Tabs
 */
function initGalleryTabs() {
    const tabs = document.querySelectorAll('.gallery-tab');
    const items = document.querySelectorAll('.gallery-item');

    if (tabs.length === 0) return;

    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active tab
            tabs.forEach(function(t) {
                t.classList.remove('active');
            });
            this.classList.add('active');

            // Filter items
            items.forEach(function(item) {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(function() {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(function() {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * Contact Form Validation & Submission
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Clear previous errors
        clearFormErrors();

        // Validate form
        let isValid = true;

        // Name validation
        const name = document.getElementById('name');
        if (!name || name.value.trim() === '') {
            showFieldError(name, 'Please enter your name');
            isValid = false;
        } else if (name.value.trim().length < 3) {
            showFieldError(name, 'Name must be at least 3 characters');
            isValid = false;
        }

        // Phone validation
        const phone = document.getElementById('phone');
        if (!phone || phone.value.trim() === '') {
            showFieldError(phone, 'Please enter your phone number');
            isValid = false;
        } else if (!validatePhone(phone.value)) {
            showFieldError(phone, 'Please enter a valid 10-digit phone number');
            isValid = false;
        }

        // Email validation (optional)
        const email = document.getElementById('email');
        if (email && email.value.trim() !== '' && !validateEmail(email.value)) {
            showFieldError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Service validation
        const service = document.getElementById('service');
        if (!service || service.value === '') {
            showFieldError(service, 'Please select a service');
            isValid = false;
        }

        // Message validation
        const message = document.getElementById('message');
        if (!message || message.value.trim() === '') {
            showFieldError(message, 'Please enter your message');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showFieldError(message, 'Message must be at least 10 characters');
            isValid = false;
        }

        // If valid, submit form
        if (isValid) {
            submitForm(form);
        }
    });

    // Real-time validation on input
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(function(input) {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            const formGroup = this.closest('.form-group');
            if (formGroup && formGroup.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

/**
 * Validate individual field
 */
function validateField(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return true;

    const fieldName = field.getAttribute('name');
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch(fieldName) {
        case 'name':
            if (value === '') {
                isValid = false;
                errorMessage = 'Please enter your name';
            } else if (value.length < 3) {
                isValid = false;
                errorMessage = 'Name must be at least 3 characters';
            }
            break;

        case 'phone':
            if (value === '') {
                isValid = false;
                errorMessage = 'Please enter your phone number';
            } else if (!validatePhone(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid 10-digit phone number';
            }
            break;

        case 'email':
            if (value !== '' && !validateEmail(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;

        case 'service':
            if (value === '') {
                isValid = false;
                errorMessage = 'Please select a service';
            }
            break;

        case 'message':
            if (value === '') {
                isValid = false;
                errorMessage = 'Please enter your message';
            } else if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters';
            }
            break;
    }

    if (isValid) {
        formGroup.classList.remove('error');
    } else {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

/**
 * Show field error
 */
function showFieldError(field, message) {
    if (!field) return;
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;

    formGroup.classList.add('error');
    const errorElement = formGroup.querySelector('.form-error');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

/**
 * Clear all form errors
 */
function clearFormErrors() {
    const errorGroups = document.querySelectorAll('.form-group.error');
    errorGroups.forEach(function(group) {
        group.classList.remove('error');
    });
}

/**
 * Validate phone number (Indian format)
 */
function validatePhone(phone) {
    // Remove spaces, dashes, and +91 prefix
    const cleanPhone = phone.replace(/[\s\-+]/g, '').replace(/^91/, '');
    // Check for 10 digits
    return /^[6-9]\d{9}$/.test(cleanPhone);
}

/**
 * Validate email
 */
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Submit form
 */
function submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const successMessage = document.querySelector('.form-success');

    // Disable submit button
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    }

    // Simulate form submission (replace with actual AJAX call)
    setTimeout(function() {
        // Show success message
        if (successMessage) {
            successMessage.classList.add('show');
        }

        // Reset form
        form.reset();

        // Re-enable submit button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Message';
        }

        // Hide success message after 5 seconds
        setTimeout(function() {
            if (successMessage) {
                successMessage.classList.remove('show');
            }
        }, 5000);

        // In production, you would send the form data to your server here
        // Example using fetch:
        /*
        const formData = new FormData(form);
        fetch('your-endpoint.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Handle success
        })
        .catch(error => {
            // Handle error
        });
        */
    }, 1500);
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.why-card, .service-card, .testimonial-card, .area-card, .process-step, .cert-card, .brand-card');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(function() {
                inThrottle = false;
            }, limit);
        }
    };
}

// Console message
console.log('%c Manoj Colours - Professional Painting Service ', 'background: #F97316; color: #fff; font-size: 16px; padding: 10px;');
console.log('%c Website loaded successfully! ', 'background: #0B1F3A; color: #fff; padding: 5px;');
