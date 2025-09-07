import request from "supertest";
import app from "./app.js"; // Import the Express app without server startup

describe("URL Shortener API", () => {
  let token = "";

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        phone: "9876543210",
        password: "Test123!"
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
  });

  it("should log in and return a JWT token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@example.com",
        password: "Test123!"
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("should shorten a URL", async () => {
    const res = await request(app)
      .post("/api/url/shorten")
      .set("Authorization", `Bearer ${token}`)
      .send({ url: "https://www.example.com" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("shortUrl");
  });

  it("should list user's URLs", async () => {
    const res = await request(app)
      .get("/api/url/urls")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.urls)).toBeTruthy();
  });
});
