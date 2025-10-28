import React, { useEffect, useState } from "react";
import { MdWarning, MdCelebration, MdAutoAwesome } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";
import colors from "../../utils/constants/colors";
import { getCurrentUser } from "../../lib/supabase";
import { STRIPE_CONFIG } from "../../lib/stripeConfig";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentType, setPaymentType] = useState(null);
  const [error, setError] = useState(null);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const verifyAndActivatePayment = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        // Vérifier le statut du paiement côté serveur
        const response = await fetch(
          `${STRIPE_CONFIG.backendUrl}/stripe/verify-session/${sessionId}`
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la vérification du paiement");
        }

        const data = await response.json();

        // Vérifier que le paiement est validé
        if (!data.paid) {
          throw new Error("Paiement non validé");
        }

        // Mettre à jour les données utilisateur
        const user = await getCurrentUser();
        if (!user) {
          throw new Error("Utilisateur non connecté");
        }

        if (data.metadata) {
          const type = data.metadata.type;
          setPaymentType(type);

          // Importer l'API Supabase pour activer l'abonnement/ajouter les tokens
          const { userExtendApi } = await import("../../lib/supabaseApi");

          if (type === "subscription") {
            // Activer l'abonnement Premium
            await userExtendApi.update(user.id, {
              has_subscription: true,
            });
            console.log("✅ Abonnement Premium activé");
          } else if (type === "token_pack") {
            // Ajouter les tokens
            const token_amount = parseInt(data.metadata.token_amount || 0);
            if (token_amount > 0) {
              const currentData = await userExtendApi.get(user.id);
              const newTokenAmount = (currentData.token || 0) + token_amount;

              await userExtendApi.update(user.id, {
                token: newTokenAmount,
              });
              console.log(`✅ ${token_amount} tokens ajoutés`);
            }
          }
        }
      } catch (err) {
        console.error("Erreur lors de la vérification:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    verifyAndActivatePayment();
  }, [sessionId]);

  const handleGoToShop = () => {
    navigate("/shop");
  };

  const handleGoToHome = () => {
    navigate("/home");
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: `linear-gradient(to bottom, ${colors.bgGradientFrom}, ${colors.bgGradientVia}, ${colors.bgGradientTo})`,
        }}
      >
        <div className="text-xl" style={{ color: colors.text }}>
          Chargement...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{
          background: `linear-gradient(to bottom, ${colors.bgGradientFrom}, ${colors.bgGradientVia}, ${colors.bgGradientTo})`,
        }}
      >
        <div
          className="max-w-md w-full p-8 rounded-2xl shadow-2xl text-center"
          style={{
            backgroundColor: colors.white,
            border: `4px solid ${colors.primary}`,
          }}
        >
          <div className="mb-6 text-6xl">
            <MdWarning />
          </div>
          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: colors.text }}
          >
            Erreur
          </h1>
          <p className="text-lg mb-6" style={{ color: colors.textSecondary }}>
            {error}
          </p>
          <button
            onClick={handleGoToShop}
            className="w-full px-6 py-3 rounded-lg font-semibold text-white transition shadow-lg hover:scale-105"
            style={{ backgroundColor: colors.primary }}
          >
            Retour à la boutique
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{
        background: `linear-gradient(to bottom, ${colors.bgGradientFrom}, ${colors.bgGradientVia}, ${colors.bgGradientTo})`,
      }}
    >
      <div
        className="max-w-md w-full p-8 rounded-2xl shadow-2xl text-center"
        style={{
          backgroundColor: colors.white,
          border: `4px solid ${colors.primary}`,
        }}
      >
        <div className="mb-6 text-6xl">
          {paymentType === "subscription" ? (
            <MdAutoAwesome />
          ) : (
            <MdCelebration />
          )}
        </div>
        <h1 className="text-3xl font-bold mb-4" style={{ color: colors.text }}>
          {paymentType === "subscription"
            ? "Abonnement Premium activé !"
            : "Paiement réussi !"}
        </h1>
        <p className="text-lg mb-6" style={{ color: colors.textSecondary }}>
          {paymentType === "subscription" ? (
            <>
              Votre abonnement Premium a été activé avec succès.
              <br />
              Profitez maintenant de tous les avantages Premium !
            </>
          ) : (
            <>
              Votre achat a été effectué avec succès.
              <br />
              Les points ont été ajoutés à votre compte.
            </>
          )}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoToShop}
            className="w-full px-6 py-3 rounded-lg font-semibold text-white transition shadow-lg hover:scale-105"
            style={{ backgroundColor: colors.primary }}
          >
            Retour à la boutique
          </button>
          <button
            onClick={handleGoToHome}
            className="w-full px-6 py-3 rounded-lg font-semibold transition"
            style={{
              backgroundColor: colors.whiteTransparent,
              color: colors.text,
            }}
          >
            Accueil
          </button>
        </div>
      </div>
    </div>
  );
}
