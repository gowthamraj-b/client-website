// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mmClose = document.getElementById('mmClose');
const mmLinks = document.querySelectorAll('.mm-link');
const navLinksAll = document.querySelectorAll('.nav-links a');
const contactForm = document.getElementById('contactForm');
const canvas = document.getElementById('particles-canvas');
const statNumbers = document.querySelectorAll('.hero-stat .number');
const themeToggle = document.getElementById('themeToggle');
const scrollIndicator = document.querySelector('.scroll-indicator');

// ===== Theme Toggle =====
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
}

// Load saved theme (default: dark)
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

themeToggle.addEventListener('click', toggleTheme);

// ===== Navbar Scroll Effect =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Mobile Menu =====
function openMenu() {
    menuBtn.classList.add('active');
    menuBtn.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    menuBtn.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Toggle on hamburger button click
if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
    });
}

// Close on X button inside menu
if (mmClose) {
    mmClose.addEventListener('click', closeMenu);
}

// Close when any mobile nav link is clicked
mmLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
});

// ===== Active Nav Link on Scroll =====
const sections = document.querySelectorAll('section[id]');

function highlightNav() {
    const scrollY = window.scrollY + 200;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

        if (navLink && scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinksAll.forEach(l => l.classList.remove('active'));
            navLink.classList.add('active');
        }
    });
}

let lastScrollTime = 0;
window.addEventListener('scroll', () => {
    const now = Date.now();
    if (now - lastScrollTime > 100) {
        highlightNav();
        lastScrollTime = now;
    }
});

// ===== Scroll Reveal Animation =====
function setupReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

setupReveal();

// ===== Animated Counter =====
let countersAnimated = false;

function animateCounters() {
    if (countersAnimated) return;

    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current) + '+';
        }, 16);
    });

    countersAnimated = true;
}

// Trigger counters when hero stats are visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ===== Particle Background =====
function initParticles() {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    // Reduce particle count on mobile/tablets for better performance
    const isMobile = window.innerWidth < 1024;
    const particleCount = isMobile ? 30 : 60;

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const opacity = (1 - distance / 120) * 0.15;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }

    animate();
}

initParticles();

// ===== Contact Form → WhatsApp =====
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const institution = document.getElementById('institution').value;
        const message = document.getElementById('message').value;

        const whatsappMsg = encodeURIComponent(
            `Hello Seiva Robotics!\n\n` +
            `*Name:* ${name}\n` +
            `*Email:* ${email}\n` +
            `*Phone:* ${phone}\n` +
            `*Institution:* ${institution}\n` +
            `*Message:* ${message}`
        );

        window.open(`https://wa.me/919342261511?text=${whatsappMsg}`, '_blank');

        const btn = contactForm.querySelector('.btn-submit');
        const originalText = btn.textContent;
        btn.textContent = '✅ Sent via WhatsApp!';
        btn.style.background = 'linear-gradient(135deg, #00ff88, #00cc6a)';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            contactForm.reset();
        }, 3000);
    });
}

// ===== Internship Form → WhatsApp =====
const internshipForm = document.getElementById('internshipForm');
if (internshipForm) {
    internshipForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const iname = document.getElementById('iname').value;
        const iemail = document.getElementById('iemail').value;
        const iphone = document.getElementById('iphone').value;
        const icollege = document.getElementById('icollege').value;
        const ibranch = document.getElementById('ibranch').value;
        const iyear = document.getElementById('iyear').value;
        const idomain = document.getElementById('idomain').value;
        const iduration = document.getElementById('iduration').value;
        const imessage = document.getElementById('imessage').value;

        const whatsappMsg = encodeURIComponent(
            `🎓 *Internship Application — Seiva Robotics & Technologies*\n\n` +
            `*Name:* ${iname}\n` +
            `*Email:* ${iemail}\n` +
            `*Phone:* ${iphone}\n` +
            `*College:* ${icollege}\n` +
            `*Branch:* ${ibranch}\n` +
            `*Year:* ${iyear}\n` +
            `*Domain:* ${idomain}\n` +
            `*Duration:* ${iduration}\n\n` +
            `*About Applicant:* \n${imessage}`
        );

        window.open(`https://wa.me/919342261511?text=${whatsappMsg}`, '_blank');

        const btn = internshipForm.querySelector('.btn-submit');
        const originalText = btn.textContent;
        btn.textContent = '✅ Application Sent via WhatsApp!';
        btn.style.background = 'linear-gradient(135deg, #00ff88, #00cc6a)';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            internshipForm.reset();
        }, 3500);
    });
}

// ===== Smooth Scroll with Offset =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Card Tilt Effect =====
function addTiltEffect() {
    // Disable tilt on mobile for performance
    if (window.innerWidth < 1024) return;

    const cards = document.querySelectorAll('.service-card, .project-card, .value-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

addTiltEffect();

// ===== Auto-hide Scroll Indicator =====
if (scrollIndicator) {
    // Hide after 4 seconds
    const hideScrollTimer = setTimeout(() => {
        scrollIndicator.classList.add('hidden');
    }, 4000);

    // Also hide immediately when user scrolls
    const onFirstScroll = () => {
        clearTimeout(hideScrollTimer);
        scrollIndicator.classList.add('hidden');
        window.removeEventListener('scroll', onFirstScroll);
    };
    window.addEventListener('scroll', onFirstScroll);
}

// ===== Video Playback & Modal =====
function setupVideoPlayback() {
    const demoVideo = document.getElementById('demoVideo');
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalClose = document.getElementById('modalClose');
    const modalBackdrop = document.querySelector('.video-modal-backdrop');

    if (!demoVideo || !videoModal || !modalVideo) return;

    const videoCard = demoVideo.closest('.project-card');

    // Autoplay handling (browser often blocks with sound, but we are muted)
    demoVideo.muted = true;
    demoVideo.play().catch(e => console.log("Card video autoplay prevented:", e));

    // Open Modal on card click
    videoCard.addEventListener('click', () => {
        videoModal.classList.add('open');
        document.body.style.overflow = 'hidden';
        modalVideo.currentTime = demoVideo.currentTime; // Sync time
        modalVideo.muted = true; // Ensure silent as requested
        modalVideo.play();
    });

    // Close Modal
    function closeModal() {
        videoModal.classList.remove('open');
        document.body.style.overflow = '';
        modalVideo.pause();
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('open')) {
            closeModal();
        }
    });
}

// ===== Loading Animation =====
window.addEventListener('load', () => {
    setupVideoPlayback();
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});
