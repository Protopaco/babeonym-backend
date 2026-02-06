import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import authAnonymous from "../helpers/authAnonymous.js";
import cleanUp from "../helpers/cleanUp.js";
import getNameCandidates from "../helpers/getNameCandidates.js";
import GivenName from "../../src/models/GivenName.js";

describe("Given Name Action - Approve", () => {
  it("200", async () => {
    const cookie = await authAnonymous();
    const nameArray = await getNameCandidates(cookie, 1);
    const name: GivenName = nameArray[0];

    console.log("Candidate Name ID:", name.givenCustomNameBridgeId);
    const postRes = await request(app)
      .post("/api/v1/givenName/action")
      .set("Cookie", cookie)
      .send({
        givenCustomNameBridgeId: name.givenCustomNameBridgeId,
        newState: "approved",
      });

    expect(postRes.status).toBe(200);
    expect(postRes.body.message).toBe("Given name action updated successfully");

    const getApprovedRes = await request(app)
      .get("/api/v1/givenName/approved")
      .set("Cookie", cookie);

    expect(getApprovedRes.status).toBe(200);
    const approvedNames: string[] = getApprovedRes.body;
    expect(approvedNames).toContainEqual(
      expect.objectContaining({
        givenCustomNameBridgeId: name.givenCustomNameBridgeId,
      }),
    );

    cleanUp(cookie);
  });

  describe("Given Name Action - Rejected", () => {
    it("200", async () => {
      const cookie = await authAnonymous();

      const nameArray = await getNameCandidates(cookie, 1);
      const name: GivenName = nameArray[0];

      const postRes = await request(app)
        .post("/api/v1/givenName/action")
        .set("Cookie", cookie)
        .send({
          givenCustomNameBridgeId: name.givenCustomNameBridgeId,
          newState: "rejected",
        });

      expect(postRes.status).toBe(200);
      expect(postRes.body.message).toBe(
        "Given name action updated successfully",
      );

      const getApprovedRes = await request(app)
        .get("/api/v1/givenName/approved")
        .set("Cookie", cookie);

      expect(getApprovedRes.status).toBe(200);
      const approvedNames: string[] = getApprovedRes.body;
      expect(approvedNames).not.toContainEqual(
        expect.objectContaining({
          givenCustomNameBridgeId: name.givenCustomNameBridgeId,
        }),
      );

      cleanUp(cookie);
    });
  });

  describe("Given Name Action - Snoozed", () => {
    it("200", async () => {
      const cookie = await authAnonymous();

      const nameArray = await getNameCandidates(cookie, 1);
      const name: GivenName = nameArray[0];

      const postRes = await request(app)
        .post("/api/v1/givenName/action")
        .set("Cookie", cookie)
        .send({
          givenCustomNameBridgeId: name.givenCustomNameBridgeId,
          newState: "snoozed",
        });

      expect(postRes.status).toBe(200);
      expect(postRes.body.message).toBe(
        "Given name action updated successfully",
      );

      const getApprovedRes = await request(app)
        .get("/api/v1/givenName/approved")
        .set("Cookie", cookie);

      expect(getApprovedRes.status).toBe(200);
      const approvedNames: string[] = getApprovedRes.body;
      expect(approvedNames).not.toContainEqual(
        expect.objectContaining({
          givenCustomNameBridgeId: name.givenCustomNameBridgeId,
        }),
      );

      cleanUp(cookie);
    });
  });

  describe("Custom Given Name Action - Rejected", () => {
    it("200", async () => {
      const cookie = await authAnonymous();

      const customNameRes = await request(app)
        .post("/api/v1/givenName/custom")
        .set("Cookie", cookie)
        .send({
          customGivenName: "ActionTestName",
        });
      expect(customNameRes.status).toBe(200);
      expect(customNameRes.body.message).toBe(
        "Custom given name added successfully",
      );

      const nameRes = await request(app)
        .get("/api/v1/givenName/approved")
        .set("Cookie", cookie);
      const nameArray: GivenName[] = nameRes.body;
      const name = nameArray.find(
        (name: GivenName) => name.givenName === "ActionTestName",
      ) as GivenName;

      const postRes = await request(app)
        .post("/api/v1/givenName/action")
        .set("Cookie", cookie)
        .send({
          givenCustomNameBridgeId: name.givenCustomNameBridgeId,
          newState: "rejected",
        });

      expect(postRes.status).toBe(200);
      expect(postRes.body.message).toBe(
        "Given name action updated successfully",
      );

      const getApprovedRes = await request(app)
        .get("/api/v1/givenName/approved")
        .set("Cookie", cookie);

      expect(getApprovedRes.status).toBe(200);
      const approvedNames: string[] = getApprovedRes.body;
      expect(approvedNames).not.toContainEqual(
        expect.objectContaining({
          givenCustomNameBridgeId: name.givenCustomNameBridgeId,
        }),
      );

      cleanUp(cookie);
    });
  });
});
