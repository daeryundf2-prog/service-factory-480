# 480서비스 넘버링 플랜 ULW 노트

## 목표
리뷰된 480개 서비스 데이터를 토대로 각 서비스별 번호가 붙은 실행 플랜을 작성한다.

## 사용할 스킬
- `omo:ulw-plan`: 사용자가 명시했고 계획 산출물이 목표다.
- `ulw`: 현재 턴은 증거 기반 진행이 요구된다.

## 성공 기준
- C1: `plans/480_service_numbered_plan.md`가 존재한다.
- C2: 서비스별 numbered plan 항목이 정확히 480개다.
- C3: 각 항목은 rank/id/name/tier/score/platform/payment/channel/weakness/requiredAddition/steps를 포함한다.
- C4: Top 20, Wave strategy, platform/payment policy caveat가 포함된다.
- C5: HTTP 또는 파일 표면으로 실제 내용을 검증한다.

## RED
계획 파일 생성 전 검증을 먼저 실행한다.

## RED 증거
- `.omo/ulw-loop/evidence/480_service_plan_red.txt`: 계획 파일 부재로 실패.
- `.omo/ulw-loop/evidence/480_service_plan_red_metis_fixes.txt`: Metis 지적 반영 전 번호 형식 `### 001.` 부재로 실패.

## Metis 반영
- 실제 경로를 명시했다: `대화방/service_factory/service_review_480.json`.
- 번호는 리뷰 rank 순서로 확정했다.
- `web-service`, `web-marketplace`, `android-apple-companion`, `internet-service` 채널 매핑을 추가했다.
- PowerShell 한글 JSON 파싱 리스크 때문에 Node UTF-8 검증을 사용했다.
- 480개 서비스별 compact schema와 6단계 실행 플랜을 적용했다.

## GREEN 증거
- `.omo/ulw-loop/evidence/480_service_plan_green.txt`
- PASS:
  - `### 001.`부터 `### 480.`까지 정확히 480개.
  - `svc-###` 서비스 ID가 480개 이상 포함.
  - 각 서비스에 1단계와 6단계 실행 단계가 존재.
  - `service_review_480.json`, `services_480.json`, `payment_forms.json`, `platform_channel_strategy.json` 참조 포함.
  - Google Play Billing, Apple In-App Purchase 정책 caveat 포함.

## 수동 QA
- `.omo/ulw-loop/evidence/480_service_plan_http.txt`
- `.omo/ulw-loop/evidence/480_service_plan_http_summary.txt`
- HTTP command: `curl.exe -i http://127.0.0.1:8801/480_service_numbered_plan.md`
- PASS: HTTP 표면에서 480개 numbered service headings 확인.
- cleanup: Python HTTP server stopped, `alive_after_stop=False`.

## 산출물
- `plans/480_service_numbered_plan.md`
- `.omo/drafts/480_service_numbered_plan.md`

## 리뷰 게이트
- 1차 reviewer `/root/plan_480_reviewer`: 제한 시간 내 응답 없음으로 닫음.
- 빠른 reviewer `/root/plan_480_fast_review`: UNCONDITIONAL APPROVAL.
