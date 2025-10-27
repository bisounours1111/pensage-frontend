import React from "react";

export default function GhostImage({ label = "Image à venir" }) {
  return (
    <div className="h-36 w-full rounded-xl bg-white/30 shadow-inner flex items-center justify-center text-sm text-black/40">
      {label}
    </div>
  );
}
