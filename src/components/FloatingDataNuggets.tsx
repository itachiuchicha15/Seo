import React, { useRef, useEffect } from 'react';
import { getThemeColor, hexToRgba } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';

// --- Configuration ---
const NUGGET_CONTENT = [
    { type: 'rank', text: 'SERP Rank: 87' },
    { type: 'click', text: '+1 Click' },
    { type: 'impression', text: '+78 Impressions' },
    { type: 'keyword', text: 'Keyword Strategy' },
    { type: 'seo', text: 'On-Page SEO' },
    { type: 'link', text: 'Backlink Analysis' },
    { type: 'content', text: 'Content Velocity' },
    { type: 'search', text: 'Google Indexing' },
    { type: 'ctr', text: 'CTR: 2.1%' },
    { type: 'schema', text: 'Schema Markup' },
    { type: 'speed', text: 'Page Speed: 92' },
    { type: 'audit', text: 'Tech Audit' },
];

const SPAWN_INTERVAL = 2500; 
const MOUSE_REPULSION_RADIUS = 120;
const MOUSE_REPULSION_STRENGTH = 3;

// --- Helper Functions ---
const drawIcon = (ctx: CanvasRenderingContext2D, type: string, x: number, y: number, size: number, opacity: number, colorHex: string) => {
    ctx.strokeStyle = hexToRgba(colorHex, opacity);
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    const s = size; 
    switch (type) {
        case 'rank': 
            ctx.moveTo(x + s * 0.1, y + s);
            ctx.lineTo(x + s * 0.1, y + s * 0.6);
            ctx.lineTo(x + s * 0.5, y + s * 0.2);
            ctx.lineTo(x + s * 0.9, y + s * 0.6);
            ctx.lineTo(x + s * 0.9, y + s);
            ctx.moveTo(x + s * 0.5, y + s * 0.2);
            ctx.lineTo(x + s * 0.5, y);
            break;
        case 'click': 
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + s);
            ctx.lineTo(x + s * 0.3, y + s * 0.8);
            ctx.lineTo(x + s * 0.6, y + s);
            ctx.lineTo(x + s * 0.8, y + s * 0.3);
            ctx.closePath();
            break;
        case 'impression': 
            ctx.ellipse(x + s / 2, y + s / 2, s / 2, s / 3.5, 0, 0, Math.PI * 2);
            ctx.moveTo(x + s * 0.8, y + s / 2);
            ctx.arc(x + s / 2, y + s / 2, s / 5, 0, Math.PI * 2);
            break;
        case 'link': 
            ctx.arc(x + s * 0.3, y + s / 2, s * 0.25, Math.PI * 0.5, Math.PI * 1.5);
            ctx.arc(x + s * 0.7, y + s / 2, s * 0.25, Math.PI * 1.5, Math.PI * 0.5);
            ctx.moveTo(x + s * 0.3, y + s * 0.25);
            ctx.lineTo(x + s * 0.7, y + s * 0.25);
            ctx.moveTo(x + s * 0.3, y + s * 0.75);
            ctx.lineTo(x + s * 0.7, y + s * 0.75);
            break;
        case 'search': 
            ctx.arc(x + s * 0.45, y + s * 0.45, s * 0.35, 0, Math.PI * 2);
            ctx.moveTo(x + s * 0.7, y + s * 0.7);
            ctx.lineTo(x + s, y + s);
            break;
        case 'keyword': 
            ctx.arc(x + s * 0.25, y + s * 0.25, s * 0.2, 0, Math.PI * 2);
            ctx.moveTo(x + s * 0.4, y + s * 0.4);
            ctx.lineTo(x + s * 0.8, y + s * 0.8);
            ctx.moveTo(x + s * 0.7, y + s);
            ctx.lineTo(x + s, y + s * 0.7);
            break;
        case 'seo': 
            ctx.moveTo(x + s/2, y);
            ctx.lineTo(x + s, y + s * 0.75);
            ctx.quadraticCurveTo(x + s/2, y + s, x, y + s * 0.75);
            ctx.closePath();
            ctx.moveTo(x + s * 0.2, y + s * 0.8);
            ctx.lineTo(x - s * 0.1, y + s * 1.1);
            ctx.moveTo(x + s * 0.8, y + s * 0.8);
            ctx.lineTo(x + s * 1.1, y + s * 1.1);
            break;
        case 'content': 
            ctx.rect(x, y, s, s);
            ctx.moveTo(x + s * 0.2, y + s * 0.3);
            ctx.lineTo(x + s * 0.8, y + s * 0.3);
            ctx.moveTo(x + s * 0.2, y + s * 0.7);
            ctx.lineTo(x + s * 0.5, y + s * 0.7);
            break;
        case 'ctr': 
            ctx.arc(x + s * 0.2, y + s * 0.2, s * 0.15, 0, Math.PI * 2);
            ctx.arc(x + s * 0.8, y + s * 0.8, s * 0.15, 0, Math.PI * 2);
            ctx.moveTo(x + s * 0.1, y + s * 0.9);
            ctx.lineTo(x + s * 0.9, y + s * 0.1);
            break;
        case 'schema': 
             ctx.moveTo(x + s * 0.3, y);
             ctx.lineTo(x, y + s/2);
             ctx.lineTo(x + s * 0.3, y + s);
             ctx.moveTo(x + s * 0.7, y);
             ctx.lineTo(x + s, y + s/2);
             ctx.lineTo(x + s * 0.7, y + s);
             break;
        case 'speed': 
             ctx.moveTo(x + s * 0.5, y);
             ctx.lineTo(x, y + s * 0.6);
             ctx.lineTo(x + s * 0.4, y + s * 0.6);
             ctx.lineTo(x - s*0.1, y + s);
             ctx.lineTo(x + s, y + s * 0.4);
             ctx.lineTo(x + s * 0.6, y + s * 0.4);
             ctx.closePath();
             break;
        case 'audit': 
             ctx.rect(x, y + s * 0.1, s, s * 0.9);
             ctx.rect(x + s * 0.2, y, s*0.6, s*0.3);
             break;
        default:
            return;
    }
    ctx.stroke();
};

const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
};

// --- Nugget Class ---
class Nugget {
    id: number;
    content: { type: string; text: string; };
    x: number;
    y: number;
    size: number;
    vx: number;
    vy: number;
    base_vy: number;
    opacity: number;
    base_opacity: number;
    angle: number;
    waveOffset: number;
    width: number = 0;
    height: number;

    // Theme colors
    lightColor: string;
    secondaryColor: string;
    primaryColor: string;
    darkColor: string;
    mutedColor: string;

    constructor(canvasWidth: number, canvasHeight: number, ctx: CanvasRenderingContext2D, colors: { light: string, secondary: string, primary: string, dark: string, muted: string }) {
        this.id = Math.random();
        this.content = NUGGET_CONTENT[Math.floor(Math.random() * NUGGET_CONTENT.length)];
        this.lightColor = colors.light;
        this.secondaryColor = colors.secondary;
        this.primaryColor = colors.primary;
        this.darkColor = colors.dark;
        this.mutedColor = colors.muted;
        
        this.size = Math.random() * 0.5 + 0.7; 
        this.base_opacity = this.size * 0.7;
        this.opacity = this.base_opacity;
        this.y = canvasHeight + 50;
        this.x = Math.random() * canvasWidth;
        
        this.base_vy = -(Math.random() * 0.15 + 0.1) * this.size; 
        this.vy = this.base_vy;
        this.vx = (Math.random() - 0.5) * 0.2;

        this.angle = 0;
        this.waveOffset = Math.random() * Math.PI * 2;
        
        const fontSize = 12 * this.size;
        ctx.font = `500 ${fontSize}px 'Roboto Mono', monospace`;
        const textMetrics = ctx.measureText(this.content.text);
        this.width = textMetrics.width + 24 + 20; 
        this.height = fontSize + 16;
    }

    update(canvasHeight: number, mouse: { x: number; y: number }) {
        this.y += this.vy;
        this.angle += 0.02;
        this.x += this.vx + Math.sin(this.angle + this.waveOffset) * 0.2;
        
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < MOUSE_REPULSION_RADIUS) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (MOUSE_REPULSION_RADIUS - distance) / MOUSE_REPULSION_RADIUS;
            this.vx += forceDirectionX * force * MOUSE_REPULSION_STRENGTH;
            this.vy += forceDirectionY * force * MOUSE_REPULSION_STRENGTH;
        }

        this.vx *= 0.98;
        this.vy += (this.base_vy - this.vy) * 0.05;

        const fadeStartHeight = canvasHeight * 0.8;
        if (this.y < fadeStartHeight) {
            this.opacity = this.base_opacity * (this.y / fadeStartHeight);
        } else {
            this.opacity = this.base_opacity;
        }
        this.opacity = Math.max(0, this.opacity);


        if (this.y < -50) this.y = canvasHeight + 50;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        
        ctx.shadowColor = hexToRgba(this.darkColor, 0.1); 
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 4;
        
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, hexToRgba('#FFFFFF', this.opacity * 0.95));
        gradient.addColorStop(1, hexToRgba(this.lightColor, this.opacity * 0.95));
        
        ctx.fillStyle = gradient;
        ctx.strokeStyle = hexToRgba(this.mutedColor, this.opacity * 0.3); 
        ctx.lineWidth = 1;
        drawRoundedRect(ctx, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height, this.height / 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();

        const fontSize = 12 * this.size;
        ctx.font = `600 ${fontSize}px 'Roboto Mono', monospace`;
        ctx.fillStyle = hexToRgba(this.darkColor, this.opacity); 
        
        const contentStartX = this.x - this.width / 2 + 12;
        const iconY = this.y - (fontSize / 1.5);
        const textY = this.y + fontSize / 3;

        drawIcon(ctx, this.content.type, contentStartX, iconY, fontSize * 1.2, this.opacity, this.primaryColor);
        ctx.fillText(this.content.text, contentStartX + 20, textY);
    }
}


const FloatingDataNuggets: React.FC<{ isAnimating: boolean }> = ({ isAnimating }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nuggetsRef = useRef<Nugget[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const animationFrameId = useRef<number | undefined>(undefined);
    const spawnIntervalId = useRef<number | undefined>(undefined);
    const { theme } = useTheme();
    
    // Theme Colors Refs
    const colors = useRef({ light: '#FEFAE0', secondary: '#BC6C25', primary: '#606C38', dark: '#283618', muted: '#DDA15E' });

    useEffect(() => {
        colors.current = {
            light: getThemeColor('light', '#FEFAE0'),
            secondary: getThemeColor('secondary', '#BC6C25'),
            primary: getThemeColor('primary', '#606C38'),
            dark: getThemeColor('dark', '#283618'),
            muted: getThemeColor('muted', '#DDA15E')
        };
        // Re-init nuggets on theme change to update colors
        nuggetsRef.current = [];
    }, [theme]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const dimensions = { width: 0, height: 0 };
        
        const setupCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            dimensions.width = rect.width;
            dimensions.height = rect.height;
        };
        
        setupCanvas();

        const spawnNugget = () => {
            if (nuggetsRef.current.length < (dimensions.width * dimensions.height) / 35000) { 
                 nuggetsRef.current.push(new Nugget(dimensions.width, dimensions.height, ctx, colors.current));
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            nuggetsRef.current.forEach(nugget => {
                nugget.update(dimensions.height, mouseRef.current);
                nugget.draw(ctx);
            });

            nuggetsRef.current = nuggetsRef.current.filter(n => n.y > -60);
            
            animationFrameId.current = requestAnimationFrame(animate);
        };
        
        const startAnimation = () => {
            if (!animationFrameId.current) {
                animate();
            }
            if (!spawnIntervalId.current) {
                spawnIntervalId.current = window.setInterval(spawnNugget, SPAWN_INTERVAL);
            }
        };

        const stopAnimation = () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
                animationFrameId.current = undefined;
            }
            if (spawnIntervalId.current) {
                clearInterval(spawnIntervalId.current);
                spawnIntervalId.current = undefined;
            }
        };
        
        if (isAnimating) {
            startAnimation();
        } else {
            stopAnimation();
        }

        const handleResize = () => {
            setupCanvas();
            nuggetsRef.current = nuggetsRef.current.filter(n => n.x < dimensions.width && n.y < dimensions.height);
        };

        const handleMouseMove = (event: MouseEvent) => {
             const rect = canvas.getBoundingClientRect();
             mouseRef.current.x = event.clientX - rect.left;
             mouseRef.current.y = event.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        window.addEventListener('resize', handleResize);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            stopAnimation();
            window.removeEventListener('resize', handleResize);
            if (canvas) {
                canvas.removeEventListener('mousemove', handleMouseMove);
                canvas.removeEventListener('mouseleave', handleMouseLeave);
            }
        };

    }, [isAnimating, theme]);

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 z-[8] w-full h-full pointer-events-auto"
        />
    );
};

export default FloatingDataNuggets;