import request from "supertest";
import app from "../../src/app.js";

export default async (): Promise<string> => {
  const res = await request(app).get("/api/v1/auth/anonymous ");
  return res.headers["set-cookie"];
};
