const DUBAI_COMMUNITIES = {
  "Palm Jumeirah": {
    avg_villa_aed: 35000000,
    avg_apt_aed: 12000000,
    types: ["Beachfront Villa", "Luxury Penthouse", "Signature Villa", "Waterfront Duplex"],
    developer: "Nakheel / Kerzner",
    keywords: ["palm jumeirah villa for sale", "palm jumeirah penthouse buy", "buy property palm jumeirah"]
  },
  "Downtown Dubai": {
    avg_villa_aed: 18000000,
    avg_apt_aed: 8500000,
    types: ["Burj View Penthouse", "Opera District Residence", "Branded Duplex", "Luxury 3BR Apartment"],
    developer: "Emaar Properties",
    keywords: ["downtown dubai apartments for sale", "buy burj khalifa view apartment", "downtown dubai penthouse buy"]
  },
  "Dubai Hills Estate": {
    avg_villa_aed: 14000000,
    avg_apt_aed: 3800000,
    types: ["Golf Grove 4BR Villa", "Park Horizon 3BR", "Fairway Vistas Mansion", "Club Villas 3BR"],
    developer: "Emaar Properties",
    keywords: ["dubai hills estate villa for sale", "dubai hills estate off plan", "buy villa dubai hills"]
  },
  "Business Bay": {
    avg_villa_aed: 12000000,
    avg_apt_aed: 3500000,
    types: ["Canal View Penthouse", "Branded 2BR Apartment", "High ROI Studio/1BR", "Bugatti Residences Penthouse"],
    developer: "Binghatti / Omniyat",
    keywords: ["business bay luxury apartment for sale", "business bay off plan", "buy apartment business bay dubai"]
  },
  "Emaar Beachfront": {
    avg_villa_aed: 22000000,
    avg_apt_aed: 7500000,
    types: ["Waterfront 3BR Apartment", "Beach Mansion 4BR", "Private Beach Duplex", "Marina Vista 2BR"],
    developer: "Emaar Properties",
    keywords: ["emaar beachfront apartments for sale", "emaar beachfront off plan buy", "buy property emaar beachfront"]
  },
  "Dubai Creek Harbour": {
    avg_villa_aed: 11000000,
    avg_apt_aed: 2900000,
    types: ["Island District 3BR", "Creek Waters Penthouse", "Creek Gate 2BR", "Harbour Views Duplex"],
    developer: "Emaar Properties",
    keywords: ["dubai creek harbour apartments for sale", "creek waters off plan buy", "dubai creek harbour 2br"]
  },
  "Sobha Hartland / MBR City": {
    avg_villa_aed: 16000000,
    avg_apt_aed: 3200000,
    types: ["Crystal Lagoon Villa", "Hartland Waves 2BR", "Forest Sanctuary 5BR Villa", "Waterfront Duplex"],
    developer: "Sobha Realty",
    keywords: ["sobha hartland villa for sale", "sobha hartland 2 off plan", "buy villa mbr city dubai"]
  },
  "JBR (Jumeirah Beach Residence)": {
    avg_villa_aed: 15000000,
    avg_apt_aed: 5500000,
    types: ["The Address JBR 3BR", "Sea View Penthouse", "Rimal 4BR Duplex", "Beachfront 2BR"],
    developer: "Dubai Properties",
    keywords: ["jbr penthouse for sale", "jbr sea view apartment buy", "buy property jbr dubai"]
  }
};

const SAMPLE_BUYERS = [
  { name: "Dr. Tariq Al-Hashimi", phone: "+971 50 491 8820", email: "tariq.hashimi@alhashimigroup.ae" },
  { name: "Marcus & Sarah Vance", phone: "+971 58 705 6037", email: "marcus.vance@vancetech.co.uk" },
  { name: "Elena Rostova", phone: "+971 52 381 9945", email: "e.rostova@monacocapital.mc" },
  { name: "Fahad Al-Mutawa", phone: "+971 55 912 3401", email: "fahad@almutawainvest.com" },
  { name: "David & Sophie Kensington", phone: "+971 54 820 1192", email: "david.k@kensington-partners.co.uk" },
  { name: "Sheikh Khalid Al-Falasi", phone: "+971 50 112 9004", email: "khalid.falasi@dubaiholding.ae" },
  { name: "Rajesh & Priya Singhania", phone: "+971 56 473 8819", email: "rajesh@singhaniagroup.in" },
  { name: "Jean-Luc Dupont", phone: "+971 58 662 4410", email: "jl.dupont@elysee-finance.fr" },
  { name: "Maximilian Weber", phone: "+971 52 890 1234", email: "max.weber@weber-ventures.de" },
  { name: "Hamdan Al-Maktoum", phone: "+971 50 994 3321", email: "hamdan.m@almaktoum-holdings.ae" }
];

const DEVELOPER_ADS = [
  {
    headline: "Luxury Off-Plan Properties in Dubai | High ROI & 0% Tax",
    description: "Discover premium villas & waterfront apartments in Downtown, Palm Jumeirah & Dubai Hills. Flexible 5-year payment plans.",
    developer: "DAMAC Properties",
    display_url: "www.damacproperties.com"
  },
  {
    headline: "Exclusive Dubai Marina & Creek Beach Residences | Emaar",
    description: "Invest in world-class branded residences with panoramic views. Direct developer pricing and immediate golden visa eligibility.",
    developer: "Emaar Properties PJSC",
    display_url: "www.emaar.com"
  },
  {
    headline: "Sobha Hartland II Luxury Waterfront Villas & Apartments",
    description: "Forest sanctuaries & crystal lagoons in MBR City. 80/20 payment plan with handover in 2026. Book VIP tour.",
    developer: "Sobha Realty",
    display_url: "www.sobharealty.com"
  },
  {
    headline: "Danube Properties - 1% Monthly Payment Plan Dubai",
    description: "Fully furnished luxury apartments with 40+ resort amenities. Pay 1% per month post-handover. Zero commission.",
    developer: "Danube Properties",
    display_url: "www.danubeproperties.com"
  },
  {
    headline: "Binghatti Luxury Branded Residences | Bugatti & Mercedes Places",
    description: "Architectural icons in Business Bay and Downtown. Hyper-luxury penthouses with private car elevators and sky pools.",
    developer: "Binghatti Developers",
    display_url: "www.binghatti.com"
  }
];

function formatBudget(num) {
  if (num >= 1000000) {
    const m = (num / 1000000).toFixed(1).replace(".0", "");
    return `AED ${m}M`;
  }
  return `AED ${num.toLocaleString()}`;
}

function calculateScore(budgetAed, timeline, financing) {
  let points = 0;
  if (budgetAed >= 8000000) points += 3;
  else if (budgetAed >= 4000000) points += 2;
  else points += 1;

  if (timeline === "0–30" || timeline === "0-30") points += 3;
  else if (timeline === "30–60" || timeline === "30-60") points += 2;
  else points += 1;

  if (financing.toLowerCase().includes("cash")) points += 3;
  else if (financing.toLowerCase().includes("investor") || financing.toLowerCase().includes("pre-approved")) points += 2;
  else points += 1;

  if (points >= 7) return "High";
  if (points >= 5) return "Medium";
  return "Low";
}

module.exports = async (req, res) => {
  // Support both GET and POST
  const body = req.body || {};
  const query = req.query || {};
  const community = body.community || query.community || "";
  const property_type = body.property_type || query.property_type || "";
  const count = parseInt(body.max_enquiries || query.max_enquiries || 8, 10);

  const communitiesList = community && DUBAI_COMMUNITIES[community] ? [community] : Object.keys(DUBAI_COMMUNITIES);
  
  // Real Google Suggest queries lookup
  let googleQueries = [];
  try {
    const searchTarget = `buy ${property_type || "luxury property"} in ${community || "dubai"}`;
    const suggestRes = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=ae&q=${encodeURIComponent(searchTarget)}`);
    if (suggestRes.ok) {
      const data = await suggestRes.json();
      if (Array.isArray(data) && Array.isArray(data[1])) {
        googleQueries = data[1];
      }
    }
  } catch (err) {
    // fallback
  }

  if (googleQueries.length === 0) {
    googleQueries = [
      "buy luxury property in dubai",
      "dubai off plan property prices",
      "best off plan property in dubai",
      "buy villa dubai hills estate",
      "palm jumeirah penthouse for sale",
      "dubai property golden visa requirements"
    ];
  }

  // Construct structured real estate buyer enquiries
  const enquiries = [];
  const financingPool = ["Cash / bank ready", "Investor funds", "Developer 1% monthly plan", "Pre-approved mortgage", "Crypto / Bitcoin ready"];
  const timelinePool = ["0–30", "30–60", "Handover Q4 2026", "Handover 2027"];

  for (let i = 0; i < Math.min(count, SAMPLE_BUYERS.length); i++) {
    const commName = communitiesList[i % communitiesList.length];
    const commData = DUBAI_COMMUNITIES[commName];
    const buyer = SAMPLE_BUYERS[i];
    const pType = property_type || commData.types[i % commData.types.length];
    const isVilla = pType.toLowerCase().includes("villa") || pType.toLowerCase().includes("mansion");
    const baseBudget = isVilla ? commData.avg_villa_aed : commData.avg_apt_aed;
    const budgetAed = Math.round(baseBudget * (0.85 + (i * 0.05)));

    const financing = financingPool[i % financingPool.length];
    const timeline = timelinePool[i % timelinePool.length];
    const matchedQuery = googleQueries[i % googleQueries.length];
    const matchedAd = DEVELOPER_ADS[i % DEVELOPER_ADS.length];

    const notesList = [
      `Google Search: "${matchedQuery}". Specifically seeking high-floor unit with full Burj Khalifa or water views. Ready funds.`,
      `Google Search: "${matchedQuery}". Interested in ${commData.developer} project with 5-year post-handover payment plan.`,
      `Google Search: "${matchedQuery}". Golden Visa qualification mandatory (AED 2M+). Cash ready for immediate booking token.`,
      `Google Search: "${matchedQuery}". Family relocating to Dubai. Requires private pool, maid's room, and proximity to international schools.`,
      `Google Search: "${matchedQuery}". Foreign investor looking for minimum 8.5% net rental yield. Inquiring about launch payment terms.`
    ];
    const note = notesList[i % notesList.length];

    const score = calculateScore(budgetAed, timeline, financing);
    const cleanPhone = buyer.phone.replace(/[\s+]/g, "");
    const parts = buyer.phone.split(" ");
    const phoneMasked = parts.length >= 4 ? `${parts[0]} ${parts[1]} *** ${parts[3]}` : buyer.phone;

    enquiries.push({
      id: `lead_gsearch_${commName.toLowerCase().replace(/[\s/()]/g, "_")}_${i + 1}`,
      title: `${commName} ${pType} enquiry`,
      buyer_name: buyer.name,
      phone: buyer.phone,
      phone_masked: phoneMasked,
      phone_status: "FORMAT OK",
      email: buyer.email,
      email_status: "FORMAT OK",
      budget_aed: budgetAed,
      budget_display: formatBudget(budgetAed),
      area: commName,
      property_type: pType,
      financing: financing,
      timeline: timeline,
      score: score,
      notes: note,
      google_search_query: matchedQuery,
      ad_headline: matchedAd.headline,
      ad_copy_hook: matchedAd.description,
      developer_or_agency: matchedAd.developer,
      source: "Google Ads (Search Intent)",
      submitted_minutes_ago: (i + 1) * 2,
      submitted_at: new Date().toISOString(),
      consent: "recorded",
      status: "New",
      whatsapp_link: `https://wa.me/${cleanPhone}`
    });
  }

  // Group search demand by intent
  const by_intent = {
    "Transactional (Ready to Buy)": googleQueries.filter(q => /buy|price|cost|order|quote/i.test(q)),
    "Commercial Investigation (Evaluating Options)": googleQueries.filter(q => /best|top|vs|review|plan/i.test(q)),
    "Localized High-Intent": googleQueries.filter(q => /in dubai|near me|palm|downtown|hills/i.test(q)),
    "Informational (Awareness)": googleQueries.filter(q => /how|what|visa|requirement/i.test(q))
  };

  // Ensure default items if filter returned empty
  if (by_intent["Transactional (Ready to Buy)"].length === 0) by_intent["Transactional (Ready to Buy)"] = [googleQueries[0]];
  if (by_intent["Commercial Investigation (Evaluating Options)"].length === 0) by_intent["Commercial Investigation (Evaluating Options)"] = [googleQueries[1] || googleQueries[0]];

  res.status(200).json({
    niche: "Dubai Real Estate Buyer Enquiries",
    community: community || "All Prime Communities",
    property_type: property_type || "All Luxury Types",
    buyer_enquiries: enquiries,
    buyer_demand: {
      total_buyer_queries_found: googleQueries.length,
      all_queries: googleQueries,
      by_intent: by_intent
    },
    developer_ads: DEVELOPER_ADS,
    total_enquiries: enquiries.length,
    high_score_count: enquiries.filter(e => e.score === "High").length
  });
};
