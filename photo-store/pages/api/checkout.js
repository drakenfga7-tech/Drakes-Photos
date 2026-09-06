import Stripe from 'stripe';
import photos from '../../data/photos.json';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.body;
  const photo = photos.find((p) => p.id === id);

  if (!photo) {
    return res.status(404).json({ error: 'Photo not found' });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: photo.title,
              images: [`${baseUrl}${photo.preview}`],
            },
            // Price always comes from our own data file, never from the browser.
            unit_amount: Math.round(photo.priceUsd * 100),
          },
          quantity: 1,
        },
      ],
      metadata: { photoId: photo.id },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not start checkout' });
  }
}
