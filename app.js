if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const board = require('./utils/board');
const authentication = require('./utils/authentication');
const generators = require('./utils/generators');
const fs = require('fs');
const escape = require('lodash.escape');
const https = require('https');
const express = require('express');


// express
const app = express();
app.set('view engine', 'pug');
app.use('/static', express.static('public')); // for serving static files from './public'

// store the code_verifier in your framework's session mechanism, if it is a cookie based solution
// it should be httpOnly (not readable by javascript) and encrypted.
let CODE_VERIFIER;
// storage should be more permanent and specific to each user
let ACCESS_TOKEN;

// auth routes
app.get("/", function (request, response) {
  console.log(`GET '/' 🤠 ${Date()}`);
  return response.send("<h1>Oh, hello there!</h1><a href='./login'>Login!</a>");
});

app.get("/login", function (request, response) {
  console.log(`GET '/login' 🤠 ${Date()}`);
  CODE_VERIFIER = generators.codeVerifier(); // generate random value
  const codeChallenge = generators.codeChallenge(CODE_VERIFIER);
  const loginUrl = authentication.getLogin(codeChallenge);
  return response.redirect(loginUrl);
});


app.get("/callback", function (request, response) {
  console.log(`GET '/callback' 🤠 ${Date()}`);
  const { code } = request.query;
  return authentication.getCallback(code, CODE_VERIFIER)
    .then(json => { ACCESS_TOKEN = json.access_token; return json; })
    .then(json => json.error ? response.send(escape(json.error)) : response.redirect('/board'))
    .catch(error => {
      console.log('error', error);
      const escapedMessage = escape(error.message);
      response.send(escapedMessage);
    });
})

// board route
app.get('/board', (request, response) => {
  console.log(`GET '/board' 🤠 ${Date()}`);
  return board.getBoard(ACCESS_TOKEN)
    .then(({ board, columns, cards }) => response.render('board', { board, columns, cards }))
    .catch(error => {
      console.log('error', error);
      const escapedMessage = escape(error.message);
      response.send(escapedMessage);
    });
});


// Start the server
const PORT = process.env.PORT || 8080;
https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app).listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
})

module.exports = app;