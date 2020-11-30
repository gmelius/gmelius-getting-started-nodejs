// https://github.com/panva/node-openid-client/blob/master/lib/helpers/generators.js
const { createHash, randomBytes } = require('crypto');

const { encode: base64url } = require('base64url');

const random = (bytes = 32) => base64url(randomBytes(bytes));

module.exports = {
  codeVerifier: random,
  codeChallenge: (codeVerifier) => base64url(createHash('sha256').update(codeVerifier).digest()),
};