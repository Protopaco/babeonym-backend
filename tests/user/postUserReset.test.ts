import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import cleanUp from "../helpers/cleanUp.js";

describe("Get User Action History", () => {
  it("200", async () => {
    const res = await request(app).get("/api/v1/auth/anonymous ");
    const cookie = res.headers["set-cookie"];

    const actionHistory1Res = await request(app)
      .get("/api/v1/user/actionHistory")
      .set("Cookie", cookie);

    expect(actionHistory1Res.status).toBe(200);
    expect(actionHistory1Res.body.actionHistory).toEqual([]);

    const createRes = await request(app)
      .post("/api/v1/givenName/custom")
      .set("Cookie", cookie)
      .send({
        customGivenName: "HistoryTestName",
      });

    expect(createRes.status).toBe(200);
    expect(createRes.body.message).toBe("Custom given name added successfully");

    const actionHistory2Res = await request(app)
      .get("/api/v1/user/actionHistory")
      .set("Cookie", cookie);

    expect(actionHistory2Res.status).toBe(200);
    const actionHistory: any[] = actionHistory2Res.body.actionHistory;
    expect(actionHistory.length).toBeGreaterThan(0);
    expect(actionHistory).toContainEqual(
      expect.objectContaining({
        givenName: "HistoryTestName",
        state: "approved",
      }),
    );

    const resetRes = await request(app)
      .post("/api/v1/user/me/reset")
      .set("Cookie", cookie);

    expect(resetRes.status).toBe(200);
    expect(resetRes.body.message).toBe("User reset successfully");

    const actionHistory3Res = await request(app)
      .get("/api/v1/user/actionHistory")
      .set("Cookie", cookie);

    expect(actionHistory3Res.status).toBe(200);
    expect(actionHistory3Res.body.actionHistory).toEqual([]);
    await cleanUp(cookie);
  });
});
