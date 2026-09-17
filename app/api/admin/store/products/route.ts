import {NextResponse} from 'next/server'
import {z} from 'zod'
import {db} from '@/lib/db'
import {requireAdmin} from '@/lib/security'
const schema=z.object({title:z.string().min(2).max(140),description:z.string().min(2).max(6000),category:z.string().min(1).max(80),price:z.number().int().nonnegative(),imageUrl:z.string().url().optional()})
export async function POST(req:Request){try{await requireAdmin();const b=schema.parse(await req.json());return NextResponse.json(await db.storeProduct.create({data:{...b,imageUrl:b.imageUrl??null}}),{status:201})}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Unable to create product'},{status:400})}}
export async function GET(){try{await requireAdmin();return NextResponse.json(await db.storeProduct.findMany({orderBy:{createdAt:'desc'}}))}catch(e){return NextResponse.json({error:'Forbidden'},{status:403})}}
