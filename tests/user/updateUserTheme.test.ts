import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import cleanUp from "../helpers/cleanUp";
import authAnonymous from "../helpers/authAnonymous";

describe("Update User Theme", () => {
  it("204 - valid theme", async () => {
    const cookie = await authAnonymous();
    const res = await request(app)
      .put("/api/v1/user/theme")
      .set("Cookie", cookie)
      .send({
        theme: "dark",
      });

    expect(res.status).toBe(204);
    expect(res.body).toEqual({});

    const meRes = await request(app)
      .get("/api/v1/user/me")
      .set("Cookie", cookie);

    expect(meRes.status).toBe(200);
    expect(meRes.body.user).toEqual(
      expect.objectContaining({
        theme: "dark",
      }),
    );
    await cleanUp(cookie);
  });

  it("204 - leaves the surname untouched", async () => {
    const cookie = await authAnonymous();
    await request(app)
      .put("/api/v1/user/settings")
      .set("Cookie", cookie)
      .send({ surName: "Smith" });

    const res = await request(app)
      .put("/api/v1/user/theme")
      .set("Cookie", cookie)
      .send({ theme: "blue" });

    expect(res.status).toBe(204);

    const meRes = await request(app)
      .get("/api/v1/user/me")
      .set("Cookie", cookie);

    expect(meRes.body.user).toEqual(
      expect.objectContaining({
        theme: "blue",
        surName: "Smith",
      }),
    );
    await cleanUp(cookie);
  });

  it("400 - missing theme", async () => {
    const cookie = await authAnonymous();
    const res = await request(app)
      .put("/api/v1/user/theme")
      .set("Cookie", cookie)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Missing theme in request body");
    await cleanUp(cookie);
  });

  it("400 - invalid theme", async () => {
    const cookie = await authAnonymous();
    const res = await request(app)
      .put("/api/v1/user/theme")
      .set("Cookie", cookie)
      .send({
        theme: "invalid_theme",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid theme value");
    await cleanUp(cookie);
  });
});
