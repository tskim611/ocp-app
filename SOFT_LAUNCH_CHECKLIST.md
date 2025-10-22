# 소프트 런치 체크리스트 (Soft Launch Checklist)

OCP App을 성공적으로 소프트 런치하기 위한 완전한 체크리스트입니다.

**목표 런치 날짜**: 2025년 말
**타겟 사용자**: 한국 자동차 애호가

---

## 📋 전체 진행 상황

- [x] ✅ **1단계**: 프로젝트 초기 설정 (완료)
- [x] ✅ **2단계**: 핵심 기능 개발 (완료)
- [ ] ⏳ **3단계**: 데이터베이스 설정 (진행 중)
- [ ] ⏳ **4단계**: 콘텐츠 준비 (진행 중)
- [ ] ⏳ **5단계**: 분석 도구 설정 (진행 중)
- [ ] ⏸️  **6단계**: 테스트 및 검증 (대기 중)
- [ ] ⏸️  **7단계**: 런치 준비 (대기 중)

---

## 1단계: 프로젝트 초기 설정 ✅ (완료)

### Git 및 GitHub
- [x] Git 설치
- [x] GitHub 저장소 생성 및 연결
- [x] 초기 커밋 및 푸시

### Vercel 배포
- [x] Vercel 계정 연결
- [x] 자동 배포 설정
- [x] 프로덕션 URL 확보: `ocp-app.vercel.app`

### 환경 변수
- [x] `.env.local` 파일 생성
- [x] `.gitignore` 설정 확인

---

## 2단계: 핵심 기능 개발 ✅ (완료)

### 페이지 및 기능
- [x] 홈 페이지 (메인 랜딩)
- [x] 가이드 목록 페이지
- [x] 가이드 상세 페이지
- [x] 커뮤니티 포럼 (스레드 목록)
- [x] 스레드 상세 페이지 (댓글 기능)
- [x] 비용 계산기
- [x] 회원가입/로그인 페이지

### 다국어 지원
- [x] next-intl 설정
- [x] 한국어/영어 번역 파일
- [x] 한국어 기본 언어 설정 (`/ko` prefix)

### 모바일 최적화
- [x] 반응형 디자인 (Tailwind CSS)
- [x] 모바일 폰트 크기 조정
- [x] Viewport 메타 태그 추가
- [x] 한국어 텍스트 줄바꿈 최적화

---

## 3단계: 데이터베이스 설정 ⏳ (진행 중)

### Supabase 프로젝트 생성
- [ ] Supabase 계정 생성
- [ ] 새 프로젝트 생성
  - 프로젝트 이름: `ocp-app`
  - 리전: `Northeast Asia (Seoul)` 권장
  - 데이터베이스 비밀번호 설정

### 환경 변수 설정
- [ ] `.env.local`에 Supabase 자격 증명 추가
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  ```
- [ ] Vercel에 환경 변수 추가 (Production, Preview, Development)

### 데이터베이스 스키마 설정
- [ ] Supabase SQL Editor에서 마이그레이션 실행
  - 파일: `supabase/migrations/20250101000000_initial_schema.sql`
- [ ] 테이블 생성 확인:
  - [ ] `users`
  - [ ] `guides`
  - [ ] `threads`
  - [ ] `comments`
- [ ] 뷰 생성 확인:
  - [ ] `guides_with_authors`
  - [ ] `threads_with_details`
  - [ ] `comments_with_authors`

### RLS (Row Level Security) 정책 확인
- [ ] 모든 테이블 RLS 활성화 확인
- [ ] 정책 테스트:
  - [ ] 로그아웃 상태에서 가이드 읽기 가능
  - [ ] 로그아웃 상태에서 가이드 작성 불가
  - [ ] 로그인 상태에서만 스레드 작성 가능
  - [ ] 다른 사용자 콘텐츠 수정 불가

### 인증 테스트
- [ ] 회원가입 테스트
- [ ] 로그인 테스트
- [ ] 로그아웃 테스트
- [ ] `public.users` 테이블 자동 생성 확인 (트리거 작동)

**상세 가이드**: `SUPABASE_SETUP_CHECKLIST.md` 참조

---

## 4단계: 콘텐츠 준비 ⏳ (진행 중)

### 가이드 콘텐츠
✅ **마크다운 파일 작성 완료** (`content/guides/`):
- [x] `getting-started.md` - 수입 시작 가이드
- [x] `cost-breakdown.md` - 비용 상세 분석
- [x] `required-documents.md` - 필수 서류 가이드
- [x] `common-mistakes.md` - 흔한 실수와 해결법
- [x] `importing-from-usa.md` - 미국 수입 가이드

### 데이터베이스에 가이드 시딩
- [ ] `.env.local`에 Supabase 자격 증명 설정
- [ ] 시스템 사용자 생성 (스크립트가 자동으로 처리)
- [ ] 가이드 시딩 스크립트 실행:
  ```bash
  npm run seed
  ```
- [ ] `/ko/guides` 페이지에서 가이드 목록 확인
- [ ] 개별 가이드 페이지 확인 (`/ko/guides/getting-started` 등)

### 커뮤니티 샘플 스레드
✅ **한국어 스레드 작성 완료** (`scripts/seed-threads.ts`):
- [x] 8개 주제 스레드 준비
- [x] 각 스레드당 2-4개 댓글
- [ ] 커뮤니티 시딩 스크립트 실행:
  ```bash
  npm run seed:community
  ```
- [ ] `/ko/community` 페이지에서 스레드 확인

**참고**:
- Service Role Key 필요 (Anon Key 대신)
- Supabase Dashboard → Settings → API → `service_role` key 복사
- `.env.local`에 추가: `SUPABASE_SERVICE_ROLE_KEY=your-service-role-key`
- ⚠️ Service Role Key는 절대 GitHub에 커밋하지 말 것!

---

## 5단계: 분석 도구 설정 ⏳ (진행 중)

### Vercel Analytics (필수)
- [ ] Vercel Dashboard → Analytics → Enable Analytics
- [ ] 배포 후 실시간 트래픽 확인
- [ ] (선택사항) `@vercel/analytics` 패키지 설치 및 설정

### Plausible Analytics (선택사항)
- [ ] [Plausible.io](https://plausible.io) 가입 (30일 무료 체험)
- [ ] 도메인 추가: `ocp-app.vercel.app`
- [ ] Next.js에 스크립트 추가 (`src/app/[locale]/layout.tsx`)
- [ ] 이벤트 추적 설정:
  - [ ] 계산기 사용
  - [ ] 가이드 조회
  - [ ] 회원가입
  - [ ] 스레드 작성

**상세 가이드**: `ANALYTICS_SETUP_GUIDE.md` 참조

**비용**:
- Vercel Analytics: 무료 (2,500 events/month)
- Plausible: €9/month (~₩13,000)

---

## 6단계: 테스트 및 검증 ⏸️ (대기 중)

### 기능 테스트

#### 인증 기능
- [ ] 회원가입 성공
- [ ] 로그인 성공
- [ ] 로그아웃 성공
- [ ] 이메일 중복 방지
- [ ] 잘못된 비밀번호 에러 처리

#### 가이드 기능
- [ ] 가이드 목록 표시
- [ ] 가이드 상세 페이지 정상 작동
- [ ] 마크다운 렌더링 확인
- [ ] 존재하지 않는 가이드 404 처리
- [ ] published=false 가이드는 미노출

#### 커뮤니티 기능
- [ ] 스레드 목록 표시
- [ ] 스레드 상세 페이지 정상 작동
- [ ] 로그인 상태에서만 스레드 작성 가능
- [ ] 로그인 상태에서만 댓글 작성 가능
- [ ] 로그아웃 상태에서 읽기 가능
- [ ] 댓글 작성 시 `last_activity_at` 업데이트 확인

#### 계산기 기능
- [ ] 차량 가격 입력 시 실시간 계산
- [ ] 배기량별 세율 정확성
- [ ] 국가별 관세율 정확성
- [ ] 환율 API 작동 확인
- [ ] 모바일에서 입력 편의성

### 브라우저 테스트
- [ ] Chrome (데스크톱)
- [ ] Safari (Mac/iOS)
- [ ] Edge (Windows)
- [ ] Samsung Internet (Android)
- [ ] Naver Whale (한국)

### 디바이스 테스트
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)
- [ ] Windows 데스크톱
- [ ] Mac 데스크톱

### 성능 테스트
- [ ] Lighthouse 성능 점수 (90+ 목표)
- [ ] PageSpeed Insights 확인
- [ ] 이미지 최적화 확인
- [ ] 첫 화면 로딩 시간 (3초 이내)

---

## 7단계: 런치 준비 ⏸️ (대기 중)

### SEO 최적화
- [ ] 모든 페이지 메타 디스크립션 추가
- [ ] Open Graph 태그 추가 (소셜 공유)
- [ ] Twitter Card 태그 추가
- [ ] `robots.txt` 설정
- [ ] `sitemap.xml` 생성
- [ ] Google Search Console 등록
- [ ] Naver 웹마스터 도구 등록

### 법적 페이지
- [ ] 개인정보처리방침 (Privacy Policy) 페이지 작성
- [ ] 이용약관 (Terms of Service) 페이지 작성
- [ ] Footer에 링크 추가

### 아이콘 및 파비콘
- [ ] SVG 아이콘을 PNG로 변환
  - [ ] `favicon.ico` (16x16, 32x32, 48x48)
  - [ ] `apple-touch-icon.png` (180x180)
  - [ ] `icon-192.png` (192x192, Android)
  - [ ] `icon-512.png` (512x512, PWA)
- [ ] `manifest.json` 설정 (PWA 대비)

### 에러 페이지
- [ ] 404 페이지 디자인 확인
- [ ] 500 에러 페이지 생성
- [ ] 에러 처리 사용자 친화적으로 개선

### 환경 변수 최종 확인
- [ ] Vercel Production 환경 변수 모두 설정
- [ ] `.env.local` GitHub에 업로드 안 됨 확인
- [ ] `.env.example` 최신 상태 유지

---

## 8단계: 소프트 런치 🚀 (런치 날)

### 런치 전 최종 체크
- [ ] 모든 기능 마지막 테스트
- [ ] 프로덕션 배포 확인
- [ ] 데이터베이스 백업
- [ ] 분석 도구 작동 확인
- [ ] 모바일/데스크톱 테스트

### 런치 발표
- [ ] 네이버 카페 홍보 (자동차 관련 커뮤니티)
- [ ] 페이스북 그룹 공유
- [ ] 지인에게 공유 요청
- [ ] 관련 커뮤니티에 소개 글 작성

### 초기 모니터링 (첫 주)
- [ ] 매일 Analytics 확인
  - [ ] 방문자 수
  - [ ] 인기 페이지
  - [ ] 에러 발생 여부
- [ ] 사용자 피드백 수집
- [ ] 버그 리포트 대응
- [ ] 성능 이슈 모니터링

---

## 📊 성공 지표 (KPIs)

### 첫 1주일 목표
- [ ] 총 방문자: 100명 이상
- [ ] 가이드 조회: 200회 이상
- [ ] 회원가입: 10명 이상
- [ ] 커뮤니티 스레드: 5개 이상
- [ ] 계산기 사용: 50회 이상

### 첫 1개월 목표
- [ ] 총 방문자: 500명 이상
- [ ] 회원가입: 50명 이상
- [ ] 커뮤니티 활성화: 주 5개 이상 새 스레드
- [ ] 계산기 사용: 200회 이상
- [ ] 가이드 조회: 1,000회 이상

---

## 🛠️ 도움말 및 리소스

### 작성된 가이드 문서
- `SUPABASE_SETUP_CHECKLIST.md` - 데이터베이스 설정 가이드
- `ANALYTICS_SETUP_GUIDE.md` - 분석 도구 설정 가이드
- `START_HERE.md` - 프로젝트 시작 가이드
- `DEPLOYMENT_GUIDE.md` - 배포 가이드
- `README.md` - 프로젝트 개요

### 스크립트
- `npm run dev` - 로컬 개발 서버
- `npm run build` - 프로덕션 빌드
- `npm run seed` - 가이드 콘텐츠 시딩
- `npm run seed:community` - 커뮤니티 스레드 시딩

### 외부 리소스
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## ✅ 완료 후 액션

모든 단계 완료 후:
1. ✅ 이 체크리스트를 GitHub에 커밋
2. ✅ 팀원들과 공유
3. ✅ 정기적으로 진행 상황 업데이트
4. ✅ 런치 후 사용자 피드백 기반 개선

---

**마지막 업데이트**: 2025년 1월
**작성자**: OCP App Team
**상태**: 진행 중 (3단계-5단계)

**다음 할 일**:
1. Supabase 프로젝트 생성 및 설정
2. 가이드 콘텐츠 데이터베이스에 시딩
3. 커뮤니티 샘플 스레드 시딩
4. Vercel Analytics 활성화
5. 전체 기능 테스트
