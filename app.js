// app.js
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(helmet());                             // security headers
app.use(cors());                               // allow cross-origin requests
app.use(express.json());                       // parse JSON bodies
app.use(morgan("dev"));                        // request logging

// --- Simple in-memory store (swap for a DB in production) ---
const items = [];

// --- Routes ---
app.get("/", (req, res) => {
  res.json({ message: "API is running", uptime: process.uptime() });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/items", (req, res) => {
  res.json(items);
});

app.post("/api/items", (req, res) => {
  const { name } = req.body || {};
  if (!name) {
    return res.status(400).json({ error: "name is required" });
  }
  const item = { id: items.size + 1, name, createdAt: new Date().toISOString() };
  items.set(item.id, item);
  res.status(201).json(item);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

// Only listen when run directly (lets tests import `app` without opening a port)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;
