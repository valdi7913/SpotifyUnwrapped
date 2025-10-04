const code = new URLSearchParams(window.location.search).get('code');
const codeVerifier = window.localStorage.getItem('code_verifier');

const clientId = '67d103834fa34ca58c4ad528774c43be';
const redirectUri = 'http://127.0.0.1:5500/redirect.html';

const body = new URLSearchParams({
  grant_type: 'authorization_code',
  code,
  redirect_uri: redirectUri,
  client_id: clientId,
  code_verifier: codeVerifier
});

fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body
})
  .then(response => response.json())
  .then(data => {
    // data.access_token, data.refresh_token, etc.
    console.log(data);
    localStorage.setItem('access_token', data.access_token);
    window.location.href = 'http://127.0.0.1:5500/';
  });