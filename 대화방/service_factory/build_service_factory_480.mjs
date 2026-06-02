import { writeFile } from "node:fs/promises";

const categories = [
  ["automation", "문의 자동화", "Activepieces", "Gumroad", "Stripe Payment Links"],
  ["crm", "CRM 세팅", "Twenty", "Payhip", "Stripe Payment Links"],
  ["support", "고객상담", "Chatwoot", "Ko-fi", "Ko-fi Payments"],
  ["analytics", "분석 대시보드", "Metabase", "Stripe Payment Links", "Stripe Payment Links"],
  ["forms", "설문/폼", "Formbricks", "Payhip", "PayPal"],
  ["booking", "예약 시스템", "Cal.com", "Stripe Payment Links", "Stripe Payment Links"],
  ["finance", "견적/청구", "InvoicePlane", "Payhip", "Payhip Checkout"],
  ["knowledge", "지식베이스", "Docmost", "Lemon Squeezy", "Lemon Squeezy"],
  ["internal-tools", "내부 운영툴", "Appsmith", "Paddle", "Paddle"],
  ["content", "콘텐츠 공장", "Ghost", "Gumroad", "Gumroad"],
  ["ops", "운영/모니터링", "Uptime Kuma", "Stripe Payment Links", "Stripe Payment Links"],
  ["commerce", "커머스 백오피스", "Medusa", "Paddle", "Paddle"],
];

const niches = [
  "병원", "치과", "한의원", "피부관리샵", "PT샵", "필라테스", "학원", "영어교습소",
  "변호사", "세무사", "노무사", "부동산", "인테리어", "이사 업체", "수리 업체", "청소 업체",
  "렌탈 업체", "쇼핑몰", "스마트스토어", "B2B 제조", "도매 유통", "프랜차이즈", "카페", "레스토랑",
  "웨딩", "사진관", "스튜디오", "강사", "코치", "SaaS", "앱 개발팀", "마케팅 대행사",
  "웹에이전시", "보험 설계사", "중고차", "여행사", "숙박업", "비영리", "채용대행", "교육기관"
];

const problems = [
  "문의가 여러 채널로 흩어져 누락된다",
  "견적과 첫 응답이 늦어 전환을 놓친다",
  "고객 상태를 엑셀로 관리해 다음 액션이 보이지 않는다",
  "광고비를 쓰지만 어떤 링크가 매출로 이어지는지 모른다",
  "예약 변경과 노쇼 대응이 수작업이다",
  "반복 CS 답변을 매번 새로 작성한다",
  "월간 보고서를 만드는 데 시간이 오래 걸린다",
  "콘텐츠 업로드 소재가 꾸준히 나오지 않는다",
];

const platforms = [
  { name: "Gumroad", priority: "primary", officialUrl: "https://gumroad.com/", bestFor: "1달러 템플릿, 문서, ZIP 디지털 상품", paymentFit: "내장 결제와 파일 전달이 있어 첫 상품 판매에 빠르다.", setup: ["상품 생성", "ZIP 업로드", "가격 설정", "상품 링크 공유"], caveat: "플랫폼 수수료와 정산 조건은 게시 전 최신 정책을 확인한다." },
  { name: "Ko-fi", priority: "primary", officialUrl: "https://ko-fi.com/shop", bestFor: "소액 후원, 디지털 파일, 커미션형 서비스", paymentFit: "Shop 상품과 후원 결제를 연결하기 쉽다.", setup: ["Shop 열기", "Digital file 선택", "상품 설명 입력", "PayPal 또는 Stripe 연결"], caveat: "지원 국가와 결제 계정 연결 가능 여부를 확인한다." },
  { name: "Payhip", priority: "primary", officialUrl: "https://payhip.com/features/sell-digital-downloads", bestFor: "디지털 다운로드와 간단한 스토어", paymentFit: "Stripe/PayPal 등 게이트웨이를 연결해 다운로드 상품을 판다.", setup: ["Digital product 추가", "파일 업로드", "가격 설정", "게이트웨이 연결"], caveat: "다운로드 제한, 세금, 쿠폰 설정을 확인한다." },
  { name: "Stripe Payment Links", priority: "primary", officialUrl: "https://docs.stripe.com/payment-links", bestFor: "서비스 착수금, 월 유지보수, 링크 결제", paymentFit: "코드 없이 Stripe-hosted 결제 링크를 만들 수 있다.", setup: ["Stripe 계정 생성", "상품/가격 생성", "Payment Link 생성", "카탈로그 CTA에 삽입"], caveat: "사업자/정산/KYC는 사용자 계정으로 완료해야 한다." },
  { name: "Paddle", priority: "primary", officialUrl: "https://developer.paddle.com/get-started/how-paddle-works/digital-products", bestFor: "글로벌 SaaS, 소프트웨어, 고가 디지털 상품", paymentFit: "Merchant of Record로 세금/결제/영수증 부담을 줄인다.", setup: ["Paddle 계정", "상품/가격", "Checkout", "웹훅/납품 연결"], caveat: "승인/심사와 지원 상품 범위를 확인한다." },
  { name: "Lemon Squeezy", priority: "secondary", officialUrl: "https://www.lemonsqueezy.com/ecommerce/digital-products", bestFor: "소프트웨어 라이선스, 다운로드, 구독", paymentFit: "상점, 라이선스, 체크아웃을 함께 제공한다.", setup: ["스토어 생성", "상품 등록", "라이선스/파일 설정", "체크아웃 링크 연결"], caveat: "계정 승인과 서비스 가능 지역을 확인한다." },
  { name: "크몽", priority: "primary", officialUrl: "https://kmong.com/", bestFor: "한국어 서비스 대행, 설치, 자동화 세팅", paymentFit: "플랫폼 내 결제/거래 중재가 있어 한국 고객에게 유리하다.", setup: ["전문가 프로필", "서비스 상품", "가격 옵션", "포트폴리오 등록"], caveat: "수수료와 금지 서비스 정책을 확인한다." },
  { name: "숨고", priority: "secondary", officialUrl: "https://soomgo.com/", bestFor: "지역 서비스, 설치 대행, 컨설팅 리드", paymentFit: "리드 매칭 후 플랫폼 또는 별도 계약으로 진행한다.", setup: ["고수 프로필", "서비스 지역", "견적 템플릿", "응답 문구"], caveat: "리드 비용과 플랫폼 규칙을 확인한다." },
  { name: "네이버 스마트스토어", priority: "secondary", officialUrl: "https://sell.smartstore.naver.com/", bestFor: "한국어 디지털 템플릿과 서비스 패키지 노출", paymentFit: "네이버 생태계 결제를 활용할 수 있다.", setup: ["판매자 가입", "상품 등록", "상세페이지", "정산 정보"], caveat: "디지털 상품/서비스 판매 가능 범위 확인이 필요하다." },
  { name: "Shopify", priority: "specialized", officialUrl: "https://www.shopify.com/", bestFor: "브랜드형 서비스 스토어와 고가 패키지", paymentFit: "스토어, 결제, 앱 생태계를 활용한다.", setup: ["스토어 생성", "디지털 상품 앱", "결제 설정", "랜딩 구성"], caveat: "월 비용과 앱 비용이 있어 초기에는 과할 수 있다." },
  { name: "WordPress + WooCommerce", priority: "specialized", officialUrl: "https://woocommerce.com/", bestFor: "자체 사이트에서 서비스/다운로드 판매", paymentFit: "WooCommerce 결제 플러그인으로 직접 판매한다.", setup: ["호스팅", "WooCommerce", "결제 플러그인", "상품 등록"], caveat: "보안/업데이트/백업 책임이 커진다." },
  { name: "GitHub Sponsors", priority: "specialized", officialUrl: "https://github.com/sponsors", bestFor: "오픈소스 템플릿, 개발자 도구, 후원형 수익", paymentFit: "후원 기반이라 직접 상품 결제보다 커뮤니티형에 맞다.", setup: ["프로필 준비", "후원 티어", "README CTA", "샘플 repo"], caveat: "일반 서비스 판매보다는 개발자 신뢰 구축용이다." },
];

const paymentSystems = [
  { name: "Stripe Payment Links", hasPayment: true, accountRequired: true, officialUrl: "https://docs.stripe.com/payment-links", bestFor: "착수금, 월 유지보수, 서비스 결제", setupSteps: ["Stripe 계정 인증", "상품과 가격 생성", "Payment Link 생성", "카탈로그 CTA 교체"], caveat: "실제 결제는 사용자 소유 Stripe 계정에서만 가능하다." },
  { name: "Gumroad", hasPayment: true, accountRequired: true, officialUrl: "https://gumroad.com/", bestFor: "ZIP, 템플릿, 문서형 디지털 상품", setupSteps: ["계정 생성", "상품 파일 업로드", "가격 설정", "상품 링크 공유"], caveat: "정산과 수수료는 최신 정책 확인." },
  { name: "Ko-fi Payments", hasPayment: true, accountRequired: true, officialUrl: "https://help.ko-fi.com/hc/en-us/articles/115003980093-How-do-I-get-paid", bestFor: "후원, 커미션, 소액 디지털 상품", setupSteps: ["Ko-fi 계정", "PayPal/Stripe 연결", "Shop 상품", "링크 배포"], caveat: "지원 결제수단은 연결 계정에 따라 달라진다." },
  { name: "Payhip Checkout", hasPayment: true, accountRequired: true, officialUrl: "https://help.payhip.com/article/164-how-to-sell-your-first-product-on-payhip", bestFor: "디지털 다운로드 스토어", setupSteps: ["상품 생성", "파일 업로드", "게이트웨이 연결", "다운로드 테스트"], caveat: "게이트웨이 승인과 세금 설정 확인." },
  { name: "Paddle", hasPayment: true, accountRequired: true, officialUrl: "https://developer.paddle.com/get-started/how-paddle-works/digital-products", bestFor: "글로벌 소프트웨어/디지털 상품", setupSteps: ["판매자 승인", "상품/가격 생성", "Checkout 연결", "웹훅 납품"], caveat: "Merchant of Record지만 승인 절차가 필요하다." },
  { name: "Lemon Squeezy", hasPayment: true, accountRequired: true, officialUrl: "https://www.lemonsqueezy.com/ecommerce/digital-products", bestFor: "소프트웨어 라이선스와 다운로드", setupSteps: ["스토어 생성", "상품 생성", "체크아웃 링크", "라이선스/파일 설정"], caveat: "계정/상품 승인 여부를 확인한다." },
  { name: "PayPal", hasPayment: true, accountRequired: true, officialUrl: "https://www.paypal.com/business", bestFor: "국제 고객의 간단한 인보이스/링크", setupSteps: ["비즈니스 계정", "결제 링크 또는 인보이스", "상품 설명", "정산 확인"], caveat: "분쟁/환불 정책을 명확히 해야 한다." },
  { name: "네이버페이", hasPayment: true, accountRequired: true, officialUrl: "https://admin.pay.naver.com/", bestFor: "한국 고객 결제", setupSteps: ["사업자/가맹 신청", "상품 등록", "정산 정보", "결제 테스트"], caveat: "가맹 심사와 판매 가능 상품 정책이 중요하다." },
  { name: "토스페이먼츠", hasPayment: true, accountRequired: true, officialUrl: "https://www.tosspayments.com/", bestFor: "한국 자체 사이트 결제", setupSteps: ["가맹 신청", "API/결제창 설정", "상품/정산 정보", "테스트 결제"], caveat: "개발 연동과 심사가 필요하다." },
  { name: "계좌이체/세금계산서", hasPayment: true, accountRequired: true, officialUrl: "https://www.nts.go.kr/", bestFor: "B2B 고가 구축/월 유지보수", setupSteps: ["견적서", "계약서", "계좌 안내", "세금계산서 발행"], caveat: "회계/세무 처리는 전문가 확인이 필요하다." },
  { name: "크몽 결제", hasPayment: true, accountRequired: true, officialUrl: "https://kmong.com/", bestFor: "한국어 서비스 거래 보호", setupSteps: ["전문가 계정", "서비스 상품", "옵션 가격", "구매 링크 전달"], caveat: "플랫폼 수수료와 정산주기를 확인한다." },
  { name: "Shopify Payments", hasPayment: true, accountRequired: true, officialUrl: "https://www.shopify.com/payments", bestFor: "브랜드 스토어와 다상품 판매", setupSteps: ["Shopify 가입", "결제 활성화", "상품/배송 없는 디지털 설정", "테스트 주문"], caveat: "국가별 Shopify Payments 지원 여부 확인." }
];

const priceByCategory = {
  automation: "₩300,000 setup + ₩90,000/mo",
  crm: "₩900,000 setup + ₩250,000/mo",
  support: "₩700,000 setup + ₩200,000/mo",
  analytics: "₩600,000 setup + ₩180,000/mo",
  forms: "₩350,000 setup + ₩80,000/mo",
  booking: "₩500,000 setup + ₩120,000/mo",
  finance: "₩600,000 setup + ₩150,000/mo",
  knowledge: "₩700,000 setup + ₩180,000/mo",
  "internal-tools": "₩1,200,000 setup + ₩350,000/mo",
  content: "₩250,000 package + ₩400,000/mo",
  ops: "₩400,000 setup + ₩120,000/mo",
  commerce: "₩1,500,000 setup + ₩500,000/mo",
};

const services = [];
let id = 1;
for (const niche of niches) {
  for (const [category, label, openSource, platform, paymentSystem] of categories) {
    const problem = problems[(id - 1) % problems.length];
    services.push({
      id: `svc-${String(id).padStart(3, "0")}`,
      name: `${niche} ${label} 서비스`,
      category,
      niche,
      customer: `${niche} 운영자와 담당자`,
      problem,
      offer: `${openSource} 또는 로컬 도구를 활용해 ${niche}의 ${label} 흐름을 세팅하고 운영 문서까지 납품한다.`,
      openSource,
      platform,
      paymentSystem,
      price: priceByCategory[category],
      mvpDays: (id % 14) + 1,
      firstAction: `${niche}의 현재 업무 화면 1개와 샘플 데이터 10개를 받아 첫 MVP 범위를 고정한다.`,
      risk: "오픈소스 라이선스, 고객 계정 권한, 개인정보/결제 책임은 계약 전 확인해야 한다.",
    });
    id += 1;
  }
}

await writeFile(new URL("services_480.json", import.meta.url), `${JSON.stringify(services, null, 2)}\n`, "utf8");
await writeFile(new URL("platforms.json", import.meta.url), `${JSON.stringify(platforms, null, 2)}\n`, "utf8");
await writeFile(new URL("payment_systems.json", import.meta.url), `${JSON.stringify(paymentSystems, null, 2)}\n`, "utf8");

console.log(`generated ${services.length} services, ${platforms.length} platforms, ${paymentSystems.length} payment systems`);
