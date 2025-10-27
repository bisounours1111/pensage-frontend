import React from "react";
import { NavLink } from "react-router-dom";
import accountIcon from "../../assets/images/account.png";
import historyIcon from "../../assets/images/histoires.png";
import notificationsIcon from "../../assets/images/notifications.png";

export default function Navbar() {
  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-50
        bg-[#d6ccc2] border-t border-black/10
        h-16 flex items-center justify-center
        px-6 block lg:hidden
      "
    >
      <div className="flex items-center justify-center gap-10">
        <NavLink to="/histoires">
          <img src={historyIcon} alt="Histoires" className="w-7 h-7" />
        </NavLink>
        <NavLink to="/account">
          <img src={accountIcon} alt="Compte" className="w-7 h-7" />
        </NavLink>
        <NavLink to="/notifications">
          <img src={notificationsIcon} alt="Notifications" className="w-7 h-7" />
        </NavLink>
      </div>
    </nav>
  );
}
