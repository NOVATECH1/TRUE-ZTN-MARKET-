import {Resend} from 'resend'
export async function resendAdminCode(email:string,code:string){
 const key=process.env.RESEND_API_KEY
 if(!key) throw new Error('RESEND_API_KEY is not configured')
 const resend=new Resend(key)
 const from=process.env.EMAIL_FROM||'ZTN <no-reply@example.com>'
 await resend.emails.send({from,to:email,subject:'ZTN Admin verification code',text:`Your ZTN Admin verification code is ${code}. It expires in 10 minutes.`})
}
