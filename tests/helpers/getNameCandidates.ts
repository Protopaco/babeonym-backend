import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

export default async (cookie: string, numberOfCandidates: number = 5) => {
  const getNamesRes = await request(app)
    .get(`/api/v1/givenName/candidates?limit=${numberOfCandidates}`)
    .set("Cookie", cookie);

  expect(getNamesRes.status).toBe(200);
  const names = getNamesRes.body;
  expect(Array.isArray(names)).toBe(true);
  expect(names).toHaveLength(numberOfCandidates);

  return names;
};
