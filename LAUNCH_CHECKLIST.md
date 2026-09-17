# ZTN Launch Checklist

## Required private values
- DATABASE_URL
- AUTH_SECRET
- AUTH_GOOGLE_ID
- AUTH_GOOGLE_SECRET
- QBIRR_API_KEY
- QBIRR_RECEIVER_NAME
- QBIRR_RECEIVER_ACCOUNT
- GCS_PROJECT_ID
- GCS_CLIENT_EMAIL
- GCS_PRIVATE_KEY
- GCS_BUCKET
- RESEND_API_KEY
- EMAIL_FROM
- NEXT_PUBLIC_APP_URL

## Production switch
- Set `DEV_PAYMENT_MODE=false`.
- Confirm `NEXT_PUBLIC_APP_URL` is the public HTTPS URL.
- Run `npm test`.
- Run `npm run build`.
- Run `npm run db:push` against production PostgreSQL.
- Run `npm run db:seed` once.
- Confirm Google OAuth redirect URI matches the public domain.
- Confirm qBirr receiver name/account exactly match the account receiving money.
- Do one small real payment after deployment before public promotion.

## Admin
The seeded admin email is `muhdinnovel2@gmail.com`. Admin authorization is checked from the database role, not from a browser-supplied email/header.
