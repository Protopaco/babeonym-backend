import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import cleanUp from "../helpers/cleanUp.js";
import authAnonymous from "../helpers/authAnonymous";

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

    expect(resSecondTry.status).toBe(409);
    expect(resSecondTry.body.message).toBe("Conflict: Duplicate entry");

    await cleanUp(cookie);
  });

  it("400 - bad word", async () => {
    const cookie = await authAnonymous();
    const res = await request(app)
      .post("/api/v1/givenName/custom")
      .set("Cookie", cookie)
      .send({
        customGivenName: "shite",
      });
  });

  it("400 - missing customGivenName", async () => {
    const cookie = await authAnonymous();
    const res = await request(app)
      .post("/api/v1/givenName/custom")
      .set("Cookie", cookie)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid custom given name");
    await cleanUp(cookie);
  });

  it("400 - customGivenName is not a string", async () => {
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
});
