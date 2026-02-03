import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

describe('Get Cultures', () => {
    it('200', async () => {
        const res = await request(app).get('/api/v1/auth/anonymous ');
        const cookie = res.headers['set-cookie'];

        const decRes = await request(app)
            .get('/api/v1/reference/cultures')
            .set('Cookie', cookie)

        expect(decRes.status).toBe(200);
        const cultures = decRes.body.cultures;
        expect(cultures).toBeDefined();
    })
})  