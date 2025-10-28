import React, { useState } from "react";
import { Link } from "react-router-dom";
import colors from "../../utils/constants/colors";
import { MdAutoStories, MdHome, MdShoppingBag, MdAccountCircle, MdNotifications, MdChecklist } from "react-icons/md";
import NotificationDropdown from "./NotificationDropdown";

// Logo
import logo from "../../assets/images/pensaga.png";

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header
      className="flex items-center justify-between px-8 w-full h-16 shadow-lg sticky top-0 z-50"
      style={{
        background: `linear-gradient(to right, ${colors.primarySoft}, ${colors.primaryLight})`,
        borderBottom: `3px solid ${colors.primary}`
      }}
    >

      {/* Logo à gauche */}
      <Link to="/" className="flex items-center hover:scale-105 transition-transform">
        <img src={logo} alt="Pensaga" className="h-10 w-auto object-contain" />
      </Link>

      {/* Navigation - responsive */}
      <div className="flex items-center gap-4">
        {/* Navigation principale - Desktop uniquement */}
        <div className="hidden lg:flex items-center gap-6">
          <Link
            to="/stories"
            className="p-3 rounded-lg hover:bg-white/20 transition-all flex items-center gap-2 group"
            style={{ color: colors.white }}
          >
            <MdAutoStories className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Histoires</span>
          </Link>
          <Link
            to="/home"
            className="p-3 rounded-lg hover:bg-white/20 transition-all flex items-center gap-2 group"
            style={{ color: colors.white }}
          >
            <MdHome className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Accueil</span>
          </Link>
          <Link
            to="/shop"
            className="p-3 rounded-lg hover:bg-white/20 transition-all flex items-center gap-2 group"
            style={{ color: colors.white }}
          >
            <MdShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Boutique</span>
          </Link>
        </div>

        {/* Icônes principales - Compte, Notifications, Quests (toujours visibles) */}
        <div className="flex items-center gap-4 border-l pl-4" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
          <Link
            to="/profile"
            className="p-3 rounded-lg hover:bg-white/20 transition-all flex items-center gap-2 group"
            style={{ color: colors.white }}
          >
            <MdAccountCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="font-medium hidden sm:inline">Compte</span>
          </Link>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-3 rounded-lg hover:bg-white/20 transition-all flex items-center gap-2 group relative"
              style={{ color: colors.white }}
            >
              <MdNotifications className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="font-medium hidden sm:inline">Notifications</span>
              {/* Badge de notification non lue */}
              <div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                style={{ backgroundColor: colors.primary }}
              />
            </button>
            <NotificationDropdown
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>
          <Link
            to="/quests"
            className="p-3 rounded-lg hover:bg-white/20 transition-all flex items-center gap-2 group relative"
            style={{ color: colors.white }}
          >
            <MdChecklist className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="font-medium hidden sm:inline">Quests</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
