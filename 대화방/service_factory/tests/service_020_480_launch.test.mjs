import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const nicheSlugs = new Map([
  ["B2B 제조", "b2b_manufacturing"],
  ["PT샵", "pt_shop"],
  ["SaaS", "saas"],
  ["강사", "instructor"],
  ["교육기관", "education"],
  ["노무사", "labor_consultant"],
  ["도매 유통", "wholesale"],
  ["레스토랑", "restaurant"],
  ["렌탈 업체", "rental"],
  ["마케팅 대행사", "marketing_agency"],
  ["변호사", "lawyer"],
  ["병원", "hospital"],
  ["보험 설계사", "insurance_planner"],
  ["부동산", "real_estate"],
  ["비영리", "nonprofit"],
  ["사진관", "photo_studio"],
  ["세무사", "tax_accountant"],
  ["쇼핑몰", "shopping_mall"],
  ["수리 업체", "repair"],
  ["숙박업", "accommodation"],
  ["스마트스토어", "smart_store"],
  ["스튜디오", "studio"],
  ["앱 개발팀", "app_team"],
  ["여행사", "travel_agency"],
  ["영어교습소", "english_academy"],
  ["웨딩", "wedding"],
  ["웹에이전시", "web_agency"],
  ["이사 업체", "moving_company"],
  ["인테리어", "interior"],
  ["중고차", "used_car"],
  ["채용대행", "recruiting_agency"],
  ["청소 업체", "cleaning"],
  ["치과", "dental"],
  ["카페", "cafe"],
  ["코치", "coach"],
  ["프랜차이즈", "franchise"],
  ["피부관리샵", "skincare"],
  ["필라테스", "pilates"],
  ["학원", "academy"],
  ["한의원", "korean_clinic"],
]);

const categorySlugs = new Map([
  ["analytics", "analytics"],
  ["automation", "automation"],
  ["booking", "booking"],
  ["commerce", "commerce"],
  ["content", "content"],
  ["crm", "crm"],
  ["finance", "finance"],
  ["forms", "forms"],
  ["internal-tools", "internal_tools"],
  ["knowledge", "knowledge"],
  ["ops", "ops"],
  ["support", "support"],
]);

const requiredFiles = [
  "manifest.json",
  "index.html",
  "offer.md",
  "delivery_checklist.md",
  "outreach.md",
];

const mojibakePattern = /[�]|[遺臾寃媛留蹂移섏]/;

function serviceNumber(rank) {
  return String(rank).padStart(3, "0");
}

function folderName(service) {
  const niche = nicheSlugs.get(service.niche);
  const category = categorySlugs.get(service.category);
  assert.ok(niche, `missing slug for niche ${service.niche}`);
  assert.ok(category, `missing slug for category ${service.category}`);
  return `service_${serviceNumber(service.rank)}_${niche}_${category}`;
}

async function readText(filePath) {
  return readFile(filePath, "utf8");
}

async function readJson(filePath) {
  return JSON.parse(await readText(filePath));
}

function assertCleanEncoding(value, label) {
  assert.doesNotMatch(String(value), mojibakePattern, `${label} contains mojibake`);
}

const review = await readJson(path.join(root, "service_review_480.json"));
const catalog = await readJson(path.join(root, "services_480.json"));
const catalogById = new Map(catalog.map((service) => [service.id, service]));
const sorted = review.toSorted((a, b) => a.rank - b.rank);

assert.equal(sorted.length, 480, "review must contain 480 ranked services");
assert.deepEqual(sorted.map((service) => service.rank), Array.from({ length: 480 }, (_, index) => index + 1));

for (const service of sorted.slice(19)) {
  const number = serviceNumber(service.rank);
  const source = catalogById.get(service.id);
  assert.ok(source, `catalog must contain ${service.id}`);

  const serviceDir = path.join(root, folderName(service));
  assert.ok(existsSync(serviceDir), `${folderName(service)} folder must exist`);

  for (const fileName of requiredFiles) {
    assert.ok(existsSync(path.join(serviceDir, fileName)), `${folderName(service)}/${fileName} must exist`);
  }

  const manifest = await readJson(path.join(serviceDir, "manifest.json"));
  assert.equal(manifest.serviceNumber, number);
  assert.equal(manifest.sourceServiceId, service.id);
  assert.equal(manifest.rank, service.rank);
  assert.equal(manifest.name, service.name);
  assert.equal(manifest.category, service.category);
  assert.equal(manifest.niche, service.niche);
  assert.equal(manifest.score, service.score);
  assert.equal(manifest.tier, service.tier);
  assert.equal(manifest.channel, service.recommendedChannel);
  assert.equal(manifest.platform.primary, service.platform);
  assert.equal(manifest.payment.primary, service.paymentSystem);
  assert.equal(manifest.priceAnchor, source.price);
  assert.equal(manifest.offer, source.offer);
  assert.equal(manifest.openSource, source.openSource);
  assert.ok(Array.isArray(manifest.deliverables) && manifest.deliverables.length >= 6);
  assert.ok(Array.isArray(manifest.implementationSteps) && manifest.implementationSteps.length >= 4);
  assert.ok(Array.isArray(manifest.qaChecklist) && manifest.qaChecklist.length >= 6);

  for (const [key, value] of Object.entries({
    name: manifest.name,
    niche: manifest.niche,
    weakness: manifest.weakness,
    requiredAddition: manifest.requiredAddition,
    offer: manifest.offer,
  })) {
    assertCleanEncoding(value, `${number}.${key}`);
  }

  const landing = await readText(path.join(serviceDir, "index.html"));
  assert.match(landing, new RegExp(manifest.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(landing, /PAYMENT_LINK_HERE/);
  assert.match(landing, /사용자 소유 계정/);
  assert.doesNotMatch(landing, /수익 보장|무조건 매출|guaranteed income/i);
  assertCleanEncoding(landing, `${number}.index.html`);

  for (const docName of ["offer.md", "delivery_checklist.md", "outreach.md"]) {
    const doc = await readText(path.join(serviceDir, docName));
    assert.match(doc, /실제 결제는 사용자 소유 계정/);
    assert.match(doc, /환불|주의|보장하지 않습니다/);
    assert.match(doc, new RegExp(manifest.requiredAddition.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assertCleanEncoding(doc, `${number}.${docName}`);
  }
}

const progress = await readJson(path.join(root, "service_execution_progress.json"));
assert.equal(progress.completedServices.length, 480, "progress must mark 480 services complete");
assert.equal(new Set(progress.completedServices).size, 480, "progress must not duplicate service numbers");
assert.equal(progress.completedServices.at(0), "001");
assert.equal(progress.completedServices.at(-1), "480");
assert.equal(progress.nextService, null);
assert.equal(progress.status, "complete");

const aggregate = await readText(path.join(root, "service_020_480_index.html"));
assert.match(aggregate, /service_020_real_estate_internal_tools\/index.html/);
assert.match(aggregate, /service_480_coach_content\/index.html/);
assertCleanEncoding(aggregate, "service_020_480_index.html");

console.log("service_020_480_launch.test.mjs passed");
