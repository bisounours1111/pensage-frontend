import React from "react";
import colors from "../../utils/constants/colors";
import GhostImage from "./GhostImage";

export default function ProductCard({ title, subtitle, price, onClick }) {
  return (
    <div className="rounded-2xl p-4 bg-white/30 border border-white/20 backdrop-blur shadow-lg hover:shadow-xl transition">
      <GhostImage />

      <h3 className="mt-4 text-lg font-bold" style={{ color: colors.text }}>
        {title}
      </h3>

      {subtitle && (
        <p className="text-sm opacity-75" style={{ color: colors.text }}>
          {subtitle}
        </p>
      )}

      <p className="mt-2 font-bold text-xl" style={{ color: colors.text }}>
        {price}
      </p>

      <button
        onClick={onClick}
        className="mt-3 text-white px-4 py-2 rounded-lg hover:scale-105 transition shadow-lg"
        style={{ backgroundColor: colors.primary }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryLight)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
      >
        Acheter
      </button>
    </div>
  );
}
