"use server";
import sharp from "sharp";
import { incrementCount, saveLogo } from "@/lib/db";
import { addCc0Metadata } from "@/lib/cc0";
import { allowRequest } from "@/lib/rate-limit";
import { sanitizeLogoSvg } from "@/lib/sanitize-logo";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

const workflowUrl = process.env.WORKFLOW_URL;
const workflowKey = process.env.WORKFLOW_KEY;

async function clientIp() {
  const requestHeaders = await headers();
  return (
    requestHeaders.get("cf-connecting-ip") ||
    requestHeaders.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown"
  );
}

async function notifyWorkflow() {
  if (!workflowKey || !workflowUrl) return;
  fetch(workflowUrl, {
    method: "GET",
    headers: { "x-workflow-key": workflowKey },
  }).catch((err) => {
    console.error("Failed forkflow in background : ", err);
  });
}

async function notifyWorkflowLogoSubmitted(body: string) {
  if (!workflowKey || !workflowUrl) return;
  const png = await sharp(Buffer.from(body), { density: 72 })
    .resize(256, 256, { fit: "inside" })
    .flatten({ background: "#ffffff" })
    .png({ palette: true, colors: 16, compressionLevel: 9, effort: 10 })
    .toBuffer();

  fetch(workflowUrl, {
    headers: {
      "x-workflow-key": workflowKey,
      "Content-Type": "image/png",
      "Content-Disposition": 'attachment; filename="logo.png"',
    },
    method: "POST",
    body: png,
  }).catch((err) => {
    console.error("Failed workflow in background : ", err);
  });
}
export async function handleLogoSubmitted(body: string) {
  if (typeof body !== "string" || body.length > 2 * 1024 * 1024) return;
  if (!allowRequest(`preview:${await clientIp()}`, 5, 60_000)) return;
  console.log("handleLogoSubmitted called with body:", body);
  notifyWorkflowLogoSubmitted(body).catch((error) =>
    console.error("Failed workflow (logo):", error),
  );
}

export async function handleIncrement() {
  if (!allowRequest(`count:${await clientIp()}`, 10, 60_000)) return null;
  const newCount = incrementCount();

  notifyWorkflow();

  revalidatePath("/");

  return newCount;
}

function cleanLogoName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/\s+/g, " ").trim().slice(0, 60);
  return cleaned || null;
}

function deriveLogoName(
  name: unknown,
  topText: unknown,
  bottomText: unknown,
): string | null {
  const explicitName = cleanLogoName(name);
  if (explicitName) return explicitName;

  const textParts = [topText, bottomText]
    .map(cleanLogoName)
    .filter((part): part is string => part !== null);

  return cleanLogoName(textParts.join(" "));
}

export async function submitLogo(
  svg: string,
  name?: string,
  topText?: string,
  bottomText?: string,
  acceptedTerms?: boolean,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (acceptedTerms !== true) {
    return { ok: false, error: "You must accept the Terms of Service." };
  }

  if (typeof svg !== "string") {
    return { ok: false, error: "Invalid logo." };
  }

  const trimmed = svg.trim();
  if (
    trimmed.length === 0 ||
    trimmed.length > 2 * 1024 * 1024 ||
    !/<svg[\s>]/i.test(trimmed)
  ) {
    return { ok: false, error: "Invalid logo." };
  }

  const ip = await clientIp();

  if (!allowRequest(`submit:${ip}`, 3, 60_000)) {
    return {
      ok: false,
      error: "Too many submissions. Please try again in a minute.",
    };
  }

  if (!allowRequest(`submit-hour:${ip}`, 10, 3_600_000)) {
    return {
      ok: false,
      error: "Too many submissions. Please try again later.",
    };
  }

  const sanitized = sanitizeLogoSvg(trimmed);
  if (!sanitized) {
    return { ok: false, error: "Invalid logo." };
  }

  const cleanedName = deriveLogoName(name, topText, bottomText);
  const acceptedAt = new Date().toISOString();

  saveLogo(addCc0Metadata(sanitized), cleanedName, {
    ip: ip === "unknown" ? null : ip,
    acceptedAt,
    submittedAt: acceptedAt,
  });
  revalidatePath("/admin");

  return { ok: true };
}
