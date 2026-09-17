import {NextResponse} from 'next/server'
import {z} from 'zod'
import {db} from '@/lib/db'
import {requireAdmin} from '@/lib/security'
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){
 try{await requireAdmin();const {id}=await params;const raw=await req.text();const source=raw?(()=>{try{return JSON.parse(raw)}catch{return Object.fromEntries(new URLSearchParams(raw))}})():{};const b=z.object({action:z.enum(['COMPLETE','CANCEL','REFUND'])}).parse(source);const order=await db.order.findUnique({where:{id}});if(!order)return NextResponse.json({error:'Order not found'},{status:404});const status=b.action==='COMPLETE'?'COMPLETED':b.action==='REFUND'?'REFUNDED':'CANCELLED';const updated=await db.order.update({where:{id},data:{status,completedAt:b.action==='COMPLETE'?new Date():undefined}});await db.notification.create({data:{userId:order.buyerId,title:`Order ${status.toLowerCase()}`,body:`Marketplace order ${order.id} is now ${status.toLowerCase()}.`}});return NextResponse.json(updated)}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Unable to update order'},{status:400})}}
