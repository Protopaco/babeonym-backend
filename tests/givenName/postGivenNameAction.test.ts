
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import authAnonymous from '../helpers/authAnonymous.js';

describe('Given Name Action - Accept', () => {
    it('200', async () => {
        const cookie = await authAnonymous();

    });
})

