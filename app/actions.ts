"use server";
import sharp from "sharp";
import { incrementCount, saveLogo } from "@/lib/db";
import { allowRequest } from "@/lib/rate-limit";
import { sanitizeLogoSvg } from "@/lib/sanitize-logo";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

const workflowUrl = process.env.WORKFLOW_URL;
const workflowKey = process.env.WORKFLOW_KEY;

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
  console.log("handleLogoSubmitted called with body:", body);
  notifyWorkflowLogoSubmitted(body);
}

export async function handleIncrement() {
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
): Promise<{ ok: true } | { ok: false; error: string }> {
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

  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("cf-connecting-ip") ||
    requestHeaders.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown";

  if (!allowRequest(`submit:${ip}`, 3, 60_000)) {
    return {
      ok: false,
      error: "Too many submissions. Please try again in a minute.",
    };
  }

  const sanitized = sanitizeLogoSvg(trimmed);
  if (!sanitized) {
    return { ok: false, error: "Invalid logo." };
  }

  const cleanedName = deriveLogoName(name, topText, bottomText);

  saveLogo(sanitized, cleanedName);
  revalidatePath("/admin");

  return { ok: true };
}
