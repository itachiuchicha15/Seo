import React, { useRef, useEffect } from 'react';

interface ParticleNetworkProps {
    isAnimating: boolean;
}

// FIX: Moved Particle class outside the component to fix scope issues.
class Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    canvasWidth: number;
    canvasHeight: number;

    constructor(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
    }

    update() {
        if (this.x > this.canvasWidth || this.x < 0) this.speedX *= -1;
        if (this.y > this.canvasHeight || this.y < 0) this.speedY *= -1;
        this.x += this.speedX;
        this.y += this.speedY;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = '#6B7280'; // muted (gray-500)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}


const ParticleNetwork: React.FC<ParticleNetworkProps> = ({ isAnimating }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // FIX: Provided initial value to useRef to fix "Expected 1 arguments, but got 0" error.
    const animationFrameId = useRef<number | undefined>(undefined);
    const particles = useRef<Particle[]>([]);
    const mouse = useRef({ x: -1000, y: -1000, radius: 100 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const connect = () => {
            if(!ctx) return;
            let opacityValue = 1;
            for (let a = 0; a < particles.current.length; a++) {
                for (let b = a; b < particles.current.length; b++) {
                    const dx = particles.current[a].x - particles.current[b].x;
                    const dy = particles.current[a].y - particles.current[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        opacityValue = 1 - (distance / 120);
                        ctx.strokeStyle = `rgba(107, 114, 128, ${opacityValue})`; // muted (gray-500)
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles.current[a].x, particles.current[a].y);
                        ctx.lineTo(particles.current[b].x, particles.current[b].y);
                        ctx.stroke();
                    }
                }
            }
            // Mouse interaction
            for (let i = 0; i < particles.current.length; i++) {
                const dx = particles.current[i].x - mouse.current.x;
                const dy = particles.current[i].y - mouse.current.y;
                const distance = Math.sqrt(dx*dx + dy*dy);
                if (distance < mouse.current.radius) {
                    ctx.strokeStyle = `rgba(245, 158, 11, ${1 - distance/mouse.current.radius})`; // primary
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(mouse.current.x, mouse.current.y);
                    ctx.lineTo(particles.current[i].x, particles.current[i].y);
                    ctx.stroke();
                }
            }
        };
        
        const animate = () => {
            if(!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const particle of particles.current) {
                particle.update();
                // FIX: Pass context to draw method.
                particle.draw(ctx);
            }
            connect();
            animationFrameId.current = requestAnimationFrame(animate);
        };
        
        const startAnimation = () => {
            if (!animationFrameId.current) {
                animate();
            }
        };

        const stopAnimation = () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
                animationFrameId.current = undefined;
            }
        };

        if(isAnimating) {
            startAnimation();
        } else {
            stopAnimation();
        }

        return () => stopAnimation();

    }, [isAnimating]);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const setupCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
        };

        const init = () => {
            particles.current = [];
            const numberOfParticles = (canvas.width * canvas.height) / 15000; // Reduced density
            for (let i = 0; i < numberOfParticles; i++) {
                // FIX: Correctly instantiate Particle with canvas dimensions.
                particles.current.push(new Particle(canvas.width, canvas.height));
            }
        };

        const handleResize = () => {
            setupCanvas();
            init();
        };
        
        const handleMouseMove = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.current.x = event.clientX - rect.left;
            mouse.current.y = event.clientY - rect.top;
        };
        
        const handleMouseLeave = () => {
            mouse.current.x = -1000;
            mouse.current.y = -1000;
        };

        setupCanvas();
        init();

        window.addEventListener('resize', handleResize);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            if(canvas) {
              canvas.removeEventListener('mousemove', handleMouseMove);
              canvas.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [])

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 z-0 w-full h-full"
        />
    );
};

export default ParticleNetwork;