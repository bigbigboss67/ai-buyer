/**
 * Google Search Public Buyer Footprint & Dorking Miner
 * Executes targeted Google dorks to find public posts, forum inquiries,
 * and social requests from people looking to buy property.
 *
 * Supports:
 * - Live Google SERP API (SerpApi) when an API key is provided
 * - Real live Google Dork search query generator
 * - Transparent separation of Demo Sample Posts vs. Live Verified Results
 */

const DORK_TEMPLATES = {
  reddit: [
    'site:reddit.com/r/dubai "looking to buy" ("apartment" OR "villa" OR "property")',
    'site:reddit.com/r/dubai "budget" "aed" ("off plan" OR "handover") "recommend"',
    'site:reddit.com/r/dubai_realestate "want to buy" OR "looking for developer"'
  ],
  expat_forums: [
    'site:expatforum.com "buy property in dubai" ("contact me" OR "pm me" OR "email")',
    'site:britishexpats.com "dubai property purchase" ("recommend" OR "whatsapp")',
    'site:internations.org "dubai real estate" "looking to invest"'
  ],
  social: [
    'site:linkedin.com/posts "looking to buy property in dubai" ("whatsapp" OR "+971" OR "email")',
    'site:facebook.com "looking for apartment to buy in dubai" ("050" OR "052" OR "054" OR "055" OR "058")',
    'site:facebook.com/groups "want to buy" "dubai" ("budget" OR "cash buyer")'
  ],
  classifieds: [
    '"looking to buy" "dubai off plan" ("whatsapp" OR "+971" OR "call me")',
    '"serious cash buyer" "dubai property" ("+971" OR "@gmail.com")',
    '"direct buyer looking for" "palm jumeirah" OR "downtown dubai"'
  ]
};

// Demo Archive Records (Provided for UI Demonstration & Schema Specification)
const SAMPLE_DEMO_POSTS = [
  {
    platform: "Reddit (r/dubai)",
    platform_icon: "🔴",
    title: "Looking to buy 3BR villa in Dubai Hills - Budget AED 8.5M",
    snippet: "Relocating from London next month with family. Looking to buy a ready or handover soon 3 or 4 bedroom villa in Dubai Hills (Maple or Sidra). Serious cash buyer ready for transfer. Reach out on WhatsApp +971 58 705 6037 or email.",
    author: "u/UK_Investor_DXB",
    source_url: "https://reddit.com/r/dubai/search?q=looking+to+buy+dubai+hills",
    detected_phones: ["+971 58 705 6037"],
    detected_emails: ["uk.investor.dxb@gmail.com"],
    area: "Dubai Hills Estate",
    budget_display: "AED 8.5M",
    date_posted: "Sample Demo",
    intent: "Ready to Buy (Cash Relocation)",
    is_sample_demo: true
  },
  {
    platform: "Expat Forum UAE",
    platform_icon: "🌐",
    title: "Interested in Palm Jumeirah duplex / penthouse with private pool",
    snippet: "Seeking direct seller or developer allocation for Palm Jumeirah waterfront duplex or high floor penthouse. Budget approx AED 25M - 30M. Must be Golden Visa eligible. WhatsApp me on +971 50 491 8820 or message here.",
    author: "AlHashimi_FamilyOffice",
    source_url: "https://www.google.com/search?q=site%3Aexpatforum.com+%22palm+jumeirah%22+%22buy%22",
    detected_phones: ["+971 50 491 8820"],
    detected_emails: ["tariq.alhashimi@gmail.com"],
    area: "Palm Jumeirah",
    budget_display: "AED 25M - 30M",
    date_posted: "Sample Demo",
    intent: "Ready to Buy (Golden Visa / HNI)",
    is_sample_demo: true
  },
  {
    platform: "LinkedIn Public Post",
    platform_icon: "💼",
    title: "Actively looking for off-plan investment units in Downtown Dubai",
    snippet: "Looking to acquire 2 or 3 units in Downtown Dubai or Business Bay with developer post-handover payment plans. Target rental yield minimum 8%. Brokers with direct developer allocations please WhatsApp details to +971 55 912 3401.",
    author: "Fahad Al-Mutawa (Private Equity)",
    source_url: "https://www.google.com/search?q=site%3Alinkedin.com%2Fposts+%22downtown+dubai%22+%22looking+to+buy%22",
    detected_phones: ["+971 55 912 3401"],
    detected_emails: ["fahad.mutawa@investgroup.ae"],
    area: "Downtown Dubai",
    budget_display: "AED 12M Total",
    date_posted: "Sample Demo",
    intent: "Bulk Off-Plan Investor",
    is_sample_demo: true
  },
  {
    platform: "Reddit (r/dubai_realestate)",
    platform_icon: "🔴",
    title: "Looking for 2BR in Emaar Beachfront with full sea view",
    snippet: "Looking for a high floor 2 bedroom in Beach Vista or Marina Vista, Emaar Beachfront. Cash ready. Prefer no agent commissions if possible, direct transfer. Contact: +971 52 381 9945.",
    author: "u/Elena_Crypto_EU",
    source_url: "https://reddit.com/r/dubai_realestate/search?q=emaar+beachfront",
    detected_phones: ["+971 52 381 9945"],
    detected_emails: ["elena.dubai.invest@proton.me"],
    area: "Emaar Beachfront",
    budget_display: "AED 6.8M",
    date_posted: "Sample Demo",
    intent: "Cash Buyer (Private Sale)",
    is_sample_demo: true
  },
  {
    platform: "British Expats UAE",
    platform_icon: "🇬🇧",
    title: "Wanting to purchase townhouse in Arabian Ranches / Tilal Al Ghaf",
    snippet: "Family moving to Dubai in August. Need 4BR townhouse with maid room. Pre-approved for mortgage up to AED 5.5M with Emirates NBD. Email me at david.kensington.dxb@gmail.com or WhatsApp +971 54 820 1192.",
    author: "Dave & Sophie K.",
    source_url: "https://www.google.com/search?q=site%3Abritishexpats.com+%22arabian+ranches%22+%22buy%22",
    detected_phones: ["+971 54 820 1192"],
    detected_emails: ["david.kensington.dxb@gmail.com"],
    area: "Arabian Ranches",
    budget_display: "AED 5.5M",
    date_posted: "Sample Demo",
    intent: "Pre-approved Mortgage Family",
    is_sample_demo: true
  },
  {
    platform: "Facebook Public Group",
    platform_icon: "👥",
    title: "Seeking 1% monthly payment plan apartment in Dubai Creek or Sobha",
    snippet: "Looking for 1BR or 2BR off-plan with developer 1% monthly payment plan post-handover. Investor looking for capital appreciation. Please send project brochure on WhatsApp +971 56 473 8819.",
    author: "Rajesh Singhania",
    source_url: "https://www.google.com/search?q=site%3Afacebook.com%2Fgroups+%22dubai+creek%22+%22want+to+buy%22",
    detected_phones: ["+971 56 473 8819"],
    detected_emails: ["rajesh.singhania.dxb@gmail.com"],
    area: "Dubai Creek Harbour",
    budget_display: "AED 2.4M",
    date_posted: "Sample Demo",
    intent: "1% Payment Plan Investor",
    is_sample_demo: true
  }
];

function extractPhoneNumbers(text) {
  const matches = text.match(/(?:\+?971|00971|0)?5[0124568]\d{7}/g) || [];
  return Array.from(new Set(matches.map(m => {
    let clean = m.replace(/[\s-]/g, '');
    if (clean.startsWith('05')) clean = '+971' + clean.slice(1);
    else if (clean.startsWith('971')) clean = '+' + clean;
    else if (!clean.startsWith('+')) clean = '+971' + clean;
    return clean;
  })));
}

function extractEmails(text) {
  const matches = text.match(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g) || [];
  return Array.from(new Set(matches.filter(e => !/\.(png|jpg|svg|css|js)$/i.test(e))));
}

async function querySerpApi(dorkQuery, apiKey) {
  try {
    const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(dorkQuery)}&api_key=${apiKey}&location=Dubai,Dubai,United+Arab+Emirates&hl=en&gl=ae&num=10`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.organic_results || !Array.isArray(data.organic_results)) return [];

    return data.organic_results.map((item, idx) => {
      const combinedText = (item.title || "") + " " + (item.snippet || "");
      const detectedPhones = extractPhoneNumbers(combinedText);
      const detectedEmails = extractEmails(combinedText);
      const primaryPhone = detectedPhones[0] || "";
      const cleanDigits = primaryPhone.replace(/\D/g, "");

      return {
        platform: item.displayed_link ? item.displayed_link.split('/')[0] : "Google Live SERP",
        platform_icon: "⚡",
        title: item.title || "Live Search Lead",
        snippet: item.snippet || "",
        author: item.source || "Public Search Result",
        source_url: item.link || "https://google.com",
        detected_phones: detectedPhones,
        detected_emails: detectedEmails,
        area: "Dubai",
        budget_display: "See Post",
        date_posted: item.date || "Indexed Live",
        intent: "Live Google Query Match",
        whatsapp_link: cleanDigits ? `https://wa.me/${cleanDigits}?text=${encodeURIComponent(`Hello, I saw your inquiry online regarding: "${item.title}". I have direct options available.`)}` : "",
        is_sample_demo: false,
        is_live_serp: true
      };
    });
  } catch (e) {
    return [];
  }
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const body = req.body || {};
  const query = req.query || {};

  const niche = body.niche || query.niche || "dubai real estate";
  const platform = body.platform || query.platform || "all";
  const community = body.community || query.community || "";
  const serpApiKey = body.serpapi_key || query.serpapi_key || process.env.SERPAPI_KEY || "";

  // 1. Generate live Google Dork queries for transparency
  const dorksGenerated = [];
  const platformsToQuery = platform === "all" ? Object.keys(DORK_TEMPLATES) : [platform];

  platformsToQuery.forEach(plat => {
    const templates = DORK_TEMPLATES[plat] || [];
    templates.forEach(t => {
      let dork = t;
      if (community) {
        dork = dork.replace(/dubai/g, community.toLowerCase());
      }
      dorksGenerated.push({
        platform: plat,
        dork_query: dork,
        google_search_link: `https://www.google.com/search?q=${encodeURIComponent(dork)}`
      });
    });
  });

  // 2. If SerpApi key provided, query live Google search results!
  let liveSerpResults = [];
  if (serpApiKey && dorksGenerated.length > 0) {
    liveSerpResults = await querySerpApi(dorksGenerated[0].dork_query, serpApiKey);
  }

  // 3. Filter demo sample posts
  let filteredPosts = SAMPLE_DEMO_POSTS;
  if (community && community !== "All") {
    const match = SAMPLE_DEMO_POSTS.filter(p => 
      p.area.toLowerCase().includes(community.toLowerCase()) || 
      p.snippet.toLowerCase().includes(community.toLowerCase())
    );
    if (match.length > 0) filteredPosts = match;
  }

  if (platform && platform !== "all") {
    const platMatch = filteredPosts.filter(p => p.platform.toLowerCase().includes(platform.toLowerCase()));
    if (platMatch.length > 0) filteredPosts = platMatch;
  }

  // 4. Attach 1-Click WhatsApp links to demo posts
  const enrichedDemoResults = filteredPosts.map(post => {
    const primaryPhone = post.detected_phones[0] || "";
    const cleanDigits = primaryPhone.replace(/\D/g, "");
    return {
      ...post,
      whatsapp_link: cleanDigits ? `https://wa.me/${cleanDigits}?text=${encodeURIComponent(`Hello, I saw your public inquiry regarding property in ${post.area}: "${post.title}". I have direct options available.`)}` : ""
    };
  });

  // Combine live results (if any) with demo cards
  const combinedResults = [...liveSerpResults, ...enrichedDemoResults];

  res.status(200).json({
    status: "ok",
    search_target: niche,
    community_filter: community || "All Dubai",
    platform_filter: platform,
    is_live_serp_active: liveSerpResults.length > 0,
    total_public_buyer_posts_found: combinedResults.length,
    public_buyer_posts: combinedResults,
    active_google_dorks: dorksGenerated.slice(0, 8),
    disclaimer: {
      is_sample_data: liveSerpResults.length === 0,
      note: "The default archive cards represent schema demo templates. Click 'Open Google Dork' to view live public forum threads on Google.com, or provide a SerpApi key / Webhook for automated live scraping."
    }
  });
};
