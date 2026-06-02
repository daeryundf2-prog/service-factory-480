import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const services = [
  ["002", "service_002_app_team_analytics", "svc-364", 2],
  ["003", "service_003_franchise_automation", "svc-253", 3],
  ["004", "service_004_franchise_analytics", "svc-256", 4],
  ["005", "service_005_saas_crm", "svc-350", 5],
  ["006", "service_006_wholesale_automation", "svc-241", 6],
  ["007", "service_007_marketing_agency_internal_tools", "svc-381", 7],
  ["008", "service_008_lawyer_analytics", "svc-100", 8],
  ["009", "service_009_hospital_automation", "svc-001", 9],
  ["010", "service_010_hospital_analytics", "svc-004", 10],
];

const requiredFiles = [
  "manifest.json",
  "index.html",
  "offer.md",
  "delivery_checklist.md",
  "outreach.md",
];

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
  assert.match(landing, new RegExp(manifest.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(landing, /PAYMENT_LINK_HERE/);
  assert.match(landing, new RegExp(manifest.platform.primary.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(landing, new RegExp(manifest.payment.primary.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(landing, /수익 보장|무조건 매출|guaranteed income/i);

  for (const docName of ["offer.md", "delivery_checklist.md", "outreach.md"]) {
    const doc = await readText(path.join(serviceDir, docName));
    assert.match(doc, /실제 결제는 사용자 소유 계정/);
    assert.match(doc, /환불|주의|보장하지 않습니다/);
    assert.match(doc, new RegExp(manifest.requiredAddition.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
}

const progress = await readJson(path.join(root, "service_execution_progress.json"));
for (const serviceNumber of ["001", "002", "003", "004", "005", "006", "007", "008", "009", "010"]) {
  assert.ok(progress.completedServices.includes(serviceNumber), `progress must include ${serviceNumber}`);
}
assert.match(progress.nextService, /^\d{3}$/);
assert.ok(Number(progress.nextService) >= 11);

console.log("service_002_010_launch.test.mjs passed");
