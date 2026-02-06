import request from "supertest";
import app from "../../src/app.js";

export default async (cookie: string, nameId: number): Promise<void> => {
  const res = await request(app)
    .post("/api/v1/givenName/action")
    .set("Cookie", cookie)
    .send({
      givenCustomNameBridgeId: nameId,
      newState: "approved",
    });
};
