import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import authAnonymous from "../helpers/authAnonymous.js";
import cleanUp from "../helpers/cleanUp.js";

describe("Given Name Action - Accept", () => {
  it.skip("200", async () => {
    const cookie = await authAnonymous();
    const getNamesRes = await request(app)
      .get("/api/v1/givenName/candidates?limit=1")
      .set("Cookie", cookie);

    expect(getNamesRes.status).toBe(200);
    const names = getNamesRes.body;
    expect(Array.isArray(names)).toBe(true);
    expect(names).toHaveLength(1);
    const nameId = names[0].id;

    const postRes = await request(app)
      .post("/api/v1/givenName/action")
      .set("Cookie", cookie)
      .send({
        givenNameId: nameId,
        action: "accept",
      });

    expect(postRes.status).toBe(200);
    expect(postRes.body.message).toBe("Given name accepted successfully");

    const getApprovedRes = await request(app)
      .get("/api/v1/givenName/approved")
      .set("Cookie", cookie);

    expect(getApprovedRes.status).toBe(200);
    const approvedNames: string[] = getApprovedRes.body;
    expect(approvedNames).toContainEqual(
      expect.objectContaining({ id: nameId }),
    );

    cleanUp(cookie);
  });
});
