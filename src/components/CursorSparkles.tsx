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

  const colors = ['#085B86', '#F59121', '#ffffff', '#38bdf8', '#fbbf24'];

  const createSparkle = (x: number, y: number): Sparkle => ({
    id: Math.random(),
    x: x + (Math.random() - 0.5) * 30,
    y: y + (Math.random() - 0.5) * 30,
    size: Math.random() * 8 + 4,
    opacity: 1,
    color: colors[Math.floor(Math.random() * colors.length)],
    duration: Math.random() * 1000 + 500
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
        // Create more frequent sparkles on hover
        sparkleInterval = setInterval(() => {
          setSparkles(prev => [...prev, createSparkle(e.clientX, e.clientY)]);
        }, 100);
      } else if (!isInteractive && isHovering) {
        isHovering = false;
        clearInterval(sparkleInterval);
      }

      // Occasional sparkles during normal movement
      if (Math.random() < 0.1 && !isHovering) {
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
      {/* Cursor Trail */}
      <div 
        className="fixed w-8 h-8 pointer-events-none transition-all duration-100 ease-out"
        style={{ 
          left: mousePosition.x - 16, 
          top: mousePosition.y - 16,
          background: 'radial-gradient(circle, rgba(8, 91, 134, 0.3) 0%, rgba(245, 145, 33, 0.2) 50%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(4px)'
        }}
      />

      {/* Sparkles */}
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="fixed pointer-events-none animate-sparkle"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            width: sparkle.size,
            height: sparkle.size,
            backgroundColor: sparkle.color,
            borderRadius: '50%',
            boxShadow: `0 0 ${sparkle.size * 2}px ${sparkle.color}`,
            animation: `sparkle-fade ${sparkle.duration}ms ease-out forwards`,
          }}
        />
      ))}
    </div>
  );
};

export default CursorSparkles;