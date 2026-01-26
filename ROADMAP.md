# 🍜 참깨라면 유후~ (Sesame Ramyun Yoohoo~) 개발 로드맵

## 1. 프로젝트 아키텍처 (Project Architecture)

### 📂 폴더 구조 (Folder Structure)
```
src/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx          # 전체 레이아웃 (폰트, 배경, 네비게이션)
│   ├── page.tsx            # 메인 대시보드 (요약 정보)
│   ├── (features)/         # 기능별 페이지 그룹
│   │   ├── timetable/      # 시간표
│   │   ├── notices/        # 알림장
│   │   ├── study/          # 학습 (받아쓰기, 구구단, 독서)
│   │   └── life/           # 생활 (용돈, 급식, 청소)
│   └── globals.css         # 전역 스타일
├── components/
│   ├── ui/                 # 공통 UI 컴포넌트
│   │   ├── SquishyButton.tsx # 말랑말랑 버튼
│   │   ├── BentoCard.tsx     # 벤토 그리드 카드
│   │   └── IconBadge.tsx     # 아이콘 배지
│   ├── layout/             # 레이아웃 컴포넌트
│   │   ├── Sidebar.tsx     # 데스크탑 사이드바
│   │   └── MobileDock.tsx  # 모바일 하단 독
│   └── features/           # 기능별 비즈니스 컴포넌트
│       ├── TimetableGrid.tsx
│       ├── DictationGame.tsx
│       └── ...
├── store/                  # 상태 관리 (Zustand)
│   ├── useSchoolStore.ts   # 학교 생활 데이터 (시간표, 알림장)
│   ├── useStudyStore.ts    # 학습 데이터 (단어, 구구단, 독서)
│   └── useLifeStore.ts     # 생활 데이터 (용돈, 청소)
├── lib/                    # 유틸리티
│   ├── constants.ts        # 상수 (색상, 테마)
│   └── utils.ts            # 헬퍼 함수
└── hooks/                  # 커스텀 훅
    └── useConfetti.ts      # 칭찬 효과
```

### 🛠 기술 스택 (Tech Stack)
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (참깨라면 테마 커스텀 설정)
- **Animation**: Framer Motion (말랑말랑한 인터랙션)
- **State Management**: Zustand (LocalStorage 지속성 유지 - `persist` 미들웨어)
- **Icons**: Lucide React (둥글게 커스텀)
- **Fun**: canvas-confetti (칭찬 폭죽), use-sound (효과음)

---

## 2. 상세 구현 단계 (Implementation Steps)

### Phase 1: 기반 공사 (Foundation) ✅
- [ ] Next.js 14 프로젝트 초기화 및 정리
- [ ] Tailwind Config 설정 (참깨 골드, 유후 핑크 등 컬러 팔레트 등록)
- [ ] 폰트 설정 (`Jua` - 배달의민족 주아체 또는 구글 폰트)
- [ ] 레이아웃 구현 (모바일 Dock + 데스크탑 Sidebar)

### Phase 2: 상태 관리 및 공통 컴포넌트 (Core)
- [ ] Zustand 스토어 설계 (기존 `useState` 로직 이관 및 `persist` 적용)
- [ ] `SquishyButton`, `BentoCard` 등 핵심 디자인 시스템 컴포넌트 제작
- [ ] 메인 대시보드 (홈 화면) UI 구현

### Phase 3: 기능 이식 (Feature Migration)
- [ ] **학교 생활**: 시간표(Timetable), 알림장(Notices), 급식(Meals)
- [ ] **학습 놀이터**: 받아쓰기(Dictation - 게임 모드), 구구단(Gugudan - 콤보 기능), 독서(Books)
- [ ] **생활 습관**: 용돈(Money - 수입/지출), 청소(Cleaning)

### Phase 4: 재미 요소 추가 (Gamification)
- [ ] 칭찬 도장/폭죽 효과 (Confetti) 구현
- [ ] 화면 전환 애니메이션 및 버튼 클릭 효과 (Framer Motion)
- [ ] (선택) PWA 설정 (홈 화면 추가 기능)

---

## 3. 디자인 시스템 요약 (Design System)

- **테마**: "고소하고 맛있는 학교 생활"
- **색상**: `bg-amber-400` (메인), `bg-pink-500` (포인트), `bg-orange-50` (배경)
- **형태**: 둥근 모서리 (Rounded-3xl), 두꺼운 테두리, 그림자
- **인터랙션**: 누르면 찌그러지는(Scale down) 물리 효과

승인해주시면 이 계획에 맞춰 **Phase 1: 기반 공사**부터 작업을 시작하겠습니다.
