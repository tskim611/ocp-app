# Supabase 데이터베이스 설정 체크리스트

이 문서는 OCP App의 Supabase 데이터베이스가 올바르게 설정되었는지 확인하는 가이드입니다.

## 📋 설정 전 준비사항

### 1. Supabase 프로젝트 생성
- [ ] [Supabase Dashboard](https://supabase.com/dashboard)에서 새 프로젝트 생성
- [ ] 프로젝트 이름: `ocp-app` (또는 원하는 이름)
- [ ] 리전: `Northeast Asia (Seoul)` 권장 (한국 사용자 대상)
- [ ] 데이터베이스 비밀번호 설정 및 안전하게 저장

### 2. 환경 변수 설정
- [ ] `.env.local` 파일 생성 (`.env.example` 참고)
- [ ] Supabase Dashboard → Settings → API에서 정보 복사

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**어디서 찾나요?**
1. Supabase Dashboard 접속
2. 프로젝트 선택
3. 왼쪽 메뉴: Settings → API
4. **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`로 복사
5. **Project API keys** → `anon` `public` 키 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`로 복사

### 3. Vercel 환경 변수 설정
- [ ] Vercel Dashboard → 프로젝트 선택 → Settings → Environment Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL` 추가
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 추가
- [ ] Production, Preview, Development 모두 체크

## 🗄️ 데이터베이스 스키마 설정

### 1. 마이그레이션 실행

**옵션 A: Supabase Dashboard에서 실행 (권장)**
1. Supabase Dashboard → SQL Editor
2. `supabase/migrations/20250101000000_initial_schema.sql` 파일 내용 복사
3. SQL Editor에 붙여넣기
4. "RUN" 버튼 클릭

**옵션 B: Supabase CLI 사용**
```bash
# Supabase CLI 설치 (아직 안 했다면)
npm install -g supabase

# Supabase 프로젝트 연결
supabase link --project-ref your-project-ref

# 마이그레이션 실행
supabase db push
```

### 2. 스키마 확인

다음 테이블들이 생성되었는지 확인:
- [ ] `public.users` - 사용자 프로필
- [ ] `public.guides` - 가이드 콘텐츠
- [ ] `public.threads` - 커뮤니티 스레드
- [ ] `public.comments` - 댓글

**확인 방법**:
1. Supabase Dashboard → Table Editor
2. 위 4개 테이블이 보이는지 확인

### 3. 뷰 확인

다음 뷰들이 생성되었는지 확인:
- [ ] `guides_with_authors` - 가이드 + 작성자 정보
- [ ] `threads_with_details` - 스레드 + 작성자 + 댓글 수
- [ ] `comments_with_authors` - 댓글 + 작성자 정보

**확인 방법**:
```sql
-- SQL Editor에서 실행
SELECT table_name
FROM information_schema.views
WHERE table_schema = 'public';
```

### 4. RLS (Row Level Security) 정책 확인

모든 테이블에 RLS가 활성화되었는지 확인:
- [ ] `users` 테이블 RLS 활성화
- [ ] `guides` 테이블 RLS 활성화
- [ ] `threads` 테이블 RLS 활성화
- [ ] `comments` 테이블 RLS 활성화

**확인 방법**:
1. Supabase Dashboard → Authentication → Policies
2. 각 테이블에 정책들이 설정되어 있는지 확인

**예상되는 정책들**:
- Users: "Users are viewable by everyone", "Users can update their own profile"
- Guides: "Published guides are viewable by everyone", "Authors can view their own guides", etc.
- Threads: "Threads are viewable by everyone", "Authenticated users can create threads", etc.
- Comments: "Comments are viewable by everyone", "Authenticated users can create comments", etc.

## ✅ 기능 테스트

### 1. 인증 기능 테스트

**테스트 사용자 생성**:
1. 로컬 환경 실행: `npm run dev`
2. http://localhost:3000/ko/signup 접속
3. 이메일/비밀번호로 회원가입
4. Supabase Dashboard → Authentication → Users에서 사용자 생성 확인

**확인 사항**:
- [ ] 회원가입 시 `auth.users`에 사용자 생성됨
- [ ] 자동으로 `public.users`에도 프로필 생성됨 (트리거 작동)
- [ ] 로그인/로그아웃 정상 작동

### 2. 가이드 기능 테스트

**가이드 데이터 추가**:
```sql
-- Supabase SQL Editor에서 실행
-- 먼저 본인의 user_id 확인
SELECT id, email FROM public.users;

-- 가이드 추가 (user_id를 위에서 확인한 ID로 변경)
INSERT INTO public.guides (slug, title, content, author_id, published)
VALUES
  ('test-guide', 'Test Guide', '# Test Content', 'your-user-id-here', true);
```

**확인 사항**:
- [ ] `/ko/guides` 페이지에서 가이드 목록 보임
- [ ] `/ko/guides/test-guide` 페이지에서 가이드 내용 보임
- [ ] 로그아웃 상태에서도 published=true 가이드는 보임

### 3. 커뮤니티 기능 테스트

**스레드 생성 테스트**:
1. 로그인 상태에서 `/ko/community` 접속
2. 새 스레드 작성
3. 댓글 작성

**확인 사항**:
- [ ] 로그인한 사용자만 스레드 작성 가능
- [ ] 로그인한 사용자만 댓글 작성 가능
- [ ] 로그아웃 상태에서도 스레드/댓글 읽기 가능
- [ ] 댓글 작성 시 `threads.last_activity_at` 자동 업데이트 (트리거 작동)

## 📊 데이터 시딩 (선택사항)

### 가이드 콘텐츠 시딩

`content/guides/` 폴더에 있는 마크다운 파일들을 데이터베이스에 추가:

```sql
-- 먼저 시스템 사용자 생성 (또는 본인 user_id 사용)
INSERT INTO public.users (id, email)
VALUES ('00000000-0000-0000-0000-000000000001', 'system@ocp-app.com')
ON CONFLICT (id) DO NOTHING;

-- 가이드 추가
INSERT INTO public.guides (slug, title, content, author_id, published) VALUES
  ('getting-started', '해외 차량 수입 시작하기', '...마크다운 내용...', '00000000-0000-0000-0000-000000000001', true),
  ('cost-breakdown', '수입 비용 상세 분석', '...마크다운 내용...', '00000000-0000-0000-0000-000000000001', true),
  ('required-documents', '필수 서류 가이드', '...마크다운 내용...', '00000000-0000-0000-0000-000000000001', true),
  ('common-mistakes', '흔히 하는 실수와 해결법', '...마크다운 내용...', '00000000-0000-0000-0000-000000000001', true),
  ('importing-from-usa', '미국에서 차량 수입하기', '...마크다운 내용...', '00000000-0000-0000-0000-000000000001', true);
```

**자동 시딩 스크립트**:
`scripts/seed-guides.ts` 파일을 실행하면 자동으로 가이드 콘텐츠를 데이터베이스에 추가합니다:

```bash
npm run seed-guides
```

## 🔒 보안 체크리스트

### RLS 정책 검증
- [ ] 로그아웃 상태에서 가이드 작성 시도 → 실패해야 함
- [ ] 로그아웃 상태에서 스레드 작성 시도 → 실패해야 함
- [ ] 다른 사용자의 가이드 수정 시도 → 실패해야 함
- [ ] 다른 사용자의 댓글 삭제 시도 → 실패해야 함

### 환경 변수 보안
- [ ] `.env.local` 파일이 `.gitignore`에 포함되어 있음
- [ ] GitHub에 환경 변수 업로드 안 됨
- [ ] Supabase 프로젝트 비밀번호 안전하게 저장됨

## 🚨 문제 해결

### 문제: "Failed to fetch" 에러
**원인**: 환경 변수 미설정 또는 잘못된 URL
**해결**:
1. `.env.local` 파일 확인
2. Supabase URL과 Anon Key가 정확한지 확인
3. 개발 서버 재시작: `npm run dev`

### 문제: "Row Level Security policy violation"
**원인**: RLS 정책 미설정 또는 잘못된 정책
**해결**:
1. Supabase Dashboard → Authentication → Policies 확인
2. 마이그레이션 파일 다시 실행
3. 또는 SQL Editor에서 정책 수동 추가

### 문제: "relation does not exist"
**원인**: 테이블이 생성되지 않음
**해결**:
1. 마이그레이션 파일 실행 확인
2. Supabase Dashboard → Table Editor에서 테이블 확인
3. 필요 시 마이그레이션 파일 다시 실행

### 문제: 가이드가 보이지 않음
**원인**: `published = false` 또는 데이터 없음
**해결**:
```sql
-- 가이드 상태 확인
SELECT slug, title, published FROM public.guides;

-- published를 true로 변경
UPDATE public.guides SET published = true WHERE slug = 'your-slug';
```

### 문제: 사용자 프로필 자동 생성 안 됨
**원인**: 트리거 미작동
**해결**:
```sql
-- 트리거 확인
SELECT trigger_name FROM information_schema.triggers
WHERE event_object_table = 'users';

-- 수동으로 사용자 프로필 생성
INSERT INTO public.users (id, email)
VALUES ('user-id-from-auth-users', 'email@example.com');
```

## 📝 다음 단계

데이터베이스 설정이 완료되면:
1. ✅ 가이드 콘텐츠 시딩 (`npm run seed-guides`)
2. ✅ 커뮤니티 샘플 스레드 생성
3. ✅ 테스트 사용자로 모든 기능 테스트
4. ✅ Vercel 프로덕션 배포 테스트

---

**도움이 필요하신가요?**
- Supabase 공식 문서: https://supabase.com/docs
- OCP App 커뮤니티에서 질문하기
