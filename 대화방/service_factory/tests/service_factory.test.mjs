import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const roomRoot = fileURLToPath(new URL("../", root));

const readJson = async (name) => JSON.parse(await readFile(new URL(name, root), "utf8"));
const readText = async (name) => readFile(new URL(name, root), "utf8");

const requiredKeys = [
  "id",
  "name",
  "category",
  "customer",
  "problem",
  "offer",
  "openSource",
  "sourceUrl",
  "price",
  "mvpDays",
  "complexity",
  "firstAction",
  "risk",
];

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

test("Given service data when parsed then it contains 40+ concrete service offers with required fields", async () => {
  const services = await readJson("services.json");
  assert.equal(Array.isArray(services), true, "services.json must be an array");
  assert.ok(services.length >= 40, `expected at least 40 services, got ${services.length}`);
  for (const service of services) {
    for (const key of requiredKeys) {
      assert.ok(Object.hasOwn(service, key), `missing ${key} on ${service.id ?? "unknown"}`);
      assert.notEqual(String(service[key]).trim(), "", `blank ${key} on ${service.id}`);
    }
    assert.match(service.price, /[$₩0-9]/, `price must be concrete on ${service.id}`);
    assert.ok(Number(service.mvpDays) >= 1 && Number(service.mvpDays) <= 14, `mvpDays out of fast-service range on ${service.id}`);
  }
});

test("Given open-source service strategy when parsed then it contains 20+ sourced OSS-backed offers and no revenue guarantee", async () => {
  const services = await readJson("services.json");
  const oss = services.filter((service) => service.openSource !== "직접제작");
  assert.ok(oss.length >= 20, `expected at least 20 OSS-backed services, got ${oss.length}`);
  for (const service of oss) {
    assert.match(service.sourceUrl, /^https:\/\/(github\.com|www\.chatwoot\.com|cal\.com|formbricks\.com|www\.metabase\.com|plausible\.io|umami\.is|www\.appsmith\.com|www\.n8n\.io)/, `invalid source URL on ${service.id}`);
  }
  const allText = JSON.stringify(services);
  assert.doesNotMatch(allText, /보장|무조건|확실히 돈|guaranteed income/i, "services must not guarantee revenue");
});

test("Given service factory page when opened then it exposes search, category filters, offer cards, and source links", async () => {
  const html = await readText("index.html");
  assert.match(html, /id="service-search"/, "catalog needs search input");
  assert.match(html, /data-category="automation"/, "catalog needs automation filter");
  assert.match(html, /data-category="support"/, "catalog needs support filter");
  assert.match(html, /서비스화 실행 후보/, "catalog needs Korean service factory headline");
  assert.match(html, /services\.json/, "catalog must load services data");
  assert.match(html, /복사/, "catalog needs copy actions for sales use");
  assert.match(html, /URLSearchParams/, "catalog needs URL query support for browser QA and shareable searches");
});

test("Given sales playbooks when read then they provide launch scripts, package pricing, and deployment caveats", async () => {
  const playbook = await readText("서비스팩토리_실행매뉴얼.md");
  const proposals = await readText("서비스팩토리_영업패키지.md");
  assert.match(playbook, /Activepieces|Twenty|Chatwoot|Formbricks|Metabase/, "playbook must cover major OSS anchors");
  assert.match(playbook, /오픈소스 라이선스/, "playbook must mention license review");
  assert.match(playbook, /1일차|2일차|3일차/, "playbook must include day-by-day launch flow");
  assert.match(proposals, /초기 세팅|월 유지보수|업셀/, "proposal doc must include package pricing structure");
  assert.match(proposals, /클라이언트에게 보내는 첫 문장/, "proposal doc must include outreach copy");
});

test("Given source notes and entry alias when read then they route users and document OSS caveats", async () => {
  const sourceNotes = await readText("서비스팩토리_오픈소스출처.md");
  const alias = await readFile(join(roomRoot, "서비스팩토리.html"), "utf8");
  assert.match(sourceNotes, /https:\/\/github\.com\/activepieces\/activepieces/, "source notes need Activepieces source");
  assert.match(sourceNotes, /https:\/\/github\.com\/twentyhq\/twenty/, "source notes need Twenty source");
  assert.match(sourceNotes, /https:\/\/github\.com\/chatwoot\/chatwoot/, "source notes need Chatwoot source");
  assert.match(sourceNotes, /라이선스 확인/, "source notes need license review caveat");
  assert.match(alias, /service_factory\/service_factory_480\.html/, "root alias must link to upgraded 480 service factory index");
  assert.match(alias, /서비스팩토리/, "root alias must be discoverable in Korean");
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
