import request from "supertest";
import app from "../../src/app.js";

export default async (cookie: string): Promise<void> => {
  request(app).delete("/api/v1/user/me ").set("Cookie", cookie);
};
