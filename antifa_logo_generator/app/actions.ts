"use server";

import { incrementCount } from "@/lib/db";
import { revalidatePath } from "next/cache";

const workflowUrl = process.env.WORKFLOW_URL;
const workflowKey = process.env.WORKFLOW_KEY;

function notifyWorkflow() {
  if (!workflowKey || !workflowUrl) return;
  fetch(workflowUrl, {
    method: "GET",
    headers: { "x-workflow-key": workflowKey },
  }).catch(() => {});
}

export function handleIncrement() {
  const newCount = incrementCount();

  notifyWorkflow();

  revalidatePath("/");

  return newCount;
}
