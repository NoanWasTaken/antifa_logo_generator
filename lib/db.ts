// lib/db.ts
import { Database } from "bun:sqlite";
import { mkdir } from "node:fs/promises";

const DATA_DIR = process.env.DATA_DIR || "./data";

await mkdir(DATA_DIR, { recursive: true });

export const db = new Database(`${DATA_DIR}/counter.db`);

db.run(
  "CREATE TABLE IF NOT EXISTS counter (id INTEGER PRIMARY KEY, value INTEGER)",
);
db.run("INSERT OR IGNORE INTO counter (id, value) VALUES (1, 0)");

export function getCount(): number {
  const result = db.query("SELECT value FROM counter WHERE id = 1").get() as {
    value: number;
  };
  return result?.value ?? 0;
}
function ts() {
  return new Date().toLocaleString("fr-FR", { hour12: false });
}

export function incrementCount(): number {
  db.run("UPDATE counter SET value = value + 1 WHERE id = 1");
  const newCount = getCount();
  console.log(`${ts()} -> Logo created! Total count: ${newCount}`);

  return newCount;
}
