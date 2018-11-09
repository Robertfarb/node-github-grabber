const fs = require('fs');
const http = require('http');
const qs = require('querystring');
const https = require('https');

const createOptionsObj = (username) => {
  return {
    hostname: 'api.github.com',
    path: `users/${username}/starred`,
    headers: {
      'User-Agent'
    }
  }
}

const githubServer = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', d => {
      body += d;
    });
    req.on('end', () => {
      const username = qs.parse(body).username
      const ws = fs.createWriteStream(`/${username}_starred_repos.txt`);
      const opts = createOptionsObj(username);
      https.get(opts, (dataStream) => {
        let repoData = '';
        dataStream.on('data', d => { repoData += d });
        dataStream.on('end', () => {
          const repos = JSON.parse(repoData).map(repo => {
            return `Repo: ${repo.name}. Stars: ${repo.stargazers_count}.`;
          }).join('\n')
          ws.write(repos);
          res.end(repos)
        })
      })
    })
  }
});

githubServer.listen(8000, () => console.log("Listening on port 8000"))
