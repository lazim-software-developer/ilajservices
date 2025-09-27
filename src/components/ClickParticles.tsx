import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  velocityX: number;
  velocityY: number;
  color: string;
  opacity: number;
  lifetime: number;
  maxLifetime: number;
  shape: 'star' | 'circle' | 'sparkle';
}

const ClickParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const colors = ['#FFD700', '#C0C0C0', '#FFFFFF', '#FFA500', '#87CEEB', '#FF69B4'];
  const shapes: ('star' | 'circle' | 'sparkle')[] = ['star', 'circle', 'sparkle'];

  const createParticle = (x: number, y: number): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 3 + 2;
    const lifetime = Math.random() * 600 + 600; // 0.6-1.2 seconds in ms
    
    return {
      id: Math.random(),
      x,
      y,
      size: Math.random() * 4 + 2, // 2-6px
      velocityX: Math.cos(angle) * velocity,
      velocityY: Math.sin(angle) * velocity - Math.random() * 2, // Slight upward bias
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1,
      lifetime: 0,
      maxLifetime: lifetime,
      shape: shapes[Math.floor(Math.random() * shapes.length)]
    };
  };

  const createParticleBurst = (x: number, y: number) => {
    const particleCount = Math.floor(Math.random() * 11) + 15; // 15-25 particles
    const newParticles = Array.from({ length: particleCount }, () => createParticle(x, y));
    setParticles(prev => [...prev, ...newParticles]);
  };

  const addShimmerEffect = (element: HTMLElement) => {
    element.style.transform = 'scale(0.95)';
    element.style.transition = 'transform 0.1s ease-out';
    
    setTimeout(() => {
      element.style.transform = 'scale(1.05)';
      setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.transition = '';
      }, 100);
    }, 50);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if clicked element is a button, link, or has cursor-pointer class
      if (target.tagName === 'BUTTON' || 
          target.tagName === 'A' || 
          target.closest('button') || 
          target.closest('a') || 
          target.closest('[role="button"]') ||
          target.classList.contains('cursor-pointer')) {
        
        const rect = target.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;
        
        createParticleBurst(x, y);
        
        // Add shimmer effect to the clicked element
        const clickedElement = target.closest('button') || target.closest('a') || target;
        if (clickedElement) {
          addShimmerEffect(clickedElement as HTMLElement);
        }
      }
    };

    // Use event delegation for better performance and dynamic element support
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev => 
        prev.map(particle => {
          const newLifetime = particle.lifetime + 16; // ~60fps
          const progress = newLifetime / particle.maxLifetime;
          
          return {
            ...particle,
            x: particle.x + particle.velocityX,
            y: particle.y + particle.velocityY + (progress * 2), // Gravity effect
            velocityY: particle.velocityY + 0.1, // Gravity acceleration
            opacity: Math.max(0, 1 - progress),
            lifetime: newLifetime
          };
        }).filter(particle => particle.lifetime < particle.maxLifetime)
      );
    };

    const interval = setInterval(animateParticles, 16); // ~60fps
    return () => clearInterval(interval);
  }, []);

  const renderParticle = (particle: Particle) => {
    const baseStyle = {
      position: 'fixed' as const,
      left: particle.x - particle.size / 2,
      top: particle.y - particle.size / 2,
      width: particle.size,
      height: particle.size,
      opacity: particle.opacity,
      pointerEvents: 'none' as const,
      zIndex: 9999,
      filter: `drop-shadow(0 0 ${particle.size}px ${particle.color})`,
    };

    switch (particle.shape) {
      case 'star':
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              backgroundColor: particle.color,
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            }}
          />
        );
      case 'circle':
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              backgroundColor: particle.color,
              borderRadius: '50%',
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
          />
        );
      case 'sparkle':
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              backgroundColor: particle.color,
              clipPath: 'polygon(50% 0%, 59% 41%, 100% 50%, 59% 59%, 50% 100%, 41% 59%, 0% 50%, 41% 41%)',
              animation: `spin ${particle.maxLifetime}ms linear infinite`,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(renderParticle)}
    </div>
  );
};

export default ClickParticles;