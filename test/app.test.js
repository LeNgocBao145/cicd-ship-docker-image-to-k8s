const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../src/app');

async function startServer() {
  const server = createApp();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  return { server, port };
}

test('health endpoint is healthy', async (context) => {
  const { server, port } = await startServer();
  context.after(() => server.close());

  const response = await fetch(`http://127.0.0.1:${port}/healthz`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('creates and lists tasks', async (context) => {
  const { server, port } = await startServer();
  context.after(() => server.close());
  const baseUrl = `http://127.0.0.1:${port}`;

  const created = await fetch(`${baseUrl}/tasks`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ title: 'Learn kind deployment' })
  });
  assert.equal(created.status, 201);
  assert.deepEqual(await created.json(), { id: '1', title: 'Learn kind deployment' });

  const listed = await fetch(`${baseUrl}/tasks`);
  assert.equal(listed.status, 200);
  assert.deepEqual(await listed.json(), [{ id: '1', title: 'Learn kind deployment' }]);
});

test('rejects a task without a title', async (context) => {
  const { server, port } = await startServer();
  context.after(() => server.close());

  const response = await fetch(`http://127.0.0.1:${port}/tasks`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ title: '   ' })
  });
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'title is required' });
});
