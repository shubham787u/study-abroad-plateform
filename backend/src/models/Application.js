import mongoose from "mongoose";

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["Applied", "Reviewed", "Accepted", "Rejected"],
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    note: {
      type: String,
      default: "",
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student reference is required"],
      index: true,
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: [true, "Program reference is required"],
      index: true,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: [true, "University reference is required"],
    },
    status: {
      type: String,
      enum: ["Applied", "Reviewed", "Accepted", "Rejected"],
      default: "Applied",
    },
    statusHistory: [statusHistorySchema],
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    statementOfPurpose: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Compound Unique Index: Single Application per Student per Program
applicationSchema.index({ student: 1, program: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);

export default Application;
