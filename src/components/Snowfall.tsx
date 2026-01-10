import React from 'react';

/**
 * Snowfall Effect Component
 * A lightweight CSS-based snow animation for the hero section.
 * Uses pure CSS animations for optimal performance.
 */
const Snowfall: React.FC = () => {
    // Generate 30 snowflakes with varied properties
    const snowflakes = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 7,
        size: 4 + Math.random() * 6,
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]" aria-hidden="true">
            {snowflakes.map((flake) => (
                <div
                    key={flake.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${flake.left}%`,
                        top: 0,
                        width: `${flake.size}px`,
                        height: `${flake.size}px`,
                        backgroundColor: '#005DAA',
                        opacity: 0.5,
                        animation: `snowfall ${flake.duration}s linear ${flake.delay}s infinite`,
                    }}
                />
            ))}
        </div>
    );
};

export default Snowfall;
