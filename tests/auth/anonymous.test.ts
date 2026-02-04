import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import cleanUp from "../helpers/cleanUp.js";

describe("Anonymous Auth", () => {
  it("200", async () => {
    const res = await request(app).get("/api/v1/auth/anonymous ");
    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();

    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user).toHaveProperty("username");
    expect(res.body.user).toHaveProperty("email");

    const cookie = res.headers["set-cookie"];

    const protectedRes = await request(app)
      .get("/api/v1/user/me")
      .set("Cookie", cookie);

    expect(protectedRes.status).toBe(200);

    await cleanUp(cookie);
  });
});
