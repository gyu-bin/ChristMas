import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

const BULB_COLORS = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ff8b94', '#ffaaa5'];
const BULB_POSITIONS = [
  { x: 50, y: 72 }, { x: 35, y: 62 }, { x: 65, y: 62 },
  { x: 25, y: 52 }, { x: 45, y: 52 }, { x: 65, y: 52 }, { x: 75, y: 52 },
  { x: 30, y: 42 }, { x: 50, y: 42 }, { x: 70, y: 42 },
  { x: 40, y: 32 }, { x: 60, y: 32 },
];

export function Tree() {
  const { state, toggleTreeLights, setPosition } = useApp();
  const [blinkingBulbs, setBlinkingBulbs] = useState<Set<number>>(new Set());
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasMovedRef = useRef(false);

  useEffect(() => {
    if (!state.tree.lightsOn) {
      setBlinkingBulbs(new Set());
      return;
    }

    const baseInterval = state.tree.blinkSpeed || 800;
    const interval = setInterval(() => {
      const newBlinking = new Set<number>();
      const bulbCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < bulbCount; i++) {
        newBlinking.add(Math.floor(Math.random() * BULB_POSITIONS.length));
      }
      
      setBlinkingBulbs(newBlinking);
    }, baseInterval + Math.random() * (baseInterval * 0.5));

    return () => clearInterval(interval);
  }, [state.tree.lightsOn, state.tree.blinkSpeed]);

  const handlePointerDown = (e: React.PointerEvent) => {
    hasMovedRef.current = false;
    setIsLongPressing(false);
    e.currentTarget.setPointerCapture(e.pointerId);
    longPressTimerRef.current = setTimeout(() => {
      setIsLongPressing(true);
    }, 500);
  };

  const handlePointerUp = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (!isLongPressing) {
      setIsLongPressing(false);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // 드래그가 활성화되기 전에 마우스가 많이 움직이면 취소
    if (!isLongPressing && hasMovedRef.current) {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    } else if (!isLongPressing) {
      // 작은 움직임은 무시 (5px 이하)
      const movement = Math.abs(e.movementX) + Math.abs(e.movementY);
      if (movement > 5) {
        hasMovedRef.current = true;
      }
    }
  };

  return (
    <motion.div
      style={{
        position: 'relative',
        width: '500px',
        height: '600px',
        cursor: isLongPressing ? 'grabbing' : 'pointer',
        zIndex: isLongPressing ? 20 : 10,
        x: state.positions.tree.x,
        y: state.positions.tree.y,
      }}
      drag={isLongPressing}
      dragMomentum={false}
      dragConstraints={{ left: -1000, right: 1000, top: -500, bottom: 500 }}
      onDragStart={() => {
        hasMovedRef.current = true;
      }}
      onDragEnd={(_, info) => {
        if (isLongPressing && (Math.abs(info.offset.x) > 5 || Math.abs(info.offset.y) > 5)) {
          const newX = state.positions.tree.x + info.offset.x;
          const newY = state.positions.tree.y + info.offset.y;
          setPosition('tree', newX, newY);
        }
        setIsLongPressing(false);
        hasMovedRef.current = false;
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerCancel={handlePointerUp}
      onClick={(e) => {
        // 드래그 중이 아닐 때만 클릭 이벤트 발생
        if (isLongPressing || hasMovedRef.current) {
          e.preventDefault();
          return;
        }
        toggleTreeLights();
        // 파티클 효과 생성
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height * 0.4; // 트리 중앙 부분
        
        const newParticles = Array.from({ length: 15 }, (_, i) => ({
          id: Date.now() + i,
          x: centerX + (Math.random() - 0.5) * 100,
          y: centerY + (Math.random() - 0.5) * 100,
          color: BULB_COLORS[Math.floor(Math.random() * BULB_COLORS.length)],
        }));
        
        setParticles(newParticles);
        setTimeout(() => setParticles([]), 1000);
      }}
      whileHover={{ scale: 1.05 }}
      whileDrag={isLongPressing ? { cursor: 'grabbing', zIndex: 20, scale: 1.02 } : {}}
      whileTap={isLongPressing ? {} : { scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 트리 PNG 이미지 */}
      <img
        src="/assets/image/tree/christmas-tree-illustration-png.png"
        alt="Christmas Tree"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
      />

      {/* 전구 오버레이 - SVG로 전구만 표시 */}
      {state.tree.lightsOn && (
        <svg 
          viewBox="0 0 100 100" 
          style={{ 
            width: '100%', 
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
          }}
        >
          {BULB_POSITIONS.map((pos, index) => {
            const isBlinking = blinkingBulbs.has(index);
            const color = BULB_COLORS[index % BULB_COLORS.length];
            
            return (
              <g key={index}>
                {/* 글로우 효과 - 항상 표시 */}
                <ellipse
                  cx={pos.x}
                  cy={pos.y + 2}
                  rx="3"
                  ry="4"
                  fill={color}
                  opacity={isBlinking ? 0.4 : 0.2}
                  style={{
                    filter: `blur(3px)`,
                  }}
                />
                
                {/* 전구 소켓 (금속 부분) */}
                <rect
                  x={pos.x - 1.5}
                  y={pos.y - 0.5}
                  width="3"
                  height="2"
                  fill="#4a4a4a"
                  rx="0.5"
                />
                
                {/* 전구 본체 (알 모양) */}
                <ellipse
                  cx={pos.x}
                  cy={pos.y + 2}
                  rx="2.5"
                  ry="3.5"
                  fill={color}
                  opacity={isBlinking ? 1 : 0.9}
                  style={{
                    filter: `drop-shadow(0 0 ${isBlinking ? '6px' : '4px'} ${color})`,
                    transition: 'all 0.3s ease',
                  }}
                />
                
                {/* 전구 하이라이트 */}
                <ellipse
                  cx={pos.x - 0.7}
                  cy={pos.y + 0.5}
                  rx="0.7"
                  ry="1.2"
                  fill="rgba(255, 255, 255, 0.8)"
                  opacity={isBlinking ? 1 : 0.7}
                />
                
                {/* 깜빡일 때 추가 글로우 */}
                {isBlinking && (
                  <ellipse
                    cx={pos.x}
                    cy={pos.y + 2}
                    rx="4.5"
                    ry="5.5"
                    fill={color}
                    opacity="0.3"
                    style={{
                      filter: `blur(5px)`,
                      animation: 'pulse 0.8s ease-in-out',
                    }}
                  />
                )}
              </g>
            );
          })}
        </svg>
      )}

      {/* 선물 상자들 */}
      <div
        style={{
          position: 'absolute',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '15px',
          zIndex: 5,
        }}
      >
        {/* 선물 상자 1 */}
        <motion.div
          style={{
            width: '50px',
            height: '50px',
            background: 'linear-gradient(135deg, #ff6b6b, #ff8b94)',
            borderRadius: '4px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            position: 'relative',
          }}
          whileHover={{ scale: 1.1, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '4px',
              background: '#ffffff',
              opacity: 0.8,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(90deg)',
              width: '100%',
              height: '4px',
              background: '#ffffff',
              opacity: 0.8,
            }}
          />
        </motion.div>
        
        {/* 선물 상자 2 */}
        <motion.div
          style={{
            width: '50px',
            height: '50px',
            background: 'linear-gradient(135deg, #4ecdc4, #a8e6cf)',
            borderRadius: '4px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            position: 'relative',
          }}
          whileHover={{ scale: 1.1, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '4px',
              background: '#ffffff',
              opacity: 0.8,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(90deg)',
              width: '100%',
              height: '4px',
              background: '#ffffff',
              opacity: 0.8,
            }}
          />
        </motion.div>
        
        {/* 선물 상자 3 */}
        <motion.div
          style={{
            width: '50px',
            height: '50px',
            background: 'linear-gradient(135deg, #ffe66d, #ffd700)',
            borderRadius: '4px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            position: 'relative',
          }}
          whileHover={{ scale: 1.1, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '4px',
              background: '#ffffff',
              opacity: 0.8,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(90deg)',
              width: '100%',
              height: '4px',
              background: '#ffffff',
              opacity: 0.8,
            }}
          />
        </motion.div>
      </div>

      {/* 파티클 효과 */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, scale: 0, x: '50%', y: '40%' }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              x: `${particle.x}px`,
              y: `${particle.y}px`,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: '50%',
              top: '40%',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${particle.color}, transparent)`,
              boxShadow: `0 0 15px ${particle.color}`,
              pointerEvents: 'none',
              zIndex: 11,
            }}
          />
        ))}
      </AnimatePresence>

      {/* 클릭 힌트 */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#ffffff80',
          fontSize: '12px',
          whiteSpace: 'nowrap',
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {state.tree.lightsOn ? '💡 클릭하여 끄기' : '💡 클릭하여 켜기'}
      </motion.div>
    </motion.div>
  );
}

