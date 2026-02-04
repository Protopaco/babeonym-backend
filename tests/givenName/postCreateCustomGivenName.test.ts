import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

describe('Create Custom Given Name', () => {
    it('201', async () => {
        const res = await request(app).get('/api/v1/auth/anonymous ');
        const cookie = res.headers['set-cookie'];

        const createRes = await request(app)
            .post('/api/v1/givenName/custom')
            .set('Cookie', cookie)
            .send({
                "customGivenName": 'TestName'
            });

        expect(createRes.status).toBe(200);
        expect(createRes.body.message).toBe('Custom given name added successfully');

        const getApprovedRes = await request(app)
            .get('/api/v1/givenName/approved')
            .set('Cookie', cookie);

        expect(getApprovedRes.status).toBe(200);
        const approvedNames: string[] = getApprovedRes.body
        expect(getApprovedRes.body).toContainEqual(
            expect.objectContaining({ givenName: 'TestName' }));

        const resSecondTry = await request(app)
            .post('/api/v1/givenName/custom')
            .set('Cookie', cookie)
            .send({
                "customGivenName": 'TestName'
            });

        expect(resSecondTry.status).toBe(409);
        expect(resSecondTry.body.message).toBe("Conflict: Duplicate entry");
    });
});