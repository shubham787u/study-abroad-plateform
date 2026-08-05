import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import University from "../models/University.js";
import Program from "../models/Program.js";

describe("Task 2: University & Program Discovery APIs", () => {
  let uToronto, uOxford, uHarvard;

  beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/study_abroad_test";
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    await University.deleteMany({});
    await Program.deleteMany({});

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

    uHarvard = await University.create({
      name: "Harvard University",
      country: "USA",
      ranking: 4,
    });

    await Program.create([
      {
        title: "Computer Science",
        university: uToronto._id,
        field: "Computer Science",
        intake: "Fall",
        fee: 25000,
      },
      {
        title: "MBA",
        university: uOxford._id,
        field: "MBA",
        intake: "Spring",
        fee: 35000,
      },
      {
        title: "Computer Science",
        university: uHarvard._id,
        field: "Computer Science",
        intake: "Fall",
        fee: 50000,
      },
    ]);
  });

  afterAll(async () => {
    await University.deleteMany({});
    await Program.deleteMany({});
    await mongoose.connection.close();
  });

  it("should filter programs by country (Canada)", async () => {
    const res = await request(app).get("/api/programs?country=Canada");

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].university.name).toEqual("Toronto University");
  });

  it("should filter programs by field (Computer Science)", async () => {
    const res = await request(app).get("/api/programs?field=Computer Science");

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBe(2);
  });

  it("should filter programs by budget under $30,000", async () => {
    const res = await request(app).get("/api/programs?maxFee=30000");

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].fee).toBeLessThanOrEqual(30000);
    expect(res.body.data[0].university.name).toEqual("Toronto University");
  });

  it("should sort programs by fee ascending", async () => {
    const res = await request(app).get("/api/programs?sortBy=fee&order=asc");

    expect(res.statusCode).toEqual(200);
    expect(res.body.data[0].fee).toEqual(25000);
    expect(res.body.data[1].fee).toEqual(35000);
    expect(res.body.data[2].fee).toEqual(50000);
  });

  it("should handle pagination correctly", async () => {
    const resPage1 = await request(app).get("/api/programs?page=1&limit=2");
    expect(resPage1.statusCode).toEqual(200);
    expect(resPage1.body.data.length).toBe(2);
    expect(resPage1.body.meta.currentPage).toBe(1);
    expect(resPage1.body.meta.totalPages).toBe(2);

    const resPage2 = await request(app).get("/api/programs?page=2&limit=2");
    expect(resPage2.statusCode).toEqual(200);
    expect(resPage2.body.data.length).toBe(1);
  });
});
