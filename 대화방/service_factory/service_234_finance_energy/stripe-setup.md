# Stripe Payment Links Setup — Energy Finance Setup

Step-by-step guide to accepting payments for the Energy Finance Setup service.

---

## Prerequisites

- **Stripe account** — Sign up free at [stripe.com](https://stripe.com)
- **Business email** — Used for account registration
- **Bank account** — For receiving payouts

---

## Step 1: Create a Stripe Account

1. Go to [stripe.com](https://stripe.com) and click **Start now**.
2. Enter your email and create a password.
3. Verify your email address.
4. Complete the **business verification** form.

> Full account activation takes 1-2 business days. Use test mode in the meantime.

---

## Step 2: Create Products

### Product 1 — Financial Dashboard Setup

1. Go to **Products** > **Add product**.
2. **Name:** `Financial Dashboard Setup`
3. **Description:** `Production-ready financial dashboard for your business. Includes KPI discovery, event tracking, 8+ charts, and documentation.`
4. **Price:** `$599` (one-time)
5. Save.

### Product 2 — Monthly Maintenance

1. Go to **Products** > **Add product**.
2. **Name:** `Monthly Dashboard Maintenance`
3. **Description:** `Monthly dashboard adjustments, new chart requests, and priority support.`
4. **Price:** `$199` (monthly, recurring)
5. Save.

---

## Step 3: Create Payment Links

1. Go to **Payments** > **Payment Links**.
2. Create link for Product 1 ($599 one-time).
3. Create link for Product 2 ($199/month recurring).
4. Copy both URLs.

---

## Step 4: Update the Landing Page

1. Open `index.html`.
2. Replace `#stripe-placeholder` with your Stripe Payment Link URL.
3. Commit, push, deploy.

---

## Step 5: Test

1. Open your live landing page.
2. Click the payment button.
3. Verify Stripe Checkout loads.
4. Test with card: `4242 4242 4242 4242`.

---

## Step 6: Configure Taxes

1. Go to **Settings** > **Tax settings**.
2. Enable Stripe Tax.
3. Set tax behavior on each Payment Link.

---

| Item | Details |
|------|---------|
| **Stripe fees** | 2.9% + $0.30 per transaction |
| **Payouts** | 2 business day rolling basis |
| **Receipts** | Automatic via Stripe |
| **Refunds** | Process through Stripe Dashboard |
