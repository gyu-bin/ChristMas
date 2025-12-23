import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

export function Moon() {
  const { state } = useApp();
  const isDay = state.scene.timeOfDay === 'day';

  const renderMoon = () => {
    // 항상 보름달만 표시
    return (
      <g>
        <circle cx="60" cy="60" r="60" fill="#fff8dc" opacity="0.95" />
        {/* 크레이터들 */}
        <circle cx="45" cy="45" r="8" fill="#e8d8a8" opacity="0.5" />
        <circle cx="70" cy="50" r="6" fill="#e8d8a8" opacity="0.4" />
        <circle cx="50" cy="70" r="7" fill="#e8d8a8" opacity="0.5" />
        <circle cx="75" cy="72" r="5" fill="#e8d8a8" opacity="0.4" />
        <circle cx="65" cy="40" r="4" fill="#e8d8a8" opacity="0.3" />
      </g>
    );
  };

  const renderSun = () => {
    return (
      <g>
        {/* 태양 본체 */}
        <circle cx="60" cy="60" r="50" fill="#ffd700" opacity="0.95" />
        {/* 태양 빛선들 */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30) * (Math.PI / 180);
          const x1 = 60 + Math.cos(angle) * 55;
          const y1 = 60 + Math.sin(angle) * 55;
          const x2 = 60 + Math.cos(angle) * 70;
          const y2 = 60 + Math.sin(angle) * 70;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#ffeb3b"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.9"
            />
          );
        })}
        {/* 태양 내부 글로우 */}
        <circle cx="60" cy="60" r="45" fill="#fff9c4" opacity="0.6" />
      </g>
    );
  };

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: '60px',
        left: '300px',
        zIndex: 10,
        pointerEvents: 'none',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <svg
        width="180"
        height="180"
        viewBox="0 0 120 120"
        style={{ 
          filter: isDay 
            ? 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.8))'
            : 'drop-shadow(0 0 25px rgba(255, 255, 200, 0.6))',
          pointerEvents: 'none',
        }}
      >
        {/* 배경 (낮/밤에 따라 색상 변경) */}
        <circle
          cx="60"
          cy="60"
          r="70"
          fill={isDay ? "rgba(255, 255, 255, 0.2)" : "rgba(26, 26, 46, 0.3)"}
          opacity="0.5"
        />
        
        {/* 글로우 효과 */}
        <circle
          cx="60"
          cy="60"
          r="65"
          fill={isDay ? "rgba(255, 215, 0, 0.2)" : "rgba(255, 255, 200, 0.15)"}
          style={{
            filter: 'blur(8px)',
          }}
        />
        {isDay ? renderSun() : renderMoon()}
      </svg>
    </motion.div>
  );
}

