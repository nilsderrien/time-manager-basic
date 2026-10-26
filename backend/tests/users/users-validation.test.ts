import assert from 'node:assert/strict';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import { createApp } from '../../src/app.js';

async function post(server: Server, body: unknown) {
  const { port } = server.address() as AddressInfo;
  const response = await fetch(`http://127.0.0.1:${port}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: response.status, body: await response.json() };
}

describe('POST /api/users request validation', () => {
  let server: Server;

  before(() => {
    server = createApp(async () => {}).listen(0);
  });

  after(() => {
    server.close();
  });

  it('returns validation details for an invalid request body', async () => {
    const response = await post(server, { first_name: '', email: 'not-an-email' });

    assert.equal(response.status, 400);
    assert.equal(response.body.error.code, 'INVALID_REQUEST_BODY');
    assert.ok(Array.isArray(response.body.error.details));
  });

  it('passes a valid request body to the route handler', async () => {
    const response = await post(server, {
      first_name: 'Ada',
      last_name: 'Lovelace',
      email: 'ada@example.com',
      contract_start_date: '2026-01-01',
    });

    assert.equal(response.status, 501);
    assert.equal(response.body.error.code, 'NOT_IMPLEMENTED');
  });
});