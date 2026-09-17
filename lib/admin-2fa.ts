import crypto from 'node:crypto'
import {cookies} from 'next/headers'
import {db} from '@/lib/db'
import {resendAdminCode} from '@/lib/email'
const COOKIE='ztn_admin_2fa'
function sha(v:string){return crypto.createHash('sha256').update(v).digest('hex')}
export async function requestAdminCode(userId:string,email:string){
 const code=String(Math.floor(100000+Math.random()*900000));
 await db.adminChallenge.updateMany({where:{userId,usedAt:null},data:{usedAt:new Date()}})
 await db.adminChallenge.create({data:{userId,codeHash:sha(code),expiresAt:new Date(Date.now()+10*60*1000)}})
 await resendAdminCode(email,code)
}
export async function verifyAdminCode(userId:string,code:string){
 const row=await db.adminChallenge.findFirst({where:{userId,usedAt:null,expiresAt:{gt:new Date()}},orderBy:{createdAt:'desc'}})
 if(!row) return false
 if(row.attempts>=5) return false
 if(sha(code)!==row.codeHash){await db.adminChallenge.update({where:{id:row.id},data:{attempts:{increment:1}}});return false}
 await db.adminChallenge.update({where:{id:row.id},data:{usedAt:new Date()}})
 const cookieStore=await cookies();cookieStore.set(COOKIE,sha(`${userId}.${process.env.AUTH_SECRET}`),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:30*24*60*60})
 return true
}
export async function adminTwoFactorOk(userId:string){const v=(await cookies()).get(COOKIE)?.value;return v===sha(`${userId}.${process.env.AUTH_SECRET}`)}
