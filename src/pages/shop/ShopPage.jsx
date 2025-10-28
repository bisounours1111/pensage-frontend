import React, { useState, useEffect } from "react";
import { MdAutoAwesome, MdCheck } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import SectionTitle from "../../components/ui/SectionTitle";
import ProductCard from "../../components/ui/ProductCard";
import PointsBalanceCard from "../../components/ui/PointsBalanceCard";
import { getCurrentUser, getUserExtend } from "../../lib/supabase";
import {
  shopTokenApi,
  shopSubscriptionApi,
  weeklyRewardApi,
} from "../../lib/supabaseApi";
import { isStripeConfigured, STRIPE_CONFIG } from "../../lib/stripeConfig";
import {
  redirectToStripeCheckout,
  redirectToStripeSubscription,
} from "../../services/stripeService";
import { userExtendApi } from "../../lib/supabaseApi";
import colors from "../../utils/constants/colors";

export default function ShopPage() {
  const navigate = useNavigate();
  const [points, setPoints] = useState(0);
  const [user, setUser] = useState(null);
  const [userExtend, setUserExtend] = useState(null);
  const [tokenPacks, setTokenPacks] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(null);
  const [weeklyRewardInfo, setWeeklyRewardInfo] = useState(null);

  useEffect(() => {
    loadShopData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadShopData = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        navigate("/login");
        return;
      }

      setUser(currentUser);

      const extendData = await getUserExtend(currentUser.id);
      setUserExtend(extendData);
      setPoints(extendData?.token || 0);

      // Charger les packs de tokens depuis Supabase
      const tokens = await shopTokenApi.getAll();
      setTokenPacks(tokens);

      // Charger les abonnements depuis Supabase
      const subs = await shopSubscriptionApi.getAll();
      setSubscriptions(subs);

      // Vérifier les récompenses hebdomadaires
      const weeklyInfo = await weeklyRewardApi.canClaimWeekly(currentUser.id);
      setWeeklyRewardInfo(weeklyInfo);
    } catch (error) {
      console.error("Erreur lors du chargement de la boutique:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyTokens = async (packId) => {
    try {
      setBuying(packId);

      const pack = tokenPacks.find((p) => p.id === packId);
      if (!pack) {
        throw new Error("Pack introuvable");
      }

      // Si Stripe N'EST PAS configuré, utiliser le mode développement
      if (!isStripeConfigured()) {
        // Mode développement sans paiement Stripe
        await shopTokenApi.buy(user.id, packId);

        const extendData = await getUserExtend(user.id);
        setUserExtend(extendData);
        setPoints(extendData?.token || 0);

        alert(
          "Achat réussi (mode développement) ! Vos points ont été ajoutés."
        );
      } else {
        // Stripe est configuré - rediriger vers Stripe Checkout
        await redirectToStripeCheckout(pack, user.id);
      }
    } catch (error) {
      console.error("Erreur lors de l'achat:", error);
      alert(`Erreur lors de l'achat: ${error.message}`);
    } finally {
      setBuying(null);
    }
  };

  const handleSubscribe = async (subscriptionId) => {
    try {
      setBuying(subscriptionId);

      const sub = subscriptions.find((s) => s.id === subscriptionId);
      if (!sub) {
        throw new Error("Abonnement introuvable");
      }

      // Si Stripe N'EST PAS configuré, utiliser le mode développement
      if (!isStripeConfigured()) {
        await shopSubscriptionApi.buy(user.id, subscriptionId);

        const extendData = await getUserExtend(user.id);
        setUserExtend(extendData);

        alert("Abonnement Premium activé (mode développement) !");
      } else {
        // Stripe est configuré - rediriger vers Stripe Checkout
        await redirectToStripeSubscription(sub, user.id);
      }
    } catch (error) {
      console.error("Erreur lors de l'achat de l'abonnement:", error);
      alert(`Erreur lors de l'achat de l'abonnement: ${error.message}`);
    } finally {
      setBuying(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!userExtend?.has_subscription) return;
    const confirmCancel = confirm(
      "Êtes-vous sûr de vouloir résilier votre abonnement Premium ?"
    );
    if (!confirmCancel) return;

    try {
      setBuying("cancel");
      if (isStripeConfigured()) {
        // Transmettre aussi l'id d'abonnement stripe si présent dans les préférences
        const stripeSubId = userExtend?.preferences?.stripe_subscription_id;
        await fetch(`${STRIPE_CONFIG.backendUrl}/stripe/cancel-subscription`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            stripe_subscription_id: stripeSubId,
          }),
        });
      }
      await userExtendApi.update(user.id, { has_subscription: false });

      const extendData = await getUserExtend(user.id);
      setUserExtend(extendData);
      alert("Votre abonnement a été résilié.");
    } catch (error) {
      console.error("Erreur lors de la résiliation de l'abonnement:", error);
      alert("Erreur lors de la résiliation de l'abonnement.");
    } finally {
      setBuying(null);
    }
  };

  const handleWeekly = async () => {
    if (!weeklyRewardInfo?.canClaim) {
      let nextClaimDate;
      if (weeklyRewardInfo?.lastTransactionDate) {
        nextClaimDate = new Date(weeklyRewardInfo.lastTransactionDate);
        nextClaimDate.setDate(nextClaimDate.getDate() + 7);
      } else {
        nextClaimDate = new Date();
        nextClaimDate.setDate(nextClaimDate.getDate() + 1);
      }

      const nextDateStr = nextClaimDate.toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const isPremium = userExtend?.has_subscription || false;
      const rewardAmount = isPremium ? 2000 : 100;

      alert(
        `Vous avez déjà récupéré votre récompense cette semaine.\n\nRécompense disponible : ${rewardAmount} points\nProchaine récompense : ${nextDateStr}`
      );
      return;
    }

    try {
      const rewardAmount = await weeklyRewardApi.claimWeekly(user.id);

      // Recharger les données utilisateur
      const extendData = await getUserExtend(user.id);
      setUserExtend(extendData);
      setPoints(extendData?.token || 0);

      // Mettre à jour les infos de récompense
      const weeklyInfo = await weeklyRewardApi.canClaimWeekly(user.id);
      setWeeklyRewardInfo(weeklyInfo);

      const isPremium = extendData?.has_subscription || false;
      alert(
        `${isPremium
          ? "Récompense Premium récupérée !"
          : "Récompense hebdomadaire récupérée !"
        }\n\n+${rewardAmount} points ont été ajoutés à votre compte.\nNouveau solde : ${extendData?.token || 0
        } points`
      );
    } catch (error) {
      console.error("Erreur lors de la récupération de la récompense:", error);
      alert(
        error.message || "Erreur lors de la récupération de la récompense."
      );
    }
  };

  const handleAd = () => {
    alert("Publicité bientôt disponible !");
  };

  if (loading) {
    return (
      <div
        className="min-h-screen pb-24"
        style={{
          background: `linear-gradient(to bottom, ${colors.bgGradientFrom}, ${colors.bgGradientVia}, ${colors.bgGradientTo})`,
        }}
      >
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl" style={{ color: colors.text }}>
            Chargement...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pb-24"
      style={{
        background: `linear-gradient(to bottom, ${colors.bgGradientFrom}, ${colors.bgGradientVia}, ${colors.bgGradientTo})`,
      }}
    >
      <header className="p-6 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1
            className="text-4xl md:text-6xl font-bold"
            style={{ color: colors.text }}
          >
            Boutique
          </h1>
        </div>

        <PointsBalanceCard
          points={points}
          onWeekly={handleWeekly}
          onAd={handleAd}
          isPremium={userExtend?.has_subscription}
          canClaimWeekly={weeklyRewardInfo?.canClaim}
        />
      </header>

      <section className="px-6 md:px-12 mb-10">
        <SectionTitle>Premium</SectionTitle>

        <div className="rounded-2xl p-6 bg-white/40 backdrop-blur border border-white/20 shadow-lg">
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            style={{ color: colors.text }}
          >
            <div className="bg-white/50 rounded-xl p-4 border border-white/40">
              <h3 className="text-xl font-bold mb-2">Gratuit</h3>
              <p className="text-sm">Récompense hebdomadaire: 100 points</p>
            </div>
            <div className="bg-pink-100 rounded-xl p-4 border border-pink-300 shadow-md">
              <h3 className="text-xl font-bold text-pink-700 mb-2 inline-flex items-center gap-2">
                Premium <MdAutoAwesome />
              </h3>
              <p className="text-sm font-medium">
                Récompense hebdomadaire: 2000 points
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            {subscriptions.length > 0 ? (
              subscriptions.map((sub) =>
                userExtend?.has_subscription ? (
                  <div key={sub.id} className="flex items-center gap-3">
                    <span
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-lg font-semibold text-white"
                      style={{ backgroundColor: colors.primary }}
                    >
                      Abonnement actif <MdCheck />
                    </span>
                    <button
                      type="button"
                      onClick={handleCancelSubscription}
                      disabled={buying === "cancel"}
                      className="px-4 py-2 rounded-lg font-semibold transition shadow-lg hover:scale-105 disabled:opacity-50"
                      style={{
                        backgroundColor: colors.white,
                        color: colors.text,
                        border: `1px solid ${colors.text}`,
                      }}
                    >
                      {buying === "cancel" ? "Résiliation..." : "Résilier"}
                    </button>
                  </div>
                ) : (
                  <button
                    key={sub.id}
                    className="text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:scale-105 disabled:opacity-50"
                    style={{ backgroundColor: colors.primary }}
                    onClick={() => handleSubscribe(sub.id)}
                    disabled={buying === sub.id}
                    onMouseEnter={(e) => {
                      if (!buying) {
                        e.target.style.backgroundColor = colors.primaryLight;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!buying) {
                        e.target.style.backgroundColor = colors.primary;
                      }
                    }}
                  >
                    {buying === sub.id
                      ? "Traitement..."
                      : `${sub.title} — ${sub.price}€`}
                  </button>
                )
              )
            ) : (
              <button
                className="text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:scale-105"
                style={{ backgroundColor: colors.primary }}
                onClick={() =>
                  alert("Aucun abonnement disponible pour le moment")
                }
              >
                Passer Premium — Bientôt disponible
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 mb-10">
        <SectionTitle>Packs de points</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tokenPacks.length > 0 ? (
            tokenPacks.map((pack) => (
              <ProductCard
                key={pack.id}
                title={pack.title}
                price={`${pack.price}€`}
                disabled={buying === pack.id}
                onClick={() => handleBuyTokens(pack.id)}
              />
            ))
          ) : (
            <div
              className="col-span-full text-center py-8"
              style={{ color: colors.text }}
            >
              Aucun pack de points disponible pour le moment
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
