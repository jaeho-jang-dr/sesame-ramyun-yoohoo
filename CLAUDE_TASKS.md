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

## 18. Neobrutalism 스타일을 부드러운 파스텔풍 심플 디자인으로 전면 개편
* **개선내용**: 만화책풍 입체 디자인(굵은 검은색 테두리 및 강한 검은색 섀도우)이 눈을 피로하게 만들고 글자의 가독성을 해치므로, 테두리를 얇고 은은하게 바꾸고 그림자를 매우 부드러운 파스텔톤 소프트 섀도우로 전면 개편하여 심플하고 예쁜 디자인을 구현함.
* **Claude 명령어**:
  ```bash
  claude "globals.css 파일의 .cartoon-card와 .cartoon-btn 클래스에서 border-4 border-gray-900 및 강한 검은색 그림자(shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]) 설정을 모두 지우고, 대신 얇은 테두리(border border-gray-200/50 또는 border border-orange-100/40)와 부드러운 소프트 블러 그림자(shadow-md 또는 shadow-lg)를 적용해 줘. 그리고 page.tsx의 마스코트 말풍선(말풍선 꼬리 border 포함)의 검은 테두리를 모두 걷어내고 부드럽고 예쁘게 둥근 파스텔 테마로 감싸서 글자가 시각적으로 아주 잘 보이게 만들어 줘."
  ```

## 19. firestore.rules 날짜 만료 해결 및 보안 규칙 정밀 세팅
* **작업내용**: 만료된 개발용 기한 조건(`timestamp.date(2026, 2, 26)`)을 제거하고, `apps`, `guestbook` 및 방명록 댓글 서브컬렉션에 대해 로그인 정보 기반 규칙을 정의하여 쓰기 차단 에러를 해결함.
* **Claude 명령어**:
  ```bash
  claude "firestore.rules 파일을 수정해 줘. 만료된 임시 read/write 규칙을 지우고, apps 컬렉션 규칙은 그대로 두고, guestbook 컬렉션과 그 하위의 comments 서브컬렉션 규칙을 추가해 줘. 규칙 상세: 조회는 누구나 허용(allow read: if true;), 등록은 로그인한 유저만 허용(allow create: if request.auth != null;), 수정 및 삭제는 본인(request.auth.uid == resource.data.authorId) 또는 관리자 이메일('drjang00@gmail.com', '102030hohoho@gmail.com')을 가진 유저만 허용하도록 정의하고, 나머지 컬렉션은 전체 차단해 줘."
  ```

## 20. 방문자 게시판 고도화 (카드/리스트 뷰 토글, 답글 시스템, 반응자 정보 툴팁 연동)
* **작업내용**: 방명록 페이지를 고도화하여 뷰 전환 스위치, 답글 서브컬렉션 연동, 반응 수 및 누른 사용자 툴팁 표출, 관리자 편의성 제어 등을 일괄 개발함.
* **Claude 명령어**:
  ```bash
  claude "src/app/guestbook/page.tsx 파일을 수정해 줘. 1) 카드형/리스트형을 고르는 뷰 토글 버튼 스위치 추가. 2) 각 글 하단에 답글(댓글) 영역과 답글 리스트(Firestore 서브컬렉션 /guestbook/{messageId}/comments 연동) 및 답글 쓰기 영역 구현. 3) 이모지 반응 데이터 구조를 ReactionUser(uid, name)[] 형태로 변경하여 클릭 시 반응 수(숫자)와 해당 반응을 누른 친구들의 실명 목록이 마우스오버 시 툴팁(Speech Bubble 스타일)으로 나타나게 함. 4) 관리자(isAdmin) 계정일 때 개별 글 및 댓글을 즉시 삭제할 수 있는 휴지통 아이콘 제공."
  ```

## 21. 관리자 대시보드 방명록/댓글 모니터링 연동
* **작업내용**: 관리자 페이지에서 전체 방명록 글에 연동된 댓글까지 한번에 파악하고 삭제할 수 있도록 백오피스 통제 능력을 업데이트함.
* **Claude 명령어**:
  ```bash
  claude "src/app/admin/page.tsx 파일을 수정해서 관리자 대시보드 방명록 관리 리스트 내에 작성자가 단 댓글 수나 답글 정보를 일부 볼 수 있는 텍스트를 추가하고, 댓글 서브컬렉션을 포함하여 불량 방명록 글을 삭제하거나 통제할 수 있는 백오피스 기능을 확인 및 보강해 줘."
  ```

## 22. AuthProvider 사용자 로그인 정보 Firestore 동기화 및 차단 세션 처리
* **작업내용**: `src/lib/auth.tsx`의 `AuthProvider` 내 `onAuthStateChanged`에서 로그인 감지 시 `/users/{uid}` 경로에 사용자 프로필(uid, email, displayName, photoURL, lastLogin, role, isBanned)을 병합 저장하고, 차단된 사용자(`isBanned === true`)로 조회될 경우 즉시 로그아웃(signOut)시키도록 보강함.
* **Claude 명령어**:
  ```bash
  claude "src/lib/auth.tsx 파일을 수정해 줘. AuthProvider 내의 useEffect 마운트 시 onAuthStateChanged 콜백 함수 안에, 사용자가 로그인했을 때 Firestore의 /users/{uid} 문서에 사용자 정보(uid, email, displayName, photoURL, lastLogin: serverTimestamp(), role: admin여부, isBanned: false(기본값))를 setDoc(..., { merge: true })로 병합 동기화하는 비동기 함수를 호출하도록 구현해 줘. 그리고 동기화 시 이미 차단된 유저(isBanned === true)로 조회되면 즉시 signOut(auth)을 호출해 세션을 끊고 경고창을 띄우는 로직도 추가해 줘. 임포트 누락도 확인해 줘."
  ```

## 23. firestore.rules 차단 유저 접근 금지 및 신규 컬렉션 규칙 추가
* **작업내용**: 차단된 유저의 접근을 전면 금지하는 규칙과 `/users`, `/settings` 컬렉션 보안 설정을 `firestore.rules`에 정밀 반영함.
* **Claude 명령어**:
  ```bash
  claude "firestore.rules 파일을 수정해 줘. 1) isBanned() 공통 헬퍼 함수 추가 (로그인 상태에서 users 컬렉션의 해당 uid 문서의 isBanned 필드가 true인지 확인). 2) 모든 컬렉션(apps, guestbook, comments)의 쓰기/수정 권한에 isBanned가 아닐 때만 허용하도록 if 조건 추가. 3) users 컬렉션(/users/{userId}) 보안 규칙 추가: 누구나 로그인하면 본인 프로필 읽기/쓰기 허용(isBanned 아닐 때), 관리자는 수정 허용. 4) settings 컬렉션(/settings/{docId}) 보안 규칙 추가: 조회는 누구나 허용(isBanned 아닐 때), 작성/수정/삭제는 관리자(isAdmin)만 허용."
  ```

## 24. 관리자 대시보드(admin/page.tsx) 사용자 관리 및 오늘의 한마디 설정 패널 추가
* **작업내용**: 관리자 페이지에 사용자 목록(조회/차단) 탭과 오늘의 한마디 실시간 설정 폼을 추가하고, 방명록 필드명 동기화 및 `formatDate` 예외 방어 처리를 수행함.
* **Claude 명령어**:
  ```bash
  claude "src/app/admin/page.tsx 파일을 수정해 줘. 1) 화면 레이아웃에 사용자 관리 탭을 추가해서 Firestore /users 컬렉션의 모든 유저 목록(이름, 이메일, 마지막 로그인 시간, 역할, 차단 상태)을 실시간(onSnapshot) 조회하게 하고, 차단/차단해제 버튼 및 관리자 권한 지정 버튼 연동. 2) 상단에 오늘의 한마디 입력 폼을 신설해 Firestore /settings/mascot 문서의 message 필드로 실시간 조회 및 저장(setDoc) 연동. 3) 방명록 리스트에서 이름과 메시지가 깨지지 않게 필드명을 authorName, message로 바꾸고, formatDate 함수에 toDate() 호출 예외 안전 검증(typeof timestamp.toDate === 'function')을 추가해 줘."
  ```

## 25. 메인 대시보드(page.tsx) 실시간 오늘의 한마디 연동
* **작업내용**: 메인 홈 화면 진입 시 관리자가 입력한 '오늘의 한마디'를 Firestore로부터 읽어와 마스코트 말풍선에 연동함.
* **Claude 명령어**:
  ```bash
  claude "src/app/page.tsx 파일을 수정해서, 마운트 시 Firestore의 /settings/mascot 문서를 가져와(getDoc) 만약 설정된 message가 존재하면 해당 텍스트를 말풍선(greeting 상태)에 적용하고, 없을 때만 기존 시간대별 메시지를 기본값으로 표시하도록 렌더링 연동을 완료해 줘."
  ```

## 27. page.test.tsx 내 Firebase Firestore Mock 에러 해결
* **오류내용**: `page.tsx`에 Firestore `doc` 및 `getDoc`이 도입되면서, `page.test.tsx` 테스트 파일에서 해당 함수들이 모킹되지 않아 `TypeError: (0 , _firestore.doc) is not a function` 경고가 발생함.
* **Claude 명령어**:
  ```bash
  claude "src/app/page.test.tsx 파일에서 firebase/firestore 모킹 객체에 doc과 getDoc 모의 함수를 추가해서 테스트 실행 시 TypeError 경고가 출력되지 않고 통과되도록 수정해 줘."
  ```

## 28. hwkim2571@gmail.com 계정을 관리자 목록에 추가
* **작업내용**: `src/lib/auth.tsx`와 `firestore.rules`의 관리자 이메일 목록에 `'hwkim2571@gmail.com'`을 추가함.
* **Claude 명령어**:
  ```bash
  claude "src/lib/auth.tsx 파일의 ADMIN_EMAILS 목록에 'hwkim2571@gmail.com'을 추가해 주고, firestore.rules 파일의 isAdmin() 함수 내 관리자 이메일 배열에도 'hwkim2571@gmail.com'을 추가해 줘."
  ```

---

## 30. 방명록 삭제 실패 오류 및 답글 삭제 권한 해결
* **오류내용**: 
  1. 방명록 글을 삭제할 때 하위 답글(댓글)을 먼저 삭제하도록 구현되어 있으나, 타인이 단 답글이 있을 경우 Firestore Rules에 의해 일반 사용자가 답글을 삭제할 수 없어 전체 방명록 글 삭제가 권한 에러(PERMISSION_DENIED)로 실패하는 현상.
  2. 로컬에서 수정된 최신 `firestore.rules`가 Firebase 서버에 배포되지 않아 발생했을 가능성.
* **해결방법**:
  1. `firestore.rules` 파일 내 `match /comments/{commentId}` 규칙을 수정하여, 본인 댓글이나 관리자뿐만 아니라 **해당 방명록 글의 소유자(게시글 작성자)**도 하위 댓글을 삭제할 수 있도록 `allow delete` 권한에 `request.auth.uid == get(/databases/$(database)/documents/guestbook/$(messageId)).data.authorId` 조건을 추가합니다.
  2. 수정 후 Firebase CLI를 통해 규칙을 배포하는 명령어를 실행합니다 (`npx firebase deploy --only firestore:rules`).
* **Claude 명령어**:
  ```bash
  claude "firestore.rules 파일을 수정해 줘. guestbook 컬렉션 내의 comments 서브컬렉션 delete 규칙(match /comments/{commentId}의 allow delete)에 '해당 방명록 글의 소유자(게시글 작성자)'도 삭제할 수 있도록 조건을 추가해 줘. 즉, 기존 조건에 || request.auth.uid == get(/databases/\$(database)/documents/guestbook/\$(messageId)).data.authorId 를 추가해서 방명록 글 소유자가 글을 지울 때 하위 댓글들도 정상적으로 삭제되게 해 줘. 그리고 수정이 끝나면 npx firebase deploy --only firestore:rules 명령어를 직접 실행해서 Firebase 서버에 규칙을 배포해 줘."
  ```

---

## 32. 방명록 삭제 오류 정밀 해결 및 구버전 스키마 호환성 대응
* **오류내용**:
  1. **isBanned()의 필드 누락 에러**: 기존 사용자(예: Jaeho Jang 등)는 Firestore `/users/{uid}` 문서에 `isBanned` 필드가 존재하지 않습니다. Firestore Security Rules는 존재하지 않는 맵의 키를 직접 접근할 때(`get(...).data.isBanned`) 런타임 에러를 발생시켜, `!isBanned()`를 통과해야 하는 모든 쓰기/삭제 요청이 `PERMISSION_DENIED`로 무조건 차단됩니다.
  2. **구버전 방명록 데이터의 소유자 매핑 에러**: 구버전 방명록 문서는 `authorId`가 아니라 `userId` 필드에 작성자 UID를 저장하고 있으며, 내용도 `message`가 아니라 `content`에 저장되어 있습니다. 이로 인해 rules에서 `isOwner(resource.data.authorId)` 검사가 실패하고, UI상에서도 빈 카드로 나타나는 문제가 발생합니다.
* **해결방법**:
  1. `firestore.rules` 파일 내 `isBanned()` 함수에서 `'isBanned' in get(...).data` 검사 조건을 먼저 추가하여 단락평가(short-circuit)로 필드 누락 런타임 에러를 방지합니다.
  2. `firestore.rules` 내의 `guestbook` 컬렉션 및 `comments` 서브컬렉션의 `update`/`delete` 규칙에 `resource.data.authorId` 뿐만 아니라 구버전 필드인 `resource.data.userId` (또는 `.get('userId', '')` 등 안전한 읽기)도 동일하게 검사하도록 수정합니다.
  3. `src/app/guestbook/page.tsx`와 `src/app/admin/page.tsx` 파일 내에서 Firestore 데이터를 불러오는 부분을 수정하여, 구버전 필드(`content`, `userId`, `userName`)가 존재할 경우 새 스키마 필드(`message`, `authorId`, `authorName`)로 올바르게 복사/정규화(Normalize)하도록 코드를 보강합니다.
* **Claude 명령어**:
  ```bash
  claude "firestore.rules와 src/app/guestbook/page.tsx, src/app/admin/page.tsx를 수정해 줘. 1) firestore.rules의 isBanned() 함수에서 exists() 검사 바로 뒤에 && ('isBanned' in get(/databases/\$(database)/documents/users/\$(request.auth.uid)).data) 를 추가하여 isBanned 필드가 없을 때의 런타임 에러를 차단하고, guestbook 및 comments 컬렉션의 update/delete 허용 조건에 구버전 필드인 userId 검사 및 get().data.get('userId', '') 형태의 안전한 parent 검사를 추가해 줘. 2) 두 tsx 파일에서 방명록 리스트 조회 시, 각 문서의 data.message || data.content, data.authorId || data.userId, data.authorName || data.userName 값을 매핑하도록 코드를 정규화(Normalize)해 줘."
  ```

---

## 33. 검증 (Verification)
모든 변경 사항이 완료된 후, 린트 오류 및 빌드를 확인하여 최종 검증합니다.
* **실행 명령어**:
  ```bash
  npm run lint
  npm run build
  npm run test
  ```

---

## 34. 마스코트 크기 확대 및 전체 폰트 가독성 개선
* **작업내용**: 
  1. `src/app/page.tsx`에 있는 마스코트 이미지의 크기를 더 직관적으로 잘 보이게 `w-20 h-20`에서 `w-28 h-28`(또는 `w-32 h-32` 등의 적절히 큰 크기)로 키우고, `Image` 컴포넌트의 width, height 속성도 112px(또는 128px) 이상으로 확장합니다.
  2. 초등학교 저학년 학생(혜완이)이 글자를 읽기 쉽도록 홈 화면 및 대시보드 컴포넌트(`src/app/page.tsx`, `src/components/home/DashboardSummary.tsx`, `src/components/home/QuickLinks.tsx`, `src/components/home/MainMenu.tsx`) 전체의 폰트 사이즈를 키웁니다.
     - 말풍선 텍스트: `text-base md:text-lg` -> `text-xl md:text-2xl`
     - 대시보드 요약 타이틀: `text-lg` -> `text-xl`
     - 대시보드 요약 각 항목 값(12권, 3개 등): `text-lg` -> `text-2xl`
     - 대시보드 요약 각 항목 레이블(읽은 책 등): `text-xs` -> `text-sm`
     - 바로가기/커뮤니티 링크 타이틀 및 설명 폰트 크기 증대
* **Claude 명령어**:
  ```bash
  claude "마스코트 이미지 크기를 w-28 h-28 (Image 112x112) 또는 w-32 h-32 (Image 128x128) 수준으로 키우고, 말풍선의 글씨 크기를 text-xl md:text-2xl 수준으로 대폭 키워줘. 그리고 src/components/home/DashboardSummary.tsx, src/components/home/QuickLinks.tsx, src/components/home/MainMenu.tsx 파일에서 타이틀, 본문, 라벨 등 모든 작은 글씨들의 Tailwind CSS font size 클래스를 한 단계씩 올려서(text-xs->text-sm, text-sm->text-base/lg, text-lg->text-xl/2xl) 초등학생이 멀리서도 한눈에 알아볼 수 있게 가독성을 대폭 개선해 줘."
  ```

---

## 35. 방문자 게시판 댓글 이모티콘 반응 및 종합 반응자 정보 조회 모달 구현
* **작업내용**:
  1. **댓글 이모티콘 반응 기능**:
     - `CommentItem` 인터페이스에 `reactions?: { [emoji: string]: ReactionUser[] }` 속성을 추가합니다.
     - `fetchComments` 함수에서 댓글의 `reactions` 데이터를 불러올 때 `normalizeReactions(data.reactions)`를 사용하여 정규화합니다.
     - 댓글의 이모티콘 클릭 시 동작할 `handleCommentReaction(entryId: string, commentId: string, emoji: string)` 함수를 구현합니다. Firestore `/guestbook/{entryId}/comments/{commentId}` 경로의 `reactions` 필드를 업데이트하고, `commentsMap` 상태를 낙관적으로 업데이트 및 롤백할 수 있도록 구현합니다.
     - 댓글 컴포넌트 렌더링 영역에 본문과 동일하게 `REACTION_EMOJIS`를 돌며 이모티콘 버튼들을 렌더링하고, 마우스오버 시 반응자 명단을 보여주는 툴팁도 동일하게 지원합니다.
  2. **반응자 종합 정보 조회 모달**:
     - 글과 댓글의 이모티콘 목록 맨 마지막 부분에 사람 아이콘(이모지 `👥` 또는 Lucide `Users`) 버튼을 추가합니다. (해당 글/댓글에 달린 반응이 총 1개 이상 있을 때만 보이도록 하거나 상시 노출하되 누르면 알려주도록 구성)
     - 이 아이콘을 클릭하면 `activeReactionModal` 상태에 해당 글/댓글의 제목(또는 작성자 정보)과 `reactions` 맵을 저장하고 모달을 엽니다.
     - 화면 중앙에 혜완이도 보기 편하고 예쁜 모달(둥근 모서리, 파스텔 배경, Jua 폰트, backdrop blur 효과)을 띄우고, 각 이모티콘별로 반응한 친구들의 실명 리스트(예: "❤️: Jaeho Jang, 김혜완", "👍: 홍길동")를 종합하여 한꺼번에 큰 글씨로 보여줍니다.
* **Claude 명령어**:
  ```bash
  claude "src/app/guestbook/page.tsx 파일을 수정해 줘. 1) CommentItem 인터페이스에 reactions 속성 추가 및 fetchComments에서 normalizeReactions를 거쳐 reactions를 세팅하도록 수정. 2) 댓글 이모티콘을 누르면 실행되는 handleCommentReaction(entryId, commentId, emoji) 함수를 Firestore 연동과 낙관적 업데이트(commentsMap 업데이트)를 적용해 구현. 3) 댓글 렌더링 부분(comments.map)에 본문과 동일한 이모티콘 반응 버튼 레이아웃 및 툴팁을 추가. 4) 게시글과 댓글 이모티콘 영역 가장 끝에 사람 아이콘(👥) 버튼을 추가하고, 클릭 시 이 글/댓글에 반응한 전체 사람 실명 목록을 이모지별로 정렬하여 한번에 시각적으로 보여주는 모달 창(둥근 파스텔 테마) UI를 추가해 줘."
  ```


