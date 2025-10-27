import React from "react";
import { useNavigate } from "react-router-dom";
import colors from "../../utils/constants/colors";

export default function PaymentCancelPage() {
  const navigate = useNavigate();

  const handleGoToShop = () => {
    navigate("/shop");
  };

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
          border: `4px solid ${colors.primaryLight}`,
        }}
      >
        <div className="mb-6 text-6xl">😔</div>
        <h1
          className="text-3xl font-bold mb-4"
          style={{ color: colors.text }}
        >
          Paiement annulé
        </h1>
        <p className="text-lg mb-6" style={{ color: colors.textSecondary }}>
          Votre paiement a été annulé.
          <br />
          Aucun frais n'a été effectué.
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

