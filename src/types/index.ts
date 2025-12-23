export interface SnowConfig {
  amount: number;
  speed: number;
}

export interface TreeState {
  lightsOn: boolean;
  glowIntensity: number;
  blinkSpeed: number; // 조명 깜빡임 속도 (ms)
}

export interface SnowmanState {
  hat: number;
  scarf: number;
  face: number;
  seed: number;
}

export interface CabinState {
  doorOpen: boolean;
  windowsLit: boolean;
  smokeOn: boolean;
}

export interface TerminalCommand {
  command: string;
  output: string;
  timestamp: number;
}

export interface AppState {
  snow: SnowConfig;
  tree: TreeState;
  snowman: SnowmanState;
  cabin: CabinState;
  terminal: {
    history: TerminalCommand[];
    isEasterEgg: boolean;
    visible: boolean;
  };
  santa: {
    shouldShow: boolean;
    timestamp: number;
  };
  santaArmy: {
    shouldShow: boolean;
    count: number;
    timestamp: number;
  };
  scene: {
    shake: boolean;
    timeOfDay: 'day' | 'night'; // 시간에 따라 자동 설정
    scrollY: number; // 스크롤 위치
  };
  positions: {
    tree: { x: number; y: number };
    cabin: { x: number; y: number };
    snowman: { x: number; y: number };
  };
  game: {
    isActive: boolean;
    score: number;
    timeLeft: number;
  };
}

