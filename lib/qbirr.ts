import { z } from 'zod'

const resultSchema = z.object({
  verified: z.boolean(),
  payer: z.string().nullable().optional(),
  amount: z.number().nullable().optional(),
  error: z.string().nullable().optional(),
})

export type QbirrResult = z.infer<typeof resultSchema>

export async function verifyQbirr(input: { provider: string; ref: string; amount: number }): Promise<QbirrResult> {
  if (process.env.DEV_PAYMENT_MODE === 'true') {
    if (input.ref.startsWith('TEST-FAIL')) return { verified: false, payer: null, amount: null, error: 'Simulated failure' }
    if (input.ref.startsWith('TEST-')) {
      const paid = Number(input.ref.match(/^TEST-(\d+)$/)?.[1] ?? input.amount)
      const verified = paid >= input.amount
      return { verified, payer: verified ? 'TEST PAYER' : null, amount: paid, error: verified ? '' : `Paid ${paid}, required ${input.amount}` }
    }
  }

  const key = process.env.QBIRR_API_KEY
  const receiverName = process.env.QBIRR_RECEIVER_NAME
  const receiverAccount = process.env.QBIRR_RECEIVER_ACCOUNT
  if (!key || !receiverName || !receiverAccount) throw new Error('qBirr environment is not fully configured')

  const response = await fetch(`${process.env.QBIRR_BASE_URL ?? 'https://verify.qbirr.com'}/api/v1/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-Key': key },
    body: JSON.stringify({
      provider: input.provider,
      ref: input.ref,
      amount: input.amount,
      receiver_name: receiverName,
      receiver_account: receiverAccount,
    }),
    cache: 'no-store',
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`qBirr HTTP ${response.status}: ${payload?.error ?? 'verification request failed'}`)
  return resultSchema.parse(payload)
}
