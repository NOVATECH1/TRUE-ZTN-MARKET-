import {z} from 'zod'
export const listingSchema=z.object({title:z.string().min(3).max(120),description:z.string().min(10).max(5000),category:z.string().min(1).max(60),price:z.number().int().nonnegative(),type:z.enum(['DIGITAL','TOPUP','SERVICE','ACCOUNT'])})
export const paymentSchema=z.object({orderId:z.string().optional(),subscriptionId:z.string().optional(),provider:z.string(),ref:z.string().min(4).max(200)})
