import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const services = [
  ["011", "service_011_tax_accountant_analytics", "svc-112", 11],
  ["012", "service_012_shopping_mall_internal_tools", "svc-213", 12],
  ["013", "service_013_web_agency_internal_tools", "svc-393", 13],
  ["014", "service_014_dental_analytics", "svc-016", 14],
  ["015", "service_015_franchise_crm", "svc-254", 15],
  ["016", "service_016_saas_booking", "svc-354", 16],
  ["017", "service_017_wholesale_crm", "svc-242", 17],
  ["018", "service_018_lawyer_crm", "svc-098", 18],
  ["019", "service_019_hospital_crm", "svc-002", 19],
];

const requiredFiles = [
  "manifest.json",
  "index.html",
  "offer.md",
  "delivery_checklist.md",
  "outreach.md",
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function readText(filePath) {
  return readFile(filePath, "utf8");
}

async function readJson(filePath) {
  return JSON.parse(await readText(filePath));
}

for (const [serviceNumber, folderName, sourceServiceId, rank] of services) {
  const serviceDir = path.join(root, folderName);
  assert.ok(existsSync(serviceDir), `${folderName} folder must exist`);

  for (const fileName of requiredFiles) {
    assert.ok(existsSync(path.join(serviceDir, fileName)), `${folderName}/${fileName} must exist`);
  }

  const manifest = await readJson(path.join(serviceDir, "manifest.json"));
  assert.equal(manifest.serviceNumber, serviceNumber);
  assert.equal(manifest.sourceServiceId, sourceServiceId);
  assert.equal(manifest.rank, rank);
  assert.ok(manifest.name);
  assert.ok(manifest.category);
  assert.ok(manifest.niche);
  assert.ok(manifest.platform?.primary);
  assert.ok(manifest.payment?.primary);
  assert.ok(manifest.priceAnchor);
  assert.ok(manifest.weakness);
  assert.ok(manifest.requiredAddition);
  assert.ok(Array.isArray(manifest.deliverables) && manifest.deliverables.length >= 6);
  assert.ok(Array.isArray(manifest.qaChecklist) && manifest.qaChecklist.length >= 6);

  const landing = await readText(path.join(serviceDir, "index.html"));
  assert.match(landing, new RegExp(escapeRegex(manifest.name)));
  assert.match(landing, /PAYMENT_LINK_HERE/);
  assert.match(landing, new RegExp(escapeRegex(manifest.platform.primary)));
  assert.match(landing, new RegExp(escapeRegex(manifest.payment.primary)));
  assert.doesNotMatch(landing, /수익 보장|무조건 매출|guaranteed income/i);

  for (const docName of ["offer.md", "delivery_checklist.md", "outreach.md"]) {
    const doc = await readText(path.join(serviceDir, docName));
    assert.match(doc, /실제 결제는 사용자 소유 계정/);
    assert.match(doc, /환불|주의|보장하지 않습니다/);
    assert.match(doc, new RegExp(escapeRegex(manifest.requiredAddition)));
  }

  if (manifest.category === "booking") {
    assert.deepEqual(
      ["예약 변경/취소 규칙", "노쇼 방지 메시지", "캘린더 충돌 테스트"].every((item) =>
        manifest.deliverables.includes(item),
      ),
      true,
      "booking launch kit must include booking-specific risk controls",
    );
  }
}

const aggregate = await readText(path.join(root, "service_011_019_index.html"));
assert.match(aggregate, /서비스 011-019 출시 키트/);
assert.match(aggregate, /service_019_hospital_crm\/index.html/);

const progress = await readJson(path.join(root, "service_execution_progress.json"));
for (const serviceNumber of [
  "001",
  "002",
  "003",
  "004",
  "005",
  "006",
  "007",
  "008",
  "009",
  "010",
  "011",
  "012",
  "013",
  "014",
  "015",
  "016",
  "017",
  "018",
  "019",
]) {
  assert.ok(progress.completedServices.includes(serviceNumber), `progress must include ${serviceNumber}`);
}
if (progress.status === "complete") {
  assert.equal(progress.nextService, null);
} else {
  assert.equal(progress.nextService, "020");
}

console.log("service_011_019_launch.test.mjs passed");
