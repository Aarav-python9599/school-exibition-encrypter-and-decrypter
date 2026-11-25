// Secret Message Lab - backend (API only, plus serving index.html).
// Frontend lives in index.html. Edit that file for design or text changes.
// No npm packages are needed.

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.SERVER_PORT || process.env.PORT || 8080;
const SHIFT = 7;          // the fixed rule used by the printed pages
const MAX_LEN = 500;      // longest text accepted
const MAX_BODY = 10000;   // largest request body in bytes
const HTML_FILE = path.join(__dirname, "index.html");

function shiftText(text, n) {
  return Array.from(text)
    .map(function (ch) {
      const c = ch.charCodeAt(0);
      if (c >= 65 && c <= 90) {
        return String.fromCharCode(((c - 65 + n) % 26 + 26) % 26 + 65);
      }
      if (c >= 97 && c <= 122) {
        return String.fromCharCode(((c - 97 + n) % 26 + 26) % 26 + 97);
      }
      return ch;
    })
    .join("");
}

function sendJson(res, status, obj) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(obj));
}

const server = http.createServer(function (req, res) {
  const url = new URL(req.url, "http://localhost");

  // Serve the frontend page
  if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
    fs.readFile(HTML_FILE, function (err, data) {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("index.html not found next to index.js");
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(data);
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/health") {
    return sendJson(res, 200, { ok: true, shift: SHIFT });
  }

  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Use POST" });
  }

  const routes = ["/api/encrypt", "/api/decrypt"];
  if (routes.indexOf(url.pathname) === -1) {
    return sendJson(res, 404, { error: "Not found" });
  }

  let raw = "";
  req.on("data", function (chunk) { raw += chunk; });

  req.on("end", function () {
    if (raw.length > MAX_BODY) {
      return sendJson(res, 413, { error: "Request too large" });
    }

    let body;
    try {
      body = JSON.parse(raw);
    } catch (e) {
      return sendJson(res, 400, { error: "Invalid JSON" });
    }

    if (!body || typeof body.text !== "string") {
      return sendJson(res, 400, { error: "Field 'text' must be a string" });
    }
    if (body.text.length > MAX_LEN) {
      return sendJson(res, 400, { error: "Text must be " + MAX_LEN + " characters or fewer" });
    }

    const text = body.text;

    if (url.pathname === "/api/encrypt") {
      return sendJson(res, 200, { result: shiftText(text, SHIFT) });
    }
    if (url.pathname === "/api/decrypt") {
      return sendJson(res, 200, { result: shiftText(text, -SHIFT) });
    }

  });
});

server.on("error", function (err) {
  if (err.code === "EADDRINUSE") {
    console.error("Port " + PORT + " is already in use.");
  } else {
    console.error(err);
  }
  process.exit(1);
});

server.listen(PORT, "0.0.0.0", function () {
  console.log("Secret Message Lab running on port " + server.address().port);
});
