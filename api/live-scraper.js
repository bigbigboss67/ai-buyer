/**
 * Real Live Web Scraper Engine (SerpApi & Apify Integration)
 * ZERO dummy data. ZERO synthetic records.
 * Only connects to real live APIs and returns genuine search results.
 */

const https = require('https');

// Helper to extract UAE phone numbers from real text
function extractUAEPhones(text) {
  if (!text) return [];
  const matches = text.match(/(?:\+971|00971|971|0)?\s*5[0124568]\d{1}[\s-]?\d{3}[\s-]?\d{3}/g) || [];
  return Array.from(new Set(matches.map(m => {
    let clean = m.replace(/[\s-]/g, '');
    if (clean.startsWith('05')) clean = '+971' + clean.slice(1);
    else if (clean.startsWith('971')) clean = '+' + clean;
    else if (!clean.startsWith('+')) clean = '+971' + clean;
    return clean;
  })));
}

// Helper to extract emails from real text
function extractEmails(text) {
  if (!text) return [];
  const matches = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
  return Array.from(new Set(matches.filter(e => !/\.(png|jpg|svg|css|js|webp)$/i.test(e))));
}

// Query SerpApi (Google Search Engine)
async function querySerpApi(query, apiKey) {
  const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&location=Dubai,+Dubai,+United+Arab+Emirates&gl=ae&hl=en&num=15&api_key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  const organic = data.organic_results || [];
  return organic.map(item => {
    const combinedText = (item.title || '') + ' ' + (item.snippet || '');
    const phones = extractUAEPhones(combinedText);
    const emails = extractEmails(combinedText);
    const primaryPhone = phones[0] || '';
    const cleanDigits = primaryPhone.replace(/\D/g, '');

    return {
      title: item.title,
      link: item.link,
      displayed_link: item.displayed_link || item.link,
      snippet: item.snippet || '',
      date: item.date || 'Indexed recently',
      detected_phones: phones,
      detected_emails: emails,
      source: item.source || (item.link ? new URL(item.link).hostname : 'Google Web'),
      whatsapp_link: cleanDigits ? `https://wa.me/${cleanDigits}` : null,
      is_live_result: true
    };
  });
}

// Query Apify (Google Search Scraper Actor)
async function queryApify(query, apiToken) {
  const url = `https://api.apify.com/v2/acts/apify~google-search-scraper/run-sync-get-dataset-items?token=${apiToken}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      queries: query,
      maxPagesPerQuery: 1,
      resultsPerPage: 15,
      countryCode: 'ae',
      languageCode: 'en'
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Apify request failed (${response.status}): ${errText}`);
  }

  const items = await response.json();
  const results = [];

  if (Array.isArray(items)) {
    for (const page of items) {
      const organic = page.organicResults || [];
      for (const item of organic) {
        const combinedText = (item.title || '') + ' ' + (item.description || '');
        const phones = extractUAEPhones(combinedText);
        const emails = extractEmails(combinedText);
        const primaryPhone = phones[0] || '';
        const cleanDigits = primaryPhone.replace(/\D/g, '');

        results.push({
          title: item.title,
          link: item.url,
          displayed_link: item.displayedUrl || item.url,
          snippet: item.description || '',
          date: item.emphasizedKeywords ? item.emphasizedKeywords.join(', ') : 'Live Crawl',
          detected_phones: phones,
          detected_emails: emails,
          source: item.url ? new URL(item.url).hostname : 'Web',
          whatsapp_link: cleanDigits ? `https://wa.me/${cleanDigits}` : null,
          is_live_result: true
        });
      }
    }
  }

  return results;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const body = req.method === 'POST' ? req.body || {} : req.query || {};

  const provider = (body.provider || 'serpapi').toLowerCase();
  const apiKey = body.api_key || (provider === 'apify' ? process.env.APIFY_TOKEN : process.env.SERPAPI_KEY) || '';
  const query = body.query || 'site:reddit.com/r/dubairealestate "looking to buy" OR "budget"';

  // If no API key provided, instruct user how to add their key
  if (!apiKey) {
    return res.status(200).json({
      status: "needs_key",
      provider,
      query,
      message: `No ${provider === 'apify' ? 'Apify Token' : 'SerpApi Key'} provided. Enter your API key in the portal or set ${provider === 'apify' ? 'APIFY_TOKEN' : 'SERPAPI_KEY'} in your environment variables to fetch 100% live Google search data.`,
      free_signup_url: provider === 'apify' ? 'https://apify.com' : 'https://serpapi.com',
      total_results: 0,
      results: []
    });
  }

  try {
    let results = [];
    if (provider === 'apify') {
      results = await queryApify(query, apiKey);
    } else {
      results = await querySerpApi(query, apiKey);
    }

    return res.status(200).json({
      status: "success",
      provider,
      query,
      total_results: results.length,
      results,
      executed_at: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      provider,
      query,
      error: error.message || "Failed to execute live scraping query.",
      results: []
    });
  }
};
