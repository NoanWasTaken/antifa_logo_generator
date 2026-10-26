"use client";

import { Trash2 } from "lucide-react";
import { deleteLogo } from "./actions";

export default function DeleteLogoForm({ id }: { id: number }) {
  return (
    <form
      action={deleteLogo}
      onSubmit={(event) => {
        if (!window.confirm(`Delete logo #${id}? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-red-300/40 px-3 text-sm font-semibold text-red-300 transition-colors hover:border-red-300 hover:bg-red/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <Trash2 className="size-4" aria-hidden="true" />
        Delete
      </button>
    </form>
  );
}
