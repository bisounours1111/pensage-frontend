/**
 * Configuration Stripe
 *
 * NOTE IMPORTANTE: Pour que Stripe fonctionne en production, vous devez:
 *
 * 1. Créer un backend API (Express.js, Next.js API routes, etc.)
 * 2. Implémenter les endpoints suivants:
 *    - POST /api/create-checkout-session - Crée une session Stripe
 *    - GET /api/verify-payment/:sessionId - Vérifie un paiement
 *    - POST /api/webhook/stripe - Webhook pour les événements Stripe
 *
 * 3. Utiliser la clé secrète uniquement côté serveur
 * 4. Mettre en place les webhooks Stripe pour synchroniser les paiements
 */

export const STRIPE_CONFIG = {
  // Clé publique (sécurisée côté client)
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,

  // URL du backend API
  backendUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",

  // Configuration de test
  isTestMode: true,

  // URLs de retour après paiement
  successUrl: `${window.location.origin}/payment/success`,
  cancelUrl: `${window.location.origin}/payment/cancel`,
};

/**
 * Vérifier si Stripe est configuré
 */
export const isStripeConfigured = () => {
  console.log(STRIPE_CONFIG.publishableKey);
  console.log(!!STRIPE_CONFIG.publishableKey);
  return !!STRIPE_CONFIG.publishableKey;
};

/**
 * Créer une session de paiement (doit être appelé côté serveur)
 *
 * EXEMPLE D'ENDPOINT BACKEND (Express.js):
 *
 * app.post('/api/create-checkout-session', async (req, res) => {
 *   const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
 *
 *   const session = await stripe.checkout.sessions.create({
 *     payment_method_types: ['card'],
 *     line_items: [
 *       {
 *         price_data: {
 *           currency: 'eur',
 *           product_data: {
 *             name: req.body.productName,
 *           },
 *           unit_amount: req.body.price * 100, // Convertir en centimes
 *         },
 *         quantity: 1,
 *       },
 *     ],
 *     mode: 'payment',
 *     success_url: STRIPE_CONFIG.successUrl,
 *     cancel_url: STRIPE_CONFIG.cancelUrl,
 *     metadata: {
 *       userId: req.body.userId,
 *       tokenAmount: req.body.tokenAmount,
 *       type: req.body.type
 *     },
 *   });
 *
 *   res.json({ sessionId: session.id, clientSecret: session.client_secret });
 * });
 */

export default STRIPE_CONFIG;
