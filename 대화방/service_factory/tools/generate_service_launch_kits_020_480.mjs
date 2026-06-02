import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = path.resolve(root, "..", "..");

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

const categoryAssets = {
  analytics: {
    toolStack: "Metabase, Umami, Plausible 또는 고객 환경에 맞는 대시보드 조합",
    deliverables: [
      "전환 이벤트 사전",
      "데이터 품질 점검표",
      "월간 리포트 템플릿",
      "KPI 정의 워크시트",
      "대시보드 화면 구성표",
      "운영 인수인계 체크리스트",
    ],
    steps: [
      "상담 전환 이벤트와 매출/문의 경로를 정의한다.",
      "데이터 원천, 필드명, 갱신 주기, 누락 기준을 점검한다.",
      "지표별 대시보드와 월간 리포트 템플릿을 세팅한다.",
      "고객 담당자에게 갱신, 해석, 수정 절차를 인수인계한다.",
    ],
  },
  automation: {
    toolStack: "Activepieces, Zapier, Make 또는 고객 권한에 맞는 자동화 도구",
    deliverables: [
      "자동화 흐름도",
      "실패 알림 설계",
      "재시도 규칙",
      "고객 계정/API 권한 체크리스트",
      "샘플 실행 로그",
      "유지보수 점검표",
    ],
    steps: [
      "현재 문의/업무 채널과 담당자 흐름을 정리한다.",
      "자동화 트리거, 조건, 예외 처리, 알림 채널을 설계한다.",
      "샘플 데이터로 성공/실패/중복 상황을 테스트한다.",
      "운영자가 직접 중단, 재실행, 변경 요청을 할 수 있게 문서화한다.",
    ],
  },
  booking: {
    toolStack: "Cal.com, Google Calendar, 알림 도구 또는 고객 예약 시스템",
    deliverables: [
      "예약 가능 시간표",
      "예약 변경/취소 규칙",
      "노쇼 방지 메시지",
      "캘린더 충돌 테스트표",
      "담당자 알림 흐름도",
      "운영 인수인계 체크리스트",
    ],
    steps: [
      "예약 가능 시간, 담당자, 변경/취소 마감 시간을 정의한다.",
      "캘린더 연동과 중복 예약 방지 테스트를 먼저 진행한다.",
      "고객 알림 메시지와 담당자 알림 흐름을 세팅한다.",
      "예약 수정, 취소, 예외 처리 절차를 인수인계한다.",
    ],
  },
  commerce: {
    toolStack: "WooCommerce, Shopify, 스마트스토어 또는 고객 판매 채널",
    deliverables: [
      "상품 등록표",
      "주문 상태 정의서",
      "재고/옵션 점검표",
      "배송/환불 안내문",
      "결제 링크 연결표",
      "운영 인수인계 체크리스트",
    ],
    steps: [
      "상품, 옵션, 가격, 배송/환불 조건을 먼저 고정한다.",
      "주문 상태와 고객 알림 메시지를 정리한다.",
      "결제 링크와 상품 페이지의 연결 상태를 확인한다.",
      "품절, 옵션 변경, 환불 요청 대응 절차를 문서화한다.",
    ],
  },
  content: {
    toolStack: "Notion, Google Docs, CMS 또는 고객 게시 채널",
    deliverables: [
      "콘텐츠 캘린더",
      "업종별 검수표",
      "금지 표현 목록",
      "게시 전 승인 플로우",
      "샘플 게시글 3종",
      "성과 점검표",
    ],
    steps: [
      "게시 채널, 타깃 고객, 금지 표현, 승인자를 확정한다.",
      "업종별 검수표와 콘텐츠 구조를 먼저 만든다.",
      "샘플 게시글을 작성하고 고객 승인 흐름을 테스트한다.",
      "게시 후 수정, 보관, 재사용 규칙을 인수인계한다.",
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
  finance: {
    toolStack: "Google Sheets, Airtable, 회계/정산 도구 또는 고객 장부",
    deliverables: [
      "비용 입력표",
      "매출/정산 대장",
      "월간 마감 체크리스트",
      "권한/감사 로그 기준",
      "오류 수정 절차서",
      "운영 인수인계 체크리스트",
    ],
    steps: [
      "수입, 비용, 정산, 세금 구분 기준을 먼저 정리한다.",
      "담당자별 입력 권한과 마감 일정을 확정한다.",
      "샘플 거래로 합계, 필터, 오류 검출을 테스트한다.",
      "월간 마감과 수정 요청 절차를 문서화한다.",
    ],
  },
  forms: {
    toolStack: "Tally, Google Forms, Typeform 또는 고객 접수 도구",
    deliverables: [
      "접수 폼 문항표",
      "수집 동의 문구",
      "스팸 방지 규칙",
      "CSV 백업 규칙",
      "담당자 알림 흐름도",
      "운영 인수인계 체크리스트",
    ],
    steps: [
      "수집 항목, 필수/선택 문항, 개인정보 동의 문구를 확정한다.",
      "접수 완료 메시지와 담당자 알림 흐름을 만든다.",
      "스팸, 중복, 빈 값, CSV 내보내기 테스트를 진행한다.",
      "백업 주기와 삭제 요청 대응 절차를 인수인계한다.",
    ],
  },
  "internal-tools": {
    toolStack: "Appsmith, Retool 또는 로컬 관리자 화면",
    deliverables: [
      "관리자 화면 구성표",
      "감사 로그 설계",
      "읽기/쓰기 권한표",
      "운영자 교육 문서",
      "승인 흐름 정의서",
      "유지보수 점검표",
    ],
    steps: [
      "운영자가 반복 입력하는 데이터와 승인 흐름을 정의한다.",
      "읽기/쓰기 권한과 감사 로그 기준을 먼저 설계한다.",
      "관리 화면과 입력 검증을 세팅한다.",
      "운영자 교육 문서와 역할 이전 절차를 납품한다.",
    ],
  },
  knowledge: {
    toolStack: "Notion, GitBook, Docsify 또는 고객 문서 포털",
    deliverables: [
      "문서 구조도",
      "초기 문서 템플릿 20개",
      "권한표",
      "검색 태그 규칙",
      "업데이트 요청 절차서",
      "운영 인수인계 체크리스트",
    ],
    steps: [
      "문서 이용자, 권한, 자주 찾는 질문을 먼저 정리한다.",
      "문서 카테고리와 템플릿 구조를 만든다.",
      "검색 태그와 업데이트 요청 흐름을 세팅한다.",
      "담당자에게 문서 추가/수정/폐기 절차를 인수인계한다.",
    ],
  },
  ops: {
    toolStack: "Google Sheets, Notion, Airtable 또는 운영 체크리스트 도구",
    deliverables: [
      "운영 체크리스트",
      "담당자 역할표",
      "일간/주간 점검표",
      "이슈 기록대장",
      "에스컬레이션 규칙",
      "운영 인수인계 문서",
    ],
    steps: [
      "반복 업무, 담당자, 마감 시간을 먼저 정리한다.",
      "일간/주간 점검 기준과 이슈 기록 방식을 만든다.",
      "실제 운영 사례로 누락, 중복, 지연 상황을 테스트한다.",
      "변경 요청과 장애 대응 절차를 인수인계한다.",
    ],
  },
  support: {
    toolStack: "Help Scout, Crisp, Zendesk 또는 고객 문의 채널",
    deliverables: [
      "문의 분류표",
      "응답 템플릿",
      "SLA 기준표",
      "에스컬레이션 규칙",
      "FAQ 초안",
      "운영 인수인계 체크리스트",
    ],
    steps: [
      "문의 유형, 긴급도, 담당자, 응답 시간을 정의한다.",
      "FAQ와 응답 템플릿을 만들고 실제 문의 예시로 검수한다.",
      "에스컬레이션과 고객 알림 기준을 세팅한다.",
      "문의 보관, 수정, 재사용 규칙을 인수인계한다.",
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

function readJson(fileName) {
  return JSON.parse(readFileSync(path.join(root, fileName), "utf8").replace(/^\uFEFF/, ""));
}

function readOptionalJson(fileName, fallback) {
  const filePath = path.join(root, fileName);
  if (!existsSync(filePath)) return fallback;
  return JSON.parse(readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function serviceNumber(rank) {
  return String(rank).padStart(3, "0");
}

function folderName(service) {
  const niche = nicheSlugs.get(service.niche);
  const category = categorySlugs.get(service.category);
  if (!niche) throw new Error(`missing slug for niche ${service.niche}`);
  if (!category) throw new Error(`missing slug for category ${service.category}`);
  return `service_${serviceNumber(service.rank)}_${niche}_${category}`;
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : Array.isArray(value?.value) ? value.value : [];
}

function channelKeys(recommendedChannel) {
  if (recommendedChannel === "web-service") return ["web"];
  if (recommendedChannel === "web-marketplace") return ["marketplace"];
  if (recommendedChannel === "android-apple-companion") return ["android", "apple"];
  return [recommendedChannel];
}

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

function docDate() {
  return "2026-06-02";
}

function paymentNotes(service, paymentForms) {
  const direct = paymentForms.find((entry) => entry.name === service.paymentSystem);
  const channelMatches = paymentForms.filter((entry) => channelKeys(service.recommendedChannel).includes(entry.channel));
  const notes = [direct, ...channelMatches].filter(Boolean);
  const unique = new Map(notes.map((entry) => [entry.name, entry]));
  return Array.from(unique.values()).slice(0, 4);
}

function channelNotes(service, channelStrategies) {
  const keys = channelKeys(service.recommendedChannel);
  return channelStrategies.filter((entry) => keys.includes(entry.channel));
}

function landing(service, assets, notes, channels) {
  const number = serviceNumber(service.rank);
  const deliverables = assets.deliverables.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n");
  const steps = assets.steps.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n");
  const paymentNoteItems = notes.map((note) => `<li><strong>${escapeHtml(note.name)}</strong>: ${escapeHtml(note.whenToUse)} / ${escapeHtml(note.caveat)}</li>`).join("\n");
  const channelNoteItems = channels.map((note) => `<li><strong>${escapeHtml(note.channel)}</strong>: ${escapeHtml(note.buildPath)} / ${escapeHtml(note.caveat)}</li>`).join("\n");

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(service.name)}</title>
  <style>
    :root { color-scheme: light; font-family: Arial, "Malgun Gothic", sans-serif; background: #f5f7f4; color: #182027; }
    body { margin: 0; }
    main { max-width: 1080px; margin: 0 auto; padding: 40px 20px 56px; }
    .hero { display: grid; gap: 20px; grid-template-columns: minmax(0, 1.35fr) minmax(280px, .65fr); align-items: stretch; }
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
        <p>Service ${number} · ${escapeHtml(service.category)} · Rank ${service.rank}</p>
        <h1>${escapeHtml(service.name)}</h1>
        <p>${escapeHtml(service.offer)}</p>
        <div class="meta">
          <span>서비스 ID: ${escapeHtml(service.id)}</span>
          <span>등급/점수: ${escapeHtml(service.tier)} / ${escapeHtml(service.score)}</span>
          <span>채널: ${escapeHtml(service.recommendedChannel)}</span>
          <span>플랫폼: ${escapeHtml(service.platform)}</span>
          <span>결제: ${escapeHtml(service.paymentSystem)}</span>
        </div>
        <p class="price">${escapeHtml(service.price)}</p>
        <a class="button" href="PAYMENT_LINK_HERE">결제 링크 연결</a>
        <p class="note">실제 결제는 사용자 소유 계정에서 생성한 링크로만 받습니다. 이 페이지는 출시 준비용 템플릿이며 수익이나 매출을 보장하지 않습니다.</p>
      </section>
      <aside>
        <h2>필수 보강</h2>
        <p>${escapeHtml(service.requiredAddition)}</p>
        <h2>주의할 약점</h2>
        <p>${escapeHtml(service.weakness)}</p>
        <h2>첫 실행</h2>
        <p>${escapeHtml(service.firstAction)}</p>
      </aside>
    </div>
    <div class="grid">
      <section><h2>납품물</h2><ul>${deliverables}</ul></section>
      <section><h2>작업 흐름</h2><ol>${steps}</ol></section>
      <section><h2>결제 주의</h2><ul>${paymentNoteItems}</ul></section>
      <section><h2>채널 주의</h2><ul>${channelNoteItems}</ul></section>
    </div>
  </main>
</body>
</html>
`;
}

function offerDoc(service, assets, notes, channels) {
  return `# ${service.name}

서비스 번호: ${serviceNumber(service.rank)}
원본 ID: ${service.id}
rank / tier / score: ${service.rank} / ${service.tier} / ${service.score}
카테고리 / 니치: ${service.category} / ${service.niche}
권장 채널: ${service.recommendedChannel}
플랫폼: ${service.platform}
결제 시스템: ${service.paymentSystem}
가격 앵커: ${service.price}

## 오퍼
${service.offer}

## 고객 문제
${service.problem}

## 첫 실행 기준
${service.firstAction}

## 납품물
${mdList(assets.deliverables)}

## 작업 단계
${mdList(assets.steps.map((step, index) => `${index + 1}. ${step}`))}

## 필수 보강
${service.requiredAddition}

## 약점과 방어
${service.weakness}

## 결제/채널 주의
${mdList(notes.map((note) => `${note.name}: ${note.whenToUse}. 주의: ${note.caveat}`))}
${mdList(channels.map((note) => `${note.channel}: ${note.buildPath}. 주의: ${note.caveat}`))}

## 환불 및 성과 안내
실제 결제는 사용자 소유 계정에서만 진행합니다. 납품 범위, 환불 조건, 고객 자료 제공 지연 시 일정 변경 조건을 사전에 안내합니다. 이 서비스는 세팅과 운영 문서를 납품하지만 매출, 문의, 수익을 보장하지 않습니다.
`;
}

function checklistDoc(service, assets, notes) {
  return `# ${service.name} 납품 체크리스트

## 사전 준비
- 사용자 소유 결제 계정에서 ${service.paymentSystem} 링크를 발급한다.
- 고객 계정 권한, API 권한, 샘플 데이터, 운영 담당자를 확인한다.
- 환불 조건과 작업 범위를 계약 전 안내한다.

## 필수 보강
- ${service.requiredAddition}

## 납품물 확인
${mdList(assets.deliverables.map((item) => `${item} 작성 및 고객 확인`))}

## 결제 확인
${mdList(notes.map((note) => `${note.name}: accountRequired=${note.accountRequired}; ${note.caveat}`))}

## QA
${mdList(qaChecklist)}

## 주의
성과를 보장하지 않습니다. 고객이 제공한 데이터 품질, 계정 권한, 내부 운영 참여도에 따라 결과물의 정확성과 운영 가능성이 달라집니다.
`;
}

function outreachDoc(service, assets) {
  return `# ${service.name} 아웃리치 문안

## 제안 문장
안녕하세요. ${service.niche} 업무에서 반복되는 ${service.problem} 문제를 빠르게 정리할 수 있는 ${service.category} 세팅 패키지를 준비했습니다.

## 포함 범위
${assets.deliverables.slice(0, 4).join(", ")}까지 포함해 ${service.offer}

## 왜 지금 필요한가
현재 흐름에서 가장 취약한 지점은 ${service.weakness} 그래서 이번 패키지에는 ${service.requiredAddition}

## 결제 안내
실제 결제는 사용자 소유 계정에서 발급한 결제 링크로만 진행합니다. PAYMENT_LINK_HERE를 고객에게 보내기 전 반드시 사용자 계정의 정식 링크로 교체해야 합니다.

## 주의 문구
이 제안은 세팅 서비스이며 매출, 문의, 수익을 보장하지 않습니다. 작업 범위와 환불 조건은 착수 전 문서로 확정합니다.

## CTA
현재 사용 도구, 샘플 데이터, 담당자 권한 범위 세 가지만 보내주시면 1차 세팅 가능 여부를 확인하겠습니다.
`;
}

function manifestFor(service, assets, notes, channels) {
  return {
    serviceNumber: serviceNumber(service.rank),
    sourceServiceId: service.id,
    rank: service.rank,
    name: service.name,
    category: service.category,
    niche: service.niche,
    score: service.score,
    tier: service.tier,
    channel: service.recommendedChannel,
    platform: {
      primary: service.platform,
      setupNote: "사용자 소유 판매자 계정에서 상품/링크를 생성해야 합니다.",
    },
    payment: {
      primary: service.paymentSystem,
      linkPlaceholder: "PAYMENT_LINK_HERE",
      ownerRequired: true,
      forms: notes,
    },
    priceAnchor: service.price,
    customer: service.customer,
    problem: service.problem,
    offer: service.offer,
    openSource: service.openSource,
    mvpDays: service.mvpDays,
    firstAction: service.firstAction,
    sourceRisk: service.risk,
    toolStack: assets.toolStack,
    weakness: service.weakness,
    requiredAddition: service.requiredAddition,
    deliverables: assets.deliverables,
    implementationSteps: assets.steps,
    channelGuidance: channels,
    qaChecklist,
    caveat: "실제 결제는 사용자 소유 계정에서만 진행하며 수익을 보장하지 않습니다.",
    generatedAt: docDate(),
  };
}

function writeService(service, paymentForms, channelStrategies) {
  const assets = categoryAssets[service.category];
  if (!assets) throw new Error(`missing category assets for ${service.category}`);
  const folder = folderName(service);
  const serviceDir = path.join(root, folder);
  const notes = paymentNotes(service, paymentForms);
  const channels = channelNotes(service, channelStrategies);

  mkdirSync(serviceDir, { recursive: true });
  writeFileSync(path.join(serviceDir, "manifest.json"), `${JSON.stringify(manifestFor(service, assets, notes, channels), null, 2)}\n`, "utf8");
  writeFileSync(path.join(serviceDir, "index.html"), landing(service, assets, notes, channels), "utf8");
  writeFileSync(path.join(serviceDir, "offer.md"), offerDoc(service, assets, notes, channels), "utf8");
  writeFileSync(path.join(serviceDir, "delivery_checklist.md"), checklistDoc(service, assets, notes), "utf8");
  writeFileSync(path.join(serviceDir, "outreach.md"), outreachDoc(service, assets), "utf8");

  return {
    number: serviceNumber(service.rank),
    serviceId: service.id,
    name: service.name,
    artifactDir: `service_factory/${folder}`,
    platform: service.platform,
    paymentSystem: service.paymentSystem,
    price: service.price,
    rank: service.rank,
    score: service.score,
    tier: service.tier,
    generatedAt: docDate(),
  };
}

function writeIndex(fileName, title, services) {
  const rows = services.map((service) => {
    const number = serviceNumber(service.rank);
    const folder = folderName(service);
    return `<tr><td>${number}</td><td><a href="${folder}/index.html">${escapeHtml(service.name)}</a></td><td>${escapeHtml(service.id)}</td><td>${escapeHtml(service.tier)}</td><td>${escapeHtml(service.score)}</td><td>${escapeHtml(service.recommendedChannel)}</td><td>${escapeHtml(service.platform)}</td><td>${escapeHtml(service.paymentSystem)}</td></tr>`;
  }).join("\n");
  writeFileSync(path.join(root, fileName), `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Arial, "Malgun Gothic", sans-serif; margin: 0; background: #f5f7f4; color: #182027; }
    main { max-width: 1180px; margin: 0 auto; padding: 32px 20px 56px; }
    h1 { font-size: 30px; letter-spacing: 0; }
    table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #d9ded6; }
    th, td { border-bottom: 1px solid #e5e9e1; padding: 9px 10px; text-align: left; vertical-align: top; }
    th { background: #edf2e9; }
    a { color: #1f6f5b; font-weight: 700; }
    .note { background: #fff6ef; border-left: 4px solid #b85b38; padding: 14px 16px; border-radius: 6px; line-height: 1.6; }
  </style>
</head>
<body>
  <main>
    <h1>${escapeHtml(title)}</h1>
    <p class="note">rank 순서는 service_review_480.json을 기준으로 하며, 서비스 상세 값은 services_480.json을 병합했습니다. 실제 결제 링크는 사용자 소유 계정에서 발급한 링크로 교체해야 합니다.</p>
    <table>
      <thead><tr><th>No.</th><th>서비스</th><th>ID</th><th>Tier</th><th>Score</th><th>Channel</th><th>Platform</th><th>Payment</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </main>
</body>
</html>
`, "utf8");
}

function updateProgress(detailsByNumber) {
  const previous = readOptionalJson("service_execution_progress.json", {});
  const previousDetails = Array.isArray(previous.completedServiceDetails) ? previous.completedServiceDetails : [];
  for (const detail of previousDetails) {
    if (detail?.number && !detailsByNumber.has(detail.number)) detailsByNumber.set(detail.number, detail);
  }
  const completedServices = Array.from({ length: 480 }, (_, index) => serviceNumber(index + 1));
  writeFileSync(path.join(root, "service_execution_progress.json"), `${JSON.stringify({
    plan: previous.plan ?? "plans/480_service_numbered_plan.md",
    startedAt: previous.startedAt ?? "2026-06-01",
    updatedAt: docDate(),
    completedServices,
    completedServiceDetails: completedServices.map((number) => detailsByNumber.get(number) ?? { number }),
    nextService: null,
    status: "complete",
  }, null, 2)}\n`, "utf8");
}

function updateBoulder() {
  const boulderPath = path.join(workspaceRoot, ".omo", "boulder.json");
  if (!existsSync(boulderPath)) return;
  const boulder = JSON.parse(readFileSync(boulderPath, "utf8").replace(/^\uFEFF/, ""));
  const work = boulder.works?.["480-service-numbered-plan"];
  if (work) {
    work.current_service = null;
    work.status = "complete";
  }
  boulder.active_work_id = null;
  writeFileSync(boulderPath, `${JSON.stringify(boulder, null, 2)}\n`, "utf8");
}

function main() {
  const review = readJson("service_review_480.json").toSorted((a, b) => a.rank - b.rank);
  const catalog = readJson("services_480.json");
  const paymentForms = normalizeArray(readJson("payment_forms.json"));
  const channelStrategies = normalizeArray(readJson("platform_channel_strategy.json"));
  const catalogById = new Map(catalog.map((service) => [service.id, service]));
  const detailsByNumber = new Map();

  for (const reviewed of review) {
    const source = catalogById.get(reviewed.id);
    if (!source) throw new Error(`missing catalog service for ${reviewed.id}`);
    const service = { ...source, ...reviewed };
    if (service.rank >= 20) {
      const detail = writeService(service, paymentForms, channelStrategies);
      detailsByNumber.set(detail.number, detail);
    }
  }

  const generated = review.filter((service) => service.rank >= 20).map((reviewed) => ({ ...catalogById.get(reviewed.id), ...reviewed }));
  const all = review.map((reviewed) => ({ ...catalogById.get(reviewed.id), ...reviewed }));
  writeIndex("service_020_480_index.html", "서비스 020-480 출시 키트", generated);
  writeIndex("service_001_480_launch_index.html", "서비스 001-480 전체 출시 키트", all);
  updateProgress(detailsByNumber);
  updateBoulder();

  console.log(`Generated ${generated.length} service launch kits: 020-480`);
  console.log("Updated service_020_480_index.html, service_001_480_launch_index.html, service_execution_progress.json");
}

main();
