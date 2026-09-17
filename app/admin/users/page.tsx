import Link from 'next/link'
import {auth} from '@/auth'
import {db} from '@/lib/db'
import {adminTwoFactorOk} from '@/lib/admin-2fa'
export default async function AdminUsers(){
 const s=await auth(); if(!s?.user?.id)return <main className="section wrap"><div className="card"><h1>Users</h1><Link className="btn primary" href="/login">Sign in</Link></div></main>
 const a=await db.user.findUnique({where:{id:s.user.id}}); if(a?.role!=='ADMIN')return <main className="section wrap"><div className="card"><h1>Access denied</h1></div></main>
 if(!(await adminTwoFactorOk(a.id)))return <main className="section wrap"><div className="card"><Link className="btn primary" href="/admin/2fa">Verify Admin device</Link></div></main>
 const users=await db.user.findMany({orderBy:{createdAt:'desc'},take:100,select:{id:true,name:true,username:true,email:true,badge:true,role:true,kycStatus:true,lastLoginAt:true,createdAt:true}})
 return <main className="wrap section"><div className="row" style={{justifyContent:'space-between'}}><div><h1>Users</h1><p className="muted">Account, role, badge and verification overview.</p></div><Link className="btn" href="/admin">Admin home</Link></div><div className="grid" style={{marginTop:18}}>{users.map(u=><div className="card" key={u.id}><div className="row" style={{justifyContent:'space-between'}}><strong>{u.name}</strong><span className="small muted">{u.role}</span></div><div className="small">@{u.username}</div><div className="small muted">{u.email}</div><div className="small muted" style={{marginTop:8}}>KYC: {u.kycStatus} · Badge: {u.badge}</div><div className="small muted">Last login: {u.lastLoginAt?u.lastLoginAt.toLocaleString():'Never'}</div></div>)}</div></main>
}
