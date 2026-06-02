# 프랜차이즈 고객상담 서비스

서비스 번호: 034
원본 ID: svc-255
rank / tier / score: 34 / A / 90
카테고리 / 니치: support / 프랜차이즈
권장 채널: android-apple-companion
플랫폼: Ko-fi
결제 시스템: Ko-fi Payments
가격 앵커: ₩700,000 setup + ₩200,000/mo

## 오퍼
Chatwoot 또는 로컬 도구를 활용해 프랜차이즈의 고객상담 흐름을 세팅하고 운영 문서까지 납품한다.

## 고객 문제
월간 보고서를 만드는 데 시간이 오래 걸린다

## 첫 실행 기준
프랜차이즈의 현재 업무 화면 1개와 샘플 데이터 10개를 받아 첫 MVP 범위를 고정한다.

## 납품물
- 문의 분류표
- 응답 템플릿
- SLA 기준표
- 에스컬레이션 규칙
- FAQ 초안
- 운영 인수인계 체크리스트

## 작업 단계
- 1. 문의 유형, 긴급도, 담당자, 응답 시간을 정의한다.
- 2. FAQ와 응답 템플릿을 만들고 실제 문의 예시로 검수한다.
- 3. 에스컬레이션과 고객 알림 기준을 세팅한다.
- 4. 문의 보관, 수정, 재사용 규칙을 인수인계한다.

## 필수 보강
개인정보 처리 위탁 문구, 라벨 규칙, SLA 응답표를 추가한다.

## 약점과 방어
메신저 API와 개인정보 처리 위탁 문구가 빠지면 운영 리스크가 크다.

## 결제/채널 주의
- Google Play Billing: Android 앱 안 디지털 기능/구독. 주의: Google Play 배포 앱의 인앱 디지털 결제 정책을 따른다.
- External web payment for outside-app services: 앱 밖에서 소비되는 실물/외부 서비스. 주의: 앱 안에서 외부 결제로 유도 가능한지 정책 확인 필요.
- Apple In-App Purchase: iOS 앱 안 디지털 콘텐츠/기능/구독. 주의: App Store Review Guidelines와 StoreKit 상태를 따라야 한다.
- Apple Pay for real-world services: 현장 서비스, 예약, 물리 서비스. 주의: 디지털 기능 판매에는 IAP가 필요할 수 있다.
- android: 웹 서비스 먼저 검증 → Android companion app → Play Console 정책 확인 → Billing 또는 외부 결제 분리. 주의: Google Play 배포 앱의 인앱 디지털 기능/콘텐츠 결제는 Google Play Billing 정책을 우선 검토한다.
- apple: 웹 결제 검증 → iOS companion app → App Store Review Guidelines 3.1 검토 → StoreKit/IAP 설계. 주의: iOS 앱 안에서 소비되는 디지털 콘텐츠/기능/구독은 Apple In-App Purchase가 필요할 수 있다.

## 환불 및 성과 안내
실제 결제는 사용자 소유 계정에서만 진행합니다. 납품 범위, 환불 조건, 고객 자료 제공 지연 시 일정 변경 조건을 사전에 안내합니다. 이 서비스는 세팅과 운영 문서를 납품하지만 매출, 문의, 수익을 보장하지 않습니다.
