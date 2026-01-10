import React, { useRef, useEffect } from 'react';
import { getThemeColor } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';

interface ParticleNetworkProps {
    isAnimating: boolean;
}

class Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    canvasWidth: number;
    canvasHeight: number;
    color: string;

    constructor(canvasWidth: number, canvasHeight: number, color: string) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.color = color;
    }

    update() {
        if (this.x > this.canvasWidth || this.x < 0) this.speedX *= -1;
        if (this.y > this.canvasHeight || this.y < 0) this.speedY *= -1;
        this.x += this.speedX;
        this.y += this.speedY;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}


const ParticleNetwork: React.FC<ParticleNetworkProps> = ({ isAnimating }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number | undefined>(undefined);
    const particles = useRef<Particle[]>([]);
    const mouse = useRef({ x: -1000, y: -1000, radius: 100 });
    const { theme } = useTheme();

    // Fetch colors from theme
    const mutedColor = useRef('#DDA15E'); 
    const primaryColor = useRef('#606C38');

    useEffect(() => {
        mutedColor.current = getThemeColor('muted', '#DDA15E');
        primaryColor.current = getThemeColor('primary', '#606C38');
    }, [theme]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const connect = () => {
            if(!ctx) return;
            let opacityValue = 1;
            
            // Parse base RGB for muted color line
            const mHex = mutedColor.current;
            const mr = parseInt(mHex.slice(1, 3), 16);
            const mg = parseInt(mHex.slice(3, 5), 16);
            const mb = parseInt(mHex.slice(5, 7), 16);

            // Parse base RGB for primary color line
            const pHex = primaryColor.current;
            const pr = parseInt(pHex.slice(1, 3), 16);
            const pg = parseInt(pHex.slice(3, 5), 16);
            const pb = parseInt(pHex.slice(5, 7), 16);

            for (let a = 0; a < particles.current.length; a++) {
                for (let b = a; b < particles.current.length; b++) {
                    const dx = particles.current[a].x - particles.current[b].x;
                    const dy = particles.current[a].y - particles.current[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        opacityValue = 1 - (distance / 120);
                        ctx.strokeStyle = `rgba(${mr}, ${mg}, ${mb}, ${opacityValue * 0.4})`; 
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
                    ctx.strokeStyle = `rgba(${pr}, ${pg}, ${pb}, ${1 - distance/mouse.current.radius})`; 
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

    }, [isAnimating, theme]);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const setupCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
        };

        const init = () => {
            particles.current = [];
            const numberOfParticles = (canvas.width * canvas.height) / 15000; 
            for (let i = 0; i < numberOfParticles; i++) {
                particles.current.push(new Particle(canvas.width, canvas.height, mutedColor.current));
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
    }, [theme])

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 z-0 w-full h-full"
        />
    );
};

export default ParticleNetwork;