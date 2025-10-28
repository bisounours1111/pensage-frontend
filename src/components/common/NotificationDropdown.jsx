import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationCard from "../ui/NotificationCard";
import colors from "../../utils/constants/colors";
import { getCurrentUser } from "../../lib/supabase";
import { notificationsApi } from "../../lib/supabaseApi";

const NotificationDropdown = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      setLoading(true);
      try {
        const user = await getCurrentUser();
        if (!user) return;
        // Récupère les 5 dernières notifs persistées + interactions reçues (tolérance erreurs)
        const results = await Promise.allSettled([
          notificationsApi.getUserNotifications(user.id, 5),
          notificationsApi.getReceivedInteractions(user.id, 5),
          notificationsApi.getNewFollowers(user.id, 5),
        ]);

        const persisted =
          results[0]?.status === "fulfilled" ? results[0].value : [];
        const interactions =
          results[1]?.status === "fulfilled" ? results[1].value : [];
        const followers =
          results[2]?.status === "fulfilled" ? results[2].value : [];

        const persistedItems = (persisted || []).map((n) => ({
          id: `notif-${n.id}`,
          type: "persisted",
          timestamp: n.created_at || n.id,
          payload: n,
        }));

        const interactionItems = (interactions || []).map((it) => it);
        const followerItems = (followers || []).map((it) => it);

        const merged = [
          ...persistedItems,
          ...interactionItems,
          ...followerItems,
        ]
          .sort((a, b) => {
            const av =
              typeof a.timestamp === "string"
                ? Date.parse(a.timestamp)
                : a.timestamp;
            const bv =
              typeof b.timestamp === "string"
                ? Date.parse(b.timestamp)
                : b.timestamp;
            return (bv || 0) - (av || 0);
          })
          .slice(0, 5);

        setItems(merged);
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen]);

  const formatRelative = (ts) => {
    if (!ts) return "";
    const t = typeof ts === "string" ? Date.parse(ts) : ts;
    if (!t) return "";
    const diff = Date.now() - t;
    const sec = Math.floor(diff / 1000);
    if (sec < 60) return "À l'instant";
    const min = Math.floor(sec / 60);
    if (min < 60) return `Il y a ${min} min`;
    const h = Math.floor(min / 60);
    if (h < 24) return `Il y a ${h} h`;
    const d = Math.floor(h / 24);
    return `Il y a ${d} j`;
  };

  const notifications = useMemo(() => {
    return (items || []).map((it) => {
      switch (it.type) {
        case "follow_me":
          return {
            id: it.id,
            message: `${
              it.payload?.user_from?.username ||
              it.payload?.user_from?.name ||
              "Un utilisateur"
            } a commencé à vous suivre`,
            userInitials: (it.payload?.user_from?.username || "FW")
              .slice(0, 2)
              .toUpperCase(),
            icon: "➕",
            isRead: false,
            timestamp: formatRelative(it.timestamp),
          };
        case "persisted":
          return {
            id: it.id,
            message: it.payload?.title
              ? `${it.payload.title}${
                  it.payload?.message ? ` — ${it.payload.message}` : ""
                }`
              : it.payload?.message || "Notification",
            userInitials: "NT",
            icon: "🔔",
            isRead: !!it.payload?.is_read,
            timestamp: formatRelative(it.timestamp),
          };
        case "comment_received":
          return {
            id: it.id,
            message: `Nouveau commentaire reçu sur "${
              it.payload?.webnovels?.title || "votre histoire"
            }"`,
            userInitials: (it.payload?.user_extend?.username || "CM")
              .slice(0, 2)
              .toUpperCase(),
            icon: "💬",
            isRead: false,
            timestamp: formatRelative(it.timestamp),
          };
        case "like_received":
          return {
            id: it.id,
            message: `Nouveau like reçu sur "${
              it.payload?.webnovels?.title || "votre histoire"
            }"`,
            userInitials: (it.payload?.user_extend?.username || "LK")
              .slice(0, 2)
              .toUpperCase(),
            icon: "❤️",
            isRead: false,
            timestamp: formatRelative(it.timestamp),
          };
        case "new_webnovel":
          return {
            id: it.id,
            message: `Nouvelle histoire par ${
              it.payload?.author?.username ||
              it.payload?.author?.name ||
              "Auteur"
            }: ${it.payload?.title || "Sans titre"}`,
            userInitials: "NW",
            icon: "📚",
            isRead: false,
            timestamp: formatRelative(it.timestamp),
          };
        case "new_episode":
          return {
            id: it.id,
            message: `Nouvel épisode par ${
              it.payload?.webnovels?.author?.username || "Auteur"
            } (#${
              it.payload?.number || it.payload?.webnovels_episode?.number || "?"
            })`,
            userInitials: "EP",
            icon: "🎬",
            isRead: false,
            timestamp: formatRelative(it.timestamp),
          };
        case "comment":
          return {
            id: it.id,
            message: "Nouveau commentaire",
            userInitials: "CM",
            icon: "💬",
            isRead: false,
            timestamp: formatRelative(it.timestamp),
          };
        case "like":
          return {
            id: it.id,
            message: "Nouveau like",
            userInitials: "LK",
            icon: "❤️",
            isRead: false,
            timestamp: formatRelative(it.timestamp),
          };
        case "follow":
          return {
            id: it.id,
            message: "Nouvel abonné",
            userInitials: "FW",
            icon: "➕",
            isRead: false,
            timestamp: formatRelative(it.timestamp),
          };
        default:
          return {
            id: it.id,
            message: "Activité",
            userInitials: "AC",
            icon: "🔔",
            isRead: false,
            timestamp: formatRelative(it.timestamp),
          };
      }
    });
  }, [items]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown */}
      <div
        className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto z-50 rounded-xl shadow-2xl"
        style={{
          backgroundColor: "#1A1A1A",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Header */}
        <div
          className="p-4 border-b"
          style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
        >
          <h3
            className="text-lg font-semibold"
            style={{ color: "rgba(255, 255, 255, 0.9)" }}
          >
            Notifications
          </h3>
        </div>

        {/* Notifications */}
        <div className="p-2 space-y-2">
          {loading ? (
            <div
              className="p-4 text-sm"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              Chargement...
            </div>
          ) : notifications.length === 0 ? (
            <div
              className="p-4 text-sm"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Aucune activité récente
            </div>
          ) : (
            notifications.map((notification, idx) => (
              <div key={notification.id} className="scale-90">
                <NotificationCard
                  message={notification.message}
                  userInitials={notification.userInitials}
                  icon={notification.icon}
                  isRead={notification.isRead}
                  timestamp={notification.timestamp}
                  onClick={() => {
                    onClose();
                    // Redirections selon type
                    const raw = items[idx];
                    if (raw?.type === "persisted") return; // optionnel: spécifique
                    if (
                      raw?.type === "comment_received" ||
                      raw?.type === "like_received"
                    ) {
                      const novelId =
                        raw?.payload?.id_webnovels ||
                        raw?.payload?.webnovels?.id;
                      if (novelId) navigate(`/read/${novelId}`);
                      return;
                    }
                    if (raw?.type === "new_webnovel") {
                      const novelId = raw?.payload?.id;
                      if (novelId) navigate(`/read/${novelId}`);
                      return;
                    }
                    if (raw?.type === "new_episode") {
                      const novelId =
                        raw?.payload?.id_webnovels ||
                        raw?.payload?.webnovels?.id;
                      if (novelId) navigate(`/read/${novelId}`);
                      return;
                    }
                    if (raw?.type === "follow_me") {
                      const followerId = raw?.payload?.from_id_user;
                      if (followerId) navigate(`/u/${followerId}`);
                      return;
                    }
                  }}
                />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          className="p-3 border-t text-center"
          style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
        >
          <button
            className="text-sm font-medium hover:opacity-80 transition"
            style={{ color: colors.primary }}
            onClick={() => {
              onClose();
              navigate("/notifications");
            }}
          >
            Voir toutes les notifications
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;
