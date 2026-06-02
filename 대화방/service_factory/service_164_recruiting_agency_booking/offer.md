# 채용대행 예약 시스템 서비스

서비스 번호: 164
원본 ID: svc-462
rank / tier / score: 164 / B / 85
카테고리 / 니치: booking / 채용대행
권장 채널: android-apple-companion
플랫폼: Stripe Payment Links
결제 시스템: Stripe Payment Links
가격 앵커: ₩500,000 setup + ₩120,000/mo

## 오퍼
Cal.com 또는 로컬 도구를 활용해 채용대행의 예약 시스템 흐름을 세팅하고 운영 문서까지 납품한다.

## 고객 문제
반복 CS 답변을 매번 새로 작성한다

## 첫 실행 기준
채용대행의 현재 업무 화면 1개와 샘플 데이터 10개를 받아 첫 MVP 범위를 고정한다.

## 납품물
- 예약 가능 시간표
- 예약 변경/취소 규칙
- 노쇼 방지 메시지
- 캘린더 충돌 테스트표
- 담당자 알림 흐름도
- 운영 인수인계 체크리스트

## 작업 단계
- 1. 예약 가능 시간, 담당자, 변경/취소 마감 시간을 정의한다.
- 2. 캘린더 연동과 중복 예약 방지 테스트를 먼저 진행한다.
- 3. 고객 알림 메시지와 담당자 알림 흐름을 세팅한다.
- 4. 예약 수정, 취소, 예외 처리 절차를 인수인계한다.

## 필수 보강
예약 변경/취소 규칙, 노쇼 방지 메시지, 캘린더 충돌 테스트를 추가한다.

## 약점과 방어
캘린더 충돌, 노쇼 정책, 예약 변경 플로우가 없으면 현장 혼란이 생긴다.

## 결제/채널 주의
- Stripe Payment Links: 서비스 착수금, 월 유지보수, 단일 결제 링크. 주의: 디지털 앱 기능을 모바일 앱 안에서 팔 때는 앱스토어 정책을 따로 본다.
- Google Play Billing: Android 앱 안 디지털 기능/구독. 주의: Google Play 배포 앱의 인앱 디지털 결제 정책을 따른다.
- External web payment for outside-app services: 앱 밖에서 소비되는 실물/외부 서비스. 주의: 앱 안에서 외부 결제로 유도 가능한지 정책 확인 필요.
- Apple In-App Purchase: iOS 앱 안 디지털 콘텐츠/기능/구독. 주의: App Store Review Guidelines와 StoreKit 상태를 따라야 한다.
- android: 웹 서비스 먼저 검증 → Android companion app → Play Console 정책 확인 → Billing 또는 외부 결제 분리. 주의: Google Play 배포 앱의 인앱 디지털 기능/콘텐츠 결제는 Google Play Billing 정책을 우선 검토한다.
- apple: 웹 결제 검증 → iOS companion app → App Store Review Guidelines 3.1 검토 → StoreKit/IAP 설계. 주의: iOS 앱 안에서 소비되는 디지털 콘텐츠/기능/구독은 Apple In-App Purchase가 필요할 수 있다.

## 환불 및 성과 안내
실제 결제는 사용자 소유 계정에서만 진행합니다. 납품 범위, 환불 조건, 고객 자료 제공 지연 시 일정 변경 조건을 사전에 안내합니다. 이 서비스는 세팅과 운영 문서를 납품하지만 매출, 문의, 수익을 보장하지 않습니다.
