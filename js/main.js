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
    initGalleryLightbox(); // Galeri lightbox'u başlat
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

        // Body scroll engelleme
        if (nav.classList.contains('active')) {
            document.body.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
        }

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

    // KORUMA: Slider elemanları yoksa fonksiyonu çalıştırma
    if (slides.length === 0 || dots.length === 0) return;

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

// Galeri Lightbox
function initGalleryLightbox() {
    const galleryImages = document.querySelectorAll('.gallery-card img');
    const lightboxBg = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('galleryLightboxImg');
    const lightboxClose = document.getElementById('galleryLightboxClose');
    const lightboxPrev = document.getElementById('galleryLightboxPrev');
    const lightboxNext = document.getElementById('galleryLightboxNext');
    if (!galleryImages.length || !lightboxBg || !lightboxImg || !lightboxClose || !lightboxPrev || !lightboxNext) return;

    let currentIndex = 0;

    function showImage(index) {
        currentIndex = (index + galleryImages.length) % galleryImages.length;
        lightboxImg.src = galleryImages[currentIndex].src;
        lightboxImg.alt = galleryImages[currentIndex].alt || '';
    }

    galleryImages.forEach((img, idx) => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            showImage(idx);
            lightboxBg.classList.add('active');
            document.body.classList.add('menu-open');
        });
    });
    function closeLightbox() {
        lightboxBg.classList.remove('active');
        lightboxImg.src = '';
        document.body.classList.remove('menu-open');
    }
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxBg.addEventListener('click', (e) => {
        if (e.target === lightboxBg) closeLightbox();
    });
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex - 1);
    });
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex + 1);
    });
    document.addEventListener('keydown', (e) => {
        if (!lightboxBg.classList.contains('active')) return;
        if (e.key === 'Escape' || e.key === 'Esc') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showImage(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            showImage(currentIndex + 1);
        }
    });
}

// Scroll to top functionality
window.addEventListener('scroll', () => {
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (!scrollTopBtn) return;
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('active');
    } else {
        scrollTopBtn.classList.remove('active');
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

    // KORUMA: Navbar yoksa fonksiyonu çalıştırma
    if (!navbar) return;

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