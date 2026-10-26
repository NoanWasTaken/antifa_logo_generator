"use server";

import { isAdminRequest } from "@/lib/admin-auth";
import {
  deleteLogo as deleteLogoById,
  setLogoStatus,
  type LogoStatus,
} from "@/lib/db";
import { revalidatePath } from "next/cache";

const LOGO_STATUSES: LogoStatus[] = ["waiting", "accepted", "refused"];

function parseId(formData: FormData): number {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid logo id");
  }
  return id;
}

export async function updateLogoStatus(formData: FormData): Promise<void> {
  if (!(await isAdminRequest())) throw new Error("Unauthorized");

  const id = parseId(formData);
  const status = formData.get("status");

  if (
    typeof status !== "string" ||
    !LOGO_STATUSES.includes(status as LogoStatus)
  ) {
    throw new Error("Invalid logo status");
  }

  setLogoStatus(id, status as LogoStatus);
  revalidatePath("/admin");
}

export async function deleteLogo(formData: FormData): Promise<void> {
  if (!(await isAdminRequest())) throw new Error("Unauthorized");

  deleteLogoById(parseId(formData));
  revalidatePath("/admin");
}
