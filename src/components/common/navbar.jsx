import React from "react";
import { NavLink } from "react-router-dom";
import colors from "../../utils/constants/colors";
import {
  MdAutoStories,
  MdHome,
  MdShoppingBag,
  MdAccountCircle,
} from "react-icons/md";

export default function Navbar() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 h-16 flex items-center justify-center px-2 md:px-6 lg:hidden overflow-hidden"
      style={{
        background: `linear-gradient(to right, ${colors.primarySoft}, ${colors.primaryLight})`,
        borderTop: `3px solid ${colors.primary}`,
      }}
    >
      <div className="flex items-center justify-center gap-2 md:gap-4 w-full">
        <NavLink
          to="/stories"
          className={({ isActive }) =>
            `p-2 md:p-3 rounded-lg hover:bg-white/50 transition-all flex flex-col items-center gap-0.5 md:gap-1 flex-shrink-0 ${
              isActive ? "bg-white/60" : ""
            }`
          }
          style={{ color: colors.white }}
        >
          <MdAutoStories className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
          <span className="text-[10px] md:text-xs font-medium whitespace-nowrap">
            Histoires
          </span>
        </NavLink>

        <NavLink
          to="/home"
          className={({ isActive }) =>
            `p-2 md:p-3 rounded-lg hover:bg-white/50 transition-all flex flex-col items-center gap-0.5 md:gap-1 flex-shrink-0 ${
              isActive ? "bg-white/60" : ""
            }`
          }
          style={{ color: colors.white }}
        >
          <MdHome className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
          <span className="text-[10px] md:text-xs font-medium whitespace-nowrap">Accueil</span>
        </NavLink>

        <NavLink
          to="/shop"
          className={({ isActive }) =>
            `p-2 md:p-3 rounded-lg hover:bg-white/50 transition-all flex flex-col items-center gap-0.5 md:gap-1 flex-shrink-0 ${
              isActive ? "bg-white/60" : ""
            }`
          }
          style={{ color: colors.white }}
        >
          <MdShoppingBag className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
          <span className="text-[10px] md:text-xs font-medium whitespace-nowrap">
            Boutique
          </span>
        </NavLink>
      </div>
    </nav>
  );
}
