import mongoose from "mongoose";

export const Blog = mongoose.model(
  "blogs",
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  )
);
