import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import authAnonymous from "../helpers/authAnonymous.js";
import cleanUp from "../helpers/cleanUp.js";
import getNameCandidates from "../helpers/getNameCandidates.js";

describe("Given Names Search", () => {
  it("200", async () => {
    const cookie = await authAnonymous();

    const res = await request(app)
      .get("/api/v1/givenName/search?search=an")
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    await cleanUp(cookie);
  });

  it("400 missing search parameter", async () => {
    const cookie = await authAnonymous();

    const res = await request(app)
      .get("/api/v1/givenName/search")
      .set("Cookie", cookie);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "Query parameter 'search' is required",
    );

    await cleanUp(cookie);
  });

  it("200 approved names are excluded from search results", async () => {
    const cookie = await authAnonymous();

    const names = await getNameCandidates(cookie, 1);
    const nameToApprove = names[0];
    const approveRes = await request(app)
      .post("/api/v1/givenName/action")
      .set("Cookie", cookie)
      .send({
        givenCustomNameBridgeId: nameToApprove.givenCustomNameBridgeId,
        newState: "approved",
      });
    expect(approveRes.status).toBe(200);

    const searchRes = await request(app)
      .get(`/api/v1/givenName/search?search=${nameToApprove.givenName}`)
      .set("Cookie", cookie);
    expect(searchRes.status).toBe(200);
    const foundNames = searchRes.body as Array<{ givenName: string }>;
    const isNameFound = foundNames.some(
      (n) => n.givenName === nameToApprove.givenName,
    );
    expect(isNameFound).toBe(false);

    await cleanUp(cookie);
  });

  it("200 with limit parameter", async () => {
    const cookie = await authAnonymous();

    const res = await request(app)
      .get("/api/v1/givenName/search?search=a&limit=5")
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeLessThanOrEqual(5);

    await cleanUp(cookie);
  });
});
