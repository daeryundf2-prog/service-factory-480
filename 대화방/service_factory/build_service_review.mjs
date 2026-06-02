import { readFile, writeFile } from "node:fs/promises";

const services = JSON.parse(await readFile(new URL("services_480.json", import.meta.url), "utf8"));

const categoryWeight = {
  automation: 14,
  crm: 13,
  support: 12,
  analytics: 12,
  booking: 10,
  finance: 10,
  "internal-tools": 13,
  ops: 9,
  forms: 8,
  commerce: 11,
  knowledge: 8,
  content: 7,
};

const platformWeight = {
  "Stripe Payment Links": 11,
  Gumroad: 9,
  Payhip: 9,
  "Ko-fi": 8,
  Paddle: 10,
  "Lemon Squeezy": 9,
};

const nicheWeight = {
  병원: 10,
  치과: 10,
  한의원: 9,
  피부관리샵: 8,
  학원: 9,
  변호사: 10,
  세무사: 10,
  부동산: 9,
  쇼핑몰: 10,
  "B2B 제조": 11,
  "도매 유통": 10,
  프랜차이즈: 11,
  SaaS: 12,
  "앱 개발팀": 11,
  "마케팅 대행사": 10,
  웹에이전시: 10,
};

const weaknessByCategory = {
  automation: "고객 계정/API 권한과 실패 알림 설계가 부족하면 납품 후 유지보수 부담이 커진다.",
  crm: "데이터 이관, 권한, 영업 단계 정의가 없으면 CRM이 빈 껍데기가 된다.",
  support: "메신저 API와 개인정보 처리 위탁 문구가 빠지면 운영 리스크가 크다.",
  analytics: "데이터 원천 품질과 전환 이벤트 정의가 없으면 보고서가 숫자 나열로 끝난다.",
  forms: "스팸 방지, 수집 동의, 저장 위치가 없으면 실제 운영에 취약하다.",
  booking: "캘린더 충돌, 노쇼 정책, 예약 변경 플로우가 없으면 현장 혼란이 생긴다.",
  finance: "세금계산서와 회계 책임 범위가 불분명하면 분쟁 가능성이 있다.",
  knowledge: "문서 권한과 초기 콘텐츠 템플릿이 없으면 도입 후 사용률이 낮다.",
  "internal-tools": "DB 쓰기 권한과 감사 로그가 없으면 운영 사고로 이어질 수 있다.",
  content: "업종 규제와 과장 표현 검수가 없으면 게시 후 리스크가 생긴다.",
  ops: "알림 오탐/미탐 기준과 백업 책임이 없으면 월 유지보수 신뢰가 떨어진다.",
  commerce: "결제, 배송, 환불, 세금 범위를 분리하지 않으면 스코프가 폭발한다.",
};

const additionByCategory = {
  automation: "실패 알림, 재시도 규칙, 고객 계정 권한 체크리스트를 추가한다.",
  crm: "CSV 이관표, 영업 단계 정의서, 담당자 권한표를 추가한다.",
  support: "개인정보 처리 위탁 문구, 라벨 규칙, SLA 응답표를 추가한다.",
  analytics: "전환 이벤트 사전, 데이터 품질 점검표, 월간 리포트 템플릿을 추가한다.",
  forms: "수집 동의 문구, 스팸 방지, CSV 백업 규칙을 추가한다.",
  booking: "예약 변경/취소 규칙, 노쇼 방지 메시지, 캘린더 충돌 테스트를 추가한다.",
  finance: "계약서, 세금계산서 안내, 환불/정산 책임 범위를 추가한다.",
  knowledge: "문서 템플릿 20개, 권한표, 검색 태그 규칙을 추가한다.",
  "internal-tools": "감사 로그, 쓰기 권한 제한, 운영자 교육 문서를 추가한다.",
  content: "금지 표현 목록, 업종별 검수표, 게시 전 승인 플로우를 추가한다.",
  ops: "장애 알림 기준, 백업 복구 리허설, 월간 점검표를 추가한다.",
  commerce: "결제/배송/환불/세금 범위를 별도 옵션으로 분리한다.",
};

const scored = services.map((service) => {
  const score = Math.min(
    100,
    45 +
      (categoryWeight[service.category] ?? 6) +
      (platformWeight[service.platform] ?? 5) +
      (nicheWeight[service.niche] ?? 5) +
      (service.mvpDays <= 5 ? 8 : service.mvpDays <= 10 ? 4 : 1) +
      (service.price.includes("mo") ? 6 : 3),
  );
  return {
    id: service.id,
    name: service.name,
    category: service.category,
    niche: service.niche,
    platform: service.platform,
    paymentSystem: service.paymentSystem,
    score,
    tier: score >= 88 ? "A" : score >= 78 ? "B" : score >= 68 ? "C" : "D",
    weakness: weaknessByCategory[service.category],
    requiredAddition: additionByCategory[service.category],
    recommendedChannel:
      service.category === "content" || service.category === "forms"
        ? "web-marketplace"
        : service.category === "booking" || service.category === "support"
          ? "android-apple-companion"
          : service.category === "commerce"
            ? "internet-service"
            : "web-service",
  };
});

scored.sort((a, b) => b.score - a.score || a.mvpDays - b.mvpDays || a.name.localeCompare(b.name, "ko"));
const review = scored.map((item, index) => ({ rank: index + 1, ...item }));

const gapCategories = ["platform", "payment", "legal", "ops", "android", "apple", "web", "sales"];
const gaps = Array.from({ length: 48 }, (_, index) => {
  const category = gapCategories[index % gapCategories.length];
  const categoryFix = {
    platform: "각 서비스별 1차 판매 플랫폼과 백업 플랫폼을 지정한다.",
    payment: "착수금, 월구독, 인보이스, 앱스토어 결제 중 하나를 기본값으로 지정한다.",
    legal: "라이선스, 개인정보, 환불, 세금 책임 문구를 계약 전 체크리스트로 만든다.",
    ops: "백업, 장애 알림, 업데이트, 월 점검표를 납품물에 포함한다.",
    android: "Android 앱은 디지털 앱 기능 결제 시 Google Play Billing을 우선 검토한다.",
    apple: "iOS 앱은 디지털 콘텐츠/기능 결제 시 Apple In-App Purchase 또는 StoreKit 정책을 우선 검토한다.",
    web: "웹 서비스는 Stripe Payment Links, Paddle, Lemon Squeezy 중 하나를 붙인다.",
    sales: "고객군별 첫 문장, 진단 질문, 업셀 옵션을 서비스 카드에 연결한다.",
  };
  return {
    id: `gap-${String(index + 1).padStart(2, "0")}`,
    category,
    title: `${category} 보강 ${index + 1}`,
    fix: categoryFix[category],
    appliesTo: review.slice(index * 10, index * 10 + 10).map((item) => item.id),
  };
});

const paymentForms = [
  ["web", "Stripe Payment Links", "서비스 착수금, 월 유지보수, 단일 결제 링크", "디지털 앱 기능을 모바일 앱 안에서 팔 때는 앱스토어 정책을 따로 본다."],
  ["web", "Stripe Checkout", "자체 웹서비스의 장바구니/구독", "개발 연동과 웹훅 검증이 필요하다."],
  ["web", "Paddle Checkout", "글로벌 디지털 상품/소프트웨어", "판매자 승인과 상품 심사가 필요하다."],
  ["web", "Lemon Squeezy Checkout", "라이선스/다운로드/구독", "계정 승인과 지원 국가 확인 필요."],
  ["marketplace", "Gumroad", "초저가 ZIP, 문서, 템플릿", "수수료/정산 조건 확인."],
  ["marketplace", "Payhip", "디지털 다운로드 스토어", "게이트웨이 연결 필요."],
  ["marketplace", "Ko-fi Shop", "후원형 디지털 상품과 커미션", "PayPal/Stripe 연결 국가 확인."],
  ["marketplace", "크몽 결제", "한국어 설치 대행/서비스 패키지", "플랫폼 정책과 수수료 확인."],
  ["android", "Google Play Billing", "Android 앱 안 디지털 기능/구독", "Google Play 배포 앱의 인앱 디지털 결제 정책을 따른다."],
  ["android", "External web payment for outside-app services", "앱 밖에서 소비되는 실물/외부 서비스", "앱 안에서 외부 결제로 유도 가능한지 정책 확인 필요."],
  ["apple", "Apple In-App Purchase", "iOS 앱 안 디지털 콘텐츠/기능/구독", "App Store Review Guidelines와 StoreKit 상태를 따라야 한다."],
  ["apple", "Apple Pay for real-world services", "현장 서비스, 예약, 물리 서비스", "디지털 기능 판매에는 IAP가 필요할 수 있다."],
  ["invoice", "계좌이체 + 세금계산서", "B2B 고가 구축, 월 유지보수", "계약서와 세무 확인 필요."],
  ["invoice", "PayPal Invoice", "해외 B2B 인보이스", "분쟁/환불 정책 명시."],
  ["subscription", "Stripe Subscription", "월 유지보수 자동결제", "해지/환불/세금 정책 필요."],
  ["subscription", "Paddle Subscription", "글로벌 SaaS 구독", "MoR 범위와 승인 확인."],
  ["subscription", "Lemon Squeezy Subscription", "소프트웨어 라이선스 구독", "라이선스 활성화/비활성화 설계 필요."],
  ["offline", "현금/카드 단말기", "오프라인 컨설팅, 현장 설치", "영수증과 계약 범위를 남긴다."],
  ["offline", "POS 결제", "매장형 서비스", "디지털 납품물과 현장 서비스를 분리한다."],
  ["korea", "토스페이먼츠", "한국 자체 웹 결제", "가맹 심사와 개발 연동 필요."],
  ["korea", "네이버페이", "한국 쇼핑/스마트스토어", "판매 가능 상품 정책 확인."],
  ["korea", "카카오페이", "한국 모바일 결제", "가맹/연동 심사 필요."],
  ["korea", "숨고/마켓 리드 결제", "지역 서비스 리드", "리드 비용과 플랫폼 규칙 확인."],
  ["web", "Bank card hosted invoice", "카드 결제 링크 인보이스", "PG/KYC는 사용자 계정으로만 가능."],
].map(([channel, name, whenToUse, caveat]) => ({
  channel,
  name,
  accountRequired: true,
  whenToUse,
  caveat,
}));

const strategy = [
  {
    channel: "web",
    bestFor: "가장 빠른 MVP, SEO, B2B 서비스, 디지털 상품",
    payment: "Stripe Payment Links, Paddle, Lemon Squeezy, Gumroad, Payhip",
    buildPath: "정적 카탈로그 → 결제 링크 → 납품 ZIP/온보딩 폼 → 월 유지보수",
    caveat: "실제 결제 링크는 사용자 소유 계정에서 생성한다.",
  },
  {
    channel: "android",
    bestFor: "현장 직원용 앱, 고객 확인 앱, 예약/상담 companion app",
    payment: "Google Play Billing for in-app digital goods; external payment only for eligible outside-app goods/services",
    buildPath: "웹 서비스 먼저 검증 → Android companion app → Play Console 정책 확인 → Billing 또는 외부 결제 분리",
    caveat: "Google Play 배포 앱의 인앱 디지털 기능/콘텐츠 결제는 Google Play Billing 정책을 우선 검토한다.",
  },
  {
    channel: "apple",
    bestFor: "iPhone 고객 앱, 예약/상담 companion app, 프리미엄 기능",
    payment: "Apple In-App Purchase / StoreKit for in-app digital goods; Apple Pay or web payment only where guidelines allow",
    buildPath: "웹 결제 검증 → iOS companion app → App Store Review Guidelines 3.1 검토 → StoreKit/IAP 설계",
    caveat: "iOS 앱 안에서 소비되는 디지털 콘텐츠/기능/구독은 Apple In-App Purchase가 필요할 수 있다.",
  },
  {
    channel: "internet-service",
    bestFor: "SaaS, API, 자동화, 웹 대시보드, 월 구독",
    payment: "Stripe Subscription, Paddle Subscription, Lemon Squeezy Subscription",
    buildPath: "로그인 없는 MVP → 고객별 워크스페이스 → 구독/인보이스 → 운영 모니터링",
    caveat: "개인정보, 데이터 보관, 장애 대응 SLA를 계약에 포함한다.",
  },
  {
    channel: "marketplace",
    bestFor: "초기 수요 검증, 한국어 대행, 디지털 템플릿",
    payment: "Gumroad, Ko-fi, Payhip, 크몽, 숨고, 네이버 스마트스토어",
    buildPath: "상품 페이지 → 샘플 이미지 → 고정가 패키지 → 후기 수집 → 자체 웹 전환",
    caveat: "플랫폼 수수료, 금지 서비스, 정산 주기, 환불 정책을 확인한다.",
  },
];

await writeFile(new URL("service_review_480.json", import.meta.url), `${JSON.stringify(review, null, 2)}\n`, "utf8");
await writeFile(new URL("service_gap_additions.json", import.meta.url), `${JSON.stringify(gaps, null, 2)}\n`, "utf8");
await writeFile(new URL("payment_forms.json", import.meta.url), `${JSON.stringify(paymentForms, null, 2)}\n`, "utf8");
await writeFile(new URL("platform_channel_strategy.json", import.meta.url), `${JSON.stringify(strategy, null, 2)}\n`, "utf8");

const top20 = review.slice(0, 20);
const report = `# 480서비스 전체리뷰

## Top 20
${top20.map((item) => `${item.rank}. ${item.name} - ${item.score}점 / ${item.tier}티어 / ${item.platform} / ${item.paymentSystem}`).join("\n")}

## 전체 판단
480개는 모두 팔 수 있는 후보지만, 바로 시작할 순서는 A티어부터입니다. B티어는 고객군이 분명하면 팔고, C/D티어는 템플릿이나 저가 상품으로 검증한 뒤 고가 서비스를 붙이는 편이 낫습니다.

## 부족한 점
- 계정/KYC/정산은 모두 사용자 소유 계정에서 처리해야 합니다.
- 모바일 앱 안 디지털 상품은 Android와 Apple 정책을 따로 봐야 합니다.
- 오픈소스 설치형 서비스는 라이선스, 보안 업데이트, 백업 책임이 빠지면 위험합니다.
- 480개 후보는 대량 리스트이므로 Top 20을 먼저 영업하고, 나머지는 업종별 페이지로 나눠야 합니다.

## 필요한 보강
- service_gap_additions.json의 48개 보강 항목을 각 서비스 카드에 연결합니다.
- 결제는 payment_forms.json에서 웹/마켓/앱/인보이스/오프라인 중 하나를 고릅니다.
- 서비스형은 월 유지보수, 템플릿형은 Gumroad/Payhip/Ko-fi, 앱형은 Store 정책을 우선합니다.

## Android 전략
Android 앱은 companion app으로 시작하는 것이 좋습니다. 앱 안에서 디지털 기능, 구독, 콘텐츠를 판매하면 Google Play Billing 정책 검토가 필요합니다. 외부에서 소비되는 서비스는 웹 결제/인보이스와 분리합니다.

## Apple / iOS 전략
iOS는 고객 확인, 예약 확인, 상담 상태 확인 같은 companion app으로 시작합니다. 앱 안 디지털 기능/콘텐츠/구독은 Apple In-App Purchase 또는 StoreKit 정책을 먼저 봅니다. 실제 현장 서비스나 웹 기반 도구 companion 성격이면 별도 결제 구조를 검토합니다.

## Web / Internet Service 전략
가장 먼저 할 것은 웹입니다. 정적 카탈로그와 결제 링크로 수요를 검증하고, 팔리는 서비스만 SaaS/API/대시보드로 키웁니다. 결제는 Stripe Payment Links, Paddle, Lemon Squeezy, 계좌이체/세금계산서 순으로 고릅니다.
`;

await writeFile(new URL("480서비스_전체리뷰.md", import.meta.url), report, "utf8");

console.log(`reviewed ${review.length} services, gaps ${gaps.length}, payment forms ${paymentForms.length}, channel strategies ${strategy.length}`);
