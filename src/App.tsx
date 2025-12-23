import { useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/AppContext';
import { SnowCanvas } from './components/SnowCanvas';
import { SceneContainer } from './components/SceneContainer';
import { TerminalPanel } from './components/TerminalPanel';
import { Santa } from './components/Santa';
import { SantaArmy } from './components/SantaArmy';
import { Moon } from './components/Moon';
import { Stars } from './components/Stars';
import { TimeDisplay } from './components/TimeDisplay';
import { ChristmasCountdown } from './components/ChristmasCountdown';
import { Game } from './components/Game';
import './App.css';

function AppContent() {
  const { state, setTimeOfDay, setScrollY } = useApp();

  // 시간에 따라 배경 변경 (6시 ~ 18시는 낮)
  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      const timeOfDay = hour >= 6 && hour < 18 ? 'day' : 'night';
      if (state.scene.timeOfDay !== timeOfDay) {
        setTimeOfDay(timeOfDay);
      }
    };

    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000); // 1분마다 체크

    return () => clearInterval(interval);
  }, [state.scene.timeOfDay, setTimeOfDay]);

  // 스크롤 이펙트
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      setScrollY(scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollY]);

  // 배경 색상 결정
  const backgroundGradient = state.scene.timeOfDay === 'day'
    ? 'linear-gradient(180deg, #87CEEB 0%, #E0F6FF 50%, #B0E0E6 100%)' // 낮: 하늘색
    : 'linear-gradient(180deg, #0a0e27 0%, #1a1a2e 50%, #16213e 100%)'; // 밤: 어두운 색

  return (
    <div className="app" style={{ background: backgroundGradient }}>
      <SnowCanvas />
      {state.scene.timeOfDay === 'night' && <Stars />}
      <Moon />
      <Santa />
      <SantaArmy />
      <SceneContainer />
      <TerminalPanel />
      <TimeDisplay />
      <ChristmasCountdown />
      <Game />
      
      {/* 타이틀 */}
      <div
        style={{
          position: 'fixed',
          top: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          textAlign: 'center',
          color: state.scene.timeOfDay === 'day' ? '#1a1a2e' : '#ffffff',
        }}
      >
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 700,
            margin: 0,
            textShadow: state.scene.timeOfDay === 'day' 
              ? '0 4px 20px rgba(255, 255, 255, 0.5)'
              : '0 4px 20px rgba(0, 0, 0, 0.5)',
            letterSpacing: '2px',
          }}
        >
          ❄️ Snowy Dev Village 🎄
        </h1>
        <p
          style={{
            fontSize: '1.2rem',
            marginTop: '12px',
            opacity: 0.8,
            textShadow: state.scene.timeOfDay === 'day'
              ? '0 2px 10px rgba(255, 255, 255, 0.5)'
              : '0 2px 10px rgba(0, 0, 0, 0.5)',
          }}
        >
          재미있는 크리스마스 마을
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

