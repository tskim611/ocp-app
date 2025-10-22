# 분석 도구 설정 가이드 (Analytics Setup Guide)

OCP App의 사용자 행동을 추적하고 개선점을 찾기 위한 분석 도구 설정 가이드입니다.

## 추천 분석 도구

소프트 런치에는 두 가지 분석 도구 조합을 추천합니다:

### 1. Vercel Analytics (필수)
- **장점**: 무료, 설정 초간단, 프라이버시 중심, Vercel과 완벽 통합
- **비용**: Free (2,500 events/month까지 무료)
- **추적 항목**: 페이지 뷰, 실시간 방문자, 지역, 디바이스 정보
- **GDPR/개인정보**: 쿠키 없이 작동, 개인정보 미수집

### 2. Plausible Analytics (선택사항)
- **장점**: 경량, 오픈소스, GDPR 완전 준수, 한국 사용자에게 적합
- **비용**: €9/month (~13,000원)
- **추적 항목**: 페이지 뷰, 유입 경로, 이벤트 추적, 목표 전환
- **GDPR/개인정보**: 100% 개인정보 보호, 쿠키 불필요

## Option 1: Vercel Analytics만 사용 (추천)

### 1. Vercel Analytics 활성화

**Vercel Dashboard에서 설정**:
1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 선택 (`ocp-app`)
3. **Analytics** 탭 클릭
4. **Enable Analytics** 버튼 클릭

**완료!** 추가 코드 없이 자동으로 작동합니다.

### 2. Web Vitals 추적 (선택사항)

Next.js 앱에서 성능 지표를 추적하려면:

```bash
npm install @vercel/analytics
```

**`src/app/[locale]/layout.tsx`에 추가**:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 3. 확인 방법

1. 사이트 배포 후 접속
2. Vercel Dashboard → Analytics
3. 실시간 트래픽 확인

**추적되는 정보**:
- 총 방문자 수
- 페이지별 조회수
- 지역별 분포
- 디바이스/브라우저
- 실시간 활성 사용자

---

## Option 2: Vercel + Plausible 함께 사용 (프리미엄)

Plausible은 더 상세한 분석이 필요할 때 추천합니다.

### 1. Plausible 가입

1. [Plausible.io](https://plausible.io) 접속
2. **Start your free trial** 클릭
3. 도메인 입력: `ocp-app.vercel.app` (또는 커스텀 도메인)
4. 30일 무료 체험 시작

### 2. Plausible 스크립트 추가

**`src/app/[locale]/layout.tsx`에 추가**:
```typescript
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        {/* Plausible Analytics */}
        <Script
          defer
          data-domain="ocp-app.vercel.app"
          src="https://plausible.io/js/script.js"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
```

**커스텀 도메인 사용 시**:
```typescript
<Script
  defer
  data-domain="yourapp.com"
  src="https://plausible.io/js/script.js"
/>
```

### 3. 이벤트 추적 설정 (선택사항)

특정 행동을 추적하려면:

**설치**:
```bash
npm install plausible-tracker
```

**`src/lib/analytics.ts` 생성**:
```typescript
import Plausible from 'plausible-tracker';

const plausible = Plausible({
  domain: 'ocp-app.vercel.app',
});

export function trackEvent(eventName: string, props?: Record<string, string | number>) {
  if (typeof window !== 'undefined') {
    plausible.trackEvent(eventName, { props });
  }
}
```

**사용 예시**:
```typescript
import { trackEvent } from '@/lib/analytics';

// 계산기 사용 추적
function onCalculate(vehiclePrice: number) {
  trackEvent('Calculate Import Cost', {
    vehiclePrice,
    currency: 'USD',
  });
}

// 가이드 조회 추적
function onGuideView(slug: string) {
  trackEvent('View Guide', {
    guide: slug,
  });
}

// 스레드 생성 추적
function onThreadCreate() {
  trackEvent('Create Thread');
}
```

### 4. 목표 전환 설정

Plausible Dashboard에서 목표 설정:

**추천 목표**:
1. **회원가입**: 이벤트 `signup`
2. **계산기 사용**: 이벤트 `Calculate Import Cost`
3. **가이드 조회**: 이벤트 `View Guide`
4. **스레드 생성**: 이벤트 `Create Thread`
5. **특정 페이지 도달**: URL `/ko/tools/calculator`

---

## 추적하면 좋은 주요 지표 (KPIs)

### 사용자 참여도
- **페이지 뷰 (Page Views)**: 전체 페이지 조회수
- **고유 방문자 (Unique Visitors)**: 순 방문자 수
- **세션 시간 (Session Duration)**: 평균 체류 시간
- **이탈률 (Bounce Rate)**: 한 페이지만 보고 나가는 비율

### 기능 사용률
- **계산기 사용**: 비용 계산기를 몇 명이 사용하는가
- **가이드 조회**: 어떤 가이드가 인기 있는가
- **회원가입**: 얼마나 많은 사람이 가입하는가
- **스레드 작성**: 커뮤니티 활성도는 어떤가

### 유입 경로
- **직접 방문 (Direct)**: URL 직접 입력
- **검색 엔진 (Organic)**: Google, Naver 등
- **소셜 미디어 (Social)**: 페이스북, 트위터 등
- **참조 사이트 (Referral)**: 다른 웹사이트 링크

### 기술 정보
- **디바이스**: 모바일 vs 데스크톱
- **브라우저**: Chrome, Safari, Edge 등
- **운영체제**: iOS, Android, Windows 등
- **지역**: 서울, 부산, 경기 등

---

## 프라이버시 및 GDPR 준수

### Vercel Analytics
- ✅ 쿠키 사용 안 함
- ✅ 개인정보 수집 안 함
- ✅ GDPR 준수
- ✅ 한국 개인정보보호법 준수

### Plausible Analytics
- ✅ 100% 오픈소스
- ✅ 쿠키 사용 안 함
- ✅ 개인정보 수집 안 함
- ✅ GDPR 완전 준수
- ✅ 데이터 EU 서버 저장 (프라이버시 강화)

**한국 사용자에게 적합한 이유**:
- 쿠키 동의 팝업 불필요
- 개인정보처리방침 단순화 가능
- 사용자 프라이버시 완벽 보호

---

## 비용 비교

| 도구 | 비용 | 무료 한도 | 유료 시작 가격 |
|------|------|-----------|---------------|
| **Vercel Analytics** | 무료 → $10/mo | 2,500 events/mo | Pro: $10/mo (25k events) |
| **Plausible** | €9/mo (~₩13,000) | 30일 체험 | €9/mo (10k pageviews) |
| **Google Analytics** | 무료 | 무제한 | 무료 (복잡함, 쿠키 필요) |

**소프트 런치 추천**:
- **Vercel Analytics만**: 완전 무료, 기본 지표 충분
- **Vercel + Plausible**: 월 13,000원, 상세한 분석 필요 시

---

## 실제 사용 사례

### Case 1: 어떤 가이드가 인기 있는가?
- Plausible에서 `/ko/guides/*` 페이지 조회수 확인
- 가장 많이 본 가이드: "미국에서 차량 수입하기"
- 결과: 더 많은 미국 수입 관련 콘텐츠 제작

### Case 2: 계산기 사용률은 얼마나 되는가?
- 이벤트 추적: `Calculate Import Cost`
- 방문자 1,000명 중 300명이 계산기 사용 (30%)
- 결과: 계산기를 더 눈에 띄는 곳에 배치

### Case 3: 모바일 vs 데스크톱 사용자 비율
- Vercel Analytics에서 디바이스 분포 확인
- 모바일 70%, 데스크톱 30%
- 결과: 모바일 UX 개선 우선 순위

### Case 4: 어디서 사용자가 오는가?
- Plausible에서 Referrers 확인
- 네이버 카페: 40%, 직접 방문: 30%, 구글: 20%
- 결과: 네이버 카페 커뮤니티 활동 강화

---

## 설정 체크리스트

### 초기 설정 (필수)
- [ ] Vercel Dashboard에서 Analytics 활성화
- [ ] 배포 후 실시간 트래픽 확인
- [ ] Vercel Analytics 작동 확인

### 고급 설정 (선택사항)
- [ ] Plausible 가입 및 30일 체험 시작
- [ ] Plausible 스크립트 추가
- [ ] 주요 이벤트 추적 설정
  - [ ] 계산기 사용
  - [ ] 가이드 조회
  - [ ] 회원가입
  - [ ] 스레드 작성
- [ ] Plausible Dashboard에서 목표 설정

### 데이터 분석 (정기적)
- [ ] 주간 방문자 수 확인
- [ ] 인기 페이지 분석
- [ ] 유입 경로 분석
- [ ] 모바일/데스크톱 비율 확인
- [ ] 목표 전환율 확인

---

## 다음 단계

분석 도구 설정 완료 후:

1. **1주일 데이터 수집**: 충분한 데이터가 모일 때까지 대기
2. **첫 분석 리포트**: 주요 지표 확인
   - 총 방문자 수
   - 인기 페이지
   - 평균 세션 시간
3. **개선점 도출**: 데이터 기반 의사결정
   - 어떤 콘텐츠를 더 만들 것인가
   - UI/UX 어디를 개선할 것인가
   - 마케팅 채널 최적화

---

## 추가 리소스

- **Vercel Analytics Docs**: https://vercel.com/docs/analytics
- **Plausible Docs**: https://plausible.io/docs
- **Next.js Analytics**: https://nextjs.org/docs/app/building-your-application/optimizing/analytics

---

**업데이트**: 2025년 1월
**작성자**: OCP App Team
