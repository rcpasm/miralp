document.addEventListener('DOMContentLoaded', function() {
    // Hamburger Menü İşlevselliği
    initMobileMenu();

    // Header Scroll İşlevselliği
    initHeaderScroll();

    // Slider İşlevselliği (Sadece ana sayfada varsa)
    if (document.querySelector('.slider')) {
        initSlider();
    }

    // Video İşlevselliği (Video olan sayfalarda)
    if (document.querySelector('.video-container')) {
        initVideos();
    }
});

// Hamburger Menü Fonksiyonları
function initMobileMenu() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (!burger || !nav || !navLinks) return;

    burger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });

    document.addEventListener('click', function(e) {
        if (nav.classList.contains('active')) {
            if (!nav.contains(e.target) && !burger.contains(e.target)) {
                toggleMenu();
            }
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    function toggleMenu() {
        nav.classList.toggle('active');
        burger.classList.toggle('toggle');

        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    }
}

// Slider Fonksiyonları
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function startSlideTimer() {
        slideInterval = setInterval(() => showSlide(currentSlide + 1), 5000);
    }

    function stopSlideTimer() {
        clearInterval(slideInterval);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showSlide(currentSlide - 1);
            stopSlideTimer();
            startSlideTimer();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showSlide(currentSlide + 1);
            stopSlideTimer();
            startSlideTimer();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopSlideTimer();
            startSlideTimer();
        });
    });

    // İlk slideı göster ve otomatik geçişi başlat
    showSlide(0);
    startSlideTimer();
}

// Video Fonksiyonları
function initVideos() {
    const videos = document.querySelectorAll('.lazy-video');
    const muteBtns = document.querySelectorAll('.mute-btn');

    // Lazy loading için IntersectionObserver
    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    const source = video.querySelector('source');
                    if (source && source.dataset.src) {
                        source.src = source.dataset.src;
                        video.load();
                        video.play().catch(() => console.log("Video otomatik oynatılamadı"));
                        observer.unobserve(video);
                    }
                }
            });
        }, { threshold: 0.5 });

        videos.forEach(video => videoObserver.observe(video));
    }

    // Video kontrolleri
    document.querySelectorAll('.video-container').forEach((container, index) => {
        const video = container.querySelector('video');
        const muteBtn = container.querySelector('.mute-btn');

        if (video) {
            // Video tıklama kontrolü
            container.addEventListener('click', (e) => {
                if (!e.target.closest('.mute-btn')) {
                    if (video.paused) {
                        video.play();
                    } else {
                        video.pause();
                    }
                }
            });

            // Ses kontrolü
            if (muteBtn) {
                muteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    video.muted = !video.muted;
                    muteBtn.innerHTML = video.muted ? 
                        '<i class="fas fa-volume-mute"></i>' : 
                        '<i class="fas fa-volume-up"></i>';
                });
            }
        }
    });
}

// Scroll to top functionality
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        document.querySelector('.scroll-top').classList.add('active');
    } else {
        document.querySelector('.scroll-top').classList.remove('active');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Header Scroll Fonksiyonu
function initHeaderScroll() {
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    const scrollThreshold = 50; // Kaç piksel scroll sonra header gizlensin

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Sayfa en üstteyse veya yukarı scroll yapılıyorsa header'ı göster
        if (currentScroll <= scrollThreshold || currentScroll < lastScroll) {
            navbar.classList.remove('hide');
        } 
        // Aşağı scroll yapılıyorsa ve eşik değerini geçtiyse header'ı gizle
        else if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
            navbar.classList.add('hide');
        }

        lastScroll = currentScroll;
    });
} 