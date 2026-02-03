
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

describe('Get Languages', () => {
    it('200', async () => {
        const res = await request(app).get('/api/v1/auth/anonymous ');
        const cookie = res.headers['set-cookie'];

        const langRes = await request(app)
            .get('/api/v1/reference/languages')
            .set('Cookie', cookie)

        expect(langRes.status).toBe(200);
        const languages = langRes.body.languages;
        expect(languages).toBeDefined();
    });
});
