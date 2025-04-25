const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: process.env.TARGET_URL || "http://localhost:9000",
      changeOrigin: true,
      timeout: 60000,
      onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        res.status(500).json({ message: 'Proxy Error', error: err.message });
      }
    })
  );
};
