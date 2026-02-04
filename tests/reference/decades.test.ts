import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { Decade } from "../../src/models/Decade.js";
import cleanUp from "../helpers/cleanUp.js";

describe("Get Decades", () => {
  it("200", async () => {
    const res = await request(app).get("/api/v1/auth/anonymous ");
    const cookie = res.headers["set-cookie"];

    const decRes = await request(app)
      .get("/api/v1/reference/decades")
      .set("Cookie", cookie);

    expect(decRes.status).toBe(200);
    const decades: Decade[] = decRes.body.decades;
    expect(decades.length).toBeGreaterThan(0);
    expect(decades[0]).toHaveProperty("id");
    expect(decades[0]).toHaveProperty("decade");
    expect(decades[0]).toHaveProperty("label");
    await cleanUp(cookie);
  });
});
