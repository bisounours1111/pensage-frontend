import React, { useState } from "react";
import NotificationCard from "../../components/ui/NotificationCard";
import colors from "../../utils/constants/colors";

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            message: "Après inscription arrivé sur onboarding",
            userInitials: "TS",
            icon: "👁️",
            isRead: false,
            timestamp: "Il y a 2h"
        },
        {
            id: 2,
            message: "Votre histoire 'Aventure Magique' a été publiée avec succès !",
            userInitials: "AM",
            icon: "📚",
            isRead: false,
            timestamp: "Il y a 4h"
        },
        {
            id: 3,
            message: "Nouveau commentaire sur votre épisode 'Chapitre 3'",
            userInitials: "JC",
            icon: "💬",
            isRead: true,
            timestamp: "Il y a 1 jour"
        },
        {
            id: 4,
            message: "Vous avez gagné 50 points pour avoir terminé votre quête quotidienne",
            userInitials: "QP",
            icon: "🎯",
            isRead: true,
            timestamp: "Il y a 2 jours"
        },
        {
            id: 5,
            message: "Bienvenue sur Pensaga ! Commencez votre première histoire",
            userInitials: "PS",
            icon: "✨",
            isRead: true,
            timestamp: "Il y a 3 jours"
        }
    ]);

    const handleNotificationClick = (notificationId) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === notificationId
                    ? { ...notif, isRead: true }
                    : notif
            )
        );
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div
            className="min-h-screen p-6"
            style={{
                background: `linear-gradient(to bottom, ${colors.bgGradientFrom}, ${colors.bgGradientVia}, ${colors.bgGradientTo})`
            }}
        >
            {/* Header */}
            <div className="mb-8">
                <h1
                    className="text-4xl md:text-6xl font-bold mb-4"
                    style={{ color: colors.text }}
                >
                    Notifications
                </h1>
                <p
                    className="text-lg"
                    style={{ color: colors.textSecondary }}
                >
                    {unreadCount > 0
                        ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`
                        : "Toutes vos notifications sont lues"
                    }
                </p>
            </div>

            {/* Liste des notifications */}
            <div className="space-y-4 max-w-2xl">
                {notifications.map(notification => (
                    <NotificationCard
                        key={notification.id}
                        message={notification.message}
                        userInitials={notification.userInitials}
                        icon={notification.icon}
                        isRead={notification.isRead}
                        timestamp={notification.timestamp}
                        onClick={() => handleNotificationClick(notification.id)}
                    />
                ))}
            </div>

            {/* Message si aucune notification */}
            {notifications.length === 0 && (
                <div className="text-center py-16">
                    <div
                        className="p-10 rounded-2xl inline-block"
                        style={{
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        <p
                            className="text-xl font-semibold mb-4"
                            style={{ color: "rgba(255, 255, 255, 0.9)" }}
                        >
                            Aucune notification
                        </p>
                        <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                            Vous n'avez pas encore de notifications
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;
