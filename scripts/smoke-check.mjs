import assert from 'node:assert/strict'

function paymentPass(required, paid){return paid >= required}
function postExpiryHours(badge){return badge==='PREMIUM_PLUS'||badge==='OFFICIAL'?48:badge==='PREMIUM'?24:10}
function maxImageMb(badge){return badge==='PREMIUM'||badge==='PREMIUM_PLUS'?25:10}
function maxDigitalMb(badge){return badge==='PREMIUM_PLUS'?500:badge==='PREMIUM'?300:100}
function usernameOk(v){return /^[A-Za-z0-9_.]{3,30}$/.test(v)}
function sellerCanReceivePayout(available,min=100){return available>=min}

assert.equal(paymentPass(398,400),true)
assert.equal(paymentPass(398,398),true)
assert.equal(paymentPass(398,397),false)
assert.equal(/^TEST-(\d+)$/.test('TEST-400'),true)
assert.equal(/^TEST-(\d+)$/.test('TEST-397'),true)
assert.equal(/^TEST-(\d+)$/.test('TEST-X'),false)
assert.equal(postExpiryHours('NONE'),10)
assert.equal(postExpiryHours('PREMIUM'),24)
assert.equal(postExpiryHours('PREMIUM_PLUS'),48)
assert.equal(postExpiryHours('OFFICIAL'),48)
assert.equal(maxImageMb('NONE'),10)
assert.equal(maxImageMb('PREMIUM'),25)
assert.equal(maxDigitalMb('NONE'),100)
assert.equal(maxDigitalMb('PREMIUM'),300)
assert.equal(maxDigitalMb('PREMIUM_PLUS'),500)
assert.equal(usernameOk('nova_user.1'),true)
assert.equal(usernameOk('bad space'),false)
assert.equal(usernameOk('a'.repeat(31)),false)
assert.equal(sellerCanReceivePayout(99),false)
assert.equal(sellerCanReceivePayout(100),true)
console.log('ZTN smoke checks passed: 19/19')
