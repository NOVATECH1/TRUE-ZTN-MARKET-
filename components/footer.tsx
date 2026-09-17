import Link from 'next/link'
import { db } from '@/lib/db'

function Icon({type}:{type:'tiktok'|'email'|'phone'|'telegram'}){
  const common={width:18,height:18,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.8,ariaHidden:true as const}
  if(type==='email') return <svg {...common}><path d="M3 5h18v14H3z"/><path d="m3 7 9 6 9-6"/></svg>
  if(type==='phone') return <svg {...common}><path d="M6.6 3h3.1l1.5 4.1-1.9 1.6a15 15 0 0 0 6 6l1.6-1.9L21 14.3v3.1c0 1-.8 1.8-1.8 1.8C11.5 19.2 4.8 12.5 4.8 4.8 4.8 3.8 5.6 3 6.6 3Z"/></svg>
  if(type==='telegram') return <svg {...common}><path d="m21 4-3.1 15.1c-.2 1-1 1.2-1.8.7l-4.8-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8.1c.4-.4-.1-.6-.6-.2L6 12.4l-4.7-1.5c-1-.3-1-1 .2-1.4L19.8 3c.8-.3 1.5.4 1.2 1Z"/></svg>
  return <svg {...common}><path d="M8 3a4 4 0 0 1 4 4v2H9V7a1 1 0 0 0-2 0v10a1 1 0 0 0 2 0v-2h3v2a4 4 0 0 1-8 0V7a4 4 0 0 1 4-4Z"/><path d="M16 21V3"/></svg>
}

export async function Footer(){
  const s=await db.siteSettings.findUnique({where:{id:'global'}}).catch(()=>null)
  const support=s?.supportEmail||'muhdinnovel@gmail.com'
  return <footer className="footer"><div className="wrap">
    <div className="row" style={{justifyContent:'space-between'}}><div><strong>ZTN Store & Marketplace</strong><div className="muted small">Buy · Sell · Discover · Grow</div></div><div className="footlinks">
      {s?.tiktokUrl && <a className="iconlink" href={s.tiktokUrl} target="_blank" rel="noreferrer"><Icon type="tiktok"/>TikTok</a>}
      <a className="iconlink" href={s?.emailUrl||`mailto:${support}`}><Icon type="email"/>Email</a>
      {s?.phoneNumber && <a className="iconlink" href={`tel:${s.phoneNumber}`}><Icon type="phone"/>Phone</a>}
      {s?.telegramUrl && <a className="iconlink" href={s.telegramUrl} target="_blank" rel="noreferrer"><Icon type="telegram"/>Telegram</a>}
    </div></div>
    <div className="row footlegal" style={{marginTop:18}}><Link href="/policies">Policies</Link><span>Support: {support}</span></div>
    <div className="muted small" style={{marginTop:14}}>© {new Date().getFullYear()} ZTN</div>
  </div></footer>
}
