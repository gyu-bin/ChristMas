import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

export function Santa() {
  const { state, resetSanta, showSanta } = useApp();
  const timerRef = useRef<number | null>(null);
  const autoTimerRef = useRef<number | null>(null);
  const lastAutoSantaRef = useRef<number>(0);

  // 자동 산타 등장 (20~40초마다)
  useEffect(() => {
    const scheduleAutoSanta = () => {
      const now = Date.now();
      const timeSinceLastSanta = now - lastAutoSantaRef.current;
      const minInterval = 20000; // 20초
      const maxInterval = 40000; // 40초
      
      // 마지막 산타가 나타난 지 충분한 시간이 지났고, 현재 산타가 나타나지 않았을 때
      if (timeSinceLastSanta > minInterval && !state.santa.shouldShow) {
        const randomDelay = Math.random() * (maxInterval - minInterval) + minInterval;
        autoTimerRef.current = window.setTimeout(() => {
          if (!state.santa.shouldShow) {
            showSanta();
            lastAutoSantaRef.current = Date.now();
          }
          scheduleAutoSanta(); // 다음 산타 예약
        }, randomDelay);
      } else {
        // 아직 시간이 안 지났으면 다시 체크
        const remainingTime = minInterval - timeSinceLastSanta;
        if (remainingTime > 0) {
          autoTimerRef.current = window.setTimeout(() => {
            scheduleAutoSanta();
          }, remainingTime);
        } else {
          scheduleAutoSanta();
        }
      }
    };

    // 초기 지연 후 첫 자동 산타 예약
    const initialDelay = Math.random() * 20000 + 20000; // 20~40초 후
    autoTimerRef.current = window.setTimeout(() => {
      scheduleAutoSanta();
    }, initialDelay);

    return () => {
      if (autoTimerRef.current) {
        clearTimeout(autoTimerRef.current);
      }
    };
  }, [state.santa.shouldShow, showSanta]);

  // 수동으로 호출된 산타 처리
  useEffect(() => {
    // shouldShow가 true가 되면 타이머 설정
    if (state.santa.shouldShow) {
      // 기존 타이머 정리
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // 5초 후 상태 리셋
      timerRef.current = window.setTimeout(() => {
        resetSanta();
      }, 5000);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [state.santa.shouldShow, state.santa.timestamp, resetSanta]);

  // 랜덤 방향 결정 (timestamp 기반)
  const isLeftToRight = state.santa.timestamp % 2 === 0;
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1500;
  
  // 왼→오: left 기준, 오→왼: right 기준
  const startX = isLeftToRight ? -250 : 0;
  const endX = isLeftToRight ? screenWidth + 250 : -(screenWidth + 250);
  const scaleX = isLeftToRight ? -1 : 1; // 왼→오일 때만 뒤집기

  return (
    <AnimatePresence mode="wait">
      {state.santa.shouldShow && (
        <motion.div
          key={`santa-${state.santa.timestamp}`}
          style={{
            position: 'fixed',
            top: '15%',
            left: isLeftToRight ? 0 : 'auto',
            right: isLeftToRight ? 'auto' : 0,
            zIndex: 50,
            pointerEvents: 'none',
            width: '200px',
            height: '120px',
          }}
          initial={{ x: startX, opacity: 0 }}
          animate={{
            x: endX,
            opacity: [0, 1, 1, 0],
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 5,
            ease: 'linear',
            opacity: { times: [0, 0.15, 0.85, 1], duration: 5 },
          }}
        >
          <svg
            width="200"
            height="120"
            viewBox="0 0 200 120"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))', transform: `scaleX(${scaleX})` }}
          >
            {/* 루돌프 - 더 크고 명확하게 */}
            <g id="rudolph">
              {/* 루돌프 몸통 */}
              <ellipse cx="100" cy="85" rx="50" ry="20" fill="#8b6914" />
              {/* 루돌프 머리 */}
              <ellipse cx="50" cy="75" rx="25" ry="28" fill="#a0781a" />
              
              {/* 루돌프 뿔 왼쪽 */}
              <path
                d="M 25 55 L 18 30 L 28 38 Z"
                fill="#d4af37"
                stroke="#b8941f"
                strokeWidth="1.5"
              />
              {/* 루돌프 뿔 오른쪽 */}
              <path
                d="M 30 52 L 23 27 L 33 35 Z"
                fill="#d4af37"
                stroke="#b8941f"
                strokeWidth="1.5"
              />
              
              {/* 루돌프 귀 왼쪽 */}
              <ellipse cx="32" cy="70" rx="8" ry="12" fill="#7a5510" />
              {/* 루돌프 귀 오른쪽 */}
              <ellipse cx="38" cy="65" rx="8" ry="12" fill="#7a5510" />
              
              {/* 루돌프 눈 */}
              <circle cx="38" cy="72" r="3" fill="#000" />
              
              {/* 루돌프 빨간 코 (전구처럼 빛남) */}
              <circle cx="28" cy="80" r="6" fill="#ff0000" opacity="1">
                <animate
                  attributeName="opacity"
                  values="1;0.7;1"
                  dur="0.5s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="28" cy="80" r="8" fill="#ff4444" opacity="0.5">
                <animate
                  attributeName="opacity"
                  values="0.5;0.3;0.5"
                  dur="0.5s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="28" cy="80" r="4" fill="#ffffff" opacity="0.8" />
            </g>

            {/* 썰매 */}
            <g id="sleigh">
              <rect x="60" y="90" width="80" height="12" fill="#8b4513" rx="3" />
              <rect x="55" y="92" width="90" height="8" fill="#654321" rx="2" />
              
              {/* 썰매 선들 */}
              <line x1="65" y1="90" x2="50" y2="80" stroke="#654321" strokeWidth="3" />
              <line x1="135" y1="90" x2="150" y2="80" stroke="#654321" strokeWidth="3" />
              <line x1="75" y1="88" x2="60" y2="78" stroke="#654321" strokeWidth="2" />
              <line x1="125" y1="88" x2="140" y2="78" stroke="#654321" strokeWidth="2" />
            </g>

            {/* 산타 - 썰매에 타고 있음 */}
            <g id="santa" transform="translate(90, 30)">
              {/* 산타 몸통 */}
              <rect x="0" y="20" width="24" height="30" fill="#d32f2f" rx="4" />
              
              {/* 산타 머리 */}
              <circle cx="12" cy="20" r="10" fill="#ffdbac" />
              
              {/* 산타 크리스마스 모자 - 머리 위에 */}
              {/* 모자 본체 (빨간색 원뿔형) */}
              <path
                d="M 2 10 Q 12 -8 22 10 L 20 20 L 4 20 Z"
                fill="#d32f2f"
              />
              {/* 흰색 털 (두껍고 푹신한) - 모자 끝에 */}
              <ellipse cx="12" cy="20" rx="11" ry="5" fill="#ffffff" />
              <ellipse cx="12" cy="20" rx="10" ry="4" fill="#ffffff" opacity="0.9" />
              {/* 꼭대기 흰색 pom-pom */}
              <circle cx="12" cy="-6" r="4" fill="#ffffff" />
              <circle cx="12" cy="-6" r="3.5" fill="#ffffff" opacity="0.8" />
              
              {/* 산타 수염 */}
              <ellipse cx="12" cy="22" rx="8" ry="6" fill="#ffffff" />
              
              {/* 산타 눈 */}
              <circle cx="9" cy="18" r="1.5" fill="#000" />
              <circle cx="15" cy="18" r="1.5" fill="#000" />
              
              {/* 산타 코 */}
              <circle cx="12" cy="20" r="1.5" fill="#ff6b6b" />
              
              {/* 산타 팔 (손잡이를 잡고 있음) */}
              <line x1="24" y1="28" x2="32" y2="20" stroke="#ffdbac" strokeWidth="3" strokeLinecap="round" />
              <circle cx="32" cy="20" r="3" fill="#ffdbac" />
            </g>

            {/* 별 스파클 효과 - 루돌프 뒤를 따라다님 */}
            <circle cx="160" cy="40" r="3" fill="#ffe66d" opacity="0.9">
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="0.8s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="170" cy="50" r="2.5" fill="#ffe66d" opacity="0.9">
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="155" cy="55" r="2" fill="#ffe66d" opacity="0.9">
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </circle>

            {/* 날개 효과 (눈내림과 함께) */}
            <circle cx="40" cy="45" r="1.5" fill="#ffffff" opacity="0.7">
              <animate
                attributeName="cy"
                values="45;50;45"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="50" cy="50" r="1" fill="#ffffff" opacity="0.6">
              <animate
                attributeName="cy"
                values="50;55;50"
                dur="1.8s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
          
          {/* 산타 뒤를 따라가는 눈 파티클 효과 */}
          <div
            style={{
              position: 'absolute',
              left: '-100px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '100px',
              height: '80px',
              pointerEvents: 'none',
            }}
          >
            {/* 여러 개의 눈 파티클 - 산타 뒤에서 흩어지며 떨어짐 */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  left: `${20 + (i % 4) * 15}px`,
                  top: `${10 + Math.floor(i / 4) * 20}px`,
                  opacity: 0.8,
                  filter: 'blur(0.5px)',
                }}
                animate={{
                  y: [0, 30 + Math.random() * 20],
                  x: [-10 + Math.random() * 20, -20 + Math.random() * 40],
                  opacity: [0.8, 0],
                  scale: [1, 0.5],
                }}
                transition={{
                  duration: 1.5 + Math.random() * 0.5,
                  delay: i * 0.1,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            ))}
            
            {/* 더 많은 작은 눈 파티클 */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`small-${i}`}
                style={{
                  position: 'absolute',
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  left: `${10 + (i % 5) * 12}px`,
                  top: `${15 + Math.floor(i / 5) * 15}px`,
                  opacity: 0.6,
                }}
                animate={{
                  y: [0, 40 + Math.random() * 30],
                  x: [-15 + Math.random() * 30, -25 + Math.random() * 50],
                  opacity: [0.6, 0],
                  scale: [1, 0.3],
                }}
                transition={{
                  duration: 2 + Math.random() * 0.8,
                  delay: i * 0.08,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
