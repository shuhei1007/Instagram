document.addEventListener("DOMContentLoaded", () => {
    // GSAP
    gsap.registerPlugin(ScrollTrigger);

    animatePageContent();

    function animatePageContent() {
        const appContainer = document.getElementById("app");
        if (!appContainer) return;
        
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
