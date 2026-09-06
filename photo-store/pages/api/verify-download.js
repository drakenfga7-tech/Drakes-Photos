import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';
import photos from '../../data/photos.json';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { session_id, download } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: 'Missing session_id' });
  }

  try {
    // Ask Stripe directly whether this session really was paid.
    // This is the step that stops anyone from grabbing a download
    // link without actually paying.
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return res.status(402).json({ error: 'Payment not completed' });
    }

    const photoId = session.metadata.photoId;
    const photo = photos.find((p) => p.id === photoId);

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    if (!download) {
      // Just confirming payment succeeded, not sending the file yet.
      return res.status(200).json({ ok: true });
    }

    // Files live outside /public so they can never be reached by
    // guessing a URL - only this verified route can serve them.
    const filePath = path.join(process.cwd(), 'photos-original', photo.original);

    if (!fs.existsSync(filePath)) {
      return res.status(500).json({ error: 'Original file missing on server' });
    }

    const fileBuffer = fs.readFileSync(filePath);
    res.setHeader('Content-Disposition', `attachment; filename="${photo.original}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    return res.status(200).send(fileBuffer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not verify payment' });
  }
}
