# ❄️ Snowy Dev Village 🎄

개발자 감성의 크리스마스 테마 인터랙티브 웹사이트

## 🎯 프로젝트 개요

크리스마스 감성과 개발자 요소를 자연스럽게 결합한 단일 페이지 웹사이트입니다.
- 눈 내리는 밤 배경
- 인터랙티브 크리스마스 트리
- 커스터마이징 가능한 눈사람
- 개발자 터미널 UI

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`로 접속하세요.

### 빌드

```bash
npm run build
```

## 🎮 사용법

### 터미널 명령어

- `help` - 사용 가능한 명령어 목록 확인
- `snow [0-500]` - 눈의 양 조절 (예: `snow 200`)
- `lights on/off` - 트리 전구 켜기/끄기
- `build` - 프로젝트 빌드 시뮬레이션
- `git status` - Git 상태 확인
- `clear` - 터미널 화면 지우기

### 인터랙션

- **크리스마스 트리**: 클릭하여 전구 켜기/끄기
- **눈사람**: 클릭하여 모자, 목도리, 얼굴 요소 랜덤 변경

### 🎁 이스터에그

Konami Code를 입력해보세요: `↑ ↑ ↓ ↓ ← → ← → B A`

눈폭풍 효과가 발생합니다!

## 🛠 기술 스택

- React 18
- TypeScript
- Vite
- Framer Motion
- Canvas API

## 📁 프로젝트 구조

```
src/
├── components/        # UI 컴포넌트
│   ├── SnowCanvas.tsx    # 눈 내림 Canvas
│   ├── Tree.tsx          # 크리스마스 트리
│   ├── Snowman.tsx       # 눈사람
│   ├── TerminalPanel.tsx # 터미널 UI
│   └── SceneContainer.tsx # 씬 컨테이너
├── context/          # 상태 관리
│   └── AppContext.tsx
├── types/            # TypeScript 타입 정의
│   └── index.ts
├── App.tsx           # 메인 앱 컴포넌트
├── App.css           # 글로벌 스타일
└── main.tsx          # 진입점
```

## 🎨 디자인 컨셉

- **색상**: 네이비/다크 배경 + 화이트 눈 + 따뜻한 전구색
- **폰트**: 모노스페이스 (터미널), 시스템 폰트 (일반 텍스트)
- **애니메이션**: 부드러운 전환과 깜빡임 효과
- **반응형**: 모바일 친화적 디자인

## 📝 라이센스

MIT

