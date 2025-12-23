import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
}

export function Stars() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // 화면 크기에 따라 별 개수 조정 (30~50개)
    const starCount = Math.floor(Math.random() * 21) + 30;
    const newStars: Star[] = Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // 화면 너비의 0~100%
      y: Math.random() * 60, // 화면 높이의 0~60% (상단 부분)
      size: Math.random() * 3 + 1, // 1~4px
      opacity: Math.random() * 0.5 + 0.3, // 0.3~0.8
      twinkleSpeed: Math.random() * 2 + 1, // 1~3초
    }));
    setStars(newStars);
  }, []);

  return (
    <>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          style={{
            position: 'fixed',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            zIndex: 8,
            pointerEvents: 'none',
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`,
          }}
          animate={{
            opacity: [star.opacity * 0.3, star.opacity, star.opacity * 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.twinkleSpeed,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  );
}

