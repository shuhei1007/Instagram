document.addEventListener("DOMContentLoaded", () => {
    // GSAP
    gsap.registerPlugin(ScrollTrigger);

    initSplash();
    initCarousel();
    initScheduleMonthTabs();
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
        
        // Initial setup (no GSAP re-trigger — avoids flicker)
        updateCarousel(0);
    }

    function initScheduleMonthTabs() {
        const tabs = Array.from(document.querySelectorAll(".month-tab"));
        const img = document.getElementById("icircle-schedule-img");
        if (!tabs.length || !img) return;

        const monthLabels = { "08": "8月", "09": "9月" };

        function showMonth(month) {
            const src = img.getAttribute(`data-src-${month}`);
            if (!src) return;
            img.src = src;
            img.alt = `iサークル ${monthLabels[month] || month}の予定`;
            tabs.forEach((tab) => {
                const active = tab.getAttribute("data-month") === month;
                tab.classList.toggle("active", active);
                tab.setAttribute("aria-selected", active ? "true" : "false");
            });
        }

        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                showMonth(tab.getAttribute("data-month"));
            });
        });

        // Default to current month when available
        const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
        if (img.getAttribute(`data-src-${currentMonth}`)) {
            showMonth(currentMonth);
        }
    }

    function animatePageContent() {
        const appContainer = document.getElementById("app");
        if (!appContainer) return;

        // No entrance motion: nested .gs-reveal + .gs-item y-animation
        // looked like the page "shaking/sinking" when opening monthly info pages.
        const revealEl = appContainer.querySelector(".gs-reveal");
        const listItems = Array.from(appContainer.querySelectorAll(".gs-item")).filter((el) => {
            const slide = el.closest(".carousel-slide");
            return !slide || slide.classList.contains("active-slide");
        });

        if (revealEl) gsap.set(revealEl, { clearProps: "opacity,transform" });
        if (listItems.length > 0) gsap.set(listItems, { clearProps: "opacity,transform" });
        appContainer.querySelectorAll(".carousel-slide:not(.active-slide) .gs-item").forEach((el) => {
            gsap.set(el, { clearProps: "opacity,transform" });
        });
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

    // Info pages opened from ノウハウ一覧: back link goes to knowledge.html
    const params = new URLSearchParams(window.location.search);
    if (params.get('from') === 'knowledge') {
        const backLink = document.querySelector('.back-link');
        if (backLink) {
            backLink.href = 'knowledge.html';
            backLink.textContent = '← ノウハウ一覧に戻る';
        }
        menuItems.forEach((item) => {
            const href = item.getAttribute('href');
            item.classList.toggle('active', href === 'knowledge.html');
        });
    }

    // Radio day cards: keep open while reading (body clicks must not toggle)
    document.querySelectorAll('.radio-day').forEach((day) => {
        const body = day.querySelector('.radio-day-body');
        if (!body) return;
        body.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        body.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });
    });
});

// Prompt Copy Logic
document.addEventListener('DOMContentLoaded', () => {
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const targetId = btn.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            if(targetEl) {
                try {
                    await navigator.clipboard.writeText(targetEl.textContent.trim());
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '✅ コピーしました！';
                    btn.classList.add('copied');
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.classList.remove('copied');
                    }, 2000);
                } catch(err) {
                    console.error('Copy failed', err);
                    alert('コピーに失敗しました。');
                }
            }
        });
    });
});
