#!/usr/bin/env node
/**
 * Service Factory Generator
 * Generates sellable English versions of all 480 services.
 * Run: node generate_all_services.mjs
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = join(__dirname, '대화방', 'service_factory');

// ── Pricing & Tool Config ──────────────────────────────────────────
const CATEGORY_CONFIG = {
  analytics:       { price: 399, monthly: 99, tools: 'Metabase, Umami, Plausible', verb: 'analytics dashboard' },
  automation:      { price: 499, monthly: 149, tools: 'n8n, Activepieces, Make', verb: 'automation workflow' },
  booking:         { price: 299, monthly: 79, tools: 'Cal.com, Calendly, Appointlet', verb: 'booking system' },
  forms:           { price: 249, monthly: 69, tools: 'Formbricks, Tally, Typeform', verb: 'form solution' },
  support:         { price: 349, monthly: 99, tools: 'Chatwoot, Crisp, Intercom', verb: 'support system' },
  finance:         { price: 599, monthly: 199, tools: 'Metabase, Stripe Dashboard, QuickBooks', verb: 'financial dashboard' },
  knowledge:       { price: 299, monthly: 79, tools: 'Notion, GitBook, Docusaurus', verb: 'knowledge base' },
  'internal-tools': { price: 449, monthly: 149, tools: 'Retool, Budibase, Appsmith', verb: 'internal tool' },
  content:         { price: 349, monthly: 99, tools: 'WordPress, Ghost, Strapi', verb: 'content system' },
  commerce:        { price: 499, monthly: 149, tools: 'WooCommerce, Shopify, Medusa', verb: 'commerce setup' },
  ops:             { price: 399, monthly: 99, tools: 'Metabase, n8n, Google Sheets', verb: 'operations dashboard' },
  crm:             { price: 399, monthly: 99, tools: 'Twenty, HubSpot, Salesforce', verb: 'CRM system' },
};

// ── Niche Pain Points ──────────────────────────────────────────────
const NICHE_PAIN = {
  SaaS: 'scattered user metrics across multiple tools, making it hard to see the full customer lifecycle',
  'app team': 'fragmented development metrics with no unified view of app performance and user behavior',
  franchise: 'inconsistent data reporting across multiple locations with no centralized visibility',
  'wholesale': 'manual order tracking and inventory management spread across spreadsheets and emails',
  'marketing agency': 'client reporting taking hours each week with data pulled from multiple platforms',
  'lawyer': 'case management data scattered across different systems with no clear pipeline visibility',
  'hospital': 'patient flow and operational data fragmented across departments',
  'tax accountant': 'seasonal workload data and client information spread across multiple systems',
  'shopping mall': 'tenant performance and foot traffic data not connected to revenue metrics',
  'web agency': 'project timelines and client deliverables tracked in disconnected tools',
  'dental': 'appointment scheduling and patient data not connected to business metrics',
  'academy': 'student enrollment and course completion data spread across different platforms',
  'korean clinic': 'patient scheduling and treatment data not integrated with business operations',
  'B2B manufacturing': 'order management and production data disconnected from sales pipeline',
  'real estate': 'property listings and client inquiries tracked in separate systems',
  'restaurant': 'inventory, orders, and customer data not connected for unified insights',
  'coach': 'client progress and session data scattered across different tools',
  'skincare': 'appointment booking and product sales data not integrated',
  'pilates': 'class scheduling and membership data spread across platforms',
  'PT shop': 'member training data and business metrics not connected',
  'instructor': 'student progress and scheduling data in separate systems',
  'labor consultant': 'case data and client information spread across spreadsheets',
  'nonprofit': 'donation tracking and program impact data not connected',
  'insurance planner': 'policy data and client information fragmented across systems',
  'photo studio': 'booking and portfolio data not connected to revenue metrics',
  'accommodation': 'reservation and guest data spread across multiple platforms',
  'repair': 'work order and customer data in disconnected systems',
  'moving company': 'quote and scheduling data not integrated with operations',
  'interior': 'project timelines and client data spread across tools',
  'used car': 'inventory and customer data not connected to sales pipeline',
  'wedding': 'vendor and client data scattered across planning tools',
  'cleaning': 'scheduling and client data not integrated with billing',
  'cafe': 'inventory and sales data not connected for unified insights',
  'recruiting agency': 'candidate and job data spread across multiple platforms',
  'English academy': 'student enrollment and class data not connected',
  'travel agency': 'booking and itinerary data scattered across systems',
  'smart store': 'e-commerce and offline sales data not unified',
  'studio': 'booking and project data not connected to revenue',
  pt_shop: 'member and training data spread across platforms',
  education: 'student progress and scheduling data not integrated',
};

// ── Helpers ────────────────────────────────────────────────────────
function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function brandName(name) {
  return name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

function nicheLabel(niche) {
  const map = {
    'SaaS': 'SaaS', 'app team': 'App Development Teams', 'franchise': 'Franchises',
    'wholesale': 'Wholesale Businesses', 'marketing agency': 'Marketing Agencies',
    'lawyer': 'Law Firms', 'hospital': 'Hospitals & Clinics', 'tax accountant': 'Tax Accounting Firms',
    'shopping mall': 'Shopping Malls', 'web agency': 'Web Agencies', 'dental': 'Dental Practices',
    'academy': 'Academies & Training Centers', 'korean clinic': 'Korean Clinics',
    'B2B manufacturing': 'B2B Manufacturers', 'real estate': 'Real Estate Companies',
    'restaurant': 'Restaurants & Food Service', 'coach': 'Business Coaches',
    'skincare': 'Skincare Studios', 'pilates': 'Pilates Studios', 'PT shop': 'Personal Training Studios',
    'instructor': 'Fitness Instructors', 'labor consultant': 'Labor Consultants',
    'nonprofit': 'Nonprofits', 'insurance planner': 'Insurance Planners',
    'photo studio': 'Photo Studios', 'accommodation': 'Accommodation Providers',
    'repair': 'Repair Shops', 'moving company': 'Moving Companies',
    'interior': 'Interior Designers', 'used car': 'Used Car Dealers',
    'wedding': 'Wedding Vendors', 'cleaning': 'Cleaning Companies',
    'cafe': 'Cafes & Coffee Shops', 'recruiting agency': 'Recruiting Agencies',
    'English academy': 'English Language Academies', 'travel agency': 'Travel Agencies',
    'smart store': 'Smart Store Operators', 'studio': 'Creative Studios',
    'pt_shop': 'Personal Training Studios', 'education': 'Education Providers',
  };
  return map[niche] || niche;
}

function categoryLabel(cat) {
  const map = {
    analytics: 'Analytics Dashboard', automation: 'Automation System', booking: 'Booking System',
    forms: 'Form Solution', support: 'Support System', finance: 'Financial Dashboard',
    knowledge: 'Knowledge Base', 'internal-tools': 'Internal Tool', content: 'Content System',
    commerce: 'Commerce Setup', ops: 'Operations Dashboard', crm: 'CRM System',
  };
  return map[cat] || cat;
}

function readServices() {
  const raw = readFileSync(join(__dirname, 'services_480.json'), 'utf8');
  const data = JSON.parse(raw);
  if (Array.isArray(data)) return data;
  for (const key of Object.keys(data)) {
    if (Array.isArray(data[key])) return data[key];
  }
  return [];
}

// ── Template: index.html ───────────────────────────────────────────
function genIndex(s, cfg) {
  const b = brandName(s.name);
  const niche = nicheLabel(s.niche);
  const cat = categoryLabel(s.category);
  const desc = s.description || `${cat} setup for ${niche}`;
  const pain = NICHE_PAIN[s.niche] || 'disconnected data across multiple tools';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${b} — ${cat} in 5 Days</title>
  <meta name="description" content="${desc}. Open-source stack, delivered in 5 business days. $${cfg.price}.">
  <style>
    :root{--bg:#0a0a0a;--surface:#141414;--surface-2:#1c1c1c;--border:#262626;--text:#e5e5e5;--text-muted:#a3a3a3;--accent:#22c55e;--accent-hover:#16a34a;--accent-dim:rgba(34,197,94,.1);--white:#fafafa;--radius:12px}*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;background:var(--bg);color:var(--text);line-height:1.6;-webkit-font-smoothing:antialiased}.container{max-width:960px;margin:0 auto;padding:0 24px}nav{position:sticky;top:0;z-index:100;background:rgba(10,10,10,.85);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);padding:16px 0}nav .container{display:flex;justify-content:space-between;align-items:center}.nav-brand{font-weight:700;font-size:18px;color:var(--white);letter-spacing:-.5px}.nav-brand span{color:var(--accent)}.nav-cta{background:var(--accent);color:#000;font-weight:600;padding:8px 20px;border-radius:8px;text-decoration:none;font-size:14px;transition:background .2s}.nav-cta:hover{background:var(--accent-hover)}.hero{padding:80px 0 60px;text-align:center}.hero-badge{display:inline-block;background:var(--accent-dim);color:var(--accent);padding:6px 16px;border-radius:999px;font-size:13px;font-weight:600;margin-bottom:24px;border:1px solid rgba(34,197,94,.2)}.hero h1{font-size:clamp(36px,6vw,56px);font-weight:800;line-height:1.1;letter-spacing:-1.5px;color:var(--white);margin-bottom:20px}.hero h1 em{font-style:normal;color:var(--accent)}.hero p{font-size:18px;color:var(--text-muted);max-width:560px;margin:0 auto 36px}.hero-cta{display:inline-flex;align-items:center;gap:8px;background:var(--accent);color:#000;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;transition:all .2s}.hero-cta:hover{background:var(--accent-hover);transform:translateY(-1px)}.hero-sub{font-size:13px;color:var(--text-muted);margin-top:12px}.proof{display:flex;justify-content:center;gap:48px;padding:40px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}.proof-item{text-align:center}.proof-num{font-size:28px;font-weight:800;color:var(--white)}.proof-label{font-size:13px;color:var(--text-muted);margin-top:4px}.section{padding:80px 0}.section-label{font-size:13px;font-weight:600;color:var(--accent);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:16px}.section h2{font-size:clamp(28px,4vw,40px);font-weight:800;letter-spacing:-1px;color:var(--white);margin-bottom:24px;line-height:1.15}.section>p,.section .container>p{font-size:17px;color:var(--text-muted);max-width:640px;margin-bottom:40px}.card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:28px;position:relative}.card .icon{font-size:24px;margin-bottom:12px}.card h3{font-size:16px;font-weight:700;color:var(--white);margin-bottom:8px}.card p{font-size:14px;color:var(--text-muted);line-height:1.5}.deliverable .num{position:absolute;top:20px;right:20px;font-size:48px;font-weight:900;color:var(--surface-2);line-height:1}.demo-section{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:40px;margin:0 auto}.demo-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}.metric-card{background:var(--surface-2);border:1px solid var(--border);border-radius:10px;padding:20px}.metric-label{font-size:12px;color:var(--text-muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px}.metric-value{font-size:28px;font-weight:800;color:var(--white)}.metric-change{font-size:12px;margin-top:4px}.metric-change.up{color:var(--accent)}.metric-change.down{color:#ef4444}.demo-chart{background:var(--surface-2);border:1px solid var(--border);border-radius:10px;padding:24px;height:200px;display:flex;align-items:flex-end;gap:8px}.chart-bar{flex:1;background:var(--accent);border-radius:4px 4px 0 0;opacity:.7;transition:opacity .2s;min-height:8px}.chart-bar:hover{opacity:1}.process-steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:24px}.process-step{text-align:center;padding:32px 20px}.process-step .step-num{width:48px;height:48px;background:var(--accent-dim);border:1px solid rgba(34,197,94,.3);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:var(--accent);margin-bottom:16px}.process-step h3{font-size:16px;font-weight:700;color:var(--white);margin-bottom:8px}.process-step p{font-size:14px;color:var(--text-muted)}.pricing-card{max-width:480px;margin:0 auto;background:var(--surface);border:2px solid var(--accent);border-radius:16px;padding:40px;text-align:center;position:relative}.pricing-card .badge{position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:var(--accent);color:#000;padding:4px 16px;border-radius:999px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}.pricing-card h3{font-size:20px;font-weight:700;color:var(--white);margin-bottom:8px}.pricing-card .price{font-size:48px;font-weight:900;color:var(--white);margin:16px 0 4px}.pricing-card .price-note{font-size:14px;color:var(--text-muted);margin-bottom:24px}.pricing-card ul{list-style:none;text-align:left;margin-bottom:28px}.pricing-card li{padding:8px 0;font-size:14px;color:var(--text);display:flex;align-items:flex-start;gap:10px}.pricing-card li::before{content:"\\2713";color:var(--accent);font-weight:700;flex-shrink:0}.pricing-cta{display:block;width:100%;background:var(--accent);color:#000;font-weight:700;padding:14px;border-radius:10px;text-decoration:none;font-size:16px;transition:background .2s;border:none;cursor:pointer}.pricing-cta:hover{background:var(--accent-hover)}.pricing-fine{font-size:12px;color:var(--text-muted);margin-top:12px}.faq-item{border-bottom:1px solid var(--border);padding:20px 0}.faq-item h3{font-size:16px;font-weight:600;color:var(--white);margin-bottom:8px}.faq-item p{font-size:14px;color:var(--text-muted);line-height:1.6}.cta-banner{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:60px 40px;text-align:center;margin:60px 0}.cta-banner h2{font-size:28px;font-weight:800;color:var(--white);margin-bottom:12px}.cta-banner p{font-size:16px;color:var(--text-muted);margin-bottom:28px}footer{border-top:1px solid var(--border);padding:40px 0;text-align:center}footer p{font-size:13px;color:var(--text-muted)}footer a{color:var(--text-muted);text-decoration:none}footer a:hover{color:var(--text)}@media(max-width:640px){.demo-grid{grid-template-columns:repeat(2,1fr)}.proof{gap:24px}.demo-section{padding:24px}.cta-banner{padding:40px 24px}}
  </style>
</head>
<body>
<nav><div class="container"><div class="nav-brand">${b.split(' ')[0]}<span>${b.split(' ').slice(1).join(' ')}</span></div><a href="#pricing" class="nav-cta">Get Started</a></div></nav>

<section class="hero"><div class="container">
  <div class="hero-badge">Delivery in 5 business days</div>
  <h1>Professional ${cat}<br><em>for ${niche}</em></h1>
  <p>${desc}. Open-source stack, configured for your specific ${niche.toLowerCase()} workflow.</p>
  <a href="#pricing" class="hero-cta">Get your ${cfg.verb} &rarr;</a>
  <div class="hero-sub">No contracts. 7-day money-back guarantee.</div>
</div></section>

<div class="proof">
  <div class="proof-item"><div class="proof-num">5 days</div><div class="proof-label">Target delivery</div></div>
  <div class="proof-item"><div class="proof-num">OSS</div><div class="proof-label">Open-source stack</div></div>
  <div class="proof-item"><div class="proof-num">$0</div><div class="proof-label">Monthly software cost</div></div>
  <div class="proof-item"><div class="proof-num">Yours</div><div class="proof-label">100% your data</div></div>
</div>

<section class="section"><div class="container">
  <div class="section-label">The problem</div>
  <h2>Your ${niche.toLowerCase()} data is everywhere.<br>Decisions are nowhere.</h2>
  <p>${niche} often deal with ${pain}. Without a unified view, decisions are based on incomplete information.</p>
  <div class="card-grid">
    <div class="card"><div class="icon">&#128256;</div><h3>Data scattered across tools</h3><p>Your ${niche.toLowerCase()} metrics live in different platforms with no single source of truth.</p></div>
    <div class="card"><div class="icon">&#9201;</div><h3>Manual reporting wastes hours</h3><p>Copying data between spreadsheets every week. Same format, same wasted time.</p></div>
    <div class="card"><div class="icon">&#129300;</div><h3>You do not know what works</h3><p>Which ${niche.toLowerCase()} activities drive the best outcomes? You are guessing without data.</p></div>
  </div>
</div></section>

<section class="section" style="background:var(--surface);border-top:1px solid var(--border);border-bottom:1px solid var(--border)"><div class="container">
  <div class="section-label">What you get</div>
  <h2>Everything you need.<br>Nothing you don't.</h2>
  <p>A working ${cfg.verb}, not a template. Configured for your ${niche.toLowerCase()} workflow with documentation to keep it running.</p>
  <div class="card-grid">
    <div class="card deliverable"><div class="num">01</div><h3>KPI Discovery Session</h3><p>A 60-minute call to map your ${niche.toLowerCase()} metrics and define what to measure.</p></div>
    <div class="card deliverable"><div class="num">02</div><h3>Event Tracking Dictionary</h3><p>A structured spec of every event to track, with naming conventions and implementation notes.</p></div>
    <div class="card deliverable"><div class="num">03</div><h3>${cfg.tools.split(',')[0]} Dashboard</h3><p>A fully configured dashboard with 8+ charts: key metrics, trends, and ${niche.toLowerCase()} performance indicators.</p></div>
    <div class="card deliverable"><div class="num">04</div><h3>Data Quality Checklist</h3><p>A validation framework to ensure your data is clean, consistent, and reliable.</p></div>
    <div class="card deliverable"><div class="num">05</div><h3>Monthly Report Template</h3><p>A plug-and-play report format with pre-built charts. Reporting drops to 30 minutes.</p></div>
    <div class="card deliverable"><div class="num">06</div><h3>Handover Documentation</h3><p>Full documentation: data sources, calculations, maintenance schedule, and troubleshooting.</p></div>
  </div>
</div></section>

<section class="section"><div class="container">
  <div class="section-label">Dashboard preview</div>
  <h2>This is what you will see<br>every Monday morning.</h2>
  <div class="demo-section">
    <div class="demo-grid">
      <div class="metric-card"><div class="metric-label">Key Metric</div><div class="metric-value">87.3%</div><div class="metric-change up">&uarr; 5.2% vs last month</div></div>
      <div class="metric-card"><div class="metric-label">Growth</div><div class="metric-value">+12.1%</div><div class="metric-change up">&uarr; 2.8% vs last month</div></div>
      <div class="metric-card"><div class="metric-label">Conversion</div><div class="metric-value">24.6%</div><div class="metric-change down">&darr; 0.4% vs last month</div></div>
      <div class="metric-card"><div class="metric-label">Retention</div><div class="metric-value">91.2%</div><div class="metric-change up">&uarr; 1.1% vs last month</div></div>
    </div>
    <div class="demo-chart" id="demoChart"></div>
  </div>
</div></section>

<section class="section" style="background:var(--surface);border-top:1px solid var(--border);border-bottom:1px solid var(--border)"><div class="container">
  <div class="section-label">How it works</div>
  <h2>From kickoff to ${cfg.verb}<br>in 5 business days.</h2>
  <div class="process-steps">
    <div class="process-step"><div class="step-num">1</div><h3>Book &amp; Pay</h3><p>Complete payment. Get a calendar link for kickoff within 1 hour.</p></div>
    <div class="process-step"><div class="step-num">2</div><h3>Kickoff Call</h3><p>60-minute session to map your ${niche.toLowerCase()} metrics and identify data sources.</p></div>
    <div class="process-step"><div class="step-num">3</div><h3>Build</h3><p>We configure your dashboard, connect data, and build charts. Daily progress updates.</p></div>
    <div class="process-step"><div class="step-num">4</div><h3>Handover</h3><p>30-minute walkthrough, full documentation, and maintenance guide. Yours to keep.</p></div>
  </div>
</div></section>

<section class="section" id="pricing"><div class="container">
  <div class="section-label">Pricing</div>
  <h2>One price.<br>Everything included.</h2>
  <div class="pricing-card">
    <div class="badge">Most Popular</div>
    <h3>${cat} Setup</h3>
    <div class="price">$${cfg.price}</div>
    <div class="price-note">One-time setup. No recurring fees.</div>
    <ul>
      <li>KPI discovery session (60 min)</li>
      <li>Event tracking dictionary</li>
      <li>Full ${cfg.tools.split(',')[0]} dashboard (8+ charts)</li>
      <li>Data quality checklist</li>
      <li>Monthly report template</li>
      <li>Handover documentation</li>
      <li>7-day post-delivery support</li>
    </ul>
    <a href="#stripe-placeholder" class="pricing-cta">Get Your ${cat} &rarr;</a>
    <div class="pricing-fine">Secure payment via Stripe. 7-day money-back guarantee.</div>
  </div>
</div></section>

<section class="section"><div class="container">
  <div class="section-label">FAQ</div>
  <h2>Questions? Answers.</h2>
  <div class="faq-item"><h3>What stack do you use?</h3><p>${cfg.tools} (open-source) for the ${cfg.verb}, connected to your existing data. No vendor lock-in, no monthly SaaS fees.</p></div>
  <div class="faq-item"><h3>Do I need to change my data pipeline?</h3><p>Not necessarily. We work with what you have. SQL database, API, or event-based system &mdash; we will find the right connectors.</p></div>
  <div class="faq-item"><h3>What if I do not have event tracking yet?</h3><p>That is fine. The event dictionary includes implementation guidance your team can follow. The dashboard works once data flows.</p></div>
  <div class="faq-item"><h3>Can I self-host?</h3><p>Yes. The tools are open-source. We help you deploy on your own infrastructure. No recurring analytics costs.</p></div>
  <div class="faq-item"><h3>What if I need changes after delivery?</h3><p>7 days of free post-delivery support. After that, monthly maintenance at $${cfg.monthly}/month.</p></div>
  <div class="faq-item"><h3>Is there a money-back guarantee?</h3><p>Yes. Full refund within 7 business days if deliverables are not met as described. No questions asked.</p></div>
</div></section>

<div class="container"><div class="cta-banner">
  <h2>Stop guessing.<br>Start measuring.</h2>
  <p>Join ${niche.toLowerCase()} professionals who replaced spreadsheets with a dashboard they actually use.</p>
  <a href="#pricing" class="hero-cta">Get your ${cfg.verb} &rarr;</a>
</div></div>

<footer><div class="container">
  <p>&copy; 2026 ${b}. Built for ${niche.toLowerCase()} professionals who want clarity, not complexity.</p>
  <p style="margin-top:8px"><a href="mailto:hello@${slugify(b)}.io">hello@${slugify(b)}.io</a></p>
  <p style="margin-top:8px;font-size:12px"><a href="privacy.html">Privacy Policy</a> &middot; <a href="terms.html">Terms of Service</a></p>
</div></footer>

<script>
(function(){var c=document.getElementById('demoChart');[65,72,58,80,75,90,85,95,88,92,78,100].forEach(function(h){var b=document.createElement('div');b.className='chart-bar';b.style.height=h+'%';c.appendChild(b)})}
)();
document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();var t=document.querySelector(a.getAttribute('href'));if(t)t.scrollIntoView({behavior:'smooth'})})});
</script>
</body></html>`;
}

// ── Template: offer.md ─────────────────────────────────────────────
function genOffer(s, cfg) {
  const b = brandName(s.name);
  const niche = nicheLabel(s.niche);
  const cat = categoryLabel(s.category);
  const desc = s.description || `${cat} setup for ${niche}`;
  return `# ${b}

**${desc}.**

---

## The Problem

${niche} often operate with ${NICHE_PAIN[s.niche] || 'disconnected data across multiple tools'}. This makes it difficult to make informed decisions about growth, operations, and customer satisfaction.

---

## What You Get

**KPI Discovery Session (60 min call)**
We walk through your ${niche.toLowerCase()} operations and define a clear set of metrics that matter for your stage.

**Event Tracking Dictionary**
A complete mapping of every event, property, and segment your dashboard requires. Your team can implement this without guessing.

**Full ${cfg.tools.split(',')[0]} Dashboard (8+ charts)**
A production-ready dashboard connected to your actual data source. Key metrics, trends, and ${niche.toLowerCase()} performance indicators.

**Data Quality Checklist**
A structured checklist for validating that your tracked data is clean, complete, and consistent.

**Monthly Report Template**
A repeatable template for your monthly review. Pulls from the same data as your dashboard.

**Handover Documentation**
Full documentation of every metric definition, data pipeline dependency, and dashboard configuration.

---

## Pricing

| Item | Price |
|------|-------|
| One-time setup (all deliverables above) | $${cfg.price} |
| Monthly maintenance (optional) | $${cfg.monthly}/month |

Payment is processed via Stripe Payment Links.

---

## Delivery Timeline

All deliverables within **5 business days** of payment confirmation.

Day 1-2: KPI Discovery Session, event tracking dictionary.
Day 3-4: Dashboard build and data quality checklist.
Day 5: Report template, handover documentation, final review call.

---

## Refund Policy

Full refund within 7 business days if deliverables are not met as described. No fine print.

---

## What We Do Not Promise

We do not guarantee revenue increases or specific ROI figures. What we deliver is clarity: a working dashboard, clean data definitions, and the ability to make decisions based on evidence.

---

## Support

7 days of post-delivery support is included. Monthly maintenance available at $${cfg.monthly}/month after the support window.

---

## Next Steps

1. Click the payment link and complete checkout.
2. You receive a calendar link for the KPI Discovery Session within 2 hours.
3. We start building your ${cfg.verb} the same day.
`;
}

// ── Template: outreach.md ──────────────────────────────────────────
function genOutreach(s, cfg) {
  const b = brandName(s.name);
  const niche = nicheLabel(s.niche);
  const cat = categoryLabel(s.category);
  const pain = NICHE_PAIN[s.niche] || 'disconnected data across multiple tools';
  return `# ${b} — Outreach Templates

---

## Template 1: Cold Outbound

**Subject line:** Quick question about your ${niche.toLowerCase()} data

Hi [First Name],

I noticed [Company Name] recently [specific observation]. Impressive work for a ${niche.toLowerCase()} at your stage.

Most ${niche.toLowerCase()} teams hit the same wall: ${pain}. Nobody can see the full picture in one place.

${b} builds your first ${cfg.verb} — event tracking, data pipeline, and monthly report — in under two weeks using open-source tools.

Would a 15-minute diagnosis call be worth your time? No pitch deck, no commitment. Just a clear read on where your data gaps are.

Best,
[Your Name]
Founder, ${b}
[Email] | [Phone]

---

## Template 2: Warm Inbound

Hi [First Name],

Thanks for getting back to me. Glad the ${b} approach resonates.

Here is what the engagement covers:

- A metric dictionary mapped to your actual ${niche.toLowerCase()} workflow.
- A working dashboard in ${cfg.tools.split(',')[0]} or similar tool.
- A monthly report template your team can run without analyst involvement.
- Handoff documentation so nothing depends on us after delivery.

Most teams see the first live dashboard within ten days of our kickoff call.

If the timing works, the next step is a 30-minute scoping call. You can book directly here:

[Insert calendar link]

Best,
[Your Name]
Founder, ${b}
[Email] | [Phone]

---

## Template 3: Follow-up (3-5 Days, No Reply)

Hi [First Name],

Circling back once. No pressure — just wanted to share something useful.

We recently helped a ${niche.toLowerCase()} team discover that their key metrics were being tracked inconsistently across three tools. The fix took less than a week once the data was visible.

Happy to do a quick scan of your setup and tell you whether there is a gap worth addressing — 15 minutes, no strings.

If the timing is not right, no worries at all.

Best,
[Your Name]
Founder, ${b}
[Email] | [Phone]
`;
}

// ── Template: delivery_checklist.md ────────────────────────────────
function genChecklist(s, cfg) {
  const b = brandName(s.name);
  const niche = nicheLabel(s.niche);
  const cat = categoryLabel(s.category);
  const tools = cfg.tools;
  return `# ${b} — Delivery Checklist

## Pre-Kickoff (Before Day 1)
- [ ] Payment confirmed
- [ ] Onboarding email sent with calendar link
- [ ] Kickoff call scheduled
- [ ] Welcome packet sent

## KPI Discovery Session (Day 1)
- [ ] 60-minute call completed
- [ ] Key metrics identified (8-12 primary KPIs)
- [ ] Data sources cataloged
- [ ] Event tracking needs documented
- [ ] ${niche}-specific metrics defined

## Event Tracking Dictionary (Day 1-2)
- [ ] Event names defined
- [ ] Event properties specified
- [ ] Naming conventions established
- [ ] Implementation guide written for team

## ${cfg.tools.split(',')[0]} Dashboard Build (Day 2-4)
- [ ] ${cfg.tools.split(',')[0]} instance deployed or connected
- [ ] Data sources connected and verified
- [ ] Primary metric chart configured
- [ ] Growth trend chart configured
- [ ] Conversion funnel chart configured
- [ ] Retention chart configured
- [ ] Performance comparison chart configured
- [ ] Custom ${niche.toLowerCase()} metric chart configured

## Data Quality Validation (Day 4)
- [ ] No duplicate data entries
- [ ] User/entity ID connection verified
- [ ] Date/timezone consistency confirmed
- [ ] Test data excluded
- [ ] All data sources aligned

## Monthly Report Template (Day 4)
- [ ] Report template created
- [ ] Pre-built charts included
- [ ] Export to PDF tested
- [ ] Live share link working

## Handover & Documentation (Day 5)
- [ ] Full documentation package delivered
- [ ] Dashboard walkthrough completed (30 min call)
- [ ] Maintenance guide provided
- [ ] Troubleshooting guide provided
- [ ] Client confirmation of understanding

## Post-Delivery Support (Day 5-12)
- [ ] 7-day support window started
- [ ] Client has support contact info
- [ ] Follow-up check-in at Day 7
`;
}

// ── Template: stripe-setup.md ──────────────────────────────────────
function genStripe(s, cfg) {
  const b = brandName(s.name);
  const cat = categoryLabel(s.category);
  return `# Stripe Payment Links Setup — ${b}

Step-by-step guide to accepting payments for the ${b} service.

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

### Product 1 — ${cat} Setup

1. Go to **Products** > **Add product**.
2. **Name:** \`${cat} Setup\`
3. **Description:** \`Production-ready ${cfg.verb} for your business. Includes KPI discovery, event tracking, 8+ charts, and documentation.\`
4. **Price:** \`$${cfg.price}\` (one-time)
5. Save.

### Product 2 — Monthly Maintenance

1. Go to **Products** > **Add product**.
2. **Name:** \`Monthly Dashboard Maintenance\`
3. **Description:** \`Monthly dashboard adjustments, new chart requests, and priority support.\`
4. **Price:** \`$${cfg.monthly}\` (monthly, recurring)
5. Save.

---

## Step 3: Create Payment Links

1. Go to **Payments** > **Payment Links**.
2. Create link for Product 1 ($${cfg.price} one-time).
3. Create link for Product 2 ($${cfg.monthly}/month recurring).
4. Copy both URLs.

---

## Step 4: Update the Landing Page

1. Open \`index.html\`.
2. Replace \`#stripe-placeholder\` with your Stripe Payment Link URL.
3. Commit, push, deploy.

---

## Step 5: Test

1. Open your live landing page.
2. Click the payment button.
3. Verify Stripe Checkout loads.
4. Test with card: \`4242 4242 4242 4242\`.

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
`;
}

// ── Template: manifest.json ────────────────────────────────────────
function genManifest(s, cfg) {
  const b = brandName(s.name);
  return JSON.stringify({
    serviceNumber: s.id?.replace('svc-', '').padStart(3, '0') || '000',
    sourceServiceId: s.id || '',
    name: s.name,
    brand: b,
    tier: s.tier || 'B',
    score: s.score || 80,
    category: s.category,
    niche: s.niche,
    recommendedChannel: 'web-service',
    platform: { primary: 'Stripe Payment Links' },
    payment: { primary: 'Stripe Payment Links' },
    priceAnchor: `$${cfg.price} setup + $${cfg.monthly}/mo maintenance`,
    currency: 'USD',
    language: 'en',
    targetMarket: 'global',
    weakness: 'Without proper data source quality, reports become number listings.',
    requiredAddition: 'Event dictionary, data quality checklist, monthly report template.',
    deliverables: [
      'KPI Discovery Session (60 min call)',
      'Event Tracking Dictionary',
      `Full ${cfg.tools.split(',')[0]} Dashboard (8+ charts)`,
      'Data Quality Checklist',
      'Monthly Report Template',
      'Handover Documentation',
    ],
    deliveryTimeline: '5 business days',
    refundPolicy: 'Full refund within 7 business days if deliverables are not met as described.',
  }, null, 2) + '\n';
}

// ── Template: privacy.html ─────────────────────────────────────────
function genPrivacy(s, cfg) {
  const b = brandName(s.name);
  const niche = nicheLabel(s.niche);
  const cat = categoryLabel(s.category);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy — ${b}</title>
  <style>
    :root{--bg:#0a0a0a;--surface:#141414;--border:#262626;--text:#e5e5e5;--text-muted:#a3a3a3;--white:#fafafa;--accent:#22c55e}*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;background:var(--bg);color:var(--text);line-height:1.7;-webkit-font-smoothing:antialiased}.container{max-width:720px;margin:0 auto;padding:0 24px}nav{padding:24px 0;border-bottom:1px solid var(--border)}.container nav,.nav{display:flex;justify-content:space-between;align-items:center}.nav-brand{font-weight:700;font-size:18px;color:var(--white);text-decoration:none}.nav-brand span{color:var(--accent)}.nav-back{color:var(--text-muted);text-decoration:none;font-size:14px}h1{font-size:32px;font-weight:800;color:var(--white);margin:48px 0 16px}h2{font-size:20px;font-weight:700;color:var(--white);margin:32px 0 12px}p{font-size:15px;color:var(--text-muted);margin-bottom:16px}ul{margin:0 0 16px 20px}li{font-size:15px;color:var(--text-muted);margin-bottom:8px}.effective{font-size:13px;color:var(--text-muted);margin-bottom:40px}footer{border-top:1px solid var(--border);padding:32px 0;text-align:center;margin-top:60px}footer p{font-size:13px}footer a{color:var(--text-muted);text-decoration:none}
  </style>
</head>
<body>
<nav><div class="container"><a href="index.html" class="nav-brand">${b.split(' ')[0]}<span>${b.split(' ').slice(1).join(' ')}</span></a><a href="index.html" class="nav-back">&larr; Home</a></div></nav>
<div class="container">
  <h1>Privacy Policy</h1>
  <p class="effective">Effective date: June 3, 2026</p>
  <p>${b} ("we") provides ${cfg.verb} setup services for ${niche.toLowerCase()} businesses. This Privacy Policy explains how we handle your information.</p>
  <h2>Information We Collect</h2>
  <ul>
    <li><strong>Contact information:</strong> name, email, company name</li>
    <li><strong>Payment information:</strong> processed by Stripe. We do not store credit card numbers.</li>
    <li><strong>Communication data:</strong> messages you send us</li>
  </ul>
  <h2>How We Use Your Information</h2>
  <ul>
    <li>To deliver the ${cfg.verb} setup service</li>
    <li>To communicate about your project and support</li>
    <li>To process payments and send receipts</li>
  </ul>
  <h2>Data Sharing</h2>
  <p>We do not sell your personal information. We share data only with Stripe for payment processing and service providers who assist in delivery.</p>
  <h2>Your Rights</h2>
  <p>You may access, correct, or delete your personal data by contacting us.</p>
  <h2>Contact</h2>
  <p>Email: <a href="mailto:hello@${slugify(b)}.io" style="color:var(--accent)">hello@${slugify(b)}.io</a></p>
</div>
<footer><div class="container"><p>&copy; 2026 ${b}. <a href="index.html">Home</a> &middot; <a href="terms.html">Terms</a></p></div></footer>
</body></html>`;
}

// ── Template: terms.html ───────────────────────────────────────────
function genTerms(s, cfg) {
  const b = brandName(s.name);
  const niche = nicheLabel(s.niche);
  const cat = categoryLabel(s.category);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Terms of Service — ${b}</title>
  <style>
    :root{--bg:#0a0a0a;--surface:#141414;--border:#262626;--text:#e5e5e5;--text-muted:#a3a3a3;--white:#fafafa;--accent:#22c55e}*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;background:var(--bg);color:var(--text);line-height:1.7;-webkit-font-smoothing:antialiased}.container{max-width:720px;margin:0 auto;padding:0 24px}nav{padding:24px 0;border-bottom:1px solid var(--border)}.container nav,.nav{display:flex;justify-content:space-between;align-items:center}.nav-brand{font-weight:700;font-size:18px;color:var(--white);text-decoration:none}.nav-brand span{color:var(--accent)}.nav-back{color:var(--text-muted);text-decoration:none;font-size:14px}h1{font-size:32px;font-weight:800;color:var(--white);margin:48px 0 16px}h2{font-size:20px;font-weight:700;color:var(--white);margin:32px 0 12px}p{font-size:15px;color:var(--text-muted);margin-bottom:16px}ul{margin:0 0 16px 20px}li{font-size:15px;color:var(--text-muted);margin-bottom:8px}.effective{font-size:13px;color:var(--text-muted);margin-bottom:40px}footer{border-top:1px solid var(--border);padding:32px 0;text-align:center;margin-top:60px}footer p{font-size:13px}footer a{color:var(--text-muted);text-decoration:none}
  </style>
</head>
<body>
<nav><div class="container"><a href="index.html" class="nav-brand">${b.split(' ')[0]}<span>${b.split(' ').slice(1).join(' ')}</span></a><a href="index.html" class="nav-back">&larr; Home</a></div></nav>
<div class="container">
  <h1>Terms of Service</h1>
  <p class="effective">Effective date: June 3, 2026</p>
  <p>By purchasing ${b} services, you agree to these terms.</p>
  <h2>Service Description</h2>
  <p>${b} provides ${cat.toLowerCase()} setup services for ${niche.toLowerCase()} businesses, including KPI discovery, event tracking, ${cfg.tools.split(',')[0]} dashboard configuration, and documentation.</p>
  <h2>Pricing and Payment</h2>
  <ul>
    <li><strong>One-time setup:</strong> $${cfg.price} USD</li>
    <li><strong>Monthly maintenance (optional):</strong> $${cfg.monthly} USD/month</li>
    <li>Payments processed via Stripe. All prices in USD.</li>
  </ul>
  <h2>Refund Policy</h2>
  <p>Full refund within 7 business days if deliverables are not met as described.</p>
  <h2>Delivery Timeline</h2>
  <p>All deliverables within 5 business days of payment confirmation.</p>
  <h2>Limitation of Liability</h2>
  <p>Our liability is limited to the amount you paid for the service.</p>
  <h2>Contact</h2>
  <p>Email: <a href="mailto:hello@${slugify(b)}.io" style="color:var(--accent)">hello@${slugify(b)}.io</a></p>
</div>
<footer><div class="container"><p>&copy; 2026 ${b}. <a href="index.html">Home</a> &middot; <a href="privacy.html">Privacy</a></p></div></footer>
</body></html>`;
}

// ── Template: README.md ────────────────────────────────────────────
function genReadme(s, cfg) {
  const b = brandName(s.name);
  return `# ${b}

${s.description || categoryLabel(s.category) + ' setup for ' + nicheLabel(s.niche)}. Built on open-source tools.

## Files

| File | Purpose |
|------|---------|
| index.html | Landing page |
| offer.md | Service offer |
| outreach.md | Outreach templates |
| delivery_checklist.md | Delivery checklist |
| stripe-setup.md | Stripe setup guide |
| manifest.json | Metadata |
| privacy.html | Privacy policy |
| terms.html | Terms of service |

## Deploy

Push to GitHub Pages or any static host.
`;
}

// ── Main ───────────────────────────────────────────────────────────
function main() {
  console.log('Reading services_480.json...');
  const services = readServices();
  console.log(`Found ${services.length} services.`);

  let success = 0, failed = 0, skipped = 0;

  for (const s of services) {
    const num = s.serviceNumber || s.id?.replace('svc-', '') || String(s.rank || '').padStart(3, '0');
    if (num === '001') { skipped++; continue; } // skip service_001

    const cat = s.category || 'analytics';
    const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.analytics;
    const dirName = s.dirName || `service_${num}_${slugify(s.name)}`;
    const dir = join(BASE, dirName);

    try {
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

      writeFileSync(join(dir, '.nojekyll'), '');
      writeFileSync(join(dir, 'index.html'), genIndex(s, cfg));
      writeFileSync(join(dir, 'offer.md'), genOffer(s, cfg));
      writeFileSync(join(dir, 'outreach.md'), genOutreach(s, cfg));
      writeFileSync(join(dir, 'delivery_checklist.md'), genChecklist(s, cfg));
      writeFileSync(join(dir, 'stripe-setup.md'), genStripe(s, cfg));
      writeFileSync(join(dir, 'manifest.json'), genManifest(s, cfg));
      writeFileSync(join(dir, 'privacy.html'), genPrivacy(s, cfg));
      writeFileSync(join(dir, 'terms.html'), genTerms(s, cfg));
      writeFileSync(join(dir, 'README.md'), genReadme(s, cfg));

      success++;
      if (success % 50 === 0) console.log(`  Progress: ${success} generated...`);
    } catch (err) {
      failed++;
      console.error(`  FAILED: ${num} ${s.name} — ${err.message}`);
    }
  }

  console.log(`\n=== DONE ===`);
  console.log(`Generated: ${success}`);
  console.log(`Skipped (001): ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total files: ${success * 10}`);
}

main();
