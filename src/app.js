const http = require('node:http');

function createApp() {
  const tasks = [];

  return http.createServer((request, response) => {
    if (request.method === 'GET' && request.url === '/healthz') {
      response.writeHead(200, { 'content-type': 'application/json' });
      return response.end(JSON.stringify({ status: 'ok' }));
    }

    if (request.method === 'GET' && request.url === '/tasks') {
      response.writeHead(200, { 'content-type': 'application/json' });
      return response.end(JSON.stringify(tasks));
    }

    if (request.method === 'POST' && request.url === '/tasks') {
      let body = '';
      request.on('data', (chunk) => { body += chunk; });
      request.on('end', () => {
        try {
          const task = JSON.parse(body || '{}');
          if (typeof task.title !== 'string' || !task.title.trim()) {
            response.writeHead(400, { 'content-type': 'application/json' });
            return response.end(JSON.stringify({ error: 'title is required' }));
          }

          const created = { id: String(tasks.length + 1), title: task.title.trim() };
          tasks.push(created);
          response.writeHead(201, { 'content-type': 'application/json' });
          response.end(JSON.stringify(created));
        } catch {
          response.writeHead(400, { 'content-type': 'application/json' });
          response.end(JSON.stringify({ error: 'body must be JSON' }));
        }
      });
      return;
    }

    response.writeHead(404, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ error: 'not found' }));
  });
}

module.exports = { createApp };
