import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import cleanUp from "../helpers/cleanUp.js";
import authAnonymous from "../helpers/authAnonymous";
import GivenName from "../../src/models/GivenName.js";

describe("Create Custom Given Name", () => {
  it("201", async () => {
    const cookie = await authAnonymous();
    const createRes = await request(app)
      .post("/api/v1/givenName/custom")
      .set("Cookie", cookie)
      .send({
        customGivenName: "TestName",
      });

    expect(createRes.status).toBe(200);
    expect(createRes.body.message).toBe("Custom given name added successfully");

    const getApprovedRes = await request(app)
      .get("/api/v1/givenName/approved")
      .set("Cookie", cookie);

    expect(getApprovedRes.status).toBe(200);
    const approvedNames: string[] = getApprovedRes.body;
    expect(getApprovedRes.body).toContainEqual(
      expect.objectContaining({ givenName: "TestName" }),
    );

    const resSecondTry = await request(app)
      .post("/api/v1/givenName/custom")
      .set("Cookie", cookie)
      .send({
        customGivenName: "TestName",
      });

    expect(resSecondTry.status).toBe(200);
    expect(resSecondTry.body.message).toBe(
      "Custom given name added successfully",
    );

    await cleanUp(cookie);
  });

  it("400 - Custom Given Name Is A Bad Word", async () => {
    const cookie = await authAnonymous();
    const res = await request(app)
      .post("/api/v1/givenName/custom")
      .set("Cookie", cookie)
      .send({
        customGivenName: "shite",
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe(
      "customGivenName contains inappropriate language",
    );
    await cleanUp(cookie);
  });

  it("400 - Missing Custom Given Name", async () => {
    const cookie = await authAnonymous();
    const res = await request(app)
      .post("/api/v1/givenName/custom")
      .set("Cookie", cookie)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid custom given name");
    await cleanUp(cookie);
  });

  it("400 - Custom Given Name is not a string", async () => {
    const cookie = await authAnonymous();
    const res = await request(app)
      .post("/api/v1/givenName/custom")
      .set("Cookie", cookie)
      .send({
        customGivenName: 123,
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid custom given name");
    await cleanUp(cookie);
  });

  it("409 - Custom Given Name Already Exists", async () => {
    const cookie = await authAnonymous();
    const customGivenName = "ExistingName";

    // First, create the custom given name
    const firstRes = await request(app)
      .post("/api/v1/givenName/custom")
      .set("Cookie", cookie)
      .send({ customGivenName });

    expect(firstRes.status).toBe(200);
    expect(firstRes.body.message).toBe("Custom given name added successfully");

    const secondRes = await request(app)
      .post("/api/v1/givenName/custom")
      .set("Cookie", cookie)
      .send({ customGivenName });

    expect(secondRes.status).toBe(200);
    expect(firstRes.body.message).toBe("Custom given name added successfully");

    await cleanUp(cookie);
  });

  it("200 - Rejected Custom Name Submitted Again", async () => {
    const cookie = await authAnonymous();
    const customGivenName = "RejectedName";

    // First, create the custom given name
    const firstRes = await request(app)
      .post("/api/v1/givenName/custom")
      .set("Cookie", cookie)
      .send({ customGivenName });

    expect(firstRes.status).toBe(200);
    expect(firstRes.body.message).toBe("Custom given name added successfully");

    const getApprovedRes = await request(app)
      .get("/api/v1/givenName/approved")
      .set("Cookie", cookie);

    expect(getApprovedRes.status).toBe(200);
    const approvedNames: GivenName[] = getApprovedRes.body;
    const name = approvedNames.find(
      (name: GivenName) => name.givenName === customGivenName,
    ) as GivenName;

    const postRes = await request(app)
      .post("/api/v1/givenName/action")
      .set("Cookie", cookie)
      .send({
        givenCustomNameBridgeId: name.givenCustomNameBridgeId,
        newState: "rejected",
      });

    expect(postRes.status).toBe(200);
    expect(postRes.body.message).toBe("Given name action updated successfully");

    const secondRes = await request(app)
      .post("/api/v1/givenName/custom")
      .set("Cookie", cookie)
      .send({ customGivenName });

    expect(secondRes.status).toBe(200);
    expect(secondRes.body.message).toBe("Custom given name added successfully");

    const getApprovedRes2 = await request(app)
      .get("/api/v1/givenName/approved")
      .set("Cookie", cookie);

    expect(getApprovedRes2.status).toBe(200);
    const approvedNames2: GivenName[] = getApprovedRes2.body;
    const name2 = approvedNames2.find(
      (name: GivenName) => name.givenName === customGivenName,
    ) as GivenName;

    expect(name2).toBeDefined();
    expect(name2.givenCustomNameBridgeId).toBe(name.givenCustomNameBridgeId);

    await cleanUp(cookie);
  });
});
