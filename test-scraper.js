const handler = require('./api/live-scraper.js');

const req = { method: 'GET', query: {} };
const res = {
  setHeader: () => {},
  status: (code) => ({
    json: (data) => {
      console.log('HTTP STATUS:', code);
      console.log('STATUS:', data.status);
      console.log('MESSAGE:', data.message);
    }
  })
};

handler(req, res);
