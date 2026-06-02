# 강사 예약 시스템 서비스 납품 체크리스트

## 사전 준비
- 사용자 소유 결제 계정에서 Stripe Payment Links 링크를 발급한다.
- 고객 계정 권한, API 권한, 샘플 데이터, 운영 담당자를 확인한다.
- 환불 조건과 작업 범위를 계약 전 안내한다.

## 필수 보강
- 예약 변경/취소 규칙, 노쇼 방지 메시지, 캘린더 충돌 테스트를 추가한다.

## 납품물 확인
- 예약 가능 시간표 작성 및 고객 확인
- 예약 변경/취소 규칙 작성 및 고객 확인
- 노쇼 방지 메시지 작성 및 고객 확인
- 캘린더 충돌 테스트표 작성 및 고객 확인
- 담당자 알림 흐름도 작성 및 고객 확인
- 운영 인수인계 체크리스트 작성 및 고객 확인

## 결제 확인
- Stripe Payment Links: accountRequired=true; 디지털 앱 기능을 모바일 앱 안에서 팔 때는 앱스토어 정책을 따로 본다.
- Google Play Billing: accountRequired=true; Google Play 배포 앱의 인앱 디지털 결제 정책을 따른다.
- External web payment for outside-app services: accountRequired=true; 앱 안에서 외부 결제로 유도 가능한지 정책 확인 필요.
- Apple In-App Purchase: accountRequired=true; App Store Review Guidelines와 StoreKit 상태를 따라야 한다.

## QA
- 랜딩 페이지에 PAYMENT_LINK_HERE 자리표시자가 남아 있어 사용자 소유 결제 링크로 교체 가능하다.
- 실제 결제는 사용자 소유 계정에서만 받는다는 문구가 모든 문서에 있다.
- 확정 수익 또는 확정 매출 표현이 없다.
- 환불/주의/성과 비보장 안내가 포함되어 있다.
- 필수 보강 항목이 랜딩, 오퍼, 체크리스트, 아웃리치에 반영되어 있다.
- 납품물이 최소 6개 이상이고 고객 권한 확인 항목이 있다.

## 주의
성과를 보장하지 않습니다. 고객이 제공한 데이터 품질, 계정 권한, 내부 운영 참여도에 따라 결과물의 정확성과 운영 가능성이 달라집니다.
