import { test, expect } from '@playwright/test';

const REQRES_BASE_URL = process.env.REQRES_BASE_URL || 'https://reqres.in';

const REQRES_HEADERS = {
  'x-api-key': process.env.REQRES_API_KEY ?? 'free_user_3GV7KBEESd0PnNSWS6LtzlyilLV',
  'Content-Type': 'application/json',
} as const;

/** single user response schema from data property returned by GET /api/users */
interface ReqResUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

//  Paginated list response schema for GET /api/users?page=2 
interface ReqResUsersListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: ReqResUser[];
}

//  Successful create response for POST /api/users 
interface ReqResCreateUserResponse {
  name: string;
  job: string;
  id: string;
  createdAt: string;
}

test.describe('ReqRes Users API', () => {
  test('GET /api/users?page=2 returns 200 and users with required keys', async ({
    request,
  }) => {
    const response = await request.get(`${REQRES_BASE_URL}/api/users?page=2`, {
      headers: REQRES_HEADERS,
    });

    expect(response.status()).toBe(200);

    const body: ReqResUsersListResponse = await response.json();

    expect(Array.isArray(body.data)).toBe(true);

    body.data.forEach((user: ReqResUser) => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('first_name');
      expect(user).toHaveProperty('last_name');

      expect(typeof user.id).toBe('number');
      expect(typeof user.email).toBe('string');
      expect(typeof user.first_name).toBe('string');
      expect(typeof user.last_name).toBe('string');
    });
  });

  test('POST /api/users creates a user and returns 201 with typed fields', async ({
    request,
  }) => {
    const payload = { name: 'morpheus', job: 'leader' };

    // 1) Create
    const response = await request.post(`${REQRES_BASE_URL}/api/users`, {
      headers: REQRES_HEADERS,
      data: payload,
    });

    expect(response.status()).toBe(201);

    const body: ReqResCreateUserResponse = await response.json();

    expect(body).toHaveProperty('name');
    expect(body).toHaveProperty('job');
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('createdAt');

    expect(typeof body.name).toBe('string');
    expect(typeof body.job).toBe('string');
    expect(typeof body.id).toBe('string');
    expect(typeof body.createdAt).toBe('string');

    expect(body.name).toBe(payload.name);
    expect(body.job).toBe(payload.job);

    expect(body.id.length).toBeGreaterThan(0);
    expect(body.createdAt.length).toBeGreaterThan(0);
  });
});
