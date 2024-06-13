// https://github.com/panva/node-openid-client/blob/master/lib/helpers/generators.js
import { createHash, randomBytes } from 'crypto';
import base64url from 'base64url';

const codeVerifier = (bytes = 32) => base64url.encode(randomBytes(bytes));

const codeChallenge = (verifier) => base64url.encode(createHash('sha256').update(verifier).digest());

export default {
  codeVerifier,
  codeChallenge
};
