module.exports = (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "ai-buyer",
    platform: "Vercel Serverless",
    timestamp: new Date().toISOString()
  });
};
