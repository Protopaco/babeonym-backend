import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import cleanUp from "../helpers/cleanUp.js";

describe("Logout", () => {
  it("200", async () => {
    const res = await request(app).get("/api/v1/auth/anonymous ");
    const cookie = res.headers["set-cookie"];

    const logoutRes = await request(app)
      .post("/api/v1/auth/logout")
      .set("Cookie", cookie);

    expect(logoutRes.status).toBe(204);

    const meRest = await request(app)
      .get("/api/v1/user/me")
      .set("Cookie", cookie);

    expect(meRest.status).toBe(401);

    await cleanUp(cookie);
  });
});
