import React from "react";
import colors from "../../utils/constants/colors";

const NotificationCard = ({
    message,
    userInitials = "TS",
    icon = "👁️",
    isRead = false,
    timestamp = "Il y a 2h",
    onClick
}) => {
    return (
        <div
            className="relative rounded-xl p-4 cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
            style={{
                backgroundColor: "#2A2A2A", // Gris foncé comme dans l'image
                border: "1px solid rgba(255, 255, 255, 0.1)"
            }}
            onClick={onClick}
        >
            {/* Message principal */}
            <div className="mb-6">
                <p
                    className="text-sm leading-relaxed"
                    style={{
                        color: isRead ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.9)"
                    }}
                >
                    {message}
                </p>
            </div>

            {/* Footer avec icône et avatar */}
            <div className="flex items-center justify-between">
                {/* Icône à gauche */}
                <div
                    className="flex items-center justify-center w-6 h-6 rounded-full"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                >
                    <span className="text-xs" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                        {icon}
                    </span>
                </div>

                {/* Avatar à droite */}
                <div
                    className="flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm"
                    style={{
                        backgroundColor: colors.primary,
                        color: colors.white
                    }}
                >
                    {userInitials}
                </div>
            </div>

            {/* Timestamp en bas */}
            <div className="absolute top-2 right-2">
                <span
                    className="text-xs"
                    style={{ color: "rgba(255, 255, 255, 0.5)" }}
                >
                    {timestamp}
                </span>
            </div>

            {/* Indicateur de non-lu */}
            {!isRead && (
                <div
                    className="absolute top-2 left-2 w-2 h-2 rounded-full"
                    style={{ backgroundColor: colors.primary }}
                />
            )}
        </div>
    );
};

export default NotificationCard;
