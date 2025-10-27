import React, { useState } from "react";
import SectionTitle from "../../components/ui/SectionTitle";
import ProductCard from "../../components/ui/ProductCard";
import PointsBalanceCard from "../../components/ui/PointsBalanceCard";

export default function ShopPage() {
  const [points, setPoints] = useState(1200);

  const handleBuyPoints = (amount) => setPoints((p) => p + amount);
  const handleWeekly = () => setPoints((p) => p + 100);
  const handleAd = () =>
    setPoints((p) => p + (Math.floor(Math.random() * 1901) + 100)); // +100–2000

  return (
    <div
      className="min-h-screen pb-24"
      style={{
        background: "linear-gradient(to bottom, #f7e7eb, #f4d5de, #f2c3d1)",
      }}
    >

      <header className="p-6 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-4xl md:text-6xl font-bold text-[#7a4252]">
            Boutique
          </h1>
        </div>

        <PointsBalanceCard points={points} onWeekly={handleWeekly} onAd={handleAd} />
      </header>

      <section className="px-6 md:px-12 mb-10">
        <SectionTitle>Premium</SectionTitle>

        <div className="rounded-2xl p-6 bg-white/40 backdrop-blur border border-white/20 shadow-lg">
          <p className="text-lg font-semibold text-[#7a4252] mb-6">
            Passe à <span className="text-pink-600">Premium</span> et débloque tout le potentiel de l'application ✨
          </p>

          <div className="grid grid-cols-2 gap-6 text-[#7a4252]">
            <div className="bg-white/50 rounded-xl p-4 border border-white/40">
              <h3 className="text-xl font-bold mb-3">Gratuit</h3>
              <ul className="text-sm space-y-2">
                <li>✅ Accès aux histoires publiques</li>
                <li>✅ 100 points / semaine</li>
                <li>✅ Lecture standard</li>
                <li>🚫 Publicités présentes</li>
                <li>🚫 Peu de bonus</li>
              </ul>
            </div>

            <div className="bg-pink-100 rounded-xl p-4 border border-pink-300 shadow-md">
              <h3 className="text-xl font-bold text-pink-700 mb-3">Premium ✨</h3>
              <ul className="text-sm space-y-2 font-medium">
                <li>✅ Tout le contenu gratuit</li>
                <li>✅ 2000 points / semaine</li>
                <li>✅ Bonus XP + progression rapide</li>
                <li>✅ Aucune publicité</li>
                <li>✅ Badges & profil premium</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              className="text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:scale-105"
              style={{ backgroundColor: "#f17ca0" }}
              onClick={() => alert("Premium à connecter bientôt")}
            >
              Passer Premium — 12,99€/mois
            </button>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 mb-10">
        <SectionTitle>Packs de points</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ProductCard title="Pack 100"  price="0,99€" onClick={() => handleBuyPoints(100)} />
          <ProductCard title="Pack 250"  price="1,99€" onClick={() => handleBuyPoints(250)} />
          <ProductCard title="Pack 500"  price="2,99€" onClick={() => handleBuyPoints(500)} />
          <ProductCard title="Pack 1000" price="4,99€" onClick={() => handleBuyPoints(1000)} />
        </div>
      </section>
    </div>
  );
}
