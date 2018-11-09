const fs = require('fs');
const http = require('http');
const qs = require('querystring');
const https = require('https');

const githubServer = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', d => {
      body += d;
    });
    req.on('end', () => {
      const username = qs.parse(body).username
      res.end(username);
    });
  }
});


const options = {
  hostname: 'api.github.com',
  port: 80,
  path: '/',
  method: 'GET',
};

const githubReq = https.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');

  res.on('data', (d) => {
    console.log(`BODY: ${d}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

githubReq.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});


githubServer.listen(8000, () => console.log("Listening on port 8000"))
