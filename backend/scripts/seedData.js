import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import University from "../src/models/University.js";
import Program from "../src/models/Program.js";
import User from "../src/models/User.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/study_abroad";
    await mongoose.connect(mongoUri);
    console.log("[Seeder] Connected to MongoDB");

    // Clear existing data
    await University.deleteMany({});
    await Program.deleteMany({});
    await User.deleteMany({ email: "rahul@gmail.com" });

    // 1. Seed Universities
    const uToronto = await University.create({
      name: "University of Toronto",
      country: "Canada",
      location: "Toronto, Ontario",
      ranking: 18,
      website: "https://www.utoronto.ca",
      description: "Top public research university in Canada offering world-class Computer Science and Engineering programs.",
    });

    const uOxford = await University.create({
      name: "University of Oxford",
      country: "UK",
      location: "Oxford, Oxfordshire",
      ranking: 3,
      website: "https://www.ox.ac.uk",
      description: "Prestigious collegiate research university in Oxford, England.",
    });

    const uHarvard = await University.create({
      name: "Harvard University",
      country: "USA",
      location: "Cambridge, Massachusetts",
      ranking: 4,
      website: "https://www.harvard.edu",
      description: "Ivy League research university in Cambridge, Massachusetts.",
    });

    const uWaterloo = await University.create({
      name: "University of Waterloo",
      country: "Canada",
      location: "Waterloo, Ontario",
      ranking: 112,
      website: "https://uwaterloo.ca",
      description: "Leading Canadian university renowned for Co-op Computer Science and Software Engineering.",
    });

    const uUBC = await University.create({
      name: "University of British Columbia",
      country: "Canada",
      location: "Vancouver, BC",
      ranking: 34,
      website: "https://www.ubc.ca",
      description: "Global center for teaching, learning and research in Vancouver.",
    });

    const uMelbourne = await University.create({
      name: "University of Melbourne",
      country: "Australia",
      location: "Melbourne, Victoria",
      ranking: 14,
      website: "https://www.unimelb.edu.au",
      description: "Australia's #1 university located in Melbourne.",
    });

    console.log("[Seeder] Universities created successfully");

    // 2. Seed Programs
    const programsData = [
      {
        title: "Master of Science in Computer Science",
        university: uToronto._id,
        field: "Computer Science",
        degreeLevel: "Master",
        intake: "Fall",
        fee: 25000,
        currency: "USD",
        durationYears: 2,
        minIeltsScore: 6.5,
        description: "Focuses on Artificial Intelligence, Machine Learning, and Distributed Systems.",
      },
      {
        title: "Master of Business Administration (MBA)",
        university: uOxford._id,
        field: "MBA",
        degreeLevel: "Master",
        intake: "Spring",
        fee: 35000,
        currency: "USD",
        durationYears: 1,
        minIeltsScore: 7.5,
        description: "World-leading 1-year MBA program designed for future global leaders.",
      },
      {
        title: "Master of Computer Science",
        university: uHarvard._id,
        field: "Computer Science",
        degreeLevel: "Master",
        intake: "Fall",
        fee: 50000,
        currency: "USD",
        durationYears: 2,
        minIeltsScore: 7.5,
        description: "Advanced study in algorithms, system design, and AI.",
      },
      {
        title: "Master of Mathematics in Computer Science",
        university: uWaterloo._id,
        field: "Computer Science",
        degreeLevel: "Master",
        intake: "Fall",
        fee: 28000,
        currency: "USD",
        durationYears: 2,
        minIeltsScore: 6.5,
        description: "Renowned Canadian CS program with extensive industrial co-op opportunities.",
      },
      {
        title: "Master of Data Science",
        university: uUBC._id,
        field: "Computer Science",
        degreeLevel: "Master",
        intake: "Fall",
        fee: 27000,
        currency: "USD",
        durationYears: 1.5,
        minIeltsScore: 6.5,
        description: "Professional program covering big data analytics, machine learning and visual data analysis.",
      },
      {
        title: "Master of Information Technology",
        university: uMelbourne._id,
        field: "Computer Science",
        degreeLevel: "Master",
        intake: "Spring",
        fee: 32000,
        currency: "USD",
        durationYears: 2,
        minIeltsScore: 6.5,
        description: "Comprehensive IT degree with cybersecurity and software engineering specializations.",
      },
    ];

    await Program.insertMany(programsData);
    console.log("[Seeder] Programs created successfully");

    // 3. Seed Sample User (Rahul)
    const hashedPassword = await bcrypt.hash("Rahul123", 10);
    const sampleUser = await User.create({
      name: "Rahul",
      email: "rahul@gmail.com",
      password: hashedPassword,
      role: "student",
      preferredCountry: "Canada",
      preferredField: "Computer Science",
      budget: 30000,
      ieltsScore: 7,
      preferredIntake: "Fall",
    });

    console.log(`[Seeder] Sample User Created: ${sampleUser.email} (Password: Rahul123)`);

    console.log("=== Seed Completed Successfully ===");
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
