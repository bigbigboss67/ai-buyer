# AI Buyer (ai-buyer)

> **Real Estate Buyer Enquiry & Google Search Intent Intelligence Engine**

An AI-driven platform that uncovers **what property buyers are actively searching for in Google**, extracts active **developer sponsored ad campaigns**, and structures high-intent **buyer inquiries** with verified contact details, budgets, financing status, and 1-click WhatsApp communication.

---

## 🌟 Key Capabilities

1. **Google Search Buyer Intent Mining:**
   - Real-time Google Autocomplete & Suggest integration.
   - Categorizes queries into *Transactional (Ready to Buy)*, *Commercial Investigation*, *Localized High-Intent*, and *Golden Visa / Buyer Questions*.

2. **Real Estate Buyer Enquiry Profiles:**
   - Pre-configured price benchmarks and project matrices for prime Dubai communities:
     - **Palm Jumeirah** (Beachfront Villas & Waterfront Duplexes)
     - **Downtown Dubai** (Burj Khalifa Penthouses & Opera District)
     - **Dubai Hills Estate** (Golf Grove Villas & Off-Plan 3BRs)
     - **Business Bay** (Canal Towers & Branded Bugatti/Mercedes Residences)
     - **Emaar Beachfront**, **Dubai Creek Harbour**, **Sobha Hartland (MBR City)**, and **JBR**.
   - 6-Matrix Lead Data:
     - 📞 **Phone** (UAE `+971 5X...` format with privacy mask / reveal toggle)
     - ✉️ **Email**
     - 💰 **Budget** (`AED 29.8M`, `AED 14.5M`, `AED 9.2M`, etc.)
     - 📍 **Community & Property Type**
     - 💳 **Financing Readiness** (Cash ready, 1% monthly plan, Pre-approved mortgage, Crypto)
     - ⏱️ **Timeline** (0–30 days, Handover Q4 2026, 2027)
     - 📝 **Inquiry Notes & Search Trigger**

3. **1-Click Communication & CRM Export:**
   - Direct 1-Click WhatsApp launch (`wa.me/+971...`).
   - One-click CSV and JSON export.
   - Ready for integration with CRM webhooks or the UAE Lead Desk portal.

---

## 🚀 Deployment & Local Setup

### Deploy on Vercel
This project is configured out-of-the-box for **Vercel Serverless**:
```bash
vercel --prod
```

### Run Locally
```bash
npm start
```
Then visit **`http://localhost:3000`** in your browser.

---

## 📡 Serverless API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/enquiries` | `GET`, `POST` | Mine real estate buyer inquiries (`community`, `property_type`, `max_enquiries`) |
| `/api/search-demand` | `GET`, `POST` | Query Google Autocomplete for buyer search terms across niches |
| `/api/export` | `POST` | Convert buyer inquiries into CRM-ready CSV file |
| `/api/status` | `GET` | API health status |

---

## 📄 License
MIT © bigbigboss67
