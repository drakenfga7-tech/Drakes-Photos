# Your Photo Store

A simple website that sells your photos. Visitors see a low-res watermarked
preview; after they pay through Stripe, they get an automatic download link
for the full-resolution file. Only you can change prices, because only you
have access to this code and where it's hosted — there's no public "admin
login" to worry about.

## How it's organized (where everything goes)

- `data/photos.json` — **this is your price list.** One entry per photo:
  title, price, and filenames. Edit this file to add photos or change prices.
- `public/previews/` — put your **low-res / watermarked** preview images here
  (the ones everyone can see for free).
- `photos-original/` — put your **full-resolution** files here. This folder
  is NOT public. It can only be reached through the paid-download check in
  `pages/api/verify-download.js`, so nobody can find or guess a link to it.

To add a new photo:
1. Save a small preview version (see "Making previews" below) into
   `public/previews/your-photo.jpg`
2. Save the full-size original into `photos-original/your-photo.jpg`
3. Add an entry to `data/photos.json`:
```json
{
  "id": "your-photo",
  "title": "Your Photo Title",
  "priceUsd": 15.00,
  "preview": "/previews/your-photo.jpg",
  "original": "your-photo.jpg"
}
```
4. Save the file and redeploy (see below) — that's the whole "admin panel."

## Making low-res previews (visible but not stealable)

Any of these work:
- Resize the image so the longest side is ~1000px (fine for on-screen viewing,
  useless for printing).
- Free tools: **Squoosh.app** (resize + compress in the browser, no install),
  or Photoshop/GIMP "Export for Web."
- Optional extra protection: add a subtle diagonal text watermark with your
  name across the image before saving the preview.

## One-time setup

### 1. Get a free Stripe account
Go to https://dashboard.stripe.com/register and sign up (free, no monthly
fee — Stripe takes a small % + flat fee only when you actually make a sale,
currently around 2.9% + $0.30 per US card transaction, but check their
pricing page for current rates).

Once logged in, go to https://dashboard.stripe.com/apikeys and copy your
**Secret key** (starts with `sk_test_...` while testing, `sk_live_...` once
you're ready for real payments).

### 2. Install dependencies
Open a terminal in this folder and run:
```
npm install
```

### 3. Add your Stripe key
Copy `.env.local.example` to a new file called `.env.local`, and paste your
Stripe secret key in:
```
STRIPE_SECRET_KEY=sk_test_your_real_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Test it locally
```
npm run dev
```
Visit http://localhost:3000 — you should see the two sample photos. Use
Stripe's test card `4242 4242 4242 4242`, any future expiry date, and any
CVC to test a full purchase without real money.

## Putting it live on the internet (free)

The easiest free host for this kind of site is **Vercel** (made by the same
company behind this framework):

1. Create a free account at https://vercel.com (you can sign up with GitHub)
2. Push this folder to a new GitHub repository (Vercel can walk you through
   this, or ask me and I'll give you the exact commands)
3. In Vercel, click "New Project," pick your repository, and deploy
4. In the Vercel project's Settings → Environment Variables, add:
   - `STRIPE_SECRET_KEY` = your Stripe secret key
   - `NEXT_PUBLIC_BASE_URL` = your Vercel site's URL (e.g.
     `https://your-store.vercel.app`) — you'll get this after the first
     deploy, then add the variable and redeploy once
5. Once live, switch to your Stripe **live** secret key (instead of the
   `sk_test_...` one) when you're ready to accept real payments.

## Changing a price later

Edit the `priceUsd` number in `data/photos.json`, save, then push the change
to GitHub — Vercel automatically redeploys it. No login page, no dashboard
to hunt through. Only you can do this because only you have access to the
GitHub repo and Vercel project.
