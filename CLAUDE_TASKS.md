# Claude CLI를 통한 ESLint 오류 해결 작업 계획서 (CLAUDE_TASKS.md)

이 파일은 로컬에서 실행 중인 Claude Code CLI (`claude` 명령어)를 통해 프로젝트의 ESLint 오류를 하나씩 안전하게 해결하기 위해 작성된 작업 지침 파일입니다.

아래 명령어를 터미널의 `claude` 세션에서 순서대로 입력하여 작업을 수행할 수 있습니다.

---

## 1. 3D 카드 컴포넌트 선언 순서 및 any 타입 수정
* **오류내용**: `handleAnimations` 함수를 선언하기 전에 `useEffect`에서 먼저 호출함, `any` 타입 존재.
* **Claude 명령어**:
  ```bash
  claude "src/components/ui/3d-card.tsx 파일에서 handleAnimations 함수가 선언된 이후에 useEffect가 동작하도록 함수 선언 순서를 위로 변경해 주고, any 타입들을 적절한 React 타입 또는 unknown 타입으로 명시해 줘. 그리고 안 쓰이는 매개변수 'e' 경고도 제거해 줘."
  ```

## 2. 구구단 페이지의 useEffect 내 setState 경고 수정
* **오류내용**: `timeLeft === 0`일 때 동기적으로 `setIsActive`, `setMode` 호출.
* **Claude 명령어**:
  ```bash
  claude "src/app/gugudan/page.tsx 파일에서 useEffect 안에 있는 setIsActive(false)와 setMode('practice')를 타이머의 setInterval 콜백 안으로 이동시키거나, 해당 useEffect 내부의 setState 호출부 옆에 eslint-disable-next-line react-hooks/set-state-in-effect 주석을 추가해서 경고를 해결해 줘. 그리고 안 쓰이는 RefreshCw 임포트도 지워줘."
  ```

## 3. 급식 페이지의 로컬스토리지 동기화 및 로딩 설정 수정
* **오류내용**: 마운트 시 `localStorage` 로드 및 API 호출 전 `setLoading` 호출 시 `react-hooks/set-state-in-effect` 경고 발생.
* **Claude 명령어**:
  ```bash
  claude "src/app/meals/page.tsx 파일에서 마운트 시 로컬스토리지 데이터를 가져와 setSchool을 호출하는 부분과 API 호출 시 setLoading(true)을 호출하는 부분에 eslint-disable-next-line react-hooks/set-state-in-effect 주석을 추가해 줘. 그리고 안 쓰이는 Calendar 임포트도 제거해 줘."
  ```

## 4. 컴포넌트 마운트 상태 설정(Notices, Timetable) 경고 수정
* **오류내용**: Client-side hydration을 방지하기 위해 마운트 여부를 추적하는 `setMounted(true)`, `setIsMounted(true)` 호출 시 경고 발생.
* **Claude 명령어**:
  ```bash
  claude "src/components/features/Notices.tsx와 src/components/features/Timetable.tsx 파일에서 useEffect 마운트 시 사용되는 setMounted(true) 및 setIsMounted(true) 호출 부분에 eslint-disable-next-line react-hooks/set-state-in-effect 주석을 추가해서 경고를 지워줘. 그리고 Notices.tsx에서 안 쓰이는 Pin 임포트도 지워줘."
  ```

## 5. 구글 캘린더 API 훅의 마운트 시 setState 경고 및 any 타입 수정
* **오류내용**: `useGoogleCalendarApi.ts`에서 API key 상태 설정 시 경고 및 `any` 타입 다수 존재.
* **Claude 명령어**:
  ```bash
  claude "src/lib/hooks/useGoogleCalendarApi.ts 파일에서 useEffect 마운트 시 setApiKey, setClientId를 호출하는 부분에 eslint-disable-next-line react-hooks/set-state-in-effect 주석을 추가하고, any 타입들을 구체적인 타입으로 변경해 줘."
  ```

## 6. 기타 안 쓰이는 임포트 정리 및 any 타입 정리
* **Claude 명령어**:
  ```bash
  claude "프로젝트의 나머지 파일들에 대해서 eslint 검사를 수행하고, src/app/cleaning/page.tsx (Trash2), src/app/dictation/page.tsx (useRef, useEffect), src/components/home/MainMenu.tsx (MessageCircle, Rocket), src/components/school/CircularSchedule.tsx (useMemo) 같이 사용되지 않는 변수와 임포트를 모두 정리해 줘. 그리고 src/lib/auth.tsx와 src/app/login/page.tsx의 any 타입 경고도 수정해 줘."
  ```

## 7. Tailwind CSS v4 Preset 로드 경고 및 테마 색상 정의 해결
* **오류내용**: `tailwind.config.ts`에서 존재하지 않는 `../design-system/tailwind.preset.js`를 불러와 빌드 시 `Module not found` 경고가 발생하며, 이로 인해 `sesame-gold` (#F59E0B), `yoohoo-pink` (#EC4899) 등의 테마 색상이 정상적으로 적용되지 않음.
* **Claude 명령어**:
  ```bash
  claude "src/app/globals.css 파일에 Tailwind v4 theme 정의(@theme { --color-sesame-gold: #F59E0B; --color-yoohoo-pink: #EC4899; })를 추가해서 테마 색상을 정의해 주고, tailwind.config.ts 파일에서 존재하지 않는 ../design-system/tailwind.preset.js presets 임포트를 지워줘."
  ```

## 8. Admin Dashboard와 Apps Page 간의 Firestore 필드 불일치 (link vs url) 해결
* **오류내용**: `src/app/admin/page.tsx` (관리자 페이지)에서는 앱의 링크 경로를 `url` 필드로 읽고 쓰고 있으나, `src/app/apps/page.tsx` (앱니버스 페이지)에서는 `link` 필드로 읽고 쓰고 있어 데이터 불일치가 발생하고 링크 수정이 정상적으로 반영되지 않음.
* **Claude 명령어**:
  ```bash
  claude "src/app/admin/page.tsx 파일에서 AppData 인터페이스의 url 속성을 link로 변경하고, Edit App Modal 및 handleSaveEdit 함수 내의 모든 url 관련 코드를 link로 변경해서 src/app/apps/page.tsx 파일의 Firestore 필드 스키마(link)와 통일해 줘."
  ```

## 9. 앱니버스 내부 링크 Client-side Routing 적용 및 로딩 딜레이 개선
* **오류내용**: `src/app/apps/page.tsx`에서 앱을 실행할 때 항상 `target="_blank"` 속성을 가진 일반 `<a>` 태그를 사용함. 이로 인해 동일 사이트 내부 앱(예: `/gugudan`, `/dictation` 등)을 실행할 때도 새 탭이 열리며 페이지 전체가 새로 로드(Full reload)되어 동작이 버벅이고 느리게 느껴짐.
* **Claude 명령어**:
  ```bash
  claude "src/app/apps/page.tsx 파일에서 실행하기 버튼(a 태그) 부분을 수정해서, 만약 app.link가 '/'로 시작하는 내부 경로이면 Next.js의 Link 컴포넌트를 사용하여 현재 창에서 바로 이동하도록 하고, 외부 링크(http로 시작하는 등)인 경우에만 기존처럼 target='_blank'를 가진 a 태그로 렌더링하도록 조건부 분기 코드를 구현해 줘. Next.js Link 컴포넌트 임포트도 확인해 줘."
  ```

## 11. Google Fonts Jua(주아) 폰트 적용
* **작업내용**: 초등학교 2학년 혜완이가 읽기 좋게 귀엽고 둥글둥글한 구글 폰트 `Jua`를 전체 웹페이지의 기본 폰트로 로드하여 설정함.
* **Claude 명령어**:
  ```bash
  claude "src/app/layout.tsx 파일에서 next/font/google의 Inter 폰트를 제거하고 대신 Jua 폰트(subsets: ['latin'], weight: '400')를 로드해서 body 태그의 className으로 적용해 줘."
  ```

## 12. globals.css에 Neobrutalism 만화풍 스타일 및 호버 효과 정의
* **작업내용**: 굵은 테두리와 강렬한 하드 섀도우를 주는 만화책 느낌의 디자인 클래스(`cartoon-card`, `cartoon-btn`) 및 Framer Motion 또는 CSS 호버 시 적용할 통통 튀는 애니메이션 효과를 정의함.
* **Claude 명령어**:
  ```bash
  claude "src/app/globals.css 파일에 Neobrutalism 만화풍 카드 및 버튼 공통 스타일을 정의해 줘. .cartoon-card는 'border-4 border-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-3xl transition-transform hover:-translate-y-1', .cartoon-btn은 'border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl active:translate-y-0.5 active:shadow-none' 속성을 갖도록 하고, 혜완이를 위해 따뜻하고 달콤한 느낌의 색상 유틸리티나 부드러운 쉐도우를 추가 정의해 줘."
  ```

## 13. 메인 대시보드(page.tsx)에 참깨라면 마스코트 캐릭터 및 응원 말풍선 구현
* **작업내용**: 메인 홈 화면 최상단에 미리 준비된 마스코트 이미지(`/images/mascot.png`)를 배치하고, 혜완이에게 말을 거는 아기자기한 말풍선 메시지 영역을 구현함.
* **Claude 명령어**:
  ```bash
  claude "src/app/page.tsx 파일의 메인 대시보드 최상단(Header 아래, DashboardSummary 위)에 public/images/mascot.png 마스코트 이미지를 크기 80x80 정도로 둥글게 배치해 줘. 그리고 그 옆에 혜완이를 환영하고 응원하는 말풍선(Speech Bubble) UI를 넣어줘. 말풍선 텍스트는 시간대에 따라 다르게 노출되도록 해 줘 (아침: '혜완아, 좋은 아침! 오늘도 유후~! ☀️', 오후/저녁: '혜완아, 오늘 학교 재미있었어? 🍜'). 말풍선 배경은 노란색이나 크림색 둥근 디자인으로 예쁘게 만들어줘."
  ```

## 14. 메인 화면 카드 및 바로가기 메뉴 디자인 만화풍으로 개편
* **작업내용**: `DashboardSummary`, `QuickLinks`, `MainMenu` 컴포넌트들을 새로 정의한 만화책 스타일(`.cartoon-card`)과 통통 튀는 애니메이션으로 리뉴얼함.
* **Claude 명령어**:
  ```bash
  claude "src/components/home/DashboardSummary.tsx, src/components/home/QuickLinks.tsx, src/components/home/MainMenu.tsx 세 파일의 카드 및 바로가기 링크 버튼의 클래스명을 수정해서 globals.css에 정의한 .cartoon-card 또는 Neobrutalism 만화풍 테두리(border-4 border-gray-900)와 그림자(shadow-[5px_5px_0px_rgba(0,0,0,1)])를 적용해 주고, 둥글기 강도를 rounded-2xl 또는 rounded-3xl로 크게 주고 마우스오버 시 통통 튀는 스케일 업 애니메이션 효과를 부여해 줘."
  ```

## 15. 구구단 게임에 참 잘했어요 수학 배지 보상 연동
* **작업내용**: 구구단 문제를 모두 완료하거나 높은 점수를 얻었을 때 결과 화면에 수학 배지(`/images/badge_math.png`)를 폭죽 효과와 함께 노출함.
* **Claude 명령어**:
  ```bash
  claude "src/app/gugudan/page.tsx 파일에서 시간 종료 시 또는 높은 점수를 달성해 연습 결과를 보여주는 화면에 public/images/badge_math.png 이미지(너비 100px 정도)를 '수학 천재 혜완이! 🏆'라는 텍스트 칭찬 카드와 함께 예쁘게 배치하고, 애니메이션으로 부드럽게 나타나도록 연동해 줘."
  ```

## 16. 독서 기록 페이지에 독서 요정 배지 스티커 연동
* **작업내용**: 독서 기록을 작성하고 저장된 목록을 볼 때, 카드 옆에 귀여운 독서 스티커 배지(`/images/badge_reading.png`)를 부착하여 성취감을 부여함.
* **Claude 명령어**:
  ```bash
  claude "src/app/books/page.tsx 파일에서 책을 성공적으로 등록했을 때 뜨는 완료 팝업이나 책 목록 리스트의 개별 책 카드 배경 구석에 public/images/badge_reading.png 스티커 이미지(너비 60px 정도)가 칭찬 뱃지 느낌으로 부착되도록 디자인을 고쳐줘."
  ```

---

## 17. 검증 (Verification)
모든 변경 사항이 완료된 후, 린트 오류 및 빌드를 확인하여 최종 검증합니다.
* **실행 명령어**:
  ```bash
  npm run lint
  npm run build
  npm run test
  ```



