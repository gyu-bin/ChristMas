import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

interface Target {
  id: number;
  x: number;
  y: number;
  duration: number; // 각 타겟의 지속 시간 (랜덤)
  spawnTime: number; // 생성 시간
}

export function Game() {
  const { state, addGameScore, endGame } = useApp();
  const [targets, setTargets] = useState<Target[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showGameOver, setShowGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const targetIdRef = useRef(0);

  useEffect(() => {
    if (!state.game.isActive) {
      // 게임 종료 시 최종 점수 저장하고 화면 표시
      if (state.game.score > 0) {
        setFinalScore(state.game.score);
        setShowGameOver(true);
        setTargets([]); // 남은 타겟 제거
      }
      return;
    }

    // 게임 시작 시 초기화
    setTargets([]);
    setTimeLeft(30);
    setShowGameOver(false);
    setFinalScore(0);
    targetIdRef.current = 0;

    // 시간 타이머
    const timeInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 타겟 생성 함수 (랜덤 간격으로)
    const createTarget = () => {
      if (!state.game.isActive) return;
      
      const now = Date.now();
      const duration = Math.random() * 2000 + 800; // 0.8초 ~ 2.8초 (랜덤)
      
      setTargets((prev) => {
        if (prev.length >= 6) return prev; // 최대 6개
        return [
          ...prev,
          {
            id: targetIdRef.current++,
            x: Math.random() * (window.innerWidth - 120),
            y: Math.random() * (window.innerHeight - 200) + 120,
            duration,
            spawnTime: now,
          },
        ];
      });

      // 다음 타겟 생성 시간 (랜덤: 0.5초 ~ 1.5초)
      const nextSpawnDelay = Math.random() * 1000 + 500;
      setTimeout(createTarget, nextSpawnDelay);
    };

    // 첫 타겟 생성 지연
    const initialDelay = Math.random() * 500 + 300;
    const timeoutId = setTimeout(createTarget, initialDelay);

    // 타겟 자동 제거 체크 (각 타겟마다 다른 시간에 사라짐)
    const checkInterval = setInterval(() => {
      const now = Date.now();
      setTargets((prev) => 
        prev.filter((target) => {
          const elapsed = now - target.spawnTime;
          return elapsed < target.duration;
        })
      );
    }, 50); // 50ms마다 체크

    return () => {
      clearInterval(timeInterval);
      clearInterval(checkInterval);
      clearTimeout(timeoutId);
    };
  }, [state.game.isActive, endGame]);

  const handleTargetClick = (id: number) => {
    setTargets((prev) => prev.filter((t) => t.id !== id));
    addGameScore(10);
  };

  // 게임 종료 화면만 표시 (게임이 끝났고 점수가 있을 때)
  if (showGameOver && finalScore > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 250,
          background: 'rgba(13, 17, 23, 0.98)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          padding: '50px 60px',
          color: '#c9d1d9',
          fontFamily: 'monospace',
          textAlign: 'center',
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.6)',
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          style={{ fontSize: '48px', marginBottom: '20px' }}
        >
          🎮
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ fontSize: '32px', marginBottom: '30px', fontWeight: 'bold' }}
        >
          게임 종료!
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 150 }}
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: '#ffe66d',
            marginBottom: '20px',
            textShadow: '0 0 20px rgba(255, 230, 109, 0.5)',
          }}
        >
          {finalScore}점
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            fontSize: '16px',
            opacity: 0.7,
            marginTop: '30px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          터미널에서 'game'을 입력하여 다시 시작하세요
        </motion.div>
      </motion.div>
    );
  }

  if (!state.game.isActive) {
    return null;
  }

  return (
    <>
      {/* 게임 UI */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 200,
          background: 'rgba(13, 17, 23, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '20px 30px',
          color: '#c9d1d9',
          fontFamily: 'monospace',
          display: 'flex',
          gap: '30px',
          alignItems: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div>
          <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>점수</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffe66d' }}>
            {state.game.score}
          </div>
        </div>
        <div style={{ width: '2px', height: '40px', background: 'rgba(255, 255, 255, 0.2)' }} />
        <div>
          <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>남은 시간</div>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: timeLeft <= 10 ? '#ff6b6b' : '#4ecdc4',
            }}
          >
            {timeLeft}초
          </div>
        </div>
      </motion.div>

      {/* 게임 타겟들 - 순발력 게임 */}
      <AnimatePresence>
        {targets.map((target) => {
          const elapsed = Date.now() - target.spawnTime;
          const remaining = target.duration - elapsed;
          const opacity = remaining < 500 ? remaining / 500 : 1; // 마지막 0.5초에 페이드아웃
          
          return (
            <motion.div
              key={target.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: opacity,
                scale: opacity,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ 
                duration: 0.2,
                ease: 'easeOut',
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={() => handleTargetClick(target.id)}
              style={{
                position: 'fixed',
                left: `${target.x}px`,
                top: `${target.y}px`,
                width: '80px',
                height: '80px',
                cursor: 'pointer',
                zIndex: 150,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '60px',
                filter: `drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4)) brightness(${opacity})`,
              }}
            >
              ⛄
            </motion.div>
          );
        })}
      </AnimatePresence>
    </>
  );
}

