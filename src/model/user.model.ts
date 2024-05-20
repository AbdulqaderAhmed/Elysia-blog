import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import mongoose from "mongoose";

export const User = mongoose.model(
  "users",
  new mongoose.Schema(
    {
      username: { type: String, required: true },
      password: { type: String, required: true },
    },
    { timestamps: true }
  )
);

export const Session = mongoose.model(
  "sessions",
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      expires_at: {
        type: Date,
        required: true,
      },
    },
    { timestamps: true }
  )
);

export const adapter = new MongodbAdapter(
  mongoose.connection.collection("sessions"),
  mongoose.connection.collection("users")
);
