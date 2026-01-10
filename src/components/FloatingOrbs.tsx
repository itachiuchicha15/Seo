import React from 'react';
import { Search, TrendingUp, BarChart2, Target, Zap, Globe, Share2, MousePointer } from 'lucide-react';

/**
 * FloatingOrbs - Mobile Hero Background Animation
 * Floating digital marketing icons that rise slowly from bottom
 * Creates a professional, SEO/marketing-themed ambiance
 */
const FloatingOrbs: React.FC = () => {
    // Digital marketing themed icons with fixed positions
    const icons = [
        { id: 1, Icon: Search, x: 8, delay: 0, duration: 12, size: 24 },
        { id: 2, Icon: TrendingUp, x: 25, delay: 2, duration: 15, size: 20 },
        { id: 3, Icon: BarChart2, x: 45, delay: 1, duration: 14, size: 22 },
        { id: 4, Icon: Target, x: 65, delay: 3, duration: 13, size: 18 },
        { id: 5, Icon: Globe, x: 82, delay: 0.5, duration: 16, size: 24 },
        { id: 6, Icon: Share2, x: 15, delay: 4, duration: 14, size: 20 },
        { id: 7, Icon: Zap, x: 55, delay: 2.5, duration: 12, size: 18 },
        { id: 8, Icon: MousePointer, x: 92, delay: 1.5, duration: 15, size: 22 },
    ];

    return (
        <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ zIndex: 1 }}
            aria-hidden="true"
        >
            {icons.map((item) => (
                <div
                    key={item.id}
                    className="absolute"
                    style={{
                        left: `${item.x}%`,
                        bottom: '-50px',
                        animation: `floatUp ${item.duration}s ease-in-out ${item.delay}s infinite`,
                    }}
                >
                    <item.Icon
                        size={item.size}
                        className="text-primary"
                        style={{ opacity: 0.45 }}
                        strokeWidth={1.5}
                    />
                </div>
            ))}
        </div>
    );
};

export default FloatingOrbs;
