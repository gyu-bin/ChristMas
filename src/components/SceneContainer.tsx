import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tree } from './Tree';
import { Snowman } from './Snowman';
import { Cabin } from './Cabin';
import { useApp } from '../context/AppContext';

export function SceneContainer() {
  const { state } = useApp();

  useEffect(() => {
    if (state.scene.shake) {
      const timer = setTimeout(() => {
        // shake 상태는 자동으로 리셋되지 않으므로, 여기서는 애니메이션만 처리
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.scene.shake]);

  // 스크롤 위치에 따른 이펙트 (파라랙스 효과)
  const scrollEffect = Math.min(state.scene.scrollY / 500, 1); // 최대 1로 제한
  const parallaxY = scrollEffect * 50; // 최대 50px 이동
  const opacity = 1 - scrollEffect * 0.3; // 스크롤하면 약간 투명해짐

  return (
    <>
      {/* 바닥 눈 쌓임 */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to top, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
      
      <motion.div
        style={{
          position: 'fixed',
          bottom: '160px',
          left: 0,
          right: 0,
          height: '50vh',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          gap: 'clamp(10px, 10px, 3vw)',
          zIndex: 5,
          pointerEvents: 'none',
          flexWrap: 'wrap',
          padding: '20px 20px 20px 10vw',
          opacity: opacity,
        }}
        animate={{
          y: parallaxY,
          ...(state.scene.shake
            ? {
                x: [0, -10, 10, -10, 10, -5, 5, 0],
                y: [parallaxY, parallaxY - 5, parallaxY + 5, parallaxY - 5, parallaxY + 5, parallaxY - 3, parallaxY + 3, parallaxY],
              }
            : {}),
        }}
        transition={
          state.scene.shake
            ? {
                duration: 0.5,
                ease: 'easeInOut',
              }
            : {
                duration: 0.1,
                ease: 'easeOut',
              }
        }
      >
        {/* 트리와 눈사람, 오두막을 클릭 가능하게 하기 위해 pointerEvents를 개별적으로 설정 */}
        <div style={{ pointerEvents: 'auto' }}>
          <Tree />
        </div>
        <div style={{ pointerEvents: 'auto' }}>
          <Cabin />
        </div>
        <div style={{ pointerEvents: 'auto' }}>
          <Snowman />
        </div>
      </motion.div>
    </>
  );
}

