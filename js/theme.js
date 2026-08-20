
document.addEventListener('DOMContentLoaded', () => {
    // Determine season
    const month = new Date().getMonth() + 1;
    let season = 'summer'; // default
    
    if (month >= 3 && month <= 5) season = 'spring';
    else if (month >= 6 && month <= 8) season = 'summer';
    else if (month >= 9 && month <= 11) season = 'autumn';
    else season = 'winter';

    // Enable easy testing via URL parameter: ?season=winter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('season')) {
        season = urlParams.get('season');
    }

    document.body.classList.add('theme-' + season);

    // Container for effects
    const effectContainer = document.createElement('div');
    effectContainer.id = 'season-effect';
    effectContainer.style.position = 'fixed';
    effectContainer.style.top = '0';
    effectContainer.style.left = '0';
    effectContainer.style.width = '100%';
    effectContainer.style.height = '100%';
    effectContainer.style.pointerEvents = 'none';
    effectContainer.style.zIndex = '0'; // Behind main content
    document.body.appendChild(effectContainer);

    if (season === 'summer') {
        // Inject SVG Waves
        effectContainer.innerHTML = `
            <svg class="ocean-waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
                <defs>
                    <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                </defs>
                <g class="parallax">
                    <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7)" />
                    <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
                    <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
                    <use xlink:href="#gentle-wave" x="48" y="7" fill="rgba(255,255,255,0.9)" />
                </g>
            </svg>
        `;
    } else {
        // Canvas for Spring, Autumn, Winter
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        effectContainer.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        
        let particles = [];
        const maxParticles = 40;

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height; // initial random spread
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -50;
                this.size = Math.random() * 5 + 2;
                
                if(season === 'spring') {
                    this.size = Math.random() * 6 + 4;
                    this.speedY = Math.random() * 1.5 + 0.5;
                    this.color = 'rgba(255, 183, 197, 0.7)'; // Sakura pink
                } else if(season === 'autumn') {
                    this.size = Math.random() * 8 + 4;
                    this.speedY = Math.random() * 1.5 + 0.8;
                    this.color = Math.random() > 0.5 ? 'rgba(216, 67, 21, 0.7)' : 'rgba(239, 108, 0, 0.7)'; // Orange/Red
                } else { // winter
                    this.size = Math.random() * 3 + 1.5;
                    this.speedY = Math.random() * 1 + 0.5;
                    this.color = 'rgba(255, 255, 255, 0.8)'; // Snow white
                }
                
                this.speedX = (Math.random() - 0.5) * 1;
                this.angle = Math.random() * Math.PI * 2;
                this.spin = (Math.random() - 0.5) * 0.1;
            }
            update() {
                this.y += this.speedY;
                this.x += this.speedX + Math.sin(this.angle) * 0.5;
                this.angle += this.spin;

                if (this.y > canvas.height + 50 || this.x < -50 || this.x > canvas.width + 50) {
                    this.reset();
                }
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.fillStyle = this.color;
                
                if (season === 'winter') {
                    // Snow
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                    ctx.fill();
                } else if (season === 'spring') {
                    // Sakura petal
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.quadraticCurveTo(this.size, -this.size, this.size * 2, 0);
                    ctx.quadraticCurveTo(this.size, this.size, 0, 0);
                    ctx.fill();
                } else if (season === 'autumn') {
                    // Autumn leaf (simple diamond/kite shape)
                    ctx.beginPath();
                    ctx.moveTo(0, -this.size);
                    ctx.lineTo(this.size/1.5, 0);
                    ctx.lineTo(0, this.size);
                    ctx.lineTo(-this.size/1.5, 0);
                    ctx.closePath();
                    ctx.fill();
                }
                ctx.restore();
            }
        }

        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }
});
