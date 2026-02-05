import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import cleanUp from "../helpers/cleanUp";
import Theme from "../../src/models/Theme";
import authAnonymous from "../helpers/authAnonymous";

describe("Update User Settings", () => {
  it("200 - valid theme and surName", async () => {
    const cookie = await authAnonymous();
    const res = await request(app)
      .put("/api/v1/user/settings")
      .set("Cookie", cookie)
      .send({
        theme: "dark",
        surName: "Smith",
      });

    expect(res.status).toBe(200);
    expect(res.body.settings).toEqual({
      userId: expect.any(Number),
      theme: "dark",
      surName: "Smith",
    });

    const meRes = await request(app)
      .get("/api/v1/user/me")
      .set("Cookie", cookie);

    expect(meRes.status).toBe(200);
    expect(meRes.body.user).toEqual(
      expect.objectContaining({
        id: res.body.settings.userId,
        theme: "dark",
        surName: "Smith",
      }),
    );
    await cleanUp(cookie);
  });

  it("400 - missing theme", async () => {
    const cookie = await authAnonymous();
    const res = await request(app)
      .put("/api/v1/user/settings")
      .set("Cookie", cookie)
      .send({
        surName: "Smith",
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing theme or surName in request body");
    await cleanUp(cookie);
  });

  it("400 - missing surName", async () => {
    const cookie = await authAnonymous();
    const res = await request(app)
      .put("/api/v1/user/settings")
      .set("Cookie", cookie)
      .send({
        theme: "dark",
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing theme or surName in request body");
    await cleanUp(cookie);
  });

  it("400 - invalid theme", async () => {
    const cookie = await authAnonymous();
    const res = await request(app)
      .put("/api/v1/user/settings")
      .set("Cookie", cookie)
      .send({
        theme: "invalid_theme",
        surName: "Smith",
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid theme value");
    await cleanUp(cookie);
  });

  it("400 - surName contains bad word", async () => {
    const cookie = await authAnonymous();
    const res = await request(app)
      .put("/api/v1/user/settings")
      .set("Cookie", cookie)
      .send({
        theme: "dark",
        surName: "shite",
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("surName contains inappropriate language");
    await cleanUp(cookie);
  });
});
