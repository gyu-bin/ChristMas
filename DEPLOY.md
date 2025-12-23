# 배포 가이드

## 📦 빌드 확인

빌드가 완료되면 `dist` 폴더에 배포 가능한 파일들이 생성됩니다.

```bash
npm run build
```

## 🚀 배포 방법

### 방법 1: Vercel (추천 - 가장 간단)

1. **Vercel 계정 만들기**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인 (또는 새 계정 생성)

2. **프로젝트 배포**
   - Vercel 대시보드에서 "Add New Project" 클릭
   - GitHub 저장소 선택 또는 로컬 프로젝트 업로드
   - 프로젝트 설정:
     - Framework Preset: `Vite`
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - "Deploy" 클릭

3. **완료!**
   - 몇 분 후 배포된 URL이 생성됩니다
   - 자동으로 HTTPS와 CDN이 제공됩니다

### 방법 2: Netlify

1. **Netlify 계정 만들기**
   - https://www.netlify.com 접속

2. **프로젝트 배포**
   - "Add new site" → "Import an existing project"
   - GitHub 저장소 연결 또는 드래그 앤 드롭
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - "Deploy site" 클릭

### 방법 3: GitHub Pages

1. **GitHub 저장소 생성 및 푸시**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **GitHub Pages 설정**
   - 저장소 Settings → Pages
   - Source: GitHub Actions 선택
   - 또는 gh-pages 브랜치 사용

3. **워크플로우 파일 생성** (`.github/workflows/deploy.yml`)
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [ main ]
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm ci
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

### 방법 4: 로컬 빌드 후 직접 배포

빌드된 `dist` 폴더의 내용을 원하는 웹 호스팅 서비스에 업로드하면 됩니다.

## 🔗 빠른 배포 (Vercel CLI)

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

## ✅ 배포 전 체크리스트

- [ ] `npm run build` 성공 확인
- [ ] `dist` 폴더에 파일 생성 확인
- [ ] 이미지 파일들이 `public` 폴더에 있는지 확인
- [ ] 환경 변수 설정 확인 (필요한 경우)

