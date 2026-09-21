// lib/db.ts
import { Database } from "bun:sqlite";
import { mkdir } from "node:fs/promises";

const DATA_DIR = process.env.DATA_DIR || "./data";

await mkdir(DATA_DIR, { recursive: true });

export const db = new Database(`${DATA_DIR}/counter.db`);

//fix for sqlite node adapter bun
db.run("PRAGMA busy_timeout = 60000");
db.run("PRAGMA synchronous = NORMAL");
try {
  db.run("PRAGMA journal_mode = WAL");
} catch (error) {
  if (
    !(error instanceof Error) ||
    (!error.message.includes("database is locked") &&
      !(error as { code?: string }).code?.includes("SQLITE_BUSY"))
  ) {
    throw error;
  }
}

db.run(
  "CREATE TABLE IF NOT EXISTS counter (id INTEGER PRIMARY KEY, value INTEGER)",
);
db.run("INSERT OR IGNORE INTO counter (id, value) VALUES (1, 0)");

db.run(
  "CREATE TABLE IF NOT EXISTS message (id INTEGER PRIMARY KEY, value VARCHAR2, active BOOLEAN)",
);
db.run("INSERT OR IGNORE INTO message (id, value, active) VALUES (1, '', 0)");

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

export function getMessage() {
  const result = db
    .query(`SELECT value, active FROM message WHERE id= 1`)
    .get() as {
    value: string;
    active: number;
  };

  return {
    ...result,
    active: result.active === 1,
  };
}

export function changeMessage(newMessage: string, active?: number) {
  if (active !== undefined) {
    db.query(
      "UPDATE message SET value = $message, active = $active WHERE id = 1",
    ).run({
      $message: newMessage,
      $active: active,
    });
  } else {
    db.query("UPDATE message SET value = $message WHERE id = 1").run({
      $message: newMessage,
    });
  }
  return getMessage();
}

export function activateMessage(active: boolean): void {
  db.query("UPDATE message SET active = $active WHERE id = 1").run({
    $active: active,
  });
}
