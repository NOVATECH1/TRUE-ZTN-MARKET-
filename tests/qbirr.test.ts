import {describe,it,expect,beforeEach} from 'vitest'
import {verifyQbirr} from '../lib/qbirr'

describe('qBirr verification behavior',()=>{beforeEach(()=>{process.env.DEV_PAYMENT_MODE='true'})
it('accepts exact payment',async()=>{const r=await verifyQbirr({provider:'cbe',ref:'TEST-398',amount:398});expect(r.verified).toBe(true)})
it('accepts overpayment',async()=>{const r=await verifyQbirr({provider:'cbe',ref:'TEST-400',amount:398});expect(r.verified).toBe(true)})
it('rejects insufficient payment',async()=>{const r=await verifyQbirr({provider:'cbe',ref:'TEST-397',amount:398});expect(r.verified).toBe(false)})
it('can simulate failure',async()=>{const r=await verifyQbirr({provider:'cbe',ref:'TEST-FAIL-1',amount:398});expect(r.verified).toBe(false)})})
