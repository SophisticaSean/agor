/**
 * JWT Authentication Integration Tests
 *
 * Tests JWT authentication on custom API endpoints.
 * Requires daemon to be running on localhost:3030.
 *
 * Run with: INTEGRATION=true pnpm test auth-jwt
 */

import { beforeAll, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const runIntegration = process.env.INTEGRATION === 'true';
const describeIntegration = runIntegration ? describe : describe.skip;

const DAEMON_URL = 'http://localhost:3030';
let jwtToken: string;
let testSessionId: string;

beforeAll(async () => {
  // Load JWT token from ~/.agor/cli-token
  const tokenPath = path.join(os.homedir(), '.agor', 'cli-token');

  if (!fs.existsSync(tokenPath)) {
    throw new Error('No JWT token found at ~/.agor/cli-token. Run `agor login` first.');
  }

  const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
  jwtToken = tokenData.accessToken;

  if (!jwtToken) {
    throw new Error('No accessToken found in ~/.agor/cli-token');
  }

  console.log(`Using JWT token for tests`);

  // Create a test session to use for the tests
  const response = await fetch(`${DAEMON_URL}/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({
      title: 'JWT Auth Test Session',
      agentic_tool: 'claude-code',
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create test session: ${response.statusText}`);
  }

  const session = await response.json();
  testSessionId = session.session_id;
  console.log(`Created test session for tests`);
});

describeIntegration('JWT Authentication on Custom Endpoints', () => {
  it('should authenticate POST /sessions/:id/spawn with JWT token', async () => {
    const response = await fetch(`${DAEMON_URL}/sessions/${testSessionId}/spawn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        prompt: 'Test spawn from JWT auth test',
      }),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data).toHaveProperty('session_id');
    expect(data.parent_session_id).toBe(testSessionId);
  });

  it('should reject POST /sessions/:id/spawn without JWT token', async () => {
    const response = await fetch(`${DAEMON_URL}/sessions/${testSessionId}/spawn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Test spawn without auth',
      }),
    });

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.message).toContain('Authentication required');
  });

  it('should authenticate POST /sessions/:id/fork with JWT token', async () => {
    const response = await fetch(`${DAEMON_URL}/sessions/${testSessionId}/fork`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        prompt: 'Test fork from JWT auth test',
      }),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data).toHaveProperty('session_id');
    expect(data.parent_session_id).toBe(testSessionId);
  });

  it('should reject POST /sessions/:id/fork without JWT token', async () => {
    const response = await fetch(`${DAEMON_URL}/sessions/${testSessionId}/fork`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Test fork without auth',
      }),
    });

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.message).toContain('Authentication required');
  });

  it('should authenticate GET /sessions/:id/genealogy with JWT token', async () => {
    const response = await fetch(`${DAEMON_URL}/sessions/${testSessionId}/genealogy`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('session');
    expect(data.session.session_id).toBe(testSessionId);
  });

  it('should reject GET /sessions/:id/genealogy without JWT token', async () => {
    const response = await fetch(`${DAEMON_URL}/sessions/${testSessionId}/genealogy`, {
      method: 'GET',
    });

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.message).toContain('Authentication required');
  });

  it('should authenticate POST /sessions/:id/prompt with JWT token', async () => {
    const response = await fetch(`${DAEMON_URL}/sessions/${testSessionId}/prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        prompt: 'echo "test from JWT auth"',
        stream: false,
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('taskId');
    expect(data.success).toBe(true);
  });

  it('should reject POST /sessions/:id/prompt without JWT token', async () => {
    const response = await fetch(`${DAEMON_URL}/sessions/${testSessionId}/prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'echo "test without auth"',
        stream: false,
      }),
    });

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.message).toContain('Authentication required');
  });

  it('should authenticate POST /messages/bulk with JWT token', async () => {
    const response = await fetch(`${DAEMON_URL}/messages/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify([
        {
          session_id: testSessionId,
          role: 'user',
          content: [{ type: 'text', text: 'Test message from JWT auth test' }],
          status: 'completed',
        },
      ]),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data[0]).toHaveProperty('message_id');
  });

  it('should reject POST /messages/bulk without JWT token', async () => {
    const response = await fetch(`${DAEMON_URL}/messages/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          session_id: testSessionId,
          role: 'user',
          content: [{ type: 'text', text: 'Test message without auth' }],
          status: 'completed',
        },
      ]),
    });

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.message).toContain('Authentication required');
  });
});
