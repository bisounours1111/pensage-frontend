import React, { useEffect, useState } from "react";
import colors from "../../utils/constants/colors";
import { getCurrentUser } from "../../lib/supabase";
import { notificationsApi } from "../../lib/supabaseApi";

const NotificationsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const user = await getCurrentUser();
        if (!user) return;
        const feed = await notificationsApi.getFeed(user.id, 10);
        setItems(feed);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const renderItem = (it) => {
    switch (it.type) {
      case "new_webnovel":
        return `Nouvelle histoire publiée: ${
          it.payload?.title || "Sans titre"
        }`;
      case "new_episode":
        return `Nouvel épisode (#${it.payload?.number})`;
      case "comment":
        return `Nouveau commentaire`;
      case "like":
        return `Nouveau like`;
      case "follow":
        return `Nouveau follow`;
      default:
        return `Activité`;
    }
  };

  return (
    <div className="p-6 md:p-12">
      <h1 className="text-3xl font-bold mb-6" style={{ color: colors.text }}>
        Notifications
      </h1>
      {loading ? (
        <div style={{ color: colors.text }}>Chargement...</div>
      ) : items.length === 0 ? (
        <div style={{ color: colors.text, opacity: 0.8 }}>
          Aucune activité récente
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((it) => (
            <div
              key={it.id}
              className="p-4 rounded-lg"
              style={{ backgroundColor: colors.whiteTransparent }}
            >
              <div className="text-sm" style={{ color: colors.text }}>
                {renderItem(it)}
              </div>
              {typeof it.timestamp === "string" && (
                <div
                  className="text-xs"
                  style={{ color: colors.text, opacity: 0.6 }}
                >
                  {new Date(it.timestamp).toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
