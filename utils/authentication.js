const fetch = require('node-fetch');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const PORT = process.env.PORT || 8080;
const REDIRECT_URI = `https://localhost:${PORT}/callback`;
const SCOPE = 'offline_access;https://api.gmelius.com/public/auth/boards/read';

const AUTHORIZE_URL = 'https://gmelius.io/oauth/authorize';
const GMELIUS_URL = 'https://api.gmelius.com';

function getLogin (codeChallenge) {
  return `${AUTHORIZE_URL}?client_id=${CLIENT_ID}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}&code_challenge=${codeChallenge}`;
}

function btoa (str) { return Buffer.from(str, 'utf-8').toString('base64'); }

function getCallback (code, codeVerifier) {
  const params = new URLSearchParams();
  params.append('code', code);
  params.append('code_verifier', codeVerifier);
  params.append('redirect_uri', REDIRECT_URI);
  params.append('grant_type', 'authorization_code');
  params.append('scope', 'offline_access');

  const headers = { 'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)};
 
  return fetch(GMELIUS_URL + '/public/v1/token', { method: 'POST', body: params, headers })
    .then(response => response.json())
}

function fetchResource (accessToken, route) {
  if (!accessToken) throw new Error('No access token');
  // add access token as bearer
  const headers = { 'Authorization': 'Bearer ' + accessToken };
  // call Gmelius API: GET https://api.gmelius.com/...
  return fetch(GMELIUS_URL + route, { headers })
    .then(res => res.json())
    .then(json => json.data);
}

module.exports = {
  getCallback,
  getLogin,
  fetchResource
};