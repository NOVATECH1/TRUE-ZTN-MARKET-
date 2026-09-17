import {PrismaClient, Role, Badge} from '@prisma/client'
const p=new PrismaClient();
async function main(){
 await p.siteSettings.upsert({where:{id:'global'},update:{},create:{id:'global',supportEmail:'muhdinnovel@gmail.com'}})
 const admin=await p.user.upsert({where:{email:'muhdinnovel2@gmail.com'},update:{role:Role.ADMIN,badge:Badge.OFFICIAL,name:'ZTN Official',username:'ztnofficial'},create:{email:'muhdinnovel2@gmail.com',role:Role.ADMIN,badge:Badge.OFFICIAL,name:'ZTN Official',username:'ztnofficial'}})
 await p.userSettings.upsert({where:{userId:admin.id},update:{},create:{userId:admin.id}})
 console.log('Seeded admin:',admin.email)
}
main().finally(()=>p.$disconnect())
