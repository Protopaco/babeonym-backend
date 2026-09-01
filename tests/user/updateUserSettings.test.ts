import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import cleanUp from "../helpers/cleanUp";
import authAnonymous from "../helpers/authAnonymous";

describe("Update User Settings", () => {
  it("200 - valid surName", async () => {
    const cookie = await authAnonymous();
    const res = await request(app)
      .put("/api/v1/user/settings")
      .set("Cookie", cookie)
      .send({
        surName: "Smith",
      });

    expect(res.status).toBe(200);
    expect(res.body.settings).toEqual({
      userId: expect.any(Number),
      theme: expect.any(String),
      surName: "Smith",
    });

    const meRes = await request(app)
      .get("/api/v1/user/me")
      .set("Cookie", cookie);

    expect(meRes.status).toBe(200);
    expect(meRes.body.user).toEqual(
      expect.objectContaining({
        id: res.body.settings.userId,
        surName: "Smith",
      }),
    );
    await cleanUp(cookie);
  });

  it("200 - surName is trimmed", async () => {
    const cookie = await authAnonymous();
    const res = await request(app)
      .put("/api/v1/user/settings")
      .set("Cookie", cookie)
      .send({
        surName: "  Smith  ",
      });

    expect(res.status).toBe(200);
    expect(res.body.settings.surName).toBe("Smith");
    await cleanUp(cookie);
  });

  it("400 - surName contains bad word", async () => {
    const cookie = await authAnonymous();
    const res = await request(app)
      .put("/api/v1/user/settings")
      .set("Cookie", cookie)
      .send({
        surName: "shite",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("surName contains inappropriate language");
    await cleanUp(cookie);
  });
});
