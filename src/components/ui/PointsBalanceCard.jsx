import React from "react";
import {
  MdAutoAwesome,
  MdLockOpen,
  MdAccessTime,
  MdCardGiftcard,
} from "react-icons/md";
import colors from "../../utils/constants/colors";

export default function PointsBalanceCard({
  points,
  onWeekly,
  onAd,
  isPremium = false,
  canClaimWeekly = false,
}) {
  const weeklyRewardAmount = isPremium ? 2000 : 100;

  return (
    <div className="w-full rounded-2xl p-6 bg-white/30 backdrop-blur shadow-lg border border-white/20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p
            className="text-xl md:text-2xl font-bold"
            style={{ color: colors.text }}
          >
            Votre solde
          </p>

          <p
            className="text-2xl md:text-3xl font-semibold"
            style={{ color: colors.text }}
          >
            {points.toLocaleString("fr-FR")} tokens
          </p>

          <p
            className="mt-2 text-lg font-semibold"
            style={{ color: colors.text }}
          >
            Votre statut :{" "}
            <span className="font-bold inline-flex items-center gap-2">
              {isPremium ? (
                <>
                  <MdAutoAwesome /> Compte Premium
                </>
              ) : (
                <>
                  <MdLockOpen /> Compte Gratuit
                </>
              )}
            </span>
          </p>

          {!canClaimWeekly && (
            <p
              className="mt-1 text-sm opacity-75"
              style={{ color: colors.text }}
            >
              Récompense hebdomadaire déjà récupérée
            </p>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <button
            className={`px-4 py-2 rounded-lg text-white font-semibold shadow-md transition hover:scale-105 ${
              !canClaimWeekly ? "opacity-50 cursor-not-allowed" : ""
            }`}
            style={{ backgroundColor: colors.primary }}
            onClick={onWeekly}
            disabled={!canClaimWeekly}
            onMouseEnter={(e) => {
              if (canClaimWeekly) {
                e.target.style.backgroundColor = colors.primaryLight;
              }
            }}
            onMouseLeave={(e) => {
              if (canClaimWeekly) {
                e.target.style.backgroundColor = colors.primary;
              }
            }}
          >
            {canClaimWeekly ? (
              <span className="inline-flex items-center gap-2">
                <MdCardGiftcard /> +{weeklyRewardAmount} tokens hebdo
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <MdAccessTime /> +{weeklyRewardAmount} tokens (déjà utilisé)
              </span>
            )}
          </button>
          <button
            className="px-4 py-2 rounded-lg text-white font-semibold shadow-md transition hover:scale-105"
            style={{ backgroundColor: colors.primary }}
            onClick={onAd}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = colors.primaryLight)
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = colors.primary)
            }
          >
            Regarder une pub
          </button>
        </div>
      </div>
    </div>
  );
}
