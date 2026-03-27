const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(functions.config().stripe.secret);

admin.initializeApp();
const db = admin.firestore();

// 1. Create a White Label Merchant Account (Triggers KYC)
exports.createMerchantAccount = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required');

  try {
    // Create Stripe Express account (Stripe handles KYC UI)
    const account = await stripe.accounts.create({
      type: 'express',
      capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
    });

    // Save Stripe ID to Firebase
    await db.collection("merchants").doc(context.auth.uid).set({
      stripeAccountId: account.id,
      status: "pending_kyc"
    }, { merge: true });

    // Generate Onboarding Link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'https://your-site.com/onboarding-retry',
      return_url: 'https://your-site.com/dashboard',
      type: 'account_onboarding',
    });

    return { url: accountLink.url };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// 2. Create 3D Secure Payment Intent
exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
  const { amount, currency, merchantId } = data;
  
  const merchant = await db.collection("merchants").doc(merchantId).get();
  const stripeAccountId = merchant.data().stripeAccountId;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount, // in cents
    currency: currency,
    payment_method_types: ['card'],
    // 3D Secure is automatically handled by Stripe's "Automatic" setting
  }, {
    stripeAccount: stripeAccountId, // Routes money to the specific merchant
  });

  return { clientSecret: paymentIntent.client_secret };
});
