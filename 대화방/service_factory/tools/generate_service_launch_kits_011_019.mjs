import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readJson(fileName) {
  return JSON.parse(readFileSync(path.join(root, fileName), "utf8").replace(/^\uFEFF/, ""));
}

const review = readJson("service_review_480.json");
const catalog = readJson("services_480.json");

const folders = new Map([
  [11, "service_011_tax_accountant_analytics"],
  [12, "service_012_shopping_mall_internal_tools"],
  [13, "service_013_web_agency_internal_tools"],
  [14, "service_014_dental_analytics"],
  [15, "service_015_franchise_crm"],
  [16, "service_016_saas_booking"],
  [17, "service_017_wholesale_crm"],
  [18, "service_018_lawyer_crm"],
  [19, "service_019_hospital_crm"],
]);

const categoryAssets = {
  analytics: {
    toolStack: "Metabase, Umami, Plausible 중 고객 환경에 맞는 조합",
    deliverables: [
      "전환 이벤트 사전",
      "데이터 품질 점검표",
      "월간 리포트 템플릿",
      "KPI 정의 워크시트",
      "대시보드 화면 구성표",
      "운영 인수인계 체크리스트",
    ],
    steps: [
      "핵심 전환 이벤트와 매출/문의 경로를 정의한다.",
      "데이터 원천, 필드명, 갱신 주기, 누락 기준을 점검한다.",
      "지표별 대시보드와 월간 리포트 템플릿을 세팅한다.",
      "고객 담당자에게 갱신, 해석, 수정 절차를 인수인계한다.",
    ],
  },
  crm: {
    toolStack: "Twenty CRM 또는 고객이 이미 쓰는 CRM",
    deliverables: [
      "CSV 이관표",
      "영업 단계 정의서",
      "담당자 권한표",
      "파이프라인 화면 구성표",
      "샘플 임포트 템플릿",
      "운영 인수인계 체크리스트",
    ],
    steps: [
      "현재 리드/고객 데이터를 CSV 이관표로 정리한다.",
      "영업 단계, 상태값, 담당자 권한을 확정한다.",
      "CRM 파이프라인과 샘플 데이터를 세팅한다.",
      "담당자별 운영법과 변경 요청 절차를 인수인계한다.",
    ],
  },
  "internal-tools": {
    toolStack: "Appsmith, Retool 또는 로컬 관리자 화면",
    deliverables: [
      "감사 로그 설계",
      "쓰기 권한 제한표",
      "운영자 교육 문서",
      "관리 화면 구성표",
      "승인 흐름 정의서",
      "유지보수 점검표",
    ],
    steps: [
      "운영자가 반복 입력하는 데이터와 승인 흐름을 정의한다.",
      "쓰기 권한과 감사 로그 기준을 먼저 설계한다.",
      "관리 화면과 입력 검증을 세팅한다.",
      "운영자 교육 문서와 장애 대응 절차를 납품한다.",
    ],
  },
  booking: {
    toolStack: "Cal.com, Google Calendar, 고객 알림 도구 중 고객 권한에 맞는 조합",
    deliverables: [
      "예약 변경/취소 규칙",
      "노쇼 방지 메시지",
      "캘린더 충돌 테스트",
      "예약 폼 구성표",
      "담당자 알림 흐름도",
      "운영 인수인계 체크리스트",
    ],
    steps: [
      "예약 가능 시간, 담당자, 변경/취소 마감 시간을 정의한다.",
      "캘린더 연동과 충돌 방지 테스트를 먼저 진행한다.",
      "노쇼 방지 메시지와 예약 변경 알림을 세팅한다.",
      "고객 담당자에게 예약 수정, 취소, 예외 처리 절차를 인수인계한다.",
    ],
  },
};

const qaChecklist = [
  "랜딩 페이지에 PAYMENT_LINK_HERE 자리표시자가 남아 있어 사용자 소유 결제 링크로 교체 가능하다.",
  "실제 결제는 사용자 소유 계정에서만 받는다는 문구가 모든 문서에 있다.",
  "확정 수익 또는 확정 매출 표현이 없다.",
  "환불/주의/성과 비보장 안내가 포함되어 있다.",
  "필수 보강 항목이 랜딩, 오퍼, 체크리스트, 아웃리치에 반영되어 있다.",
  "납품물이 최소 6개 이상이고 고객 권한 확인 항목이 있다.",
];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

function mdList(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function landing(service, assets, serviceNumber) {
  const deliverables = assets.deliverables.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n");
  const steps = assets.steps.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n");
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(service.name)}</title>
  <style>
    :root { color-scheme: light; font-family: Arial, "Malgun Gothic", sans-serif; background: #f5f7f4; color: #182027; }
    body { margin: 0; }
    main { max-width: 1040px; margin: 0 auto; padding: 40px 20px 56px; }
    .hero { display: grid; gap: 24px; grid-template-columns: minmax(0, 1.35fr) minmax(280px, .65fr); align-items: stretch; }
    section, aside { background: #fff; border: 1px solid #d9ded6; border-radius: 8px; padding: 24px; box-shadow: 0 8px 24px rgba(24,32,39,.06); }
    h1 { font-size: 34px; line-height: 1.18; margin: 0 0 14px; letter-spacing: 0; }
    h2 { font-size: 19px; margin: 0 0 12px; letter-spacing: 0; }
    p { line-height: 1.65; }
    .meta { display: flex; flex-wrap: wrap; gap: 8px; margin: 18px 0; }
    .meta span { border: 1px solid #cbd4c5; border-radius: 999px; padding: 7px 10px; font-size: 13px; background: #f8faf6; }
    .price { font-size: 24px; font-weight: 700; margin: 10px 0 16px; }
    a.button { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 18px; border-radius: 6px; background: #1f6f5b; color: white; text-decoration: none; font-weight: 700; }
    ul, ol { padding-left: 22px; line-height: 1.7; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-top: 16px; }
    .note { border-left: 4px solid #b85b38; background: #fff6ef; padding: 14px 16px; border-radius: 6px; }
    @media (max-width: 780px) { .hero, .grid { grid-template-columns: 1fr; } h1 { font-size: 28px; } main { padding-top: 24px; } }
  </style>
</head>
<body>
  <main>
    <div class="hero">
      <section>
        <p>Service ${serviceNumber} · ${escapeHtml(service.category)} · Rank ${service.rank}</p>
        <h1>${escapeHtml(service.name)}</h1>
        <p>${escapeHtml(service.offer)}</p>
        <div class="meta">
          <span>플랫폼: ${escapeHtml(service.platform)}</span>
          <span>결제: ${escapeHtml(service.paymentSystem)}</span>
          <span>채널: ${escapeHtml(service.channel)}</span>
          <span>원본 ID: ${escapeHtml(service.id)}</span>
        </div>
        <p class="price">${escapeHtml(service.price)}</p>
        <a class="button" href="PAYMENT_LINK_HERE">결제 링크 연결</a>
        <p class="note">실제 결제는 사용자 소유 계정의 Stripe, Paddle, Gumroad, Payhip 링크로만 받습니다. 이 페이지는 출시 준비용 템플릿이며 수익을 보장하지 않습니다.</p>
      </section>
      <aside>
        <h2>필수 보강</h2>
        <p>${escapeHtml(service.requiredAddition)}</p>
        <h2>주의할 약점</h2>
        <p>${escapeHtml(service.weakness)}</p>
      </aside>
    </div>
    <div class="grid">
      <section><h2>납품물</h2><ul>${deliverables}</ul></section>
      <section><h2>작업 흐름</h2><ol>${steps}</ol></section>
    </div>
  </main>
</body>
</html>
`;
}

function offerDoc(service, assets, serviceNumber) {
  return `# ${service.name}

서비스 번호: ${serviceNumber}
원본 ID: ${service.id}
플랫폼: ${service.platform}
결제 시스템: ${service.paymentSystem}
가격 앵커: ${service.price}

## 오퍼
${service.offer}

## 핵심 납품물
${mdList(assets.deliverables)}

## 필수 보강
${service.requiredAddition}

## 약점과 방어
${service.weakness}

## 결제 주의
실제 결제는 사용자 소유 계정의 결제 링크로만 받습니다. PAYMENT_LINK_HERE는 Stripe, Paddle, Gumroad, Payhip 등 사용자 계정에서 발급한 링크로 교체해야 합니다.

## 환불 및 성과 안내
환불 조건, 작업 범위, 고객 자료 제공 지연 시 일정 변경 조건을 사전에 고지합니다. 이 서비스는 세팅과 운영 문서를 납품하지만 매출, 문의, 수익을 보장하지 않습니다.
`;
}

function checklistDoc(service, assets) {
  return `# ${service.name} 납품 체크리스트

## 사전 준비
- 실제 결제는 사용자 소유 계정에서 발급한 링크로만 연결한다.
- 고객 계정 권한, API 키, 관리자 초대, 샘플 데이터를 확인한다.
- 환불 조건과 작업 범위를 계약 전 안내한다.

## 필수 보강
- ${service.requiredAddition}

## 납품물 확인
${mdList(assets.deliverables.map((item) => `${item} 작성 및 고객 확인`))}

## QA
${mdList(qaChecklist)}

## 주의
성과를 보장하지 않습니다. 고객이 제공한 데이터 품질, 계정 권한, 내부 운영 참여도에 따라 결과물의 정확도와 운영 가능성이 달라집니다.
`;
}

function outreachDoc(service, assets) {
  return `# ${service.name} 아웃리치 문안

## 짧은 제안
안녕하세요. ${service.niche} 업무에서 반복되는 ${service.category} 세팅을 빠르게 정리해 드리는 패키지를 준비했습니다. ${assets.deliverables.slice(0, 3).join(", ")}까지 포함해 납품합니다.

## 문제 제기
현재 흐름에서 가장 흔한 실패 지점은 ${service.weakness} 그래서 이번 패키지는 ${service.requiredAddition}

## 제안 범위
${service.offer}

## 결제 안내
실제 결제는 사용자 소유 계정에서 발급한 결제 링크로만 진행합니다. PAYMENT_LINK_HERE를 고객에게 보내기 전 반드시 사용자 계정의 정식 링크로 교체해야 합니다.

## 환불/주의 문구
세팅형 서비스이므로 착수 후 환불 범위는 작업 단계에 따라 달라집니다. 매출, 문의, 수익은 보장하지 않습니다.

## CTA
자료 3가지만 보내주시면 1차 세팅 가능 여부를 확인해 드리겠습니다: 현재 사용 도구, 샘플 데이터, 담당자 권한 범위.
`;
}

const selected = review
  .filter((service) => folders.has(service.rank))
  .map((service) => ({ ...catalog.find((entry) => entry.id === service.id), ...service }))
  .sort((a, b) => a.rank - b.rank);

if (selected.length !== 9) {
  throw new Error(`Expected 9 service reviews, found ${selected.length}`);
}

const previousProgress = readJson("service_execution_progress.json");
const previousDetails = Array.isArray(previousProgress.completedServiceDetails)
  ? previousProgress.completedServiceDetails
  : previousProgress.completedServices.map((number) => ({ number }));
const detailByNumber = new Map(previousDetails.map((detail) => [detail.number, detail]));

for (const service of selected) {
  const serviceNumber = String(service.rank).padStart(3, "0");
  const folder = folders.get(service.rank);
  const assets = categoryAssets[service.category];
  if (!assets) throw new Error(`No category assets for ${service.category}`);

  const serviceDir = path.join(root, folder);
  mkdirSync(serviceDir, { recursive: true });

  const manifest = {
    serviceNumber,
    sourceServiceId: service.id,
    rank: service.rank,
    name: service.name,
    category: service.category,
    niche: service.niche,
    score: service.score,
    tier: service.tier,
    channel: service.recommendedChannel,
    platform: { primary: service.platform, setupNote: "사용자 소유 판매자 계정에서 상품/링크를 생성해야 합니다." },
    payment: { primary: service.paymentSystem, linkPlaceholder: "PAYMENT_LINK_HERE", ownerRequired: true },
    priceAnchor: service.price,
    offer: service.offer,
    openSource: service.openSource,
    toolStack: assets.toolStack,
    weakness: service.weakness,
    requiredAddition: service.requiredAddition,
    deliverables: assets.deliverables,
    implementationSteps: assets.steps,
    qaChecklist,
    caveat: "실제 결제는 사용자 소유 계정에서만 진행하며 수익을 보장하지 않습니다.",
  };

  writeFileSync(path.join(serviceDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  writeFileSync(path.join(serviceDir, "index.html"), landing({ ...service, channel: service.recommendedChannel }, assets, serviceNumber), "utf8");
  writeFileSync(path.join(serviceDir, "offer.md"), offerDoc(service, assets, serviceNumber), "utf8");
  writeFileSync(path.join(serviceDir, "delivery_checklist.md"), checklistDoc(service, assets), "utf8");
  writeFileSync(path.join(serviceDir, "outreach.md"), outreachDoc(service, assets), "utf8");

  detailByNumber.set(serviceNumber, {
    number: serviceNumber,
    serviceId: service.id,
    name: service.name,
    artifactDir: `service_factory/${folder}`,
    platform: service.platform,
    paymentSystem: service.paymentSystem,
    price: service.price,
    testEvidence: ".omo/start-work/service_011_019_green.txt",
    httpEvidence: ".omo/start-work/service_011_019_http_all.txt",
    browserEvidence: ".omo/start-work/service_011_019_edge_019.png",
    ledger: ".omo/start-work/ledger.jsonl",
  });
}

const indexRows = selected.map((service) => {
  const folder = folders.get(service.rank);
  const serviceNumber = String(service.rank).padStart(3, "0");
  return `<li><a href="${folder}/index.html">${serviceNumber}. ${escapeHtml(service.name)}</a> · ${escapeHtml(service.platform)} · ${escapeHtml(service.price)}</li>`;
}).join("\n");

writeFileSync(path.join(root, "service_011_019_index.html"), `<!doctype html>
<html lang="ko">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>서비스 011-019 출시 키트</title><style>body{font-family:Arial,"Malgun Gothic",sans-serif;margin:0;background:#f5f7f4;color:#182027}main{max-width:960px;margin:auto;padding:32px 20px}h1{font-size:30px}li{margin:10px 0;line-height:1.6}a{color:#1f6f5b;font-weight:700}.note{background:#fff6ef;border-left:4px solid #b85b38;padding:14px;border-radius:6px}</style></head>
<body><main><h1>서비스 011-019 출시 키트</h1><p class="note">실제 결제는 사용자 소유 계정에서 발급한 링크로 교체해야 하며 수익을 보장하지 않습니다.</p><ol>${indexRows}</ol></main></body>
</html>
`, "utf8");

const completedNumbers = Array.from(new Set([
  ...previousProgress.completedServices,
  ...selected.map((service) => String(service.rank).padStart(3, "0")),
])).sort();

writeFileSync(path.join(root, "service_execution_progress.json"), `${JSON.stringify({
  plan: previousProgress.plan ?? "plans/480_service_numbered_plan.md",
  startedAt: previousProgress.startedAt ?? "2026-06-01",
  updatedAt: "2026-06-02",
  completedServices: completedNumbers,
  completedServiceDetails: completedNumbers.map((number) => detailByNumber.get(number) ?? { number }),
  nextService: "020",
  status: "active",
}, null, 2)}\n`, "utf8");

const boulderPath = path.resolve(root, "..", "..", ".omo", "boulder.json");
if (existsSync(boulderPath)) {
  const boulder = JSON.parse(readFileSync(boulderPath, "utf8").replace(/^\uFEFF/, ""));
  const work = boulder.works?.["480-service-numbered-plan"];
  if (work) work.current_service = "020";
  writeFileSync(boulderPath, `${JSON.stringify(boulder, null, 2)}\n`, "utf8");
}

console.log(`Generated ${selected.length} service launch kits: ${selected.map((service) => String(service.rank).padStart(3, "0")).join(", ")}`);
