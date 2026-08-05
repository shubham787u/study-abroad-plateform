import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Program title is required"],
      trim: true,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: [true, "University reference is required"],
      index: true,
    },
    field: {
      type: String,
      required: [true, "Field of study is required"],
      trim: true,
      index: true,
    },
    degreeLevel: {
      type: String,
      enum: ["Bachelor", "Master", "PhD", "Diploma"],
      default: "Master",
    },
    intake: {
      type: String,
      enum: ["Fall", "Spring", "Summer"],
      required: [true, "Intake season is required"],
      index: true,
    },
    fee: {
      type: Number,
      required: [true, "Tuition fee is required"],
      index: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    durationYears: {
      type: Number,
      default: 2,
    },
    minIeltsScore: {
      type: Number,
      default: 6.5,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for fast search and recommendation filtering
programSchema.index({ field: 1, fee: 1, intake: 1 });
programSchema.index({ university: 1, field: 1 });

const Program = mongoose.model("Program", programSchema);

export default Program;
