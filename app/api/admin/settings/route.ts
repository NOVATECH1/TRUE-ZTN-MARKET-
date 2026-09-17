import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {requireAdmin} from '@/lib/security'
export async function POST(req:Request){try{await requireAdmin();const fd=await req.formData();const data={tiktokUrl:String(fd.get('tiktokUrl')||''),emailUrl:String(fd.get('emailUrl')||''),phoneNumber:String(fd.get('phoneNumber')||''),telegramUrl:String(fd.get('telegramUrl')||''),supportEmail:String(fd.get('supportEmail')||'muhdinnovel@gmail.com')};await db.siteSettings.upsert({where:{id:'global'},update:data,create:{id:'global',...data}});return NextResponse.redirect(new URL('/admin/settings?updated=1',req.url))}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Unable to save settings'},{status:403})}}
