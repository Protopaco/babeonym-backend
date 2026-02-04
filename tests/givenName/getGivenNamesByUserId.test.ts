import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import authAnonymous from '../helpers/authAnonymous.js';

describe('Get Given Names By User ID', () => {
    it('200', async () => {
        const cookie = await authAnonymous();

        const res = await request(app)
            .get('/api/v1/givenName/')
            .set('Cookie', cookie);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('200 with genders filter', async () => {
        const cookie = await authAnonymous();

        const res = await request(app)
            .get('/api/v1/givenName/?genders=female,male')
            .set('Cookie', cookie);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('200 with decades filter', async () => {
        const cookie = await authAnonymous();

        const res = await request(app)
            .get('/api/v1/givenName/?decades=1990s,2000s')
            .set('Cookie', cookie);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('200 with popularity filter', async () => {
        const cookie = await authAnonymous();

        const res = await request(app)
            .get('/api/v1/givenName/?popularity=.5')
            .set('Cookie', cookie);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('200 with limit', async () => {
        const cookie = await authAnonymous();

        const res = await request(app)
            .get('/api/v1/givenName/?limit=10')
            .set('Cookie', cookie);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeLessThanOrEqual(10);
    });
}); 
