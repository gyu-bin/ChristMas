import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

interface SantaItem {
  id: number;
  timestamp: number;
  yPosition: number;
  isLeftToRight: boolean; // 방향 추가
}

export function SantaArmy() {
  const { state, resetSantaArmy } = useApp();
  const [santas, setSantas] = useState<SantaItem[]>([]);
  const intervalRef = useRef<number | null>(null);
  const santaIdRef = useRef<number>(0);
  const endTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (state.santaArmy.shouldShow) {
      // 기존 타이머 정리
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (endTimerRef.current) {
        clearTimeout(endTimerRef.current);
      }
      
      santaIdRef.current = 0;
      setSantas([]);

      let createdCount = 0;
      const targetCount = state.santaArmy.count;

      // 지정된 개수만큼 정확히 생성
      const createNextSanta = () => {
        if (createdCount >= targetCount) {
          // 지정된 개수만큼 생성 완료
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          // 마지막 산타가 지나간 후 리셋
          setTimeout(() => {
            resetSantaArmy();
            setSantas([]);
          }, 5000);
          return;
        }

        const newSanta: SantaItem = {
          id: santaIdRef.current++,
          timestamp: Date.now(),
          yPosition: Math.random() * 80 + 10, // 화면 높이의 10%~90% 사이
          isLeftToRight: Math.random() > 0.5, // 랜덤 방향
        };
        setSantas((prev) => [...prev, newSanta]);
        createdCount++;

        // 다음 산타 생성 (랜덤 간격: 0.3초 ~ 1초)
        const nextDelay = Math.random() * 700 + 300; // 300ms ~ 1000ms
        intervalRef.current = window.setTimeout(() => {
          createNextSanta();
        }, nextDelay);
      };

      // 첫 산타 생성
      createNextSanta();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (endTimerRef.current) {
        clearTimeout(endTimerRef.current);
        endTimerRef.current = null;
      }
      setSantas([]);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (endTimerRef.current) {
        clearTimeout(endTimerRef.current);
      }
    };
  }, [state.santaArmy.shouldShow, resetSantaArmy]);

  if (!state.santaArmy.shouldShow) return null;

  return (
    <AnimatePresence>
      {santas.map((santa) => {
        const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1500;
        
        // 왼→오: left 기준, 오→왼: right 기준
        const startX = santa.isLeftToRight ? -250 : 0;
        const endX = santa.isLeftToRight ? screenWidth + 250 : -(screenWidth + 250);
        const scaleX = santa.isLeftToRight ? -1 : 1; // 왼→오일 때만 뒤집기

        return (
          <motion.div
            key={`santa-army-${santa.timestamp}-${santa.id}`}
            style={{
              position: 'fixed',
              top: `${santa.yPosition}%`,
              left: santa.isLeftToRight ? 0 : 'auto',
              right: santa.isLeftToRight ? 'auto' : 0,
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
                {/* 루돌프 */}
                <g id="rudolph">
                  <ellipse cx="100" cy="85" rx="50" ry="20" fill="#8b6914" />
                  <ellipse cx="50" cy="75" rx="25" ry="28" fill="#a0781a" />
                  <path
                    d="M 25 55 L 18 30 L 28 38 Z"
                    fill="#d4af37"
                    stroke="#b8941f"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 30 52 L 23 27 L 33 35 Z"
                    fill="#d4af37"
                    stroke="#b8941f"
                    strokeWidth="1.5"
                  />
                  <ellipse cx="32" cy="70" rx="8" ry="12" fill="#7a5510" />
                  <ellipse cx="38" cy="65" rx="8" ry="12" fill="#7a5510" />
                  <circle cx="38" cy="72" r="3" fill="#000" />
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
                  <line x1="65" y1="90" x2="50" y2="80" stroke="#654321" strokeWidth="3" />
                  <line x1="135" y1="90" x2="150" y2="80" stroke="#654321" strokeWidth="3" />
                  <line x1="75" y1="88" x2="60" y2="78" stroke="#654321" strokeWidth="2" />
                  <line x1="125" y1="88" x2="140" y2="78" stroke="#654321" strokeWidth="2" />
                </g>

                {/* 산타 */}
                <g id="santa" transform="translate(90, 30)">
                  <rect x="0" y="20" width="24" height="30" fill="#d32f2f" rx="4" />
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
                  <ellipse cx="12" cy="22" rx="8" ry="6" fill="#ffffff" />
                  <circle cx="9" cy="18" r="1.5" fill="#000" />
                  <circle cx="15" cy="18" r="1.5" fill="#000" />
                  <circle cx="12" cy="20" r="1.5" fill="#ff6b6b" />
                  <line x1="24" y1="28" x2="32" y2="20" stroke="#ffdbac" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="32" cy="20" r="3" fill="#ffdbac" />
                </g>

                {/* 별 스파클 */}
                <circle cx="160" cy="40" r="3" fill="#ffe66d" opacity="0.9">
                  <animate
                    attributeName="opacity"
                    values="0.3;1;0.3"
                    dur="0.8s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
            </motion.div>
        );
      })}
    </AnimatePresence>
  );
}

