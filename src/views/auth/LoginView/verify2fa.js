const speakeasy = require('speakeasy')

var verified = speakeasy.totp.verify({
    secret: '@rBLbiv<)J<pg)B)rWTlT?QS^G^MNf#(',
    encoding: 'ascii',
    token: '765983'
})

console.log(verified)