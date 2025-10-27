import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import colors from '../../utils/constants/colors';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutButton = ({ 
  price, 
  onSuccess, 
  onError, 
  productName, 
  tokenAmount, 
  userId,
  type = 'token' // 'token' ou 'subscription'
}) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    
    try {
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe n\'est pas initialisé. Vérifiez votre clé publique.');
      }

      // Créer la session de paiement via votre backend
      // NOTE: Vous devez implémenter un endpoint backend pour créer des sessions Stripe
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: price,
          productName,
          tokenAmount,
          userId,
          type
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la session de paiement');
      }

      const { sessionId, clientSecret } = await response.json();

      // Rediriger vers la page de paiement Stripe
      const result = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      onError(error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ backgroundColor: colors.primary, color: colors.white }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.target.style.backgroundColor = colors.primaryLight;
        }
      }}
      onMouseLeave={(e) => {
        if (!loading) {
          e.target.style.backgroundColor = colors.primary;
        }
      }}
    >
      {loading ? 'Chargement...' : `Acheter pour ${price}€`}
    </button>
  );
};

export default CheckoutButton;

