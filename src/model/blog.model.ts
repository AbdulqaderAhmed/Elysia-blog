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
      image: {
        type: String,
        default:
          "https://i.pinimg.com/564x/dd/67/97/dd67971d934cd5c9ad01887b5486481e.jpg",
      },
    },
    { timestamps: true }
  )
);
