import { getLogoById, recordLogoDownload } from "@/lib/db";
import { allowRequest } from "@/lib/rate-limit";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const logo = getLogoById(Number(id));
  if (!logo || logo.status !== "accepted") {
    return new Response("Not found", { status: 404 });
  }

  const download = new URL(request.url).searchParams.get("download") === "1";
  if (download) {
    const ip =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      "unknown";
    if (!allowRequest(`download:${ip}`, 8, 60_000)) {
      return new Response("Too many downloads. Try again in a minute.", {
        status: 429,
        headers: { "Retry-After": "60" },
      });
    }
    recordLogoDownload(logo.id);
  }

  return new Response(logo.value, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Content-Security-Policy": "default-src 'none'; img-src data:",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": download ? "no-store" : "public, max-age=60",
    },
  });
}
