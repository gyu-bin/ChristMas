import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

export function Snowman() {
  const { updateSnowman, state, setSnowConfig, setPosition } = useApp();
  const [isAnimating, setIsAnimating] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [clickCount, setClickCount] = useState(0);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasMovedRef = useRef(false);

  // state.snowman 값에 따라 다양한 색조 필터 적용
  const colorFilters = [
    'hue-rotate(0deg)',      // 원본
    'hue-rotate(60deg)',     // 노란색 계열
    'hue-rotate(120deg)',    // 초록색 계열
    'hue-rotate(180deg)',    // 청록색 계열
    'hue-rotate(240deg)',    // 파란색 계열
    'hue-rotate(300deg)',    // 보라색 계열
  ];
  
  // hat과 scarf 값을 조합하여 필터 선택
  const filterIndex = (state.snowman.hat + state.snowman.scarf) % colorFilters.length;
  const currentFilter = colorFilters[filterIndex];

  const handleClick = () => {
    updateSnowman();
    setIsAnimating(true);
    
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    
    // 반짝임 효과 생성
    const newSparkles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setSparkles(newSparkles);
    
    // 연속 클릭 시 눈 폭풍 효과 (3회 이상)
    if (newClickCount >= 3) {
      setSnowConfig({ amount: 400, speed: 2.5 });
      
      setTimeout(() => {
        setSnowConfig({ amount: 100, speed: 1 });
        setClickCount(0);
      }, 3000);
    }
    
    // 클릭 카운트 리셋 타이머 (2초 후)
    setTimeout(() => {
      setClickCount(0);
    }, 2000);
    
    // 애니메이션 종료 후 반짝임 제거
    setTimeout(() => {
      setIsAnimating(false);
      setTimeout(() => setSparkles([]), 500);
    }, 1000);
  };

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
        width: '450px',
        height: '500px',
        cursor: isLongPressing ? 'grabbing' : 'pointer',
        zIndex: isLongPressing ? 20 : 10,
        x: state.positions.snowman.x,
        y: state.positions.snowman.y,
      }}
      drag={isLongPressing}
      dragMomentum={false}
      dragConstraints={{ left: -1000, right: 1000, top: -500, bottom: 500 }}
      onDragStart={() => {
        hasMovedRef.current = true;
      }}
      onDragEnd={(_, info) => {
        if (isLongPressing && (Math.abs(info.offset.x) > 5 || Math.abs(info.offset.y) > 5)) {
          const newX = state.positions.snowman.x + info.offset.x;
          const newY = state.positions.snowman.y + info.offset.y;
          setPosition('snowman', newX, newY);
        }
        setIsLongPressing(false);
        hasMovedRef.current = false;
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerCancel={handlePointerUp}
      onClick={(e) => {
        if (isLongPressing || hasMovedRef.current) {
          e.preventDefault();
          return;
        }
        handleClick();
      }}
      whileHover={{ scale: 1.05 }}
      whileDrag={isLongPressing ? { cursor: 'grabbing', zIndex: 20, scale: 1.02 } : {}}
      whileTap={isLongPressing ? {} : { scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* 눈사람 이미지 - 클릭 시 크기 애니메이션 */}
      <motion.div
        animate={
          isAnimating
            ? {
                scale: [1, 1.2, 1],
              }
            : {}
        }
        transition={
          isAnimating
            ? {
                scale: { duration: 0.8, ease: 'easeInOut' },
              }
            : {}
        }
        style={{
          filter: isAnimating 
            ? `${currentFilter} brightness(1.3) drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))`
            : currentFilter,
          transition: 'filter 0.5s ease',
        }}
      >
        <img
          src="/assets/image/snowman/snowman-illustration-png.png"
          alt="Snowman"
          style={{
            width: '120%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
          }}
        />
      </motion.div>

      {/* 반짝임 효과 */}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ opacity: 0, scale: 0, x: '50%', y: '50%' }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              x: `${sparkle.x}%`,
              y: `${sparkle.y}%`,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #ffffff, #ffd700)',
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
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
          // bottom: '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#ffffff80',
          fontSize: '12px',
          whiteSpace: 'nowrap',
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ⛄ 클릭하여 변경
      </motion.div>
    </motion.div>
  );
}

