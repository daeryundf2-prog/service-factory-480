# 서비스팩토리 ULW 노트

## 요청
서비스가 목적이니 최대한 많이 만들고, 오픈소스로 제대로 만들어진 것이 있으면 검색해서 서비스화할 수 있게 만든다.

## 사용할 스킬
- `omo:ulw-loop`: 사용자가 명시했고, 목표/증거 기반 루프가 필요하다.
- `omo:frontend-ui-ux`: 결과물이 브라우저 카탈로그라 UI/UX 표면이 중요하다.
- `omo:review-work`: 다수 파일을 만드는 의미 있는 구현이므로 최종 검토가 필요하다.
- `omo:programming`: TypeScript/Go/Python은 피하지만, 테스트 주도 원칙은 적용한다.

## 범위 산정
- 표면: 브라우저 서비스 카탈로그 1개, 데이터 JSON 1개, 실행 매뉴얼 2개, 테스트 1개.
- 파일: 5개 이상.
- 단계: 조사, RED 테스트, 구현, GREEN, HTTP QA, 리뷰.
- 계획 에이전트: 호출했으나 응답 지연으로 닫았다. 자체 웨이브로 진행한다.

## 성공 기준
- C1 데이터: 40개 이상 서비스 후보, 20개 이상 오픈소스 기반, 가격/고객/첫 액션/리스크 포함.
- C2 UI: 검색, 카테고리 필터, 카드, 복사 액션, 출처 링크가 있는 카탈로그.
- C3 실행문서: 오픈소스 설치/서비스화 매뉴얼과 영업 패키지 문서.

## 테스트 매핑
- C1: `대화방/service_factory/tests/service_factory.test.mjs` - service data tests.
- C2: `대화방/service_factory/tests/service_factory.test.mjs` - catalog page tests.
- C3: `대화방/service_factory/tests/service_factory.test.mjs` - playbook tests.

## 수동 QA 시나리오
- C1 HTTP: `curl -i http://127.0.0.1:<port>/services.json`, PASS = HTTP 200 and 40+ JSON entries.
- C2 HTTP: `curl -i http://127.0.0.1:<port>/index.html`, PASS = HTTP 200 and headline/search markup.
- C3 HTTP: `curl -i http://127.0.0.1:<port>/%EC%84%9C%EB%B9%84%EC%8A%A4%ED%8C%A9%ED%86%A0%EB%A6%AC_%EC%8B%A4%ED%96%89%EB%A7%A4%EB%89%B4%EC%96%BC.md`, PASS = HTTP 200 and OSS/manual text.

## RED
대상 파일 생성 전 테스트를 먼저 작성했다.

### RED 증거
- `.omo/ulw-loop/evidence/service_factory_red.txt`: `services.json`, `index.html`, 실행매뉴얼 부재로 실패.
- `.omo/ulw-loop/evidence/service_factory_red_sources_alias.txt`: 오픈소스 출처 노트 부재로 실패.
- `.omo/ulw-loop/evidence/service_factory_red_url_params.txt`: URL 검색 파라미터 지원 부재로 실패.

## GREEN 증거
- `.omo/ulw-loop/evidence/service_factory_green_final.txt`: 5개 테스트 전부 PASS.
- 테스트 항목:
  - 40개 이상 서비스 후보와 필수 필드.
  - 20개 이상 오픈소스 기반 후보와 수익 보장 문구 금지.
  - 검색, 카테고리, 복사, 출처 링크가 있는 카탈로그.
  - 실행매뉴얼과 영업패키지.
  - 루트 진입 파일과 오픈소스 출처 노트.

## 생성 산출물
- `대화방/서비스팩토리.html`
- `대화방/service_factory/index.html`
- `대화방/service_factory/services.json`
- `대화방/service_factory/서비스팩토리_실행매뉴얼.md`
- `대화방/service_factory/서비스팩토리_영업패키지.md`
- `대화방/service_factory/서비스팩토리_오픈소스출처.md`
- `대화방/service_factory/tests/service_factory.test.mjs`

## 수동 QA 증거
- C1 HTTP data: `.omo/ulw-loop/evidence/service_factory_http_services.txt`
  - `curl.exe -i http://127.0.0.1:8780/service_factory/services.json`
  - PASS: HTTP 응답과 서비스 48개 확인.
  - cleanup: `.omo/ulw-loop/evidence/service_factory_http_summary.txt`
- C2 Browser UI:
  - Microsoft Edge headless action: `http://127.0.0.1:8782/service_factory/index.html?q=Chatwoot`
  - screenshot: `.omo/ulw-loop/evidence/service_factory_edge_chatwoot_real.png`
  - action log: `.omo/ulw-loop/evidence/service_factory_browser_action_log.json`
  - PASS: 실제 카탈로그 화면에 Chatwoot 검색 결과 1개와 복사/출처 버튼 표시.
  - cleanup: `.omo/ulw-loop/evidence/service_factory_browser_summary.txt`
- C3 HTTP manual: `.omo/ulw-loop/evidence/service_factory_http_manual.txt`
  - `curl.exe -i http://127.0.0.1:8780/service_factory/<encoded manual>`
  - PASS: `오픈소스 라이선스`, `Activepieces` 문구 확인.
  - cleanup: `.omo/ulw-loop/evidence/service_factory_http_summary.txt`

## 정리 확인
- Python HTTP QA 프로세스 없음.
- `edge-sf*` 임시 프로필 없음.
- LSP: Markdown 폴더에는 구성된 LSP 서버가 없어 진단 불가. Node 테스트와 HTTP/Edge QA로 대체.

## 출처 조사
- GitHub 검색/공식 페이지 기반으로 Activepieces, Twenty, InvoicePlane, Chatwoot, Zammad, Formbricks, Metabase 등 오픈소스 후보를 선정했다.
- 실제 납품 전 최신 라이선스 확인이 필요하므로 출처 노트에 라이선스 확인 caveat를 남겼다.

## 리뷰 게이트
- reviewer: `/root/service_factory_reviewer`
- verdict: UNCONDITIONAL APPROVAL
- 요약:
  - 48개 서비스 후보와 오픈소스 중심 서비스팩토리 목표 적합.
  - 수익 보장 과장 없음.
  - HTTP 200 및 Edge screenshot evidence 확인.
  - Node 테스트 5개 PASS 확인.
  - `대화방/서비스팩토리.html` 진입점 확인.
