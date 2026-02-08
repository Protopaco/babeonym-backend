import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import authAnonymous from "../helpers/authAnonymous.js";
import Gender from "../../src/models/Gender.js";
import cleanUp from "../helpers/cleanUp.js";

describe("Get Given Names By User ID", () => {
  it("200", async () => {
    const cookie = await authAnonymous();

    const res = await request(app)
      .get("/api/v1/givenName/candidates")
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("200 with genders filter", async () => {
    const cookie = await authAnonymous();

    const res = await request(app)
      .get("/api/v1/givenName/candidates?genders=female&include=meta")
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(
      res.body.every((response: any) => response.gender === Gender.FEMALE),
    ).toBe(true);
  });

  it("200 with decades filter", async () => {
    const cookie = await authAnonymous();

    const res = await request(app)
      .get("/api/v1/givenName/candidates?decadeIds=1,2")
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("200 with popularity filter", async () => {
    const cookie = await authAnonymous();

    const res = await request(app)
      .get("/api/v1/givenName/candidates?popularity=.5")
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("200 with limit", async () => {
    const cookie = await authAnonymous();

    const res = await request(app)
      .get("/api/v1/givenName/candidates?limit=10")
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeLessThanOrEqual(10);
    await cleanUp(cookie);
  });
});
