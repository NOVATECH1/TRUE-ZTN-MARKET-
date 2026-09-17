import { auth } from '@/auth'
import { headers } from 'next/headers'
import { db } from './db'
import { adminTwoFactorOk } from './admin-2fa'

export async function requestId(){
  return (await headers()).get('x-request-id') ?? crypto.randomUUID()
}

export async function requireUser(){
  const session = await auth()
  if(!session?.user?.id) throw new Error('Unauthorized')
  const user = await db.user.findUnique({where:{id:session.user.id}})
  if(!user) throw new Error('Unauthorized')
  return user
}

export async function requireAdmin(){
  const user = await requireUser()
  if(user.role !== 'ADMIN') throw new Error('Forbidden')
  if(!(await adminTwoFactorOk(user.id))) throw new Error('Admin 2FA required')
  return user
}
