import React from "react";
import { Link } from "react-router-dom";

// Logo + icônes
import logo from "../../assets/images/pensaga.png";
import accountIcon from "../../assets/images/account.png";
import historyIcon from "../../assets/images/histoires.png";
import notificationsIcon from "../../assets/images/notifications.png";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 w-full h-16 bg-[#d6ccc2] shadow-sm sticky top-0 z-50">
      
      {/* Logo à gauche */}
      <Link to="/" className="flex items-center">
        <img src={logo} alt="Pensaga" className="h-10 w-auto object-contain" />
      </Link>

      {/* Icônes à droite */}
      <div className="flex items-center gap-6">
        {/* --- Icônes visibles partout (mobile + desktop) --- */}
        <Link to="/histoires">
          <img src={historyIcon} alt="Histoires" className="w-6 h-6 hover:scale-110 transition" />
        </Link>
        <Link to="/account">
          <img src={accountIcon} alt="Compte" className="w-6 h-6 hover:scale-110 transition" />
        </Link>
        <Link to="/notifications">
          <img src={notificationsIcon} alt="Notifications" className="w-6 h-6 hover:scale-110 transition" />
        </Link>

        <Link to="/desktop-link-1" className="hidden lg:block">
          <img src={historyIcon} alt="Extra 1" className="w-6 h-6 hover:scale-110 transition" />
        </Link>
        <Link to="/desktop-link-2" className="hidden lg:block">
          <img src={accountIcon} alt="Extra 2" className="w-6 h-6 hover:scale-110 transition" />
        </Link>
        <Link to="/desktop-link-3" className="hidden lg:block">
          <img src={notificationsIcon} alt="Extra 3" className="w-6 h-6 hover:scale-110 transition" />
        </Link>
      </div>
    </header>
  );
}
