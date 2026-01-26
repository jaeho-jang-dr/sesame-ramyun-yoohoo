# 참깨라면 유후~ (Sesame Ramyun Yoohoo~) 프로젝트 계획서

## 1. 프로젝트 개요

- **앱 이름**: 참깨라면 유후~ (Sesame Ramyun Yoohoo~)
- **목표**: 초등학교 저학년(손주)들이 학교 생활을 즐겁고 알차게 보낼 수 있도록 돕는 개인 맞춤형 도우미 앱
- **핵심 가치**: 재미(Fun), 도움(Helpful), 습관(Habit)

## 2. 타겟 사용자

- **메인 사용자**: 초등학교 저학년 학생 (특히 손주 '혜완'이 등)
- **서브 사용자**: 학부모/조부모 (알림장 확인 및 용돈 관리 등 보조 역할)

## 3. 디자인 컨셉 (참깨라면 테마)

- **테마**: "고소하고 맛있는 학교 생활!"
- **메인 컬러**:
  - **참깨 골드 (Yellow/Orange)**: 밝고 긍정적인 에너지 (#F59E0B)
  - **유후 핑크 (Pink)**: 사랑스러움과 즐거움 (#EC4899)
  - **새싹 그린 (Green)**: 성장과 편안함 (#10B981)
- **UI 스타일**:
  - 둥글둥글한 버튼과 카드 디자인 (Bento Grid 스타일)
  - 아이들이 좋아하는 스티커 느낌의 아이콘 (Lucide React + Emoji)
  - 직관적인 네비게이션 (글자보다 아이콘과 색상 위주)

## 4. 주요 기능 (참고: 기존 date-reminder-app.tsx 확장)

### 🏠 홈 (대시보드)

- 등교 전 필수 체크리스트 (준비물, 숙제)
- 오늘의 한마디 (할아버지가 전하는 응원 메시지 기능 추가 고려)
- 주요 상태 요약 (읽은 책 수, 남은 용돈 등)

### 📅 학교 생활

- **시간표 (Timetable)**: 요일별 과목 및 준비물 확인
- **알림장 (Notices)**: 학교 숙제, 안내문 기록 (완료 시 칭찬 스티커 효과)
- **급식 메뉴 (Lunch)**: 맛있는 급식 메뉴 미리보기

### ✍️ 학습 놀이터

- **받아쓰기 (Dictation)**:
  - 단어장 등록 및 랜덤 퀴즈
  - 맞춤법 점수 기록
- **구구단 (Gugudan)**:
  - 게임처럼 즐기는 구구단 연습
  - 연속 정답 콤보 효과
- **독서 기록 (Reading Log)**:
  - 읽은 책 제목, 별점, 감상평 기록
  - '독서왕' 뱃지 시스템

### 💰 생활 습관

- **용돈 기입장 (Pocket Money)**:
  - 받은 돈/쓴 돈 입력
  - 저축 목표 설정 기능 (심화)
- **청소/심부름 (Chores)**:
  - 당번 활동 및 배정된 집안일 완수 체크

## 5. 기술 스택 (Tech Stack)

- **Framework**: Next.js 14 (App Router) - 웹 기반으로 어디서든 접속 가능
- **Language**: TypeScript - 안정적인 코드 작성
- **Styling**: Tailwind CSS - 빠르고 예쁜 디자인 구현
- **State Management**: Zustand or React Context
- **Persistence (데이터 저장)**:
  - 초기 단계: LocalStorage (기기 내 저장)
  - 발전 단계: Firebase (Firestore) - 할아버지 폰과 손주 폰 데이터 연동

## 6. 개발 로드맵

1. **Project Setup**: Next.js 프로젝트 생성 및 기본 레이아웃 구성
2. **Core Features I (학교)**: 시간표, 알림장, 급식 기능 구현
3. **Core Features II (학습)**: 받아쓰기, 구구단, 독서 기록 구현
4. **Core Features III (생활)**: 용돈, 청소 기능 구현
5. **UI/UX Polish**: 참깨라면 테마 적용, 애니메이션 효과(framer-motion) 추가
6. **Deployment**: Vercel 배포 및 PWA 설정 (홈 화면에 앱처럼 추가)

## 7. 폴더 구조 예상

```
/src
  /app
    /school
      /timetable
      /notices
      /meals
    /study
      /dictation
      /gugudan
      /library
    /life
      /money
      /cleaning
  /components
    /ui (버튼, 카드 등 공통 컴포넌트)
    /features (기능별 컴포넌트)
  /store (상태 관리)
  /lib (유틸리티)
```
