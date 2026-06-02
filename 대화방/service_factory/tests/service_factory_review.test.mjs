import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const readJson = async (name) => JSON.parse(await readFile(new URL(name, root), "utf8"));
const readText = async (name) => readFile(new URL(name, root), "utf8");

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

test("Given 480 service review when parsed then every service is ranked with score, tier, and weakness", async () => {
  const services = await readJson("services_480.json");
  const review = await readJson("service_review_480.json");
  assert.equal(review.length, 480, `expected 480 reviewed services, got ${review.length}`);
  const ids = new Set(services.map((service) => service.id));
  let topCount = 0;
  for (const item of review) {
    assert.ok(ids.has(item.id), `review id not in services_480: ${item.id}`);
    assert.ok(Number.isInteger(item.rank) && item.rank >= 1 && item.rank <= 480, `bad rank on ${item.id}`);
    assert.ok(item.score >= 0 && item.score <= 100, `bad score on ${item.id}`);
    assert.ok(["A", "B", "C", "D"].includes(item.tier), `bad tier on ${item.id}`);
    assert.ok(item.weakness.length >= 8, `weakness too thin on ${item.id}`);
    assert.ok(item.requiredAddition.length >= 8, `requiredAddition too thin on ${item.id}`);
    if (item.rank <= 20) topCount += 1;
  }
  assert.equal(topCount, 20, "must have exactly top 20 rank entries");
});

test("Given gap additions when parsed then missing pieces are covered across platform, payment, legal, ops, and app channels", async () => {
  const gaps = await readJson("service_gap_additions.json");
  assert.ok(gaps.length >= 40, `expected at least 40 gap additions, got ${gaps.length}`);
  const categories = new Set(gaps.map((gap) => gap.category));
  for (const required of ["platform", "payment", "legal", "ops", "android", "apple", "web", "sales"]) {
    assert.ok(categories.has(required), `missing gap category ${required}`);
  }
  for (const gap of gaps) {
    assert.ok(gap.fix, `gap ${gap.id} needs fix`);
    assert.ok(gap.appliesTo.length >= 1, `gap ${gap.id} needs appliesTo`);
  }
});

test("Given payment forms when parsed then multiple online, invoice, marketplace, mobile, subscription, and offline forms exist", async () => {
  const forms = await readJson("payment_forms.json");
  assert.ok(forms.length >= 24, `expected at least 24 payment forms, got ${forms.length}`);
  const channels = new Set(forms.map((form) => form.channel));
  for (const required of ["web", "marketplace", "android", "apple", "invoice", "subscription", "offline", "korea"]) {
    assert.ok(channels.has(required), `missing payment channel ${required}`);
  }
  for (const form of forms) {
    assert.ok(form.accountRequired === true, `payment form ${form.name} must require user-owned account`);
    assert.ok(form.whenToUse, `payment form ${form.name} needs whenToUse`);
    assert.ok(form.caveat, `payment form ${form.name} needs caveat`);
  }
});

test("Given platform channel strategy when parsed then web, Android, Apple, and internet service paths are possible and policy-caveated", async () => {
  const strategy = await readJson("platform_channel_strategy.json");
  const names = strategy.map((item) => item.channel);
  for (const required of ["web", "android", "apple", "internet-service", "marketplace"]) {
    assert.ok(names.includes(required), `missing channel ${required}`);
  }
  const text = JSON.stringify(strategy);
  assert.match(text, /Google Play Billing/, "Android strategy needs Google Play Billing caveat");
  assert.match(text, /Apple In-App Purchase|StoreKit/, "Apple strategy needs IAP or StoreKit caveat");
  assert.match(text, /Stripe Payment Links/, "Web strategy needs Stripe option");
});

test("Given service review dashboard and report when read then they expose ranking, gaps, payment forms, and app platform guidance", async () => {
  const html = await readText("service_review_dashboard.html");
  const report = await readText("480서비스_전체리뷰.md");
  assert.match(html, /service_review_480\.json/, "dashboard must load review ranking");
  assert.match(html, /payment_forms\.json/, "dashboard must load payment forms");
  assert.match(html, /platform_channel_strategy\.json/, "dashboard must load channel strategy");
  assert.match(html, /id="tier-filter"/, "dashboard needs tier filter");
  assert.match(report, /Top 20/, "report needs Top 20 section");
  assert.match(report, /부족한 점/, "report needs weakness section");
  assert.match(report, /안드로이드|Android/, "report needs Android section");
  assert.match(report, /애플|Apple|iOS/, "report needs Apple section");
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

if (failures > 0) {
  process.exitCode = 1;
}
