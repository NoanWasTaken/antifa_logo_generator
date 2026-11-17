// lib/db.ts
import { Database } from "bun:sqlite";
import { mkdir } from "node:fs/promises";
import { TERMS_VERSION } from "./terms";

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

export type LogoStatus = "waiting" | "accepted" | "refused";
export type Logo = {
  id: number;
  value: string;
  status: LogoStatus;
  name: string | null;
  submittedAt: string | null;
  termsVersion: string | null;
};

export type LogoSubmission = {
  ip: string | null;
  acceptedAt: string;
  submittedAt: string;
};

db.run(
  "CREATE TABLE IF NOT EXISTS logo (id INTEGER PRIMARY KEY, value TEXT, status TEXT NOT NULL DEFAULT 'waiting')",
);

const migrateLogoTable = db.transaction(() => {
  const logoColumns = db.query("PRAGMA table_info(logo)").all() as {
    name: string;
  }[];
  if (!logoColumns.some((column) => column.name === "status")) {
    db.run(
      "ALTER TABLE logo ADD COLUMN status TEXT NOT NULL DEFAULT 'waiting'",
    );
    db.run(
      "UPDATE logo SET status = CASE WHEN is_validated = 1 THEN 'accepted' ELSE 'waiting' END",
    );
    try {
      db.run("ALTER TABLE logo DROP COLUMN is_validated");
    } catch {}
  }
  db.run("DELETE FROM logo WHERE value = '' OR value IS NULL");
});
migrateLogoTable.immediate();

const migrateLogoDownloads = db.transaction(() => {
  const logoColumns = db.query("PRAGMA table_info(logo)").all() as {
    name: string;
  }[];
  if (!logoColumns.some((column) => column.name === "downloads")) {
    db.run("ALTER TABLE logo ADD COLUMN downloads INTEGER NOT NULL DEFAULT 0");
  }
});
migrateLogoDownloads.immediate();

const migrateLogoName = db.transaction(() => {
  const logoColumns = db.query("PRAGMA table_info(logo)").all() as {
    name: string;
  }[];
  if (!logoColumns.some((column) => column.name === "name")) {
    db.run("ALTER TABLE logo ADD COLUMN name TEXT");
  }
});
migrateLogoName.immediate();

const migrateLogoSubmission = db.transaction(() => {
  const logoColumns = db.query("PRAGMA table_info(logo)").all() as {
    name: string;
  }[];
  const addColumn = (name: string, definition: string) => {
    if (!logoColumns.some((column) => column.name === name)) {
      db.run(`ALTER TABLE logo ADD COLUMN ${name} ${definition}`);
    }
  };
  addColumn("submitted_at", "TEXT");
  addColumn("ip", "TEXT");
  addColumn("terms_version", "TEXT");
  addColumn("accepted_at", "TEXT");
});
migrateLogoSubmission.immediate();

db.run(
  `CREATE TABLE IF NOT EXISTS moderation_log (
    id INTEGER PRIMARY KEY,
    logo_id INTEGER NOT NULL,
    decided_at TEXT NOT NULL,
    decision TEXT NOT NULL
  )`,
);

try {
  const logColumns = db.query("PRAGMA table_info(moderation_log)").all() as {
    name: string;
  }[];
  if (logColumns.some((column) => column.name === "reason")) {
    db.run("ALTER TABLE moderation_log DROP COLUMN reason");
  }
} catch {}

export type GallerySort = "newest" | "popular";
export type GalleryLogo = {
  id: number;
  downloads: number;
  name: string | null;
};

export function getAcceptedLogos(
  sort: GallerySort,
  limit: number,
  offset: number,
  search?: string,
): GalleryLogo[] {
  const where = search ? "AND name LIKE $search" : "";
  return db
    .query(
      `SELECT id, downloads, name FROM logo WHERE status = 'accepted' ${where} ${
        sort === "popular"
          ? "ORDER BY downloads DESC, id DESC"
          : "ORDER BY id DESC"
      } LIMIT $limit OFFSET $offset`,
    )
    .all(
      search
        ? { $limit: limit, $offset: offset, $search: `%${search}%` }
        : { $limit: limit, $offset: offset },
    ) as GalleryLogo[];
}

export function getAcceptedLogoCount(search?: string): number {
  const row = db
    .query(
      `SELECT COUNT(*) AS count FROM logo WHERE status = 'accepted' ${
        search ? "AND name LIKE $search" : ""
      }`,
    )
    .get(search ? { $search: `%${search}%` } : {}) as { count: number };
  return row.count;
}

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

export function getLogos(status?: LogoStatus): Logo[] {
  const columns =
    "id, value, status, name, submitted_at AS submittedAt, terms_version AS termsVersion";
  if (status) {
    return db
      .query(
        `SELECT ${columns} FROM logo WHERE status = $status ORDER BY id DESC`,
      )
      .all({ $status: status }) as Logo[];
  }
  return db
    .query(`SELECT ${columns} FROM logo ORDER BY id DESC`)
    .all() as Logo[];
}

export function getLogoCounts(): Record<LogoStatus, number> {
  const counts: Record<LogoStatus, number> = {
    waiting: 0,
    accepted: 0,
    refused: 0,
  };
  const rows = db
    .query("SELECT status, COUNT(*) AS count FROM logo GROUP BY status")
    .all() as { status: string; count: number }[];
  for (const row of rows) {
    if (
      row.status === "waiting" ||
      row.status === "accepted" ||
      row.status === "refused"
    ) {
      counts[row.status] = row.count;
    }
  }
  return counts;
}

export function getLogoById(id: number): Logo | undefined {
  const logo = db
    .query(
      "SELECT id, value, status, name, submitted_at AS submittedAt, terms_version AS termsVersion FROM logo WHERE id = $id",
    )
    .get({ $id: id }) as Logo | null;
  return logo ?? undefined;
}

export function setLogoStatus(id: number, status: LogoStatus): void {
  const update = db.transaction(() => {
    db.query("UPDATE logo SET status = $status WHERE id = $id").run({
      $status: status,
      $id: id,
    });
    db.query(
      `INSERT INTO moderation_log (logo_id, decided_at, decision)
       VALUES ($id, $decidedAt, $decision)`,
    ).run({
      $id: id,
      $decidedAt: new Date().toISOString(),
      $decision: status,
    });
  });
  update.immediate();
}

export function deleteLogo(id: number): void {
  const remove = db.transaction(() => {
    db.query("DELETE FROM moderation_log WHERE logo_id = $id").run({
      $id: id,
    });
    db.query("DELETE FROM logo WHERE id = $id").run({ $id: id });
  });
  remove.immediate();
}

export function recordLogoDownload(id: number): void {
  db.query(
    "UPDATE logo SET downloads = downloads + 1 WHERE id = $id AND status = 'accepted'",
  ).run({ $id: id });
}

export function saveLogo(
  logoValue: string,
  name: string | null,
  submission: LogoSubmission,
): void {
  const result = db
    .query(
      `INSERT INTO logo (value, status, name, submitted_at, ip, terms_version, accepted_at)
     VALUES ($logoValue, 'waiting', $name, $submittedAt, $ip, $termsVersion, $acceptedAt)`,
    )
    .run({
      $logoValue: logoValue,
      $name: name,
      $submittedAt: submission.submittedAt,
      $ip: submission.ip,
      $termsVersion: TERMS_VERSION,
      $acceptedAt: submission.acceptedAt,
    });

  console.log(
    `${ts()} -> Logo #${result.lastInsertRowid} submitted (${logoValue.length} bytes, name: ${name ?? "none"})`,
  );
}
