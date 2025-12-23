import { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, SnowConfig, TreeState } from '../types';

interface AppContextType {
  state: AppState;
  setSnowConfig: (config: Partial<SnowConfig>) => void;
  toggleTreeLights: () => void;
  setTreeConfig: (config: Partial<TreeState>) => void;
  updateSnowman: () => void;
  toggleCabinDoor: () => void;
  toggleCabinWindows: () => void;
  toggleCabinSmoke: () => void;
  shakeScene: () => void;
  setTimeOfDay: (timeOfDay: 'day' | 'night') => void;
  setPosition: (element: 'tree' | 'cabin' | 'snowman', x: number, y: number) => void;
  setScrollY: (scrollY: number) => void;
  addTerminalCommand: (command: string, output: string) => void;
  clearTerminal: () => void;
  setEasterEgg: (enabled: boolean) => void;
  toggleTerminal: () => void;
  showSanta: () => void;
  resetSanta: () => void;
  showSantaArmy: (count: number) => void;
  resetSantaArmy: () => void;
  startGame: () => void;
  endGame: () => void;
  addGameScore: (points: number) => void;
}

type AppAction =
  | { type: 'SET_SNOW_CONFIG'; payload: Partial<SnowConfig> }
  | { type: 'TOGGLE_TREE_LIGHTS' }
  | { type: 'SET_TREE_CONFIG'; payload: Partial<TreeState> }
  | { type: 'UPDATE_SNOWMAN' }
  | { type: 'TOGGLE_CABIN_DOOR' }
  | { type: 'TOGGLE_CABIN_WINDOWS' }
  | { type: 'TOGGLE_CABIN_SMOKE' }
  | { type: 'SHAKE_SCENE' }
  | { type: 'SET_TIME_OF_DAY'; payload: 'day' | 'night' }
  | { type: 'SET_POSITION'; payload: { element: 'tree' | 'cabin' | 'snowman'; x: number; y: number } }
  | { type: 'SET_SCROLL_Y'; payload: number }
  | { type: 'ADD_TERMINAL_COMMAND'; payload: { command: string; output: string } }
  | { type: 'CLEAR_TERMINAL' }
  | { type: 'SET_EASTER_EGG'; payload: boolean }
  | { type: 'TOGGLE_TERMINAL' }
  | { type: 'SHOW_SANTA' }
  | { type: 'RESET_SANTA' }
  | { type: 'SHOW_SANTA_ARMY'; payload: number }
  | { type: 'RESET_SANTA_ARMY' }
  | { type: 'START_GAME' }
  | { type: 'END_GAME' }
  | { type: 'ADD_GAME_SCORE'; payload: number };

// 현재 시간에 따라 낮/밤 판단 (6시 ~ 18시는 낮)
const getTimeOfDay = (): 'day' | 'night' => {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? 'day' : 'night';
};

const initialState: AppState = {
  snow: {
    amount: 100,
    speed: 1,
  },
  tree: {
    lightsOn: true,
    glowIntensity: 1,
    blinkSpeed: 800,
  },
  snowman: {
    hat: 0,
    scarf: 0,
    face: 0,
    seed: Date.now(),
  },
  cabin: {
    doorOpen: false,
    windowsLit: true,
    smokeOn: true,
  },
  terminal: {
    history: [],
    isEasterEgg: false,
    visible: true,
  },
  santa: {
    shouldShow: false,
    timestamp: 0,
  },
  santaArmy: {
    shouldShow: false,
    count: 0,
    timestamp: 0,
  },
  scene: {
    shake: false,
    timeOfDay: getTimeOfDay(),
    scrollY: 0,
  },
  positions: {
    tree: { x: 0, y: 0 },
    cabin: { x: 0, y: 0 },
    snowman: { x: 0, y: 0 },
  },
  game: {
    isActive: false,
    score: 0,
    timeLeft: 30,
  },
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SNOW_CONFIG':
      return {
        ...state,
        snow: { ...state.snow, ...action.payload },
      };
    case 'TOGGLE_TREE_LIGHTS':
      return {
        ...state,
        tree: {
          ...state.tree,
          lightsOn: !state.tree.lightsOn,
          glowIntensity: !state.tree.lightsOn ? 1 : 0.3,
        },
      };
    case 'SET_TREE_CONFIG':
      return {
        ...state,
        tree: { ...state.tree, ...action.payload },
      };
    case 'UPDATE_SNOWMAN':
      const newSeed = Date.now();
      return {
        ...state,
        snowman: {
          hat: Math.floor(Math.random() * 3),
          scarf: Math.floor(Math.random() * 4),
          face: Math.floor(Math.random() * 5),
          seed: newSeed,
        },
      };
    case 'TOGGLE_CABIN_DOOR':
      return {
        ...state,
        cabin: {
          ...state.cabin,
          doorOpen: !state.cabin.doorOpen,
        },
      };
    case 'TOGGLE_CABIN_WINDOWS':
      return {
        ...state,
        cabin: {
          ...state.cabin,
          windowsLit: !state.cabin.windowsLit,
        },
      };
    case 'TOGGLE_CABIN_SMOKE':
      return {
        ...state,
        cabin: {
          ...state.cabin,
          smokeOn: !state.cabin.smokeOn,
        },
      };
    case 'SHAKE_SCENE':
      // shake가 이미 true면 false로, false면 true로 토글 (애니메이션 재시작)
      return {
        ...state,
        scene: {
          ...state.scene,
          shake: !state.scene.shake,
        },
      };
    case 'SET_TIME_OF_DAY':
      return {
        ...state,
        scene: {
          ...state.scene,
          timeOfDay: action.payload,
        },
      };
    case 'SET_POSITION':
      return {
        ...state,
        positions: {
          ...state.positions,
          [action.payload.element]: {
            x: action.payload.x,
            y: action.payload.y,
          },
        },
      };
    case 'SET_SCROLL_Y':
      return {
        ...state,
        scene: {
          ...state.scene,
          scrollY: action.payload,
        },
      };
    case 'ADD_TERMINAL_COMMAND':
      return {
        ...state,
        terminal: {
          ...state.terminal,
          history: [
            ...state.terminal.history,
            {
              command: action.payload.command,
              output: action.payload.output,
              timestamp: Date.now(),
            },
          ],
        },
      };
    case 'CLEAR_TERMINAL':
      return {
        ...state,
        terminal: {
          ...state.terminal,
          history: [],
        },
      };
    case 'SET_EASTER_EGG':
      return {
        ...state,
        terminal: {
          ...state.terminal,
          isEasterEgg: action.payload,
        },
      };
    case 'TOGGLE_TERMINAL':
      return {
        ...state,
        terminal: {
          ...state.terminal,
          visible: !state.terminal.visible,
        },
      };
    case 'SHOW_SANTA':
      return {
        ...state,
        santa: {
          shouldShow: true,
          timestamp: Date.now(),
        },
      };
    case 'RESET_SANTA':
      return {
        ...state,
        santa: {
          shouldShow: false,
          timestamp: state.santa.timestamp,
        },
      };
    case 'SHOW_SANTA_ARMY':
      return {
        ...state,
        santaArmy: {
          shouldShow: true,
          count: action.payload,
          timestamp: Date.now(),
        },
      };
    case 'RESET_SANTA_ARMY':
      return {
        ...state,
        santaArmy: {
          shouldShow: false,
          count: state.santaArmy.count,
          timestamp: state.santaArmy.timestamp,
        },
      };
    case 'START_GAME':
      return {
        ...state,
        game: {
          isActive: true,
          score: 0,
          timeLeft: 30,
        },
      };
    case 'END_GAME':
      return {
        ...state,
        game: {
          ...state.game,
          isActive: false,
        },
      };
    case 'ADD_GAME_SCORE':
      return {
        ...state,
        game: {
          ...state.game,
          score: state.game.score + action.payload,
        },
      };
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setSnowConfig = (config: Partial<SnowConfig>) => {
    dispatch({ type: 'SET_SNOW_CONFIG', payload: config });
  };

  const toggleTreeLights = () => {
    dispatch({ type: 'TOGGLE_TREE_LIGHTS' });
  };

  const setTreeConfig = (config: Partial<TreeState>) => {
    dispatch({ type: 'SET_TREE_CONFIG', payload: config });
  };

  const updateSnowman = () => {
    dispatch({ type: 'UPDATE_SNOWMAN' });
  };

  const toggleCabinDoor = () => {
    dispatch({ type: 'TOGGLE_CABIN_DOOR' });
  };

  const toggleCabinWindows = () => {
    dispatch({ type: 'TOGGLE_CABIN_WINDOWS' });
  };

  const toggleCabinSmoke = () => {
    dispatch({ type: 'TOGGLE_CABIN_SMOKE' });
  };

  const shakeScene = () => {
    dispatch({ type: 'SHAKE_SCENE' });
    setTimeout(() => {
      dispatch({ type: 'SHAKE_SCENE' }); // 리셋은 reducer에서 처리하지 않고 여기서 처리
    }, 1000);
  };

  const setTimeOfDay = (timeOfDay: 'day' | 'night') => {
    dispatch({ type: 'SET_TIME_OF_DAY', payload: timeOfDay });
  };

  const setPosition = (element: 'tree' | 'cabin' | 'snowman', x: number, y: number) => {
    dispatch({ type: 'SET_POSITION', payload: { element, x, y } });
  };

  const setScrollY = (scrollY: number) => {
    dispatch({ type: 'SET_SCROLL_Y', payload: scrollY });
  };

  const addTerminalCommand = (command: string, output: string) => {
    dispatch({ type: 'ADD_TERMINAL_COMMAND', payload: { command, output } });
  };

  const clearTerminal = () => {
    dispatch({ type: 'CLEAR_TERMINAL' });
  };

  const setEasterEgg = (enabled: boolean) => {
    dispatch({ type: 'SET_EASTER_EGG', payload: enabled });
  };

  const toggleTerminal = () => {
    dispatch({ type: 'TOGGLE_TERMINAL' });
  };

  const showSanta = () => {
    dispatch({ type: 'SHOW_SANTA' });
  };

  const resetSanta = () => {
    dispatch({ type: 'RESET_SANTA' });
  };

  const showSantaArmy = (count: number) => {
    dispatch({ type: 'SHOW_SANTA_ARMY', payload: count });
  };

  const resetSantaArmy = () => {
    dispatch({ type: 'RESET_SANTA_ARMY' });
  };

  const startGame = () => {
    dispatch({ type: 'START_GAME' });
  };

  const endGame = () => {
    dispatch({ type: 'END_GAME' });
  };

  const addGameScore = (points: number) => {
    dispatch({ type: 'ADD_GAME_SCORE', payload: points });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setSnowConfig,
        toggleTreeLights,
        setTreeConfig,
        updateSnowman,
        toggleCabinDoor,
        toggleCabinWindows,
        toggleCabinSmoke,
        shakeScene,
        setTimeOfDay,
        setPosition,
        setScrollY,
        addTerminalCommand,
        clearTerminal,
        setEasterEgg,
        toggleTerminal,
        showSanta,
        resetSanta,
        showSantaArmy,
        resetSantaArmy,
        startGame,
        endGame,
        addGameScore,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

