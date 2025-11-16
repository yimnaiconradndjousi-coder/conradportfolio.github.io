// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initSmoothScrolling();
    initScrollEffects();
    initSkillAnimations();
    initContactForm();
    initScrollToTop();
    initParticles();
    initTypewriter();
});

// Mobile Navigation
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Effects
function initScrollEffects() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        // Header background on scroll
        if (window.scrollY > 100) {
            header.style.background = 'rgba(10, 10, 10, 0.98)';
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        // Active nav link based on scroll position
        updateActiveNavLink();
    });
}

// Update active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = sectionId;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Skill Bar Animations
function initSkillAnimations() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const animateSkillBars = function() {
        skillBars.forEach(bar => {
            const barPosition = bar.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (barPosition < screenPosition) {
                const level = bar.getAttribute('data-level');
                bar.style.width = level + '%';
                
                // Update skill level text
                const skillLevel = bar.closest('.skill-item').querySelector('.skill-level');
                if (skillLevel) {
                    skillLevel.textContent = `${level}%`;
                }
            }
        });
    };
    
    // Initial check
    animateSkillBars();
    
    // Check on scroll
    window.addEventListener('scroll', animateSkillBars);
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    
    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            const formMessage = document.getElementById('formMessage');
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim(),
                timestamp: new Date().toLocaleString()
            };

            // Validation
            if (!formData.name || !formData.email || !formData.subject || !formData.message) {
                showFormMessage('Please fill in all fields', 'error');
                return;
            }

            if (!isValidEmail(formData.email)) {
                showFormMessage('Please enter a valid email address', 'error');
                return;
            }

            // Show loading state
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            submitBtn.disabled = true;

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Store message
                storeMessage(formData);
                
                // Success message
                showFormMessage('Thank you for your message! I will get back to you soon.', 'success');
                
                // Reset form
                contactForm.reset();
                
                // Show download option
                showDownloadOption();
                
            } catch (error) {
                showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
            } finally {
                // Reset button
                btnText.style.display = 'flex';
                btnLoading.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Store message in localStorage
function storeMessage(message) {
    let messages = JSON.parse(localStorage.getItem('portfolioMessages')) || [];
    messages.push(message);
    localStorage.setItem('portfolioMessages', JSON.stringify(messages));
}

// Show form message
function showFormMessage(text, type) {
    const formMessage = document.getElementById('formMessage');
    if (!formMessage) return;
    
    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// Show download option
function showDownloadOption() {
    let downloadBtn = document.querySelector('.download-btn');
    
    if (!downloadBtn) {
        downloadBtn = document.createElement('button');
        downloadBtn.className = 'btn download-btn';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download Messages';
        downloadBtn.onclick = downloadMessages;
        
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.parentNode.insertBefore(downloadBtn, submitBtn.nextSibling);
    }
}

// Download messages as CSV
function downloadMessages() {
    const messages = JSON.parse(localStorage.getItem('portfolioMessages')) || [];
    
    if (messages.length === 0) {
        showFormMessage('No messages to download', 'error');
        return;
    }
    
    const headers = ['Timestamp', 'Name', 'Email', 'Subject', 'Message'];
    const csvContent = [
        headers.join(','),
        ...messages.map(msg => [
            `"${msg.timestamp}"`,
            `"${msg.name.replace(/"/g, '""')}"`,
            `"${msg.email.replace(/"/g, '""')}"`,
            `"${msg.subject.replace(/"/g, '""')}"`,
            `"${msg.message.replace(/"/g, '""')}"`
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio_messages_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showFormMessage('Messages downloaded successfully!', 'success');
}

// Scroll to Top functionality
function initScrollToTop() {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Particle background effect
function initParticles() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    for (let i = 0; i < 15; i++) {
        createParticle(heroSection);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    const size = Math.random() * 4 + 1;
    
    particle.style.position = 'absolute';
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.background = 'rgba(255, 107, 107, 0.5)';
    particle.style.borderRadius = '50%';
    particle.style.top = Math.random() * 100 + 'vh';
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.opacity = Math.random() * 0.6 + 0.2;
    particle.style.boxShadow = '0 0 10px rgba(255, 107, 107, 0.5)';
    
    container.appendChild(particle);
    animateParticle(particle);
}

function animateParticle(particle) {
    let x = parseFloat(particle.style.left);
    let y = parseFloat(particle.style.top);
    let xSpeed = (Math.random() - 0.5) * 0.3;
    let ySpeed = (Math.random() - 0.5) * 0.3;
    
    function move() {
        x += xSpeed;
        y += ySpeed;
        
        // Bounce off edges
        if (x <= 0 || x >= 100) xSpeed *= -1;
        if (y <= 0 || y >= 100) ySpeed *= -1;
        
        particle.style.left = x + 'vw';
        particle.style.top = y + 'vh';
        
        requestAnimationFrame(move);
    }
    
    move();
}

// Typewriter effect for hero title
function initTypewriter() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.opacity = '1';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Start after a short delay
    setTimeout(typeWriter, 500);
}

// Project card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Check for existing messages on load
    const messages = JSON.parse(localStorage.getItem('portfolioMessages')) || [];
    if (messages.length > 0) {
        showDownloadOption();
    }
});