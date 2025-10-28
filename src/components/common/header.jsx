import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import colors from "../../utils/constants/colors";
import {
  MdAutoStories,
  MdHome,
  MdShoppingBag,
  MdAccountCircle,
  MdNotifications,
  MdChecklist,
  MdLogout,
} from "react-icons/md";
import { signOut } from "../../lib/supabase";
import NotificationDropdown from "./NotificationDropdown";

// Logo
import logo from "../../assets/images/pensaga.png";

export default function Header() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (e) {
      console.error("Erreur de déconnexion:", e);
    }
  };

  return (
    <header
      className="flex items-center justify-between px-4 md:px-8 w-full h-16 shadow-lg sticky top-0 z-50"
      style={{
        background: `linear-gradient(to right, ${colors.primarySoft}, ${colors.primaryLight})`,
        borderBottom: `3px solid ${colors.primary}`,
      }}
    >
      {/* Logo à gauche */}
      <Link
        to="/home"
        className="flex items-center hover:scale-105 transition-transform flex-shrink-0"
      >
        <img
          src={logo}
          alt="Pensaga"
          className="h-8 md:h-10 w-auto object-contain"
        />
      </Link>

      {/* Navigation - responsive */}
      <div className="flex items-center gap-2 md:gap-4">
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
        <div
          className="flex items-center gap-1 sm:gap-2 md:gap-4 border-l pl-2 md:pl-4"
          style={{ borderColor: "rgba(255,255,255,0.3)" }}
        >
          <Link
            to="/profile"
            className="p-2 md:p-3 rounded-lg hover:bg-white/20 transition-all flex items-center gap-1 md:gap-2 group flex-shrink-0"
            style={{ color: colors.white }}
          >
            <MdAccountCircle className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
            <span className="font-medium hidden sm:inline">Compte</span>
          </Link>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-3 rounded-lg hover:bg-white/20 transition-all flex items-center gap-2 group relative"
              style={{ color: colors.white }}
            >
              <MdNotifications className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="font-medium hidden sm:inline">
                Notifications
              </span>
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
            className="p-2 md:p-3 rounded-lg hover:bg-white/20 transition-all flex items-center gap-1 md:gap-2 group relative flex-shrink-0"
            style={{ color: colors.white }}
          >
            <MdChecklist className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
            <span className="font-medium hidden sm:inline">Quests</span>
          </Link>
          <button
            onClick={handleLogout}
            className="px-2 py-2 rounded-lg transition-all flex items-center gap-1 md:gap-2 shadow-sm hover:shadow-md hover:scale-[1.02] flex-shrink-0"
            style={{
              color: colors.white,
              backgroundColor: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
            title="Se déconnecter"
          >
            <MdLogout className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden md:inline font-medium">Se déconnecter</span>
          </button>
        </div>
      </div>
    </header>
  );
}
