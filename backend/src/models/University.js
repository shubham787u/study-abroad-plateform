import mongoose from "mongoose";

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "University name is required"],
      trim: true,
      unique: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      index: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    ranking: {
      type: Number,
      default: 100,
    },
    website: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    logoUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

universitySchema.index({ country: 1, name: 1 });

const University = mongoose.model("University", universitySchema);

export default University;
