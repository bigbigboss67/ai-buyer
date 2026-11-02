module.exports = async (req, res) => {
  const query = req.query.q || req.body?.q || "buy property in dubai";
  const country = req.query.gl || req.body?.gl || "ae";
  const lang = req.query.hl || req.body?.hl || "en";

  try {
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=${lang}&gl=${country}&q=${encodeURIComponent(query)}`;
    const resp = await fetch(url);
    if (!resp.ok) {
      return res.status(500).json({ error: "Failed to fetch Google suggestions" });
    }
    const data = await resp.json();
    const suggestions = Array.isArray(data[1]) ? data[1] : [];

    const classified = suggestions.map(s => {
      let intent = "General Commercial";
      if (/buy|price|cost|order|hire|quote|cheap/i.test(s)) {
        intent = "Transactional (Ready to Buy)";
      } else if (/best|top|vs|comparison|review/i.test(s)) {
        intent = "Commercial Investigation";
      } else if (/how|what|why|guide/i.test(s)) {
        intent = "Informational";
      } else if (/near me|in dubai|local/i.test(s)) {
        intent = "Localized High-Intent";
      }
      return { query: s, intent };
    });

    res.status(200).json({
      query,
      country,
      total: suggestions.length,
      suggestions: classified
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
