document.addEventListener("DOMContentLoaded", () => {
    // GSAP
    gsap.registerPlugin(ScrollTrigger);

    animatePageContent();

    // Splash Screen Animation
    function initSplash() {
        const splashContainer = document.querySelector('.splash-container');
        if (!splashContainer) return;
        
        const waves = document.querySelector('.ocean-waves');
        const titleLines = splashContainer.querySelectorAll('.splash-title span');
        const btn = splashContainer.querySelector('.splash-action');
        
        // Hide initially
        gsap.set([titleLines, btn], { opacity: 0, y: 30 });
        
        const tl = gsap.timeline();
        
        if (waves) {
            // Summer wave animation
            waves.style.transition = 'height 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            tl.to(waves, {
                height: "75vh",
                duration: 1.5,
                ease: "sine.inOut"
            })
            .to(waves, {
                height: "12vh",
                duration: 2.2,
                ease: "sine.inOut",
                onComplete: () => {
                    waves.style.transition = '';
                }
            }, "+=0.2")
            .to(titleLines, { opacity: 1, y: 0, duration: 1.2, stagger: 0.3, ease: "power2.out" }, "-=1.8")
            .to(btn, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.8");
        } else {
            // Other seasons (Spring, Autumn, Winter) - Just fade in beautifully
            tl.to(titleLines, { opacity: 1, y: 0, duration: 1.5, stagger: 0.3, ease: "power2.out", delay: 0.5 })
              .to(btn, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.8");
        }
    }
    
    initSplash();

    initCarousel();

    function initCarousel() {
        const track = document.getElementById("members-track");
        if (!track) return;
        
        const slides = Array.from(track.querySelectorAll(".carousel-slide"));
        const thumbnails = Array.from(document.querySelectorAll(".thumb-btn"));
        const prevBtn = document.querySelector(".prev-btn");
        const nextBtn = document.querySelector(".next-btn");
        
        if (slides.length === 0) return;
        
        let currentIndex = 0;
        const totalSlides = slides.length;
        
        function updateCarousel(index) {
            // Bounds
            if (index < 0) index = 0;
            if (index >= totalSlides) index = totalSlides - 1;
            currentIndex = index;
            
            // Transform track
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update active states
            slides.forEach((slide, i) => {
                slide.classList.toggle("active-slide", i === currentIndex);
            });
            thumbnails.forEach((thumb, i) => {
                thumb.classList.toggle("active", i === currentIndex);
            });
            
            // Disable/Enable buttons
            if (prevBtn) prevBtn.disabled = currentIndex === 0;
            if (nextBtn) nextBtn.disabled = currentIndex === totalSlides - 1;
            
            // Optional: Re-trigger GSAP animations in the newly active slide
            const activeSlide = slides[currentIndex];
            const slideItems = activeSlide.querySelectorAll(".gs-item");
            if (slideItems.length > 0) {
                gsap.fromTo(slideItems,
                    { opacity: 0, y: 40 },
                    { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
                );
            }
        }
        
        // Thumbnail clicks
        thumbnails.forEach((thumb) => {
            thumb.addEventListener("click", () => {
                const index = parseInt(thumb.getAttribute("data-index"), 10);
                updateCarousel(index);
            });
        });
        
        // Prev/Next clicks
        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                updateCarousel(currentIndex - 1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                updateCarousel(currentIndex + 1);
            });
        }
        
        // Initial setup
        updateCarousel(0);
    }

    function animatePageContent() {
        const appContainer = document.getElementById("app");
        if (!appContainer) return;
        
        // Page container reveal
        const revealEl = appContainer.querySelector(".gs-reveal");
        if(revealEl) {
            gsap.fromTo(revealEl, 
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }
            );
        }

        // Stagger list items or cards
        const listItems = appContainer.querySelectorAll(".gs-item");
        if(listItems.length > 0) {
            gsap.fromTo(listItems, 
                { opacity: 0, y: 40 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 1.2, 
                    stagger: 0.1, 
                    ease: "power2.out",
                    delay: 0.2
                }
            );
        }
    }
});

// Sidebar Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if(menuToggle && sidebar && overlay) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.add('open');
            overlay.classList.add('open');
        });
        
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
        });
    }

    // Accordion Logic
    const accordionBtns = document.querySelectorAll('.accordion-btn');
    accordionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            const content = btn.nextElementSibling;
            if(content && content.classList.contains('accordion-content')) {
                content.classList.toggle('open');
            }
        });
    });

    // Auto-set active menu item based on URL
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        if (currentPath === href || (currentPath === 'index.html' && href === 'news.html')) {
            item.classList.add('active');
            // Do NOT automatically open the parent accordion, per user request.
        } else {
            item.classList.remove('active');
        }
    });
});
