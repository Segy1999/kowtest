import React, { useEffect, useState } from 'react';

interface CelestialObject {
  id: number;
  style: React.CSSProperties;
  angle: number;
  speed: number;
  isComet: boolean;
}

const ShootingStar = () => {
  const [celestialObjects, setCelestialObjects] = useState<CelestialObject[]>([]);
  
  const generateStartPosition = () => {
    const edge = Math.floor(Math.random() * 3);
    let startX, startY, angle;
    
    switch (edge) {
      case 0: // top
        startX = Math.random() * window.innerWidth;
        startY = -20;
        angle = 30 + Math.random() * 30;
        break;
      case 1: // left
        startX = -20;
        startY = Math.random() * (window.innerHeight / 2);
        angle = 15 + Math.random() * 30;
        break;
      case 2: // right
        startX = window.innerWidth + 20;
        startY = Math.random() * (window.innerHeight / 2);
        angle = 195 + Math.random() * 30;
        break;
      default:
        startX = -20;
        startY = Math.random() * (window.innerHeight / 2);
        angle = 30 + Math.random() * 30;
    }
    
    return { startX, startY, angle };
  };

  const createCelestialObject = (forceComet = false) => {
    const { startX, startY, angle } = generateStartPosition();
    const isComet = forceComet || Math.random() < 0.2;
    const baseSize = isComet ? 5 + Math.random() * 2 : 2 + Math.random() * 2;
    const speed = isComet ? 4 + Math.random() : 3.2 + Math.random() * 0.6;
    
    return {
      id: Date.now(),
      style: {
        position: 'fixed',
        left: `${startX}px`,
        top: `${startY}px`,
        width: `${baseSize}px`,
        height: `${baseSize}px`,
        transform: `translate(0, 0) rotate(${angle}deg)`,
        opacity: 1,
        transition: `all ${speed}s linear`,
        zIndex: isComet ? 2 : 1,
      } as React.CSSProperties,
      angle,
      speed,
      isComet
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.7) {
        const newObject = createCelestialObject();
        setCelestialObjects(prev => [...prev, newObject]);
        
        requestAnimationFrame(() => {
          const element = document.getElementById(`celestial-${newObject.id}`);
          if (element) {
            const computedStyle = window.getComputedStyle(element);
            const startX = parseFloat(computedStyle.left);
            const startY = parseFloat(computedStyle.top);
            
            const distance = Math.max(window.innerWidth, window.innerHeight) * 1.5;
            const endX = startX + distance * Math.cos(newObject.angle * Math.PI / 180);
            const endY = startY + distance * Math.sin(newObject.angle * Math.PI / 180);
            
            element.style.transform = `translate(${endX - startX}px, ${endY - startY}px) rotate(${newObject.angle}deg)`;
            element.style.opacity = '0';
          }
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cleanup = setInterval(() => {
      setCelestialObjects(prev => prev.filter(obj => Date.now() - obj.id < obj.speed * 1000));
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {celestialObjects.map(obj => (
        <div
          key={obj.id}
          id={`celestial-${obj.id}`}
          className="will-change-transform"
          style={obj.style}
        >
          <div className="relative">
            {/* Main celestial body */}
            <div
              className="absolute rounded-full"
              style={{
                width: '100%',
                height: '100%',
                background: obj.isComet ? 'linear-gradient(45deg, #fff, #ffd700)' : 'white',
                boxShadow: obj.isComet 
                  ? '0 0 8px 4px rgba(255, 255, 255, 0.8)'
                  : '0 0 4px 2px rgba(255, 255, 255, 0.8)'
              }}
            />
            
            {/* Trailing tail */}
            <div
              className="absolute origin-right"
              style={{
                top: '50%',
                right: '100%',
                width: obj.isComet ? '150px' : '100px',
                height: obj.isComet ? '3px' : '2px',
                transformOrigin: 'right center',
                background: obj.isComet
                  ? 'linear-gradient(to left, rgba(255,165,0,0.8), rgba(255,69,0,0.4) 40%, rgba(255,69,0,0.1) 70%, transparent)'
                  : 'linear-gradient(to left, rgba(255,255,255,0.8), rgba(255,255,255,0.4) 40%, rgba(255,255,255,0.1) 70%, transparent)',
                filter: 'blur(1px)',
              }}
            />
            
            {/* Additional glow effect for comets */}
            {obj.isComet && (
              <div
                className="absolute"
                style={{
                  width: '200%',
                  height: '200%',
                  top: '-50%',
                  right: '-50%',
                  background: 'radial-gradient(circle at 75% 50%, rgba(255,165,0,0.4) 0%, rgba(255,69,0,0.1) 50%, transparent 70%)',
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShootingStar;