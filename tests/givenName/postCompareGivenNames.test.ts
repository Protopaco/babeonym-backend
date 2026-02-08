import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import cleanUp from "../helpers/cleanUp.js";
import authAnonymous from "../helpers/authAnonymous";
import GivenName from "../../src/models/GivenName.js";
import getNameCandidates from "../helpers/getNameCandidates.js";
import approveName from "../helpers/approveName.js";

describe("Compare Given Names", () => {
  it("200", async () => {
    const cookie = await authAnonymous();
    const namesCandidates = await getNameCandidates(cookie, 2);
    await approveName(cookie, namesCandidates[0].givenCustomNameBridgeId);
    await approveName(cookie, namesCandidates[1].givenCustomNameBridgeId);

    const createRes1 = await request(app)
      .get("/api/v1/givenName/approved")
      .set("Cookie", cookie);

    expect(createRes1.status).toBe(200);
    const approvedNames: GivenName[] = createRes1.body;
    expect(approvedNames.length).toBeGreaterThanOrEqual(2);

    const name1 = approvedNames[0];
    const name2 = approvedNames[1];

    const compareRes = await request(app)
      .post("/api/v1/givenName/compare")
      .set("Cookie", cookie)
      .send({
        winnerId: name1.givenCustomNameBridgeId,
        loserId: name2.givenCustomNameBridgeId,
      });

    expect(compareRes.status).toBe(200);
    expect(compareRes.body.message).toBe(
      "Given name comparison updated successfully",
    );

    const approvedRes2 = await request(app)
      .get("/api/v1/givenName/approved")
      .set("Cookie", cookie);

    expect(approvedRes2.status).toBe(200);
    const approvedNames2: GivenName[] = approvedRes2.body;
    const updatedName1 = approvedNames2.find(
      (n) => n.givenCustomNameBridgeId === name1.givenCustomNameBridgeId,
    );
    const updatedName2 = approvedNames2.find(
      (n) => n.givenCustomNameBridgeId === name2.givenCustomNameBridgeId,
    );

    expect(updatedName1).toBeDefined();
    expect(updatedName2).toBeDefined();
    expect(updatedName1!.rating).toBeGreaterThan(name1.rating);
    expect(updatedName2!.rating).toBeLessThan(name2.rating);

    // Compare the same names again in reverse order to ensure it works both ways
    const resSecondTry = await request(app)
      .post("/api/v1/givenName/compare")
      .set("Cookie", cookie)
      .send({
        winnerId: name2.givenCustomNameBridgeId,
        loserId: name1.givenCustomNameBridgeId,
      });

    expect(resSecondTry.status).toBe(200);
    expect(resSecondTry.body.message).toBe(
      "Given name comparison updated successfully",
    );

    await cleanUp(cookie);
  });
});
