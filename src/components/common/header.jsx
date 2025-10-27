import React from "react";
import { Link } from "react-router-dom";

import logo from "../../assets/images/pensaga.png";
import accountIcon from "../../assets/images/account.png";
import historyIcon from "../../assets/images/histoires.png";
import notificationsIcon from "../../assets/images/notifications.png";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 w-full h-16 bg-[#d6ccc2] shadow-sm sticky top-0 z-50">
      
      <Link to="/" className="flex items-center">
        <img
          src={logo}
          alt="Pensaga"
          className="h-10 w-auto object-contain"
        />
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/histoires">
          <img
            src={historyIcon}
            alt="Histoires"
            className="w-6 h-6 hover:scale-110 transition-transform duration-150"
          />
        </Link>
        <Link to="/notifications">
          <img
            src={notificationsIcon}
            alt="Notifications"
            className="w-6 h-6 hover:scale-110 transition-transform duration-150"
          />
        </Link>
        <Link to="/account">
          <img
            src={accountIcon}
            alt="Compte"
            className="w-6 h-6 hover:scale-110 transition-transform duration-150"
          />
        </Link>
      </div>
    </header>
  );
}
