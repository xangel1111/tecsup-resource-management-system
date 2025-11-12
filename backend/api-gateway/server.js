require("dotenv").config();
const express = require("express");
const cors = require("cors"); // 👈 importar CORS
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
app.use(cors({ origin: "*"}));

app.use("/auth", createProxyMiddleware({
  target: "http://localhost:5000",
  changeOrigin: true,
  pathRewrite: { "^/auth": "" },
}));

app.use("/cubicles", createProxyMiddleware({
  target: "http://localhost:5001",
  changeOrigin: true,
}));

app.use("/loans", createProxyMiddleware({
  target: "http://localhost:5002",
  changeOrigin: true,
}));

app.use("/openai", createProxyMiddleware({
  target: "http://localhost:5005",
  changeOrigin: true,
  pathRewrite: { "^/openai": "" },
}));

app.use((req, res, next) => {
  console.log(`[Gateway] ${req.method} ${req.originalUrl}`);
  next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});
