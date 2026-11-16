import { changeMessage, getMessage } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function PUT(req: Request) {
  const key = process.env.WORKFLOW_KEY;
  if (!key || req.headers.get("x-workflow-key") !== key) {
    return new Response("Unauthorized", { status: 401 });
  }

  const value = await req.json();
  if (
    typeof value.message !== "string" ||
    typeof value.active !== "boolean" ||
    value.message.length > 4096
  ) {
    return new Response("Invalid body", { status: 400 });
  }

  console.log("[API] PUT /message:", value);
  changeMessage(value.message, value.active);
  const after = getMessage();
  console.log("[API] DB after:", after);
  revalidatePath("/");
  return Response.json({ ok: true });
}
