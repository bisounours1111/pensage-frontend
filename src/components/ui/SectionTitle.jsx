import React from "react";
import colors from "../../utils/constants/colors";

export default function SectionTitle({ children }) {
  return (
    <h2
      className="text-2xl md:text-3xl font-bold mb-4 drop-shadow-sm"
      style={{ color: colors.text }}
    >
      {children}
    </h2>
  );
}
