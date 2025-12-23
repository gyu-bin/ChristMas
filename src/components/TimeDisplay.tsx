import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function TimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    return `${year}-${month}-${day} (${weekday})`;
  };

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 50,
        background: 'rgba(26, 26, 46, 0.8)',
        backdropFilter: 'blur(10px)',
        padding: '15px 20px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#ffffff',
        fontFamily: 'monospace',
        fontSize: '14px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ marginBottom: '8px', opacity: 0.8, fontSize: '12px' }}>
        {formatDate(currentTime)}
      </div>
      <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace' }}>
        {formatTime(currentTime)}
      </div>
    </motion.div>
  );
}

