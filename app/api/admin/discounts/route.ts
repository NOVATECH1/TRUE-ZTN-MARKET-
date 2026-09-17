import {NextResponse} from 'next/server'
import {z} from 'zod'
import {db} from '@/lib/db'
import {requireAdmin} from '@/lib/security'
const schema=z.object({code:z.string().trim().min(3).max(40),type:z.enum(['PERCENT','FIXED']),value:z.number().int().positive(),expiresAt:z.string().optional(),usageLimit:z.number().int().positive().optional(),productId:z.string().optional()})
export async function POST(req:Request){try{await requireAdmin();const b=schema.parse(await req.json());if(b.type==='PERCENT'&&b.value>100)return NextResponse.json({error:'Percent must be <= 100'},{status:400});return NextResponse.json(await db.discountCode.create({data:{code:b.code.toUpperCase(),type:b.type,value:b.value,expiresAt:b.expiresAt?new Date(b.expiresAt):null,usageLimit:b.usageLimit??null,productId:b.productId??null}}),{status:201})}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Unable to create discount code'},{status:400})}}
export async function GET(){try{await requireAdmin();return NextResponse.json(await db.discountCode.findMany({orderBy:{createdAt:'desc'}}))}catch{return NextResponse.json({error:'Forbidden'},{status:403})}}
