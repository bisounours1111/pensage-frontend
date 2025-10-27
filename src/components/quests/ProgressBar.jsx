import React, { useEffect, useState } from "react";

export default function ProgressBar({ value = 0 }) {
  const clamped = Math.max(0, Math.min(100, value));
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(clamped), 50);
    return () => clearTimeout(t);
  }, [clamped]);

  return (
    <div className="w-full h-3 rounded-full bg-white/40 overflow-hidden border border-white/30">
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${width}%`, backgroundColor: "#f17ca0" }}
      />
    </div>
  );
}
