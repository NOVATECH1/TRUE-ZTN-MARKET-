import Link from 'next/link'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { adminTwoFactorOk } from '@/lib/admin-2fa'

export default async function AdminKyc() {
  const s = await auth()

  if (!s?.user?.id) {
    return (
      <main className="section wrap">
        <div className="card">
          <h1>KYC</h1>
          <Link className="btn primary" href="/login">
            Sign in
          </Link>
        </div>
      </main>
    )
  }

  const admin = await db.user.findUnique({
    where: { id: s.user.id },
  })

  if (admin?.role !== 'ADMIN') {
    return (
      <main className="section wrap">
        <div className="card">
          <h1>Access denied</h1>
        </div>
      </main>
    )
  }

  if (!(await adminTwoFactorOk(admin.id))) {
    return (
      <main className="section wrap">
        <div className="card">
          <h1>Admin verification required</h1>
          <Link className="btn primary" href="/admin/2fa">
            Verify device
          </Link>
        </div>
      </main>
    )
  }

  const rows = await db.kycSubmission.findMany({
    where: { status: 'PENDING' },
    include: {
      user: {
        select: {
          name: true,
          username: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  return (
    <main className="section wrap">
      <h1>Pending KYC</h1>

      <div className="grid" style={{ marginTop: 18 }}>
        {rows.map((x: typeof rows[number]) => (
          <div className="card" key={x.id}>
            <h3>{x.user.name}</h3>

            <p className="small muted">
              @{x.user.username} · {x.user.email}
            </p>

            <p>Document: {x.documentType}</p>
            <p>Phone: {x.phoneNumber}</p>

            <div className="row">
              <form
                action={`/api/admin/kyc/${x.id}`}
                method="post"
              >
                <input
                  type="hidden"
                  name="decision"
                  value="VERIFIED"
                />
                <button className="btn primary">
                  Approve
                </button>
              </form>

              <form
                action={`/api/admin/kyc/${x.id}`}
                method="post"
              >
                <input
                  name="reason"
                  placeholder="Rejection reason"
                />
                <input
                  type="hidden"
                  name="decision"
                  value="REJECTED"
                />
                <button className="btn">
                  Reject
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
