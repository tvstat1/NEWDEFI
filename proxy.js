const http = require("http");
const https = require("https");
const PORT = process.env.PORT || 3001;
const DEBANK_HOST = "pro-openapi.debank.com";
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "AccessKey, Content-Type");
  if (req.method === "OPTIONS") { res.writeHead(200); res.end(); return; }
  const accessKey = req.headers["accesskey"];
  if (!accessKey) { res.writeHead(400); res.end(JSON.stringify({ error: "Missing AccessKey" })); return; }
  const proxyReq = https.request({ hostname: DEBANK_HOST, path: req.url, method: "GET", headers: { "AccessKey": accessKey, "Accept": "application/json" } }, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, { "Content-Type": "application/json" });
    proxyRes.pipe(res);
  });
  proxyReq.on("error", (e) => { res.writeHead(502); res.end(JSON.stringify({ error: e.message })); });
  proxyReq.end();
});
server.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
