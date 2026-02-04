import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import authAnonymous from "../helpers/authAnonymous.js";
import { logger } from "../../src/utils/logger.js";

describe("Delete User", () => {
  it("204", async () => {
    const cookie = await authAnonymous();
    logger.info(`Authenticated with cookie: ${cookie}`);
    const deleteRes = await request(app)
      .delete("/api/v1/user/me")
      .set("Cookie", cookie);

    expect(deleteRes.status).toBe(204);

    const getUserRes = await request(app)
      .get("/api/v1/user/me")
      .set("Cookie", cookie);

    expect(getUserRes.status).toBe(401);
  });
});
