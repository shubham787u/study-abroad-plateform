import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import University from "../models/University.js";
import Program from "../models/Program.js";
import User from "../models/User.js";

describe("Task 3: Recommendation Engine APIs", () => {
  let uToronto, uOxford;
  let userToken;

  beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/study_abroad_test";
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    await University.deleteMany({});
    await Program.deleteMany({});
    await User.deleteMany({ email: "rahulrec@test.com" });

    uToronto = await University.create({
      name: "Toronto University",
      country: "Canada",
      ranking: 18,
    });

    uOxford = await University.create({
      name: "Oxford University",
      country: "UK",
      ranking: 3,
    });

    // Program A: Good Match for Rahul (Canada, CS, Fee 28000, IELTS 6.5, Fall)
    await Program.create({
      title: "Computer Science Program A",
      university: uToronto._id,
      field: "Computer Science",
      intake: "Fall",
      fee: 28000,
      minIeltsScore: 6.5,
    });

    // Program B: Poor Match for Rahul (UK, MBA, Fee 50000, IELTS 7.5, Spring)
    await Program.create({
      title: "MBA Program B",
      university: uOxford._id,
      field: "MBA",
      intake: "Spring",
      fee: 50000,
      minIeltsScore: 7.5,
    });

    // Create Rahul profile user
    const regRes = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Rahul Recommendation Test",
        email: "rahulrec@test.com",
        password: "Password123",
        preferredCountry: "Canada",
        preferredField: "Computer Science",
        budget: 30000,
        ieltsScore: 7,
        preferredIntake: "Fall",
      });

    userToken = regRes.body.data.token;
  });

  afterAll(async () => {
    await University.deleteMany({});
    await Program.deleteMany({});
    await User.deleteMany({ email: "rahulrec@test.com" });
    await mongoose.connection.close();
  });

  it("should recommend Program A higher than Program B based on student profile aggregation pipeline", async () => {
    const res = await request(app)
      .get("/api/recommendations")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);

    const topRecommendation = res.body.data[0];
    expect(topRecommendation.title).toEqual("Computer Science Program A");
    expect(topRecommendation.university.country).toEqual("Canada");
    expect(topRecommendation.matchScore).toBeGreaterThan(70);
    expect(topRecommendation.matchBadge).toEqual("Excellent Match");
  });

  it("should support custom recommendation POST criteria", async () => {
    const res = await request(app)
      .post("/api/recommendations/custom")
      .send({
        country: "Canada",
        field: "Computer Science",
        budget: 30000,
        ieltsScore: 7,
        intake: "Fall",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.data[0].title).toEqual("Computer Science Program A");
  });
});
