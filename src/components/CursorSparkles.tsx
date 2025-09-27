import React, { useEffect, useState } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  duration: number;
}

const CursorSparkles = () => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const colors = [
    '#085B86', '#F59121', '#ffffff', '#38bdf8', '#fbbf24', 
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b',
    '#eb4d4b', '#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e'
  ];

  const createSparkle = (x: number, y: number): Sparkle => ({
    id: Math.random(),
    x: x + (Math.random() - 0.5) * 50,
    y: y + (Math.random() - 0.5) * 50,
    size: Math.random() * 12 + 6,
    opacity: Math.random() * 0.8 + 0.2,
    color: colors[Math.floor(Math.random() * colors.length)],
    duration: Math.random() * 1500 + 800
  });

  useEffect(() => {
    let sparkleInterval: NodeJS.Timeout;
    let isHovering = false;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      const isInteractive = target.tagName === 'BUTTON' || 
                          target.tagName === 'A' || 
                          target.closest('button') || 
                          target.closest('a') || 
                          target.closest('[role="button"]') ||
                          target.classList.contains('cursor-pointer');

      if (isInteractive && !isHovering) {
        isHovering = true;
        // Create much more frequent sparkles on hover
        sparkleInterval = setInterval(() => {
          // Create multiple sparkles at once for more dramatic effect
          for (let i = 0; i < 3; i++) {
            setSparkles(prev => [...prev, createSparkle(e.clientX, e.clientY)]);
          }
        }, 50);
      } else if (!isInteractive && isHovering) {
        isHovering = false;
        clearInterval(sparkleInterval);
      }

      // More frequent sparkles during normal movement
      if (Math.random() < 0.3 && !isHovering) {
        setSparkles(prev => [...prev, createSparkle(e.clientX, e.clientY)]);
      }
    };

    const handleMouseLeave = () => {
      isHovering = false;
      clearInterval(sparkleInterval);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearInterval(sparkleInterval);
    };
  }, []);

  useEffect(() => {
    const cleanup = setInterval(() => {
      setSparkles(prev => prev.filter(sparkle => 
        Date.now() - sparkle.id < sparkle.duration
      ));
    }, 50);

    return () => clearInterval(cleanup);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Enhanced Cursor Trail */}
      <div 
        className="fixed w-12 h-12 pointer-events-none transition-all duration-75 ease-out animate-pulse"
        style={{ 
          left: mousePosition.x - 24, 
          top: mousePosition.y - 24,
          background: 'radial-gradient(circle, rgba(8, 91, 134, 0.6) 0%, rgba(245, 145, 33, 0.4) 40%, rgba(255, 255, 255, 0.2) 70%, transparent 100%)',
          borderRadius: '50%',
          filter: 'blur(2px)',
          boxShadow: '0 0 20px rgba(245, 145, 33, 0.6), 0 0 40px rgba(8, 91, 134, 0.4)'
        }}
      />
      
      {/* Secondary glow effect */}
      <div 
        className="fixed w-6 h-6 pointer-events-none transition-all duration-50 ease-out"
        style={{ 
          left: mousePosition.x - 12, 
          top: mousePosition.y - 12,
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(245, 145, 33, 0.6) 50%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(1px)',
          boxShadow: '0 0 15px rgba(255, 255, 255, 0.8)'
        }}
      />

      {/* Enhanced Sparkles */}
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="fixed pointer-events-none"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            width: sparkle.size,
            height: sparkle.size,
            backgroundColor: sparkle.color,
            borderRadius: '50%',
            boxShadow: `
              0 0 ${sparkle.size * 3}px ${sparkle.color},
              0 0 ${sparkle.size * 6}px ${sparkle.color}80,
              0 0 ${sparkle.size * 9}px ${sparkle.color}40,
              inset 0 0 ${sparkle.size}px rgba(255, 255, 255, 0.8)
            `,
            filter: `brightness(1.5) saturate(1.8)`,
            animation: `sparkle-fade ${sparkle.duration}ms ease-out forwards`,
            opacity: sparkle.opacity,
          }}
        >
          {/* Inner glow */}
          <div 
            className="absolute inset-0 rounded-full animate-pulse"
            style={{
              background: `radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, ${sparkle.color} 40%, transparent 70%)`,
              filter: 'blur(1px)'
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default CursorSparkles;