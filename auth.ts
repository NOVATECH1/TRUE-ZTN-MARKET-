import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const {handlers,auth,signIn,signOut}=NextAuth({
  session:{strategy:'jwt'},
  providers:[
    Google({clientId:process.env.AUTH_GOOGLE_ID!,clientSecret:process.env.AUTH_GOOGLE_SECRET!}),
    Credentials({
      credentials:{email:{label:'Email',type:'email'},password:{label:'Password',type:'password'}},
      async authorize(c){
        if(!c?.email||!c.password)return null
        const u=await db.user.findUnique({where:{email:String(c.email)}})
        if(!u?.passwordHash)return null
        if(!await bcrypt.compare(String(c.password),u.passwordHash))return null
        await db.user.update({where:{id:u.id},data:{lastLoginAt:new Date()}})
        return {id:u.id,email:u.email,name:u.name,image:u.imageUrl,role:u.role}
      }
    })
  ],
  callbacks:{
    async signIn({user,account}){
      if(account?.provider==='google' && user.email){
        const existing=await db.user.findUnique({where:{email:user.email}})
        if(!existing){
          const suffix=Math.random().toString(36).slice(2,12)
          const pendingUsername=`pending_${suffix}`.slice(0,30)
          const created=await db.user.create({data:{email:user.email,name:user.name||'New ZTN User',username:pendingUsername,imageUrl:user.image||null,onboardingRequired:true,settings:{create:{}},lastLoginAt:new Date()}})
          user.id=created.id
          ;(user as {role?:string}).role=created.role
          return '/onboarding'
        } else {
          user.id=existing.id
          ;(user as {role?:string}).role=existing.role
          await db.user.update({where:{id:existing.id},data:{lastLoginAt:new Date(),imageUrl:user.image||existing.imageUrl}})
          if(existing.onboardingRequired) return '/onboarding'
        }
      }
      return true
    },
    async jwt({token,user}){
      if(user){token.sub=user.id}
      if(token.sub){
        const dbUser=await db.user.findUnique({where:{id:String(token.sub)},select:{role:true,name:true,email:true,imageUrl:true}})
        token.role=dbUser?.role
      }
      return token
    },
    async session({session,token}){
      if(session.user){
        session.user.id=token.sub as string
        ;(session.user as {role?:string}).role=token.role as string | undefined
      }
      return session
    }
  }
})
