import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

export function Cabin() {
  const { state, toggleCabinDoor, toggleCabinWindows, toggleCabinSmoke, setPosition } = useApp();

  return (
    <motion.div
      style={{
        position: 'relative',
        width: '350px',
        height: '450px',
        zIndex: 10,
        display: 'flex',
        alignItems: 'flex-end',
        cursor: 'grab',
        x: state.positions.cabin.x,
        y: state.positions.cabin.y,
      }}
      drag
      dragMomentum={false}
      onDragEnd={(_, info) => {
        const newX = state.positions.cabin.x + info.offset.x;
        const newY = state.positions.cabin.y + info.offset.y;
        setPosition('cabin', newX, newY);
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileDrag={{ cursor: 'grabbing', zIndex: 20, scale: 1.02 }}
      onClick={(e) => {
        if (e.defaultPrevented) return;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const relativeX = (x / rect.width) * 100;
        const relativeY = (y / rect.height) * 100;

        // 문 클릭 영역 (40-60% x, 60-85% y)
        if (relativeX >= 40 && relativeX <= 60 && relativeY >= 60 && relativeY <= 85) {
          toggleCabinDoor();
        }
        // 창문 클릭 영역 (왼쪽: 25-40% x, 50-60% y, 오른쪽: 60-75% x, 50-60% y)
        else if (
          ((relativeX >= 25 && relativeX <= 40) || (relativeX >= 60 && relativeX <= 75)) &&
          relativeY >= 50 &&
          relativeY <= 60
        ) {
          toggleCabinWindows();
        }
        // 굴뚝 클릭 영역 (65-75% x, 15-25% y)
        else if (relativeX >= 65 && relativeX <= 75 && relativeY >= 15 && relativeY <= 25) {
          toggleCabinSmoke();
        }
      }}
      whileHover={{ scale: 1.02 }}
    >
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        {/* 오두막 벽 */}
        <rect x="20" y="40" width="60" height="45" fill="#8b6f47" stroke="#6b5237" strokeWidth="0.5" />
        
        {/* 오두막 지붕 */}
        <path
          d="M 10 40 L 50 15 L 90 40 Z"
          fill="#5d4037"
          stroke="#4a3429"
          strokeWidth="0.5"
        />
        
        {/* 지붕 눈 덮임 */}
        <path
          d="M 10 38 L 50 18 L 85 38 Z"
          fill="#ffffff"
          opacity="1.0"
        />
        
        {/* 굴뚝 */}
        <rect x="65" y="20" width="8" height="12" fill="#4a4a4a" rx="1" />
        <rect x="67" y="18" width="4" height="3" fill="#6a6a6a" />
        {/* 굴뚝 연기 */}
        {state.cabin.smokeOn && (
          <>
            <circle cx="69" cy="15" r="2" fill="rgba(200, 200, 200, 0.6)" opacity="0.7">
              <animate
                attributeName="cy"
                values="15;12;15"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.7;0.3;0.7"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="69" cy="10" r="1.5" fill="rgba(200, 200, 200, 0.5)" opacity="0.5">
              <animate
                attributeName="cy"
                values="10;7;10"
                dur="3.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.5;0.2;0.5"
                dur="3.5s"
                repeatCount="indefinite"
              />
            </circle>
          </>
        )}
        
        {/* 문 */}
        <motion.g
          animate={{
            x: state.cabin.doorOpen ? 5 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <rect x="42" y="60" width="16" height="25" fill="#654321" rx="2" />
          <circle cx="56" cy="72" r="1.5" fill="#d4af37" />
          {/* 문 손잡이 */}
          <circle cx="57.5" cy="72" r="0.8" fill="#ffd700" />
        </motion.g>
        
        {/* 문 열렸을 때 내부 */}
        {state.cabin.doorOpen && (
          <>
            {/* 내부 어두운 그림자 (오른쪽에 약간 보임) */}
            <rect x="54" y="60" width="12" height="25" fill="#654321" opacity="0.8" rx="2" />
            {/* 내부 빛 (창문처럼 따뜻한 노란 빛, 약간만 보임) */}
            <rect x="56" y="62" width="8" height="21" fill="#ffe66d" opacity="0.6" rx="1" />
            {/* 빛 글로우 효과 (약하게) */}
            <ellipse
              cx="60"
              cy="72"
              rx="5"
              ry="10"
              fill="#ffe66d"
              opacity="0.2"
              style={{
                filter: 'blur(3px)',
              }}
            />
          </>
        )}
        
        {/* 창문 (왼쪽) */}
        <rect x="28" y="50" width="10" height="10" fill={state.cabin.windowsLit ? "#fff8dc" : "#3a3a3a"} rx="1" stroke="#654321" strokeWidth="0.5" />
        <line x1="33" y1="50" x2="33" y2="60" stroke="#654321" strokeWidth="0.5" />
        <line x1="28" y1="55" x2="38" y2="55" stroke="#654321" strokeWidth="0.5" />
        {/* 창문 빛 */}
        {state.cabin.windowsLit && (
          <circle cx="33" cy="55" r="2" fill="#ffe66d" opacity="0.6">
            <animate
              attributeName="opacity"
              values="0.6;0.9;0.6"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        )}
        
        {/* 창문 (오른쪽) */}
        <rect x="62" y="50" width="10" height="10" fill={state.cabin.windowsLit ? "#fff8dc" : "#3a3a3a"} rx="1" stroke="#654321" strokeWidth="0.5" />
        <line x1="67" y1="50" x2="67" y2="60" stroke="#654321" strokeWidth="0.5" />
        <line x1="62" y1="55" x2="72" y2="55" stroke="#654321" strokeWidth="0.5" />
        {/* 창문 빛 */}
        {state.cabin.windowsLit && (
          <circle cx="67" cy="55" r="2" fill="#ffe66d" opacity="0.6">
            <animate
              attributeName="opacity"
              values="0.6;0.9;0.6"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </circle>
        )}
        
        {/* 문 앞 눈 쌓임 */}
        <ellipse cx="50" cy="85" rx="20" ry="3" fill="#ffffff" opacity="0.8" />
      </svg>

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
        ⛄ 클릭하여 변경
      </motion.div>
    </motion.div>
  );
}

