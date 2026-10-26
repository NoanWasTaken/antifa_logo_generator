"use server";

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

//todo: notify workflow logo submitted

export async function handleIncrement() {
  const newCount = incrementCount();

  notifyWorkflow();

  revalidatePath("/");

  return newCount;
}

export async function submitLogo(
  svg: string,
  name?: string,
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

  const cleanedName =
    typeof name === "string"
      ? name.replace(/\s+/g, " ").trim().slice(0, 60) || null
      : null;

  saveLogo(sanitized, cleanedName);
  revalidatePath("/admin");

  return { ok: true };
}
