import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import accountIcon from "../../assets/images/account.png";
import historyIcon from "../../assets/images/histoires.png";
import notificationsIcon from "../../assets/images/notifications.png";
import arrowLeft from "../../assets/images/gauche.png";
import arrowRight from "../../assets/images/droite.png";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-50
        bg-[#d6ccc2] border-t border-black/10
        h-16 flex items-center justify-center
        px-6 lg:hidden
      "
    >
      {/* ✅ On ajoute ici flèche gauche + icônes + flèche droite */}
      <div className="flex items-center justify-center gap-8">

        {/* Flèche gauche */}
        <button onClick={() => navigate(-1)} aria-label="Retour">
          <img src={arrowLeft} alt="Retour" className="w-6 h-6" />
        </button>

        {/* Icônes déjà existantes */}
        <NavLink to="/histoires">
          <img src={historyIcon} alt="Histoires" className="w-7 h-7" />
        </NavLink>

        <NavLink to="/account">
          <img src={accountIcon} alt="Compte" className="w-7 h-7" />
        </NavLink>

        <NavLink to="/notifications">
          <img src={notificationsIcon} alt="Notifications" className="w-7 h-7" />
        </NavLink>

        {/* Flèche droite */}
        <button onClick={() => navigate(1)} aria-label="Suivant">
          <img src={arrowRight} alt="Suivant" className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}
