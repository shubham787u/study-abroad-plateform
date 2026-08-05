import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import University from "../models/University.js";
import Program from "../models/Program.js";
import User from "../models/User.js";
import Application from "../models/Application.js";

describe("Task 4: Application Workflow APIs", () => {
  let university, program, studentToken, studentUser, counselorUser, counselorToken;

  beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/study_abroad_test";
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    await University.deleteMany({});
    await Program.deleteMany({});
    await User.deleteMany({ email: /@apptest\.com$/ });
    await Application.deleteMany({});

    university = await University.create({
      name: "Toronto University Application Test",
      country: "Canada",
    });

    program = await Program.create({
      title: "Computer Science",
      university: university._id,
      field: "Computer Science",
      intake: "Fall",
      fee: 25000,
    });

    // Create student
    const studentRes = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Rahul Application Test",
        email: "rahulapp@apptest.com",
        password: "Password123",
      });
    studentToken = studentRes.body.data.token;
    studentUser = studentRes.body.data.user;

    // Create counselor
    const counselorRes = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Counselor User",
        email: "counselor@apptest.com",
        password: "Password123",
        role: "counselor",
      });
    counselorToken = counselorRes.body.data.token;
    counselorUser = counselorRes.body.data.user;
  });

  afterAll(async () => {
    await University.deleteMany({});
    await Program.deleteMany({});
    await User.deleteMany({ email: /@apptest\.com$/ });
    await Application.deleteMany({});
    await mongoose.connection.close();
  });

  it("should allow student to submit an application to a program", async () => {
    const res = await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        programId: program._id,
        statementOfPurpose: "I am passionate about Computer Science.",
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.application.status).toEqual("Applied");
    expect(res.body.data.application.statusHistory.length).toBe(1);
    expect(res.body.data.application.statusHistory[0].status).toEqual("Applied");
  });

  it("should PREVENT student from applying to the same program twice", async () => {
    const res = await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        programId: program._id,
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already applied/i);
  });

  it("should allow student to fetch their submitted applications", async () => {
    const res = await request(app)
      .get("/api/applications")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].program._id.toString()).toEqual(program._id.toString());
  });

  it("should transition application status Applied -> Reviewed -> Accepted with history tracking", async () => {
    const appsRes = await request(app)
      .get("/api/applications")
      .set("Authorization", `Bearer ${studentToken}`);
    
    const appId = appsRes.body.data[0]._id;

    // 1. Update to Reviewed
    const reviewRes = await request(app)
      .patch(`/api/applications/${appId}/status`)
      .set("Authorization", `Bearer ${counselorToken}`)
      .send({
        status: "Reviewed",
        note: "Documents verified by counselor",
      });

    expect(reviewRes.statusCode).toEqual(200);
    expect(reviewRes.body.data.application.status).toEqual("Reviewed");

    // 2. Update to Accepted
    const acceptRes = await request(app)
      .patch(`/api/applications/${appId}/status`)
      .set("Authorization", `Bearer ${counselorToken}`)
      .send({
        status: "Accepted",
        note: "Congratulations! Admission granted.",
      });

    expect(acceptRes.statusCode).toEqual(200);
    expect(acceptRes.body.data.application.status).toEqual("Accepted");

    // Fetch details to verify status history
    const detailRes = await request(app)
      .get(`/api/applications/${appId}`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(detailRes.statusCode).toEqual(200);
    expect(detailRes.body.data.application.statusHistory.length).toBe(3);
    expect(detailRes.body.data.application.statusHistory[0].status).toEqual("Applied");
    expect(detailRes.body.data.application.statusHistory[1].status).toEqual("Reviewed");
    expect(detailRes.body.data.application.statusHistory[2].status).toEqual("Accepted");
  });
});
