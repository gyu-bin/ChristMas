import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

function TypingText({ text, onComplete }: { text: string; onComplete: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 20);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return <span>{displayedText}</span>;
}

export function TerminalPanel() {
  const { state, setSnowConfig, toggleTreeLights, setTreeConfig, addTerminalCommand, clearTerminal, setEasterEgg, toggleTerminal, showSanta, showSantaArmy, startGame } = useApp();
  const [input, setInput] = useState('');
  const [currentOutput, setCurrentOutput] = useState<{ text: string; isTyping: boolean } | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // 모바일 감지
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [state.terminal.history, currentOutput]);

  const executeCommand = (cmd: string) => {
    const parts = cmd.trim().toLowerCase().split(' ');
    const command = parts[0];
    const args = parts.slice(1);

    let output = '';

    switch (command) {
      case 'help':
        output = `사용 가능한 명령어:
  help          - 도움말 표시
  snow [0-500]  - 눈의 양 조절 (예: snow 200)
  lights on/off - 트리 전구 켜기/끄기
  lights speed [200-2000] - 조명 깜빡임 속도 조절 (예: lights speed 500)
  santa         - 산타를 하늘에서 호출하기 🎅
  storm         - 눈폭풍 시작! ⚡
  game          - 눈사람 맞추기 미니 게임 시작 🎮
  build         - 프로젝트 빌드 시뮬레이션
  git status    - Git 상태 확인
  feedback      - 피드백 보내기 💌
  clear         - 터미널 화면 지우기`;

  output += `\n\n💡 이스터에그: 'merry', 'christmas', 'xmas' 명령어를 입력해보세요!`;
        break;

      case 'snow':
        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount < 0 || amount > 500) {
          output = '❌ 오류: snow 명령어는 0-500 사이의 숫자를 사용하세요.\n   예: snow 200';
        } else {
          const speed = amount > 200 ? 2 : 1;
          setSnowConfig({ amount, speed });
          output = `✅ 눈의 양을 ${amount}으로 설정했습니다.`;
        }
        break;

      case 'lights':
        if (args[0] === 'on' || args[0] === 'off') {
          const shouldBeOn = args[0] === 'on';
          if (shouldBeOn !== state.tree.lightsOn) {
            toggleTreeLights();
          }
          output = `✅ 트리 전구를 ${args[0] === 'on' ? '켰' : '껐'}습니다.`;
        } else if (args[0] === 'speed') {
          const speed = parseInt(args[1]);
          if (isNaN(speed) || speed < 200 || speed > 2000) {
            output = '❌ 오류: lights speed는 200-2000 사이의 숫자를 사용하세요.\n   예: lights speed 500 (낮을수록 빠름)';
          } else {
            setTreeConfig({ blinkSpeed: speed });
            output = `✅ 조명 깜빡임 속도를 ${speed}ms로 설정했습니다.`;
          }
        } else {
          output = '❌ 오류: lights on/off 또는 lights speed [200-2000]를 사용하세요.';
        }
        break;

      case 'build':
        output = `빌드 시작...
📦 의존성 설치 중...
✅ 의존성 설치 완료
🔨 컴파일 중...
✅ 컴파일 완료
📦 번들링 중...
✅ 번들링 완료
✨ 빌드 성공! (3.2초 소요)`;
        break;

      case 'git':
        if (args[0] === 'status') {
          output = `On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  
        modified:   src/components/Tree.tsx
        modified:   src/components/Snowman.tsx

no changes added to commit (use "git add" to stage)`;
        } else {
          output = `❌ 오류: 지원하지 않는 git 명령어입니다.\n   사용 가능: git status`;
        }
        break;

      case 'clear':
        clearTerminal();
        setCurrentOutput(null); // currentOutput도 초기화하여 초기 메시지가 표시되도록
        return;

      case 'santa':
        showSanta();
        output = '🎅 산타가 하늘에서 지나갑니다!';
        break;

      case 'storm':
        setEasterEgg(true);
        output = '🎉 눈폭풍 시작! 10초간 지속됩니다...';
        setSnowConfig({ amount: 500, speed: 3 });
        
        setTimeout(() => {
          setEasterEgg(false);
          setSnowConfig({ amount: 100, speed: 1 });
        }, 10000);
        break;

      case 'game':
        if (state.game.isActive) {
          output = '⚠️ 게임이 이미 진행 중입니다!';
        } else {
          startGame();
          output = '🎮 눈사람 맞추기 게임을 시작합니다!\n   30초 동안 나타나는 눈사람을 클릭하세요! ⛄';
        }
        break;

      case 'feedback':
        output = `💌 피드백 및 문의사항이 있으시면 아래 메일로 연락해주세요!\n\n   📧 rbqls6651@naver.com\n\n   감사합니다! 😊`;
        break;

      case 'merry':
      case 'christmas':
      case 'xmas':
        // 이스터에그: 산타 군단 등장
        const santaCount = Math.floor(Math.random() * 41) + 10; // 10~50명
        showSantaArmy(santaCount);
        output = `🎅🎅🎅 산타 ${santaCount}명이 하늘을 가로지릅니다! 🎅🎅🎅`;
        break;

      case '':
        output = '';
        break;

      default:
        output = `❌ 명령어를 찾을 수 없습니다: ${command}\n   'help'를 입력하여 사용 가능한 명령어를 확인하세요.`;
    }

    if (output) {
      addTerminalCommand(cmd, output);
      setCurrentOutput({ text: output, isTyping: true });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    executeCommand(input);
    setInput('');
  };

  const handleTypingComplete = () => {
    setCurrentOutput({ text: '', isTyping: false });
  };

  // 터미널이 숨겨진 경우 토글 버튼만 표시
  if (!state.terminal.visible) {
    return (
        <motion.button
        onClick={toggleTerminal}
        style={{
          position: 'fixed',
          top: isMobile ? '10px' : '20px',
          right: isMobile ? '10px' : '20px',
          width: '48px',
          height: '48px',
          backgroundColor: 'rgba(13, 17, 23, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          color: '#c9d1d9',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          zIndex: 100,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        💻
      </motion.button>
    );
  }

  return (
    <motion.div
        style={{
          position: 'fixed',
          top: isMobile ? '10px' : '20px',
          right: isMobile ? '10px' : '20px',
          left: isMobile ? '10px' : 'auto',
          width: isMobile ? 'calc(100vw - 20px)' : 'clamp(320px, 500px, 90vw)',
          maxHeight: isMobile ? 'calc(100vh - 20px)' : '600px',
          backgroundColor: 'rgba(13, 17, 23, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: isMobile ? '12px' : '16px',
          fontFamily: 'Monaco, "Courier New", monospace',
          fontSize: isMobile ? '12px' : '14px',
          color: '#c9d1d9',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
        }}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
    >
      {/* 터미널 헤더 */}
      <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f57' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#28ca42' }} />
            </div>
            <span style={{ marginLeft: '8px', color: '#8b949e', fontSize: '12px' }}>terminal</span>
          </div>
          <button
            onClick={toggleTerminal}
            style={{
              background: 'none',
              border: 'none',
              color: '#8b949e',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '4px 8px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = '#c9d1d9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#8b949e';
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* 터미널 출력 영역 */}
      <div
        ref={terminalRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          marginBottom: '12px',
          maxHeight: '400px',
          minHeight: '200px',
        }}
      >
        <AnimatePresence>
          {state.terminal.history.map((cmd, index) => {
            const isLast = index === state.terminal.history.length - 1;
            const isTyping = isLast && currentOutput?.isTyping;
            
            return (
              <motion.div
                key={cmd.timestamp}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ marginBottom: '12px' }}
              >
                <div style={{ color: '#7c3aed', marginBottom: '4px' }}>
                  $ {cmd.command}
                </div>
                <div style={{ color: '#c9d1d9', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                  {isTyping ? (
                    <TypingText
                      text={cmd.output}
                      onComplete={handleTypingComplete}
                    />
                  ) : (
                    cmd.output
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {state.terminal.history.length === 0 && !currentOutput && (
          <div style={{ color: '#8b949e', fontStyle: 'italic' }}>
            터미널이 준비되었습니다. 'help'를 입력하여 명령어를 확인하세요.
          </div>
        )}
      </div>

      {/* 입력 영역 */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#7c3aed' }}>$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#c9d1d9',
              fontFamily: 'Monaco, "Courier New", monospace',
              fontSize: isMobile ? '12px' : '14px',
              WebkitAppearance: 'none',
              WebkitTapHighlightColor: 'transparent',
            }}
            autoFocus={!isMobile}
            placeholder="명령어 입력..."
            inputMode="text"
            autoCapitalize="off"
            autoCorrect="off"
          />
        </div>
      </form>
    </motion.div>
  );
}

