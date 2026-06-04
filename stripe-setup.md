# Stripe Payment Links Setup — MetricSetup

Step-by-step guide to accepting payments for the MetricSetup service.

---

## Prerequisites

Before starting, make sure you have:

- **Stripe account** — Sign up free at [stripe.com](https://stripe.com)
- **Business email** — Used for Stripe account registration and payout notifications
- **Bank account** — For receiving payouts from Stripe

---

## Step 1: Create a Stripe Account

1. Go to [stripe.com](https://stripe.com) and click **Start now**.
2. Enter your email and create a password.
3. Verify your email address from the confirmation link.
4. Complete the **business verification** form:
   - Business type (sole proprietor, LLC, etc.)
   - Personal details (name, date of birth, address)
   - Bank account and routing number

> **Note:** Full account activation takes **1–2 business days**. You can build and test in the meantime using Stripe's **test mode** (toggle in the dashboard sidebar).

---

## Step 2: Create Products

Create two products in the Stripe Dashboard.

### Product 1 — SaaS Metrics Dashboard Setup

1. In the Stripe Dashboard, go to **Products** → **Add product**.
2. Fill in:
   - **Name:** `SaaS Metrics Dashboard Setup`
   - **Description:** `Production-ready Metabase dashboard for your SaaS. Includes KPI discovery, event tracking, 8+ charts, and documentation.`
3. Under **Pricing**, click **Add price**:
   - **Price:** `$399`
   - **Billing period:** One-time
4. Click **Save product**.

### Product 2 — Monthly Dashboard Maintenance

1. Go to **Products** → **Add product** again.
2. Fill in:
   - **Name:** `Monthly Dashboard Maintenance`
   - **Description:** `Monthly dashboard adjustments, new chart requests, and priority support.`
3. Under **Pricing**, click **Add price**:
   - **Price:** `$99`
   - **Billing period:** Monthly (recurring)
4. Click **Save product**.

---

## Step 3: Create Payment Links

1. In the Stripe Dashboard, go to **Payments** → **Payment Links**.
2. Click **Create payment link**.

### Link for Product 1 ($399 one-time)

1. Under **What are you selling?**, select **SaaS Metrics Dashboard Setup**.
2. Leave quantity at 1.
3. Click **Create link**.
4. Copy the generated URL (looks like `https://buy.stripe.com/...`).

### Link for Product 2 ($99/month recurring)

1. Click **Create payment link** again.
2. Under **What are you selling?**, select **Monthly Dashboard Maintenance**.
3. Leave quantity at 1.
4. Click **Create link**.
5. Copy the generated URL.

> Save both URLs somewhere safe. You will need them in the next step.

---

## Step 4: Update the Landing Page

1. Open `index.html` in the MetricSetup service directory.
2. Search for the placeholder:
   ```
   #stripe-placeholder
   ```
3. Replace the placeholder with your actual Stripe Payment Link URL.
4. Commit and push your changes.
5. **Deploy to GitHub Pages** (or your hosting provider).

The payment button on your live landing page will now redirect to Stripe Checkout.

---

## Step 5: Test

Run through this checklist to confirm everything works:

1. **Open your live landing page** in a browser.
2. **Click the payment button** for the $399 dashboard setup.
3. **Verify Stripe Checkout loads** — you should see the Stripe-hosted payment page with the correct product name and price.
4. **Complete a test payment** using Stripe's test mode:
   - Use test card number: `4242 4242 4242 4242`
   - Use any future expiry date and any CVC.
5. **Verify** the payment appears in your Stripe Dashboard under **Payments**.
6. **Repeat** for the $99/month maintenance link.

> **Tip:** Switch between test mode and live mode using the toggle in the Stripe Dashboard sidebar. Always test in test mode before accepting real payments.

---

## Step 6: Configure Taxes

For a globally-sold $399 service, configure tax settings to stay compliant.

1. In the Stripe Dashboard, go to **Settings** > **Tax settings**.
2. Enable **Stripe Tax** (available in supported regions).
3. For each Payment Link, set **Tax behavior**:
   - **Exclusive** (recommended): Tax is added on top of $399. Customer sees $399 + tax at checkout.
   - **Inclusive**: $399 includes tax. You receive less in high-tax jurisdictions.
4. Stripe automatically calculates VAT (EU), GST (UK, AU), and other applicable taxes based on customer location.
5. Review the **Tax** tab in your dashboard after test transactions to verify correct tax amounts.

> **Note:** If you are not registered for VAT/GST, Stripe Tax will still calculate it, but you may need to register or adjust settings. Consult a tax professional for your specific situation.

---

## Notes

| Item | Details |
|---|---|
| **Stripe fees** | 2.9% + $0.30 per transaction |
| **Payouts** | 2 business day rolling basis |
| **Receipts** | Automatic via Stripe |
| **Refunds** | Process through the Stripe Dashboard |

---

Once both payment links are live and tested, the billing side of MetricSetup is ready to accept customers.
