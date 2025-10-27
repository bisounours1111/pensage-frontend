import { isStripeConfigured, STRIPE_CONFIG } from "../lib/stripeConfig";

/**
 * Rediriger vers Stripe Checkout pour un pack de tokens
 */
export const redirectToStripeCheckout = async (pack, userId) => {
  if (!isStripeConfigured()) {
    throw new Error("Stripe non configuré");
  }

  // Créer une session de paiement via le backend
  const response = await fetch(
    `${STRIPE_CONFIG.backendUrl}/stripe/create-checkout-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "token_pack",
        pack_id: pack.id,
        user_id: userId,
        product_name: pack.title,
        amount: pack.price,
        token_amount: pack.token_amount || 0,
        success_url: STRIPE_CONFIG.successUrl,
        cancel_url: STRIPE_CONFIG.cancelUrl,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.detail || "Erreur lors de la création de la session Stripe"
    );
  }

  const { url } = await response.json();

  // Rediriger vers Stripe Checkout (nouvelle méthode)
  if (url) {
    window.location.href = url;
  } else {
    throw new Error("URL de paiement introuvable");
  }
};

/**
 * Rediriger vers Stripe Checkout pour un abonnement
 */
export const redirectToStripeSubscription = async (subscription, userId) => {
  if (!isStripeConfigured()) {
    throw new Error("Stripe non configuré");
  }

  // Créer une session d'abonnement via le backend
  const response = await fetch(
    `${STRIPE_CONFIG.backendUrl}/stripe/create-subscription-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "subscription",
        subscription_id: subscription.id,
        user_id: userId,
        product_name: subscription.title,
        amount: subscription.price, // Prix mensuel
        price_id: subscription.stripe_price_id, // Doit être configuré dans Supabase (optionnel)
        success_url: STRIPE_CONFIG.successUrl,
        cancel_url: STRIPE_CONFIG.cancelUrl,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.detail || "Erreur lors de la création de la session Stripe"
    );
  }

  const { url } = await response.json();

  // Rediriger vers Stripe Checkout (nouvelle méthode)
  if (url) {
    window.location.href = url;
  } else {
    throw new Error("URL de paiement introuvable");
  }
};
