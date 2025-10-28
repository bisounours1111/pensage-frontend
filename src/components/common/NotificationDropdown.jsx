import React, { useState } from "react";
import NotificationCard from "../ui/NotificationCard";
import colors from "../../utils/constants/colors";

const NotificationDropdown = ({ isOpen, onClose }) => {
    const [notifications] = useState([
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
            message: "Votre histoire 'Aventure Magique' a été publiée !",
            userInitials: "AM",
            icon: "📚",
            isRead: false,
            timestamp: "Il y a 4h"
        },
        {
            id: 3,
            message: "Nouveau commentaire sur votre épisode",
            userInitials: "JC",
            icon: "💬",
            isRead: true,
            timestamp: "Il y a 1 jour"
        }
    ]);

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-40"
                onClick={onClose}
            />

            {/* Dropdown */}
            <div
                className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto z-50 rounded-xl shadow-2xl"
                style={{
                    backgroundColor: "#1A1A1A",
                    border: "1px solid rgba(255, 255, 255, 0.1)"
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
                    {notifications.map(notification => (
                        <div key={notification.id} className="scale-90">
                            <NotificationCard
                                message={notification.message}
                                userInitials={notification.userInitials}
                                icon={notification.icon}
                                isRead={notification.isRead}
                                timestamp={notification.timestamp}
                                onClick={onClose}
                            />
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div
                    className="p-3 border-t text-center"
                    style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
                >
                    <button
                        className="text-sm font-medium hover:opacity-80 transition"
                        style={{ color: colors.primary }}
                        onClick={onClose}
                    >
                        Voir toutes les notifications
                    </button>
                </div>
            </div>
        </>
    );
};

export default NotificationDropdown;
