import {NextResponse} from 'next/server'
import {auth} from '@/auth'
import {db} from '@/lib/db'
import {requestAdminCode} from '@/lib/admin-2fa'
export async function POST(req:Request){const s=await auth();if(!s?.user?.id)return NextResponse.redirect(new URL('/login',req.url));const u=await db.user.findUnique({where:{id:s.user.id}});if(u?.role!=='ADMIN')return NextResponse.json({error:'Forbidden'},{status:403});try{await requestAdminCode(u.id,u.email);return NextResponse.redirect(new URL('/admin/2fa?sent=1',req.url))}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Unable to send code'},{status:500})}}
