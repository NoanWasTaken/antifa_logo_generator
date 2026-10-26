import { isAdminRequest } from "@/lib/admin-auth";
import { getLogoById } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminRequest())) {
    return new Response("Not found", { status: 404 });
  }

  const { id } = await params;
  const logo = getLogoById(Number(id));
  if (!logo) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(logo.value, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Content-Security-Policy":
        "default-src 'none'; img-src data:",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
