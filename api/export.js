module.exports = (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { enquiries = [] } = req.body || {};
  const headers = [
    "Title", "Buyer Name", "Phone", "Email", "Budget AED", "Budget Display",
    "Area", "Property Type", "Financing", "Timeline", "Score", "Inquiry Notes",
    "WhatsApp Link", "Google Search Query", "Developer/Agency", "Source"
  ];

  let csvContent = headers.join(",") + "\n";

  enquiries.forEach(e => {
    const row = [
      `"${(e.title || "").replace(/"/g, '""')}"`,
      `"${(e.buyer_name || "").replace(/"/g, '""')}"`,
      `"${e.phone || ""}"`,
      `"${e.email || ""}"`,
      e.budget_aed || 0,
      `"${e.budget_display || ""}"`,
      `"${e.area || ""}"`,
      `"${e.property_type || ""}"`,
      `"${e.financing || ""}"`,
      `"${e.timeline || ""}"`,
      `"${e.score || ""}"`,
      `"${(e.notes || "").replace(/"/g, '""')}"`,
      `"${e.whatsapp_link || ""}"`,
      `"${(e.google_search_query || "").replace(/"/g, '""')}"`,
      `"${e.developer_or_agency || ""}"`,
      `"${e.source || "Google Ads"}"`
    ];
    csvContent += row.join(",") + "\n";
  });

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=realestate_buyer_enquiries.csv");
  res.status(200).send(csvContent);
};
