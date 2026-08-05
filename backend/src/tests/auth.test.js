import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import User from "../models/User.js";

describe("Task 1: Authentication & Profile APIs", () => {
  beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/study_abroad_test";
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  });

  afterEach(async () => {
    await User.deleteMany({ email: /@test\.com$/ });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should register a new student with hashed password and return JWT token", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Rahul Test",
        email: "rahul@test.com",
        password: "Rahul123Password",
        preferredCountry: "Canada",
        preferredField: "Computer Science",
        budget: 30000,
        ieltsScore: 7,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data.user).toHaveProperty("email", "rahul@test.com");
    expect(res.body.data.user).not.toHaveProperty("password");

    // Verify password is encrypted in database
    const savedUser = await User.findOne({ email: "rahul@test.com" }).select("+password");
    expect(savedUser.password).not.toEqual("Rahul123Password");
    expect(savedUser.password).toMatch(/^\$2[ayb]\$/);
  });

  it("should prevent duplicate registration with same email", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Rahul Test",
        email: "rahul@test.com",
        password: "Rahul123Password",
      });

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Rahul Duplicate",
        email: "rahul@test.com",
        password: "AnotherPassword123",
      });

    expect(res.statusCode).toEqual(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already registered/i);
  });

  it("should log in registered user with correct credentials", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Rahul Test",
        email: "rahul@test.com",
        password: "Rahul123Password",
      });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "rahul@test.com",
        password: "Rahul123Password",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
  });

  it("should reject login with wrong password", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Rahul Test",
        email: "rahul@test.com",
        password: "Rahul123Password",
      });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "rahul@test.com",
        password: "WrongPassword",
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });

  it("should fetch logged in user profile with JWT token", async () => {
    const regRes = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Rahul Test",
        email: "rahul@test.com",
        password: "Rahul123Password",
        preferredCountry: "Canada",
      });

    const token = regRes.body.data.token;

    const res = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.user.email).toEqual("rahul@test.com");
    expect(res.body.data.user.preferredCountry).toEqual("Canada");
  });
});
