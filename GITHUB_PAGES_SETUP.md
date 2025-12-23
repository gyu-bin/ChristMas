# GitHub Pages 배포 설정 가이드

## ⚠️ 현재 문제
저장소가 **Private**이라서 일반 GitHub Pages 설정이 비활성화되어 있습니다.

## ✅ 해결 방법

### 방법 1: 저장소를 Public으로 변경 (추천)
1. GitHub 저장소로 이동: https://github.com/gyu-bin/ChristMas
2. **Settings** → **General** (맨 아래로 스크롤)
3. **Danger Zone** → **Change repository visibility**
4. **Change visibility** → **Make public** 선택
5. 저장소 이름 입력하여 확인

### 방법 2: GitHub Actions로 배포 (Private 저장소 가능)
1. GitHub 저장소로 이동: https://github.com/gyu-bin/ChristMas
2. **Settings** → **Pages** 클릭
3. **Source** 섹션에서:
   - "Deploy from a branch" 대신 **"GitHub Actions"** 선택
   - (만약 "GitHub Actions" 옵션이 보이지 않으면 저장소를 public으로 변경하세요)

4. **Actions** 탭에서 배포 상태 확인:
   - https://github.com/gyu-bin/ChristMas/actions
   - "Deploy to GitHub Pages" 워크플로우가 실행 중인지 확인
   - 성공하면 초록색 체크마크가 표시됩니다

5. 배포 완료 후 접속:
   - `https://gyu-bin.github.io/ChristMas/`

## 📝 참고사항

- Private 저장소에서는 무료 플랜에서 GitHub Pages가 제한될 수 있습니다
- Public 저장소로 변경하는 것이 가장 간단한 방법입니다
- 이미 워크플로우 파일은 푸시되어 있으므로, 저장소를 public으로 변경하고 Settings → Pages에서 "GitHub Actions"를 선택하면 자동으로 배포됩니다

