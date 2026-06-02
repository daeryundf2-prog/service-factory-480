import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../service_001_saas_analytics/", import.meta.url);
const readText = async (name) => readFile(new URL(name, root), "utf8");
const readJson = async (name) => JSON.parse(await readText(name));

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

test("Given Service 001 launch kit when parsed then it has a complete sellable offer manifest", async () => {
  const manifest = await readJson("manifest.json");
  assert.equal(manifest.serviceNumber, "001", "manifest must identify Service 001");
  assert.equal(manifest.sourceServiceId, "svc-352", "manifest must map to reviewed top service");
  assert.match(manifest.name, /SaaS.*분석/, "manifest must name the SaaS analytics service");
  assert.ok(manifest.priceAnchor, "manifest needs price anchor");
  assert.ok(manifest.platform.primary, "manifest needs primary platform");
  assert.ok(manifest.payment.primary, "manifest needs primary payment");
  assert.ok(manifest.deliverables.length >= 6, "manifest needs 6+ deliverables");
  assert.ok(manifest.qaChecklist.length >= 6, "manifest needs 6+ QA checks");
});

test("Given Service 001 landing page when read then it has payment placeholder and no revenue guarantee", async () => {
  const html = await readText("index.html");
  assert.match(html, /SaaS 분석 대시보드 서비스/, "landing needs service title");
  assert.match(html, /PAYMENT_LINK_HERE/, "landing needs payment placeholder");
  assert.match(html, /Stripe Payment Links/, "landing needs Stripe path");
  assert.match(html, /Metabase|Umami|Plausible/, "landing needs analytics stack references");
  assert.doesNotMatch(html, /수익 보장|무조건 매출|guaranteed income/i, "landing must not overclaim revenue");
});

test("Given Service 001 sales documents when read then they include outreach, onboarding, delivery, and refund/account caveats", async () => {
  const offer = await readText("offer.md");
  const checklist = await readText("delivery_checklist.md");
  const outreach = await readText("outreach.md");
  assert.match(offer, /실제 결제는 사용자 소유 계정/, "offer needs user-owned payment caveat");
  assert.match(offer, /환불|refund/i, "offer needs refund wording");
  assert.match(checklist, /전환 이벤트|데이터 품질|월간 리포트/, "checklist needs required additions from review");
  assert.match(outreach, /SaaS/, "outreach needs SaaS targeting");
  assert.match(outreach, /첫 제안/, "outreach needs first proposal copy");
});

let failures = 0;
for (const { name, fn } of tests) {
  try {
    await fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    failures += 1;
    console.error(`FAIL ${name}`);
    console.error(error instanceof Error ? error.message : String(error));
  }
}

if (failures > 0) process.exitCode = 1;
