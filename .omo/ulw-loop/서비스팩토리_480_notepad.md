# 서비스팩토리 480 ULW 노트

## 요청
48개는 부족하니 480개 서비스 후보를 만들고, 플랫폼도 정하며, 결제 시스템 유무와 선택지를 모두 만들고 리뷰한다.

## 사용할 스킬
- `ulw`: 사용자가 명시했다. 증거 기반 목표 실행으로 진행한다.
- `omo:frontend-ui-ux`: 브라우저 카탈로그와 플랫폼/결제 UI를 확장한다.
- `omo:review-work`: 다수 파일과 결제/플랫폼 가이드가 포함되어 리뷰 게이트가 필요하다.

## 범위
- 데이터: 480개 서비스 후보.
- 플랫폼: 판매/호스팅/마켓플레이스/서비스 운영 플랫폼 12개 이상.
- 결제: Stripe, Gumroad, Ko-fi, Payhip, Paddle, Lemon Squeezy 등 결제/상점 선택지 10개 이상.
- 표면: 브라우저 카탈로그, 플랫폼 선택표, 결제 시스템 문서.
- 제한: 계정 생성, 실제 결제 링크 생성, 결제 수령, 외부 게시 대행은 하지 않는다.

## 성공 기준
- C1: `services_480.json`에 480개 서비스 후보가 있고 각 후보는 플랫폼과 결제 추천을 가진다.
- C2: `platforms.json`에 12개 이상 플랫폼과 결제 가능 여부/추천 용도가 있다.
- C3: `payment_systems.json`과 `결제시스템_세팅가이드.md`에 결제 시스템 10개 이상과 세팅 순서가 있다.
- C4: `service_factory_480.html`이 480 카탈로그와 플랫폼/결제 매핑을 브라우저에서 보여준다.

## QA 계획
- RED: 확장 테스트를 먼저 작성하고 파일 부재/48개 한계로 실패시킨다.
- GREEN: 생성기와 산출물을 만든 뒤 테스트 통과.
- HTTP QA: 480 JSON, 플랫폼 JSON, 결제 JSON, HTML을 `curl -i`로 확인.
- Browser QA: Edge headless로 `?q=Chatwoot&platform=Gumroad` 페이지 캡처.

## 외부 조사
- Stripe Payment Links 공식 문서.
- Ko-fi Shop 공식 도움말.
- Payhip 디지털 상품 공식 도움말.
- Paddle digital products 공식 문서.
- Lemon Squeezy digital products 공식 페이지.

## RED 증거
- `.omo/ulw-loop/evidence/service_factory_480_red.txt`
- 실패 이유:
  - `services_480.json` 없음.
  - `platforms.json` 없음.
  - `payment_systems.json` 없음.
  - `service_factory_480.html` 없음.

## GREEN 증거
- `.omo/ulw-loop/evidence/service_factory_480_green_final.txt`
- PASS:
  - 480개 서비스 후보 정확히 생성.
  - 12개 플랫폼과 결제/배포 가이드 포함.
  - 12개 결제 시스템과 사용자 소유 계정 caveat 포함.
  - 480 카탈로그가 데이터/플랫폼/결제 데이터를 로드.
  - 루트 `대화방/서비스팩토리.html`이 480 카탈로그로 이동.

## 생성/수정 산출물
- `대화방/service_factory/build_service_factory_480.mjs`
- `대화방/service_factory/services_480.json`
- `대화방/service_factory/platforms.json`
- `대화방/service_factory/payment_systems.json`
- `대화방/service_factory/service_factory_480.html`
- `대화방/service_factory/결제시스템_세팅가이드.md`
- `대화방/service_factory/tests/service_factory_480.test.mjs`
- `대화방/서비스팩토리.html`

## 수동 QA 증거
- C1 HTTP services:
  - command: `curl.exe -i http://127.0.0.1:8788/service_factory/services_480.json`
  - evidence: `.omo/ulw-loop/evidence/service_factory_480_http_services.txt`
  - PASS: 480개 JSON 확인.
- C2 HTTP platforms/payments:
  - commands:
    - `curl.exe -i http://127.0.0.1:8788/service_factory/platforms.json`
    - `curl.exe -i http://127.0.0.1:8788/service_factory/payment_systems.json`
  - evidence:
    - `.omo/ulw-loop/evidence/service_factory_480_http_platforms.txt`
    - `.omo/ulw-loop/evidence/service_factory_480_http_payments.txt`
  - PASS: 12 플랫폼, 12 결제 시스템 확인.
- C3 HTTP payment guide:
  - command: `curl.exe -i http://127.0.0.1:8788/service_factory/<encoded 결제시스템_세팅가이드.md>`
  - evidence: `.omo/ulw-loop/evidence/service_factory_480_http_payment_guide.txt`
  - PASS: 실제 결제는 사용자 소유 계정 필요 문구 포함.
- C4 Browser:
  - channel: Microsoft Edge headless
  - URL: `http://127.0.0.1:8789/service_factory/service_factory_480.html?q=Chatwoot&platform=Ko-fi`
  - screenshot: `.omo/ulw-loop/evidence/service_factory_480_edge_gumroad.png`
  - action log: `.omo/ulw-loop/evidence/service_factory_480_browser_action_log.json`
  - PASS: 480 카탈로그, Chatwoot 검색, Ko-fi 플랫폼 필터 결과 렌더.

## 정리 확인
- `.omo/ulw-loop/evidence/service_factory_480_http_summary.txt`: HTTP server cleanup 기록.
- `.omo/ulw-loop/evidence/service_factory_480_browser_summary.txt`: Edge profile cleanup 기록.
- 추가 확인: `python.exe` QA 서버 없음, `edge-sf480-*` 임시 폴더 없음.

## 플랫폼/결제 선택 결론
- 첫 판매: Gumroad, Ko-fi, Payhip.
- 서비스 착수금: Stripe Payment Links.
- 글로벌 소프트웨어/구독: Paddle, Lemon Squeezy.
- 한국어 대행: 크몽, 숨고, 네이버 스마트스토어, 계좌이체/세금계산서.

## 리뷰 게이트
- reviewer: `/root/service_factory_480_reviewer`
- verdict: UNCONDITIONAL APPROVAL
- 확인:
  - `services_480.json` = 480 items.
  - `platforms.json` = 12 platforms.
  - `payment_systems.json` = 12 systems.
  - `service_factory_480.html` renders catalog plus platform/payment matrices.
  - Node tests all PASS.
  - HTTP evidence all 200 OK.
  - Browser evidence screenshot renders filtered catalog.
