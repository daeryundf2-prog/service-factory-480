# MetricSetup — SaaS Analytics Dashboard Service

Production-ready analytics dashboard setup for SaaS companies. Built on Metabase (open-source).

## Live Demo

Deploy to GitHub Pages and open your URL.

## Files

| File | Purpose |
|---|---|
| `index.html` | Landing page (deploy this) |
| `offer.md` | Service offer document |
| `outreach.md` | Email/LinkedIn outreach templates |
| `delivery_checklist.md` | Internal delivery checklist |
| `stripe-setup.md` | Stripe Payment Link setup guide |
| `manifest.json` | Service metadata |
| `privacy.html` | Privacy policy page |
| `terms.html` | Terms of service page |

## Deploy to GitHub Pages

1. Create a new GitHub repo (public)
2. Push this directory as the root
3. Go to Settings > Pages > Source: "Deploy from a branch" > Branch: main
4. Your site is live at `https://yourusername.github.io/repo-name/`

## Connect Stripe

Follow `stripe-setup.md` to create Payment Links, then replace `#stripe-placeholder` in `index.html` with your actual Stripe URL.
