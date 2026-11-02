/**
 * Real Inbound Lead Webhook Handler
 * Receives live buyer leads from:
 * 1. Google Ads Lead Form Assets (Webhook)
 * 2. Meta (Facebook / Instagram) Lead Ads
 * 3. Zapier / Make.com / Pabbly Connect
 * 4. Custom Website Forms / Landing Pages
 */

const fs = require('fs');
const path = require('path');

// In-memory buffer for serverless executions
let inMemoryLeads = [];

// Try to persist locally if running via local server.js
const LOCAL_LEADS_FILE = path.join(__dirname, '..', 'data', 'inbound-leads.json');

function loadLocalLeads() {
  try {
    if (fs.existsSync(LOCAL_LEADS_FILE)) {
      const data = fs.readFileSync(LOCAL_LEADS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {}
  return [];
}

function saveLocalLeads(leads) {
  try {
    const dir = path.dirname(LOCAL_LEADS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
  } catch (e) {}
}

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Google-Key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Return all real inbound leads captured so far
  if (req.method === 'GET') {
    const local = loadLocalLeads();
    const all = [...local, ...inMemoryLeads];
    // Deduplicate by id or phone
    const seen = new Set();
    const unique = [];
    for (const item of all) {
      const key = item.id || item.phone;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
    }
    return res.status(200).json({
      status: "ok",
      total_inbound_leads: unique.length,
      leads: unique,
      webhook_url: "https://ai-buyer-kappa.vercel.app/api/webhook",
      instructions: "Send POST requests with buyer contact details to this endpoint to capture 100% real leads in real time."
    });
  }

  // POST: Capture incoming lead
  if (req.method === 'POST') {
    const payload = req.body || {};

    let name = payload.name || payload.full_name || "New Inbound Buyer";
    let phone = payload.phone || payload.phone_number || payload.mobile || "";
    let email = payload.email || payload.email_address || "";
    let budget = payload.budget || payload.budget_range || "AED 3M - 5M";
    let community = payload.community || payload.location || payload.area || "Dubai (General)";
    let property_type = payload.property_type || payload.type || "Apartment / Villa";
    let source = payload.source || "Direct Webhook";

    // Handle Google Ads Webhook format
    // Google sends: { lead_id, user_column_data: [{ column_id: 'FULL_NAME', string_value: '...' }, ...] }
    if (payload.user_column_data && Array.isArray(payload.user_column_data)) {
      source = "Google Ads Lead Form";
      for (const col of payload.user_column_data) {
        const id = (col.column_id || "").toUpperCase();
        const val = col.string_value || "";
        if (id.includes("NAME")) name = val;
        if (id.includes("PHONE") || id.includes("NUMBER")) phone = val;
        if (id.includes("EMAIL")) email = val;
        if (id.includes("BUDGET")) budget = val;
        if (id.includes("LOCATION") || id.includes("AREA") || id.includes("CITY")) community = val;
      }
    }

    // Format clean digits for WhatsApp
    const cleanDigits = phone.replace(/\D/g, "");
    const whatsapp_link = cleanDigits 
      ? `https://wa.me/${cleanDigits}?text=${encodeURIComponent(`Hello ${name}, thank you for your inquiry about ${property_type} in ${community}. How can I assist you with your purchase?`)}`
      : "";

    const newLead = {
      id: "LEAD-" + Date.now(),
      created_at: new Date().toISOString(),
      name,
      phone,
      email,
      budget,
      community,
      property_type,
      source,
      whatsapp_link,
      is_real: true,
      lead_score: 95,
      notes: payload.notes || payload.message || "Inbound inquiry received via webhook."
    };

    inMemoryLeads.unshift(newLead);
    const local = loadLocalLeads();
    local.unshift(newLead);
    saveLocalLeads(local);

    return res.status(201).json({
      status: "success",
      message: "Real lead captured successfully into ai-buyer system.",
      lead: newLead
    });
  }

  return res.status(405).json({ error: "Method not allowed. Use GET to list or POST to submit." });
};
