# Services 011-019 ULW Notepad

## Goal
Continue sequential service factory execution from `nextService: 011` through `019`.

## Skills
- `omo:ulw-loop`: requested by the user; evidence-bound loop.
- `omo:frontend-ui-ux`: landing pages are user-facing browser surfaces.
- `browser/control-in-app-browser`: browser QA guidance; CDP screenshot fallback is allowed when in-app/browser-client path is unavailable or brittle.
- `omo:review-work`: significant multi-file implementation needs a final reviewer gate.

## Scope
- Distinct services: 9 (`011`-`019`).
- Production surfaces: 9 folders, 45 service files, 1 aggregate index, progress state, generator.
- Tests: 1 new RED/GREEN launch contract plus existing regression tests.
- Manual QA: HTTP for all `index.html` and `manifest.json`, browser screenshot for service `019`.

## Success Criteria
1. `SC-011-019-files`: test `tests/service_011_019_launch.test.mjs` fails before implementation and passes after. Manual QA: `curl/http` all service surfaces return 200.
2. `SC-payment-safety`: all pages/docs retain `PAYMENT_LINK_HERE`, say actual payment uses user-owned accounts, and contain no guarantee phrases. Manual QA: UTF-8 HTTP body scan.
3. `SC-progress`: `service_execution_progress.json` includes `001`-`019` and `nextService` is `020`; `.omo/boulder.json` current service is `020`. Manual QA: parsed JSON stdout.
4. `SC-browser`: real browser loads service `019` landing and captures a screenshot with H1/title evidence. Manual QA: CDP screenshot artifact.

## Plan
1. Add RED test for 011-019 contract.
2. Generate launch kits from catalog/review data with category-specific assets, adding booking category.
3. Run GREEN and regression tests.
4. Run HTTP QA and browser screenshot QA with cleanup receipts.
5. Append ledger and run reviewer gate.
## Evidence Update
- RED: `.omo/start-work/service_011_019_red.txt` captured `service_011_tax_accountant_analytics folder must exist`.
- GREEN: `.omo/start-work/service_011_019_green.txt` captured `service_011_019_launch.test.mjs passed`.
- Regressions: `.omo/start-work/service_011_019_regression_001.txt`, `.omo/start-work/service_011_019_regression_002_010.txt`, `.omo/start-work/service_011_019_regression_480.txt` all pass after progress-aware regression test fix.
- HTTP channel: `.omo/start-work/service_011_019_http_all.txt`, invocation `curl.exe -sS -i http://127.0.0.1:8830/<service>/<file>`, all 18 service files plus aggregate index 200, placeholders/caveats present, forbidden guarantee phrases absent, cleanup receipt recorded.
- Browser channel: `.omo/start-work/service_011_019_browser_log.txt` and `.omo/start-work/service_011_019_edge_019.png`, invocation `node tools/cdp_screenshot.mjs 9224 http://127.0.0.1:8831/service_019_hospital_crm/index.html ...`, H1/title captured, cleanup verified.
- Progress: `service_execution_progress.json` has `001`-`019`; `nextService` and Boulder `current_service` are `020`.
- Syntax/quality: `node --check` passed for changed scripts; LSP TypeScript server exited in this non-project folder, so executable Node checks and tests are the binding JS diagnostics.
