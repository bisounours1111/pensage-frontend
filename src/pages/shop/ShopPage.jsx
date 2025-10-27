import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SectionTitle from "../../components/ui/SectionTitle";
import ProductCard from "../../components/ui/ProductCard";
import PointsBalanceCard from "../../components/ui/PointsBalanceCard";
import { getCurrentUser, getUserExtend } from "../../lib/supabase";
import { shopTokenApi, shopSubscriptionApi, weeklyRewardApi } from "../../lib/supabaseApi";
import { isStripeConfigured, STRIPE_CONFIG } from "../../lib/stripeConfig";
import { redirectToStripeCheckout, redirectToStripeSubscription } from "../../services/stripeService";
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
        navigate('/login');
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
      console.error('Erreur lors du chargement de la boutique:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyTokens = async (packId) => {
    try {
      setBuying(packId);

      const pack = tokenPacks.find(p => p.id === packId);
      if (!pack) {
        throw new Error('Pack introuvable');
      }

      // Si Stripe N'EST PAS configuré, utiliser le mode développement
      if (!isStripeConfigured()) {
        // Mode développement sans paiement Stripe
        await shopTokenApi.buy(user.id, packId);
        
        const extendData = await getUserExtend(user.id);
        setUserExtend(extendData);
        setPoints(extendData?.token || 0);
        
        alert('Achat réussi (mode développement) ! Vos points ont été ajoutés.');
      } else {
        // Stripe est configuré - rediriger vers Stripe Checkout
        await redirectToStripeCheckout(pack, user.id);
      }
    } catch (error) {
      console.error('Erreur lors de l\'achat:', error);
      alert(`Erreur lors de l'achat: ${error.message}`);
    } finally {
      setBuying(null);
    }
  };

  const handleSubscribe = async (subscriptionId) => {
    try {
      setBuying(subscriptionId);

      const sub = subscriptions.find(s => s.id === subscriptionId);
      if (!sub) {
        throw new Error('Abonnement introuvable');
      }

      // Si Stripe N'EST PAS configuré, utiliser le mode développement
      if (!isStripeConfigured()) {
        await shopSubscriptionApi.buy(user.id, subscriptionId);
        
        const extendData = await getUserExtend(user.id);
        setUserExtend(extendData);
        
        alert('Abonnement Premium activé (mode développement) !');
      } else {
        // Stripe est configuré - rediriger vers Stripe Checkout
        await redirectToStripeSubscription(sub, user.id);
      }
    } catch (error) {
      console.error('Erreur lors de l\'achat de l\'abonnement:', error);
      alert(`Erreur lors de l'achat de l'abonnement: ${error.message}`);
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
      
      const nextDateStr = nextClaimDate.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      const isPremium = userExtend?.has_subscription || false;
      const rewardAmount = isPremium ? 2000 : 100;
      
      alert(`Vous avez déjà récupéré votre récompense cette semaine.\n\nRécompense disponible : ${rewardAmount} points\nProchaine récompense : ${nextDateStr}`);
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
      alert(`${isPremium ? '🎉 Récompense Premium récupérée !' : '🎉 Récompense hebdomadaire récupérée !'}\n\n+${rewardAmount} points ont été ajoutés à votre compte.\nNouveau solde : ${extendData?.token || 0} points`);
    } catch (error) {
      console.error('Erreur lors de la récupération de la récompense:', error);
      alert(error.message || 'Erreur lors de la récupération de la récompense.');
    }
  };

  const handleAd = () => {
    alert('Publicité bientôt disponible !');
  };

  if (loading) {
    return (
      <div
        className="min-h-screen pb-24"
        style={{ background: `linear-gradient(to bottom, ${colors.bgGradientFrom}, ${colors.bgGradientVia}, ${colors.bgGradientTo})` }}
      >
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl" style={{ color: colors.text }}>Chargement...</div>
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
          <h1 className="text-4xl md:text-6xl font-bold" style={{ color: colors.text }}>
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
          <p className="text-lg font-semibold mb-6" style={{ color: colors.text }}>
            Passe à <span className="text-pink-600">Premium</span> et débloque tout le potentiel de l'application ✨
          </p>

          <div className="grid grid-cols-2 gap-6" style={{ color: colors.text }}>
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
            {subscriptions.length > 0 ? (
              subscriptions.map((sub) => (
                <button
                  key={sub.id}
                  className="text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:scale-105 disabled:opacity-50"
                  style={{ backgroundColor: colors.primary }}
                  onClick={() => handleSubscribe(sub.id)}
                  disabled={buying === sub.id || userExtend?.has_subscription}
                  onMouseEnter={(e) => {
                    if (!buying && !userExtend?.has_subscription) {
                      e.target.style.backgroundColor = colors.primaryLight;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!buying && !userExtend?.has_subscription) {
                      e.target.style.backgroundColor = colors.primary;
                    }
                  }}
                >
                  {buying === sub.id
                    ? 'Traitement...'
                    : userExtend?.has_subscription
                    ? 'Abonnement actif ✓'
                    : `${sub.title} — ${sub.price}€`}
                </button>
              ))
            ) : (
              <button
                className="text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:scale-105"
                style={{ backgroundColor: colors.primary }}
                onClick={() => alert("Aucun abonnement disponible pour le moment")}
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
            <div className="col-span-full text-center py-8" style={{ color: colors.text }}>
              Aucun pack de points disponible pour le moment
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
