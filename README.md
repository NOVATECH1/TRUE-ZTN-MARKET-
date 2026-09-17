# ZTN Store & Marketplace — production application source

This is the real ZTN application source, built as a fresh Next.js + PostgreSQL project. It is not the old ZTN codebase and it is not a visual demo.

## Before deployment
1. Copy `.env.example` to `.env`.
2. Set a production PostgreSQL `DATABASE_URL`.
3. Set a long random `AUTH_SECRET`.
4. Add Google OAuth credentials.
5. Add qBirr API key + receiver name + receiver account.
6. Add Google Cloud Storage service-account values and a bucket.
7. Add Resend email credentials.
8. Set `DEV_PAYMENT_MODE=false` in production.
9. Run `npm install`, `npm run db:generate`, `npm run db:push`, and `npm run db:seed`.
10. Run `npm test` and `npm run build` before the public launch.

## Payment
Production verification uses qBirr server-side verification at `POST /api/v1/verify`. The browser never sees the qBirr API key. Transaction references are stored as unique values in PostgreSQL to prevent replay. Overpayment is accepted according to qBirr's verification response.

For local testing only, set `DEV_PAYMENT_MODE=true` and use references such as `TEST-400` for a 400 ETB simulated payment or `TEST-FAIL` for a simulated failure.

## Footer / support settings
Footer contact links are stored in the `SiteSettings` table and can be edited from the Admin Panel, so TikTok, email, phone, Telegram, and support details do not require source-code changes.

Default support email: `muhdinnovel@gmail.com`
Admin email: `muhdinnovel2@gmail.com`

## Important
Never commit `.env` or any qBirr, Google, storage, or email secret to GitHub.
