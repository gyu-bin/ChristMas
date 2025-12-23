import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function ChristmasCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      let christmas = new Date(currentYear, 11, 25, 0, 0, 0); // 12월 25일

      // 올해 크리스마스가 지났으면 내년 크리스마스로
      if (now > christmas) {
        christmas = new Date(currentYear + 1, 11, 25, 0, 0, 0);
      }

      const difference = christmas.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: isMobile ? '70px' : '120px',
        left: isMobile ? '10px' : '20px',
        zIndex: 50,
        background: 'rgba(26, 26, 46, 0.8)',
        backdropFilter: 'blur(10px)',
        padding: isMobile ? '10px 12px' : '15px 20px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#ffffff',
        fontFamily: 'monospace',
        fontSize: isMobile ? '11px' : '14px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div style={{ marginBottom: isMobile ? '6px' : '10px', fontSize: isMobile ? '12px' : '16px', fontWeight: 'bold', color: '#ff6b6b' }}>
        🎄 크리스마스까지
      </div>
      <div style={{ display: 'flex', gap: isMobile ? '6px' : '12px', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: 'bold', color: '#ffe66d' }}>
            {timeLeft.days}
          </div>
          <div style={{ fontSize: isMobile ? '8px' : '10px', opacity: 0.7 }}>일</div>
        </div>
        <div style={{ fontSize: isMobile ? '14px' : '20px', opacity: 0.5 }}>:</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: 'bold', color: '#ffe66d' }}>
            {timeLeft.hours}
          </div>
          <div style={{ fontSize: isMobile ? '8px' : '10px', opacity: 0.7 }}>시간</div>
        </div>
        <div style={{ fontSize: isMobile ? '14px' : '20px', opacity: 0.5 }}>:</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: 'bold', color: '#ffe66d' }}>
            {timeLeft.minutes}
          </div>
          <div style={{ fontSize: isMobile ? '8px' : '10px', opacity: 0.7 }}>분</div>
        </div>
        <div style={{ fontSize: isMobile ? '14px' : '20px', opacity: 0.5 }}>:</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: 'bold', color: '#ffe66d' }}>
            {timeLeft.seconds}
          </div>
          <div style={{ fontSize: isMobile ? '8px' : '10px', opacity: 0.7 }}>초</div>
        </div>
      </div>
    </motion.div>
  );
}

