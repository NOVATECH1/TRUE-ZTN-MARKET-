import {NextResponse} from 'next/server'
import {auth} from '@/auth'
import {db} from '@/lib/db'
import {verifyAdminCode} from '@/lib/admin-2fa'
export async function POST(req:Request){const s=await auth();if(!s?.user?.id)return NextResponse.redirect(new URL('/login',req.url));const fd=await req.formData();const code=String(fd.get('code')||'');const u=await db.user.findUnique({where:{id:s.user.id}});if(u?.role!=='ADMIN')return NextResponse.json({error:'Forbidden'},{status:403});const ok=await verifyAdminCode(u.id,code);return ok?NextResponse.redirect(new URL('/admin',req.url)):NextResponse.redirect(new URL('/admin/2fa?error=1',req.url))}
