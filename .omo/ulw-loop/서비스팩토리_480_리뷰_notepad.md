# 서비스팩토리 480 리뷰 ULW 노트

## 요청
480개 서비스 전체 검토와 순위화, 부족한 점 보강, 다양한 결제 형태, 웹/안드로이드/애플/인터넷 서비스 플랫폼 전략 추가.

## 사용할 스킬
- `ulw`: 사용자가 명시했고 RED→GREEN+수동 QA 루프가 필요하다.
- `omo:frontend-ui-ux`: 리뷰 대시보드가 브라우저 표면이다.
- `omo:review-work`: 사용자가 리뷰를 요청했고 다수 파일을 만든다.

## 성공 기준
- C1: 480개 전체가 점수, 순위, 티어, 부족점, 보강 액션을 가진다.
- C2: 부족한 점 보강 목록이 플랫폼/결제/법무/운영/안드로이드/애플/웹/영업 범주를 포함한다.
- C3: 결제 형태가 웹, 마켓플레이스, Android, Apple, invoice, subscription, offline, Korea 채널을 모두 포함한다.
- C4: 웹/안드로이드/애플/인터넷 서비스/마켓플레이스 전략이 정책 caveat와 함께 있다.
- C5: 브라우저 리뷰 대시보드와 전체 리뷰 보고서가 생성된다.

## RED
테스트 파일을 먼저 추가하고 산출물 부재를 실패로 확인한다.

## RED 증거
- `.omo/ulw-loop/evidence/service_factory_review_red.txt`
- 실패 이유:
  - `service_review_480.json` 없음.
  - `service_gap_additions.json` 없음.
  - `payment_forms.json` 없음.
  - `platform_channel_strategy.json` 없음.
  - `service_review_dashboard.html` 없음.

## GREEN 증거
- `.omo/ulw-loop/evidence/service_factory_review_green_final.txt`
- PASS:
  - 480개 전체 순위/점수/티어/부족점/필요 보강 생성.
  - 부족점 보강 48개가 플랫폼/결제/법무/운영/안드로이드/애플/웹/영업을 포함.
  - 결제 형태 24개가 웹/마켓플레이스/안드로이드/애플/인보이스/구독/오프라인/한국 채널 포함.
  - 웹, Android, Apple, internet-service, marketplace 전략 포함.
  - 리뷰 대시보드와 전체 리뷰 보고서 생성.
- 회귀:
  - `.omo/ulw-loop/evidence/service_factory_review_regression_480_final.txt`
  - `.omo/ulw-loop/evidence/service_factory_review_regression_original_final.txt`

## 생성/수정 산출물
- `대화방/service_factory/build_service_review.mjs`
- `대화방/service_factory/service_review_480.json`
- `대화방/service_factory/service_gap_additions.json`
- `대화방/service_factory/payment_forms.json`
- `대화방/service_factory/platform_channel_strategy.json`
- `대화방/service_factory/service_review_dashboard.html`
- `대화방/service_factory/480서비스_전체리뷰.md`
- `대화방/service_factory/tests/service_factory_review.test.mjs`
- 수정: `대화방/service_factory/tests/service_factory.test.mjs`

## 수동 QA 증거
- HTTP:
  - `.omo/ulw-loop/evidence/service_factory_review_http_review.txt`
  - `.omo/ulw-loop/evidence/service_factory_review_http_gaps.txt`
  - `.omo/ulw-loop/evidence/service_factory_review_http_payment_forms.txt`
  - `.omo/ulw-loop/evidence/service_factory_review_http_channels.txt`
  - `.omo/ulw-loop/evidence/service_factory_review_http_dashboard.txt`
  - `.omo/ulw-loop/evidence/service_factory_review_http_report.txt`
  - summary: `.omo/ulw-loop/evidence/service_factory_review_http_summary.txt`
  - PASS: review=480, paymentForms=24, channels=5.
- Browser:
  - Edge URL: `http://127.0.0.1:8793/service_factory/service_review_dashboard.html?q=병원&tier=A`
  - screenshot: `.omo/ulw-loop/evidence/service_factory_review_edge_A_android.png`
  - action log: `.omo/ulw-loop/evidence/service_factory_review_browser_action_log.json`
  - summary: `.omo/ulw-loop/evidence/service_factory_review_browser_summary.txt`
  - PASS: 병원 A티어 후보와 부족점/추가 액션 카드 렌더.

## 정책 조사 반영
- Apple: 앱 안 디지털 콘텐츠/기능/구독은 Apple In-App Purchase 또는 StoreKit 정책을 우선 검토.
- Google Play: Google Play 배포 앱에서 앱 안 디지털 기능/서비스 결제는 Google Play Billing 정책을 우선 검토.
- Web: Stripe Payment Links, Paddle, Lemon Squeezy, Gumroad, Payhip 등 사용자 소유 계정으로 결제 링크 생성.

## 정리 확인
- QA용 Python HTTP 서버 없음. 기존 `kakao_gui_v2.py`는 이 작업이 만든 프로세스가 아니므로 유지.
- `edge-sfreview-*` 임시 프로필 없음.
- 계획 에이전트는 지연되어 닫았다. 자체 웨이브로 RED→GREEN→HTTP/Browser QA 완료.

## 추가 자체 감사
- `.omo/ulw-loop/evidence/service_factory_review_self_audit.json`
- 결과:
  - Reviewed: 480
  - RankMin: 1
  - RankMax: 480
  - TierA: 65
  - TierB: 347
  - TierC: 68
  - PaymentForms: 24
  - PaymentChannels: web, marketplace, android, apple, invoice, subscription, offline, korea
  - PlatformChannels: web, android, apple, internet-service, marketplace

## 리뷰 게이트 상태
- 전용 reviewer `/root/service_factory_review_reviewer`: 응답 없음으로 닫음.
- 전용 reviewer fast `/root/service_factory_review_reviewer_fast`: 응답 없음으로 닫음.
- default xhigh audit `/root/service_factory_review_default_audit`: 응답 없음.
- 차단: reviewer unconditional approval을 받지 못했다.

## 재개 후 리뷰 게이트
- fresh tests:
  - `.omo/ulw-loop/evidence/service_factory_review_resume_green.txt`
  - `.omo/ulw-loop/evidence/service_factory_review_resume_regression_480.txt`
  - `.omo/ulw-loop/evidence/service_factory_review_resume_regression_original.txt`
- fresh HTTP QA:
  - `.omo/ulw-loop/evidence/service_factory_review_resume_http_summary.txt`
  - PASS: review=480, paymentForms=24, channels=5.
- fresh Browser QA:
  - `.omo/ulw-loop/evidence/service_factory_review_resume_edge_android.png`
  - `.omo/ulw-loop/evidence/service_factory_review_resume_browser_summary.txt`
  - PASS: Android + A tier filtered dashboard rendered.
- final reviewer:
  - `/root/service_review_fast_approval`
  - verdict: UNCONDITIONAL APPROVAL
