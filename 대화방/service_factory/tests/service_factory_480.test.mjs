import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const readJson = async (name) => JSON.parse(await readFile(new URL(name, root), "utf8"));
const readText = async (name) => readFile(new URL(name, root), "utf8");

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

const requiredServiceKeys = [
  "id",
  "name",
  "category",
  "niche",
  "customer",
  "problem",
  "offer",
  "openSource",
  "platform",
  "paymentSystem",
  "price",
  "mvpDays",
  "firstAction",
  "risk",
];

test("Given expanded service factory when parsed then it contains exactly 480 platform-mapped offers", async () => {
  const services = await readJson("services_480.json");
  assert.equal(services.length, 480, `expected exactly 480 services, got ${services.length}`);
  const ids = new Set();
  for (const service of services) {
    for (const key of requiredServiceKeys) {
      assert.ok(Object.hasOwn(service, key), `missing ${key} on ${service.id ?? "unknown"}`);
      assert.notEqual(String(service[key]).trim(), "", `blank ${key} on ${service.id}`);
    }
    assert.match(service.id, /^svc-\d{3}$/, `bad id format on ${service.id}`);
    assert.equal(ids.has(service.id), false, `duplicate id ${service.id}`);
    ids.add(service.id);
    assert.ok(Number(service.mvpDays) >= 1 && Number(service.mvpDays) <= 14, `mvpDays out of range on ${service.id}`);
  }
});

test("Given platform choices when parsed then there are 12+ platforms with payment and deployment guidance", async () => {
  const platforms = await readJson("platforms.json");
  assert.ok(platforms.length >= 12, `expected at least 12 platforms, got ${platforms.length}`);
  for (const platform of platforms) {
    assert.ok(platform.name, "platform needs name");
    assert.ok(platform.bestFor, `platform ${platform.name} needs bestFor`);
    assert.ok(platform.paymentFit, `platform ${platform.name} needs paymentFit`);
    assert.match(platform.officialUrl, /^https:\/\//, `platform ${platform.name} needs official URL`);
    assert.ok(["primary", "secondary", "specialized"].includes(platform.priority), `bad priority on ${platform.name}`);
  }
  const names = platforms.map((platform) => platform.name);
  for (const required of ["Gumroad", "Ko-fi", "Payhip", "Stripe Payment Links", "Paddle", "Lemon Squeezy"]) {
    assert.ok(names.includes(required), `missing platform ${required}`);
  }
});

test("Given payment systems when parsed then 10+ systems include real-payment caveats and account-required status", async () => {
  const systems = await readJson("payment_systems.json");
  assert.ok(systems.length >= 10, `expected at least 10 payment systems, got ${systems.length}`);
  for (const system of systems) {
    assert.ok(system.name, "payment system needs name");
    assert.ok(system.hasPayment === true || system.hasPayment === false, `hasPayment must be boolean on ${system.name}`);
    assert.ok(system.accountRequired === true, `accountRequired must be true on ${system.name}`);
    assert.ok(system.setupSteps.length >= 3, `setup steps too thin on ${system.name}`);
    assert.match(system.officialUrl, /^https:\/\//, `payment system ${system.name} needs official URL`);
  }
  const guide = await readText("결제시스템_세팅가이드.md");
  assert.match(guide, /실제 결제는 사용자 소유 계정/, "guide must state user-owned account requirement");
  assert.match(guide, /Stripe Payment Links/, "guide must mention Stripe Payment Links");
  assert.match(guide, /Paddle/, "guide must mention Paddle");
});

test("Given 480 catalog page when opened then it links 480 data, platform data, and payment data", async () => {
  const html = await readText("service_factory_480.html");
  assert.match(html, /services_480\.json/, "page must load 480 services");
  assert.match(html, /platforms\.json/, "page must load platform data");
  assert.match(html, /payment_systems\.json/, "page must load payment data");
  assert.match(html, /id="platform-filter"/, "page needs platform filter");
  assert.match(html, /id="payment-filter"/, "page needs payment filter");
  assert.match(html, /480개 서비스/, "page needs 480 headline");
});

test("Given root service factory entry when read then it routes to the 480 catalog", async () => {
  const rootEntry = await readFile(new URL("../서비스팩토리.html", root), "utf8");
  assert.match(rootEntry, /service_factory\/service_factory_480\.html/, "root entry must route to 480 catalog");
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
