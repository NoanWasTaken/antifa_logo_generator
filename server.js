import { Database } from "bun:sqlite";
import { mkdir } from "node:fs/promises";

const DATA_DIR = process.env.DATA_DIR || "./data";
await mkdir(DATA_DIR, { recursive: true });
const db = new Database(`${DATA_DIR}/counter.db`);
db.run(
  "CREATE TABLE IF NOT EXISTS counter (id INTEGER PRIMARY KEY, value INTEGER)",
);
db.run("INSERT OR IGNORE INTO counter (id, value) VALUES (1, 0)");

const RATE_LIMIT = 10;
const RATE_WINDOW = 60_000;
const hits = new Map();
const visitLog = new Map();
const workflowUrl = process.env.WORKFLOW_URL;
const workflowKey = process.env.WORKFLOW_KEY;

function rateLimit(ip) {
  const now = Date.now();
  const timestamps = hits.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_WINDOW);
  if (recent.length >= RATE_LIMIT) return true;
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function getCount() {
  return db.query("SELECT value FROM counter WHERE id = 1").get().value;
}

function ts() {
  return new Date().toLocaleString("fr-FR", { hour12: false });
}

function incrementCount() {
  db.run("UPDATE counter SET value = value + 1 WHERE id = 1");
  const count = getCount();
  console.log(`${ts()} -> Logo created! Total count: ${count}`);
  notifyWorkflow();
  return count;
}

function notifyWorkflow() {
  if (!workflowUrl || !workflowKey) return;
  fetch(workflowUrl, {
    method: "GET",
    headers: { "x-workflow-key": workflowKey },
  }).catch(() => {});
}

function logVisit(ip) {
  const t = Date.now();
  if (!visitLog.has(ip) || t - visitLog.get(ip) > 60000) {
    visitLog.set(ip, t);
    console.log(`${ts()} -> Visit from ${ip}`);
  }
}

Bun.serve({
  async fetch(req) {
    const url = new URL(req.url);
    const ip = req.headers.get("x-forwarded-for") || "local";

    if (url.pathname === "/api/count") {
      if (req.method === "GET") {
        logVisit(ip);
        return Response.json({ count: getCount() });
      }
      if (req.method === "POST") {
        if (rateLimit(ip))
          return Response.json({ error: "Too many requests" }, { status: 429 });
        return Response.json({ count: incrementCount() });
      }
    }

    if (url.pathname === "/") {
      logVisit(ip);
    }

    let path = url.pathname;
    if (path === "/") path = "/index.html";
    const file = Bun.file("." + path);
    if (await file.exists()) {
      const etag = `W/"${path}-${file.lastModified}"`;
      if (req.headers.get("If-None-Match") === etag) {
        return new Response(null, { status: 304 });
      }
      return new Response(file, {
        headers: { ETag: etag, "Cache-Control": "no-cache" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
  port: 3000,
});
