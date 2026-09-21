import { changeMessage, getMessage } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function PUT(req: Request) {
  const value = await req.json();
  console.log("[API] PUT /message:", value);
  changeMessage(value.message, value.active);
  const after = getMessage();
  console.log("[API] DB after:", after);
  revalidatePath("/");
  return Response.json({ ok: true });
}
