document.addEventListener("DOMContentLoaded", () => {
    const appContainer = document.getElementById("app");
    const menuItems = document.querySelectorAll(".menu-item");
    
    // GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Initial Load
    loadPage("news");

    // Menu Click Event
    menuItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const page = item.getAttribute("data-page");
            if(page) {
                // Update active class
                menuItems.forEach(i => i.classList.remove("active"));
                item.classList.add("active");
                
                // Load content
                loadPage(page);
            }
        });
    });

    function loadPage(pageName) {
        // Fade out current content
        gsap.to(appContainer, {
            opacity: 0, 
            y: -20, 
            duration: 0.3,
            onComplete: () => {
                fetchContent(pageName);
            }
        });
    }

    function fetchContent(pageName) {
        fetch(`pages/${pageName}.html`)
            .then(response => {
                if(!response.ok) throw new Error("Page not found");
                return response.text();
            })
            .then(html => {
                appContainer.innerHTML = html;
                
                // Reset opacity & transform for the container immediately
                gsap.set(appContainer, {opacity: 1, y: 0});
                
                // Trigger page specific animations
                animatePageContent();
            })
            .catch(error => {
                appContainer.innerHTML = `
                    <div class="page-container">
                        <h1>準備中</h1>
                        <p>このページ（${pageName}）は現在作成中です。</p>
                    </div>
                `;
                gsap.set(appContainer, {opacity: 1, y: 0});
                animatePageContent();
            });
    }

    function animatePageContent() {
        // Page container reveal
        const revealEl = appContainer.querySelector(".gs-reveal");
        if(revealEl) {
            gsap.fromTo(revealEl, 
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
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
                    duration: 0.8, 
                    stagger: 0.1, 
                    ease: "power2.out",
                    delay: 0.2
                }
            );
        }
    }
});
