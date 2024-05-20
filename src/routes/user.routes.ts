import { Elysia } from "elysia";
import { login, logout, register } from "../controller/auth.controller";

export const userRoute = new Elysia({ prefix: "/auth" })
  .post("/register", register)
  .post("/login", login)
  .get("/logout", logout);
