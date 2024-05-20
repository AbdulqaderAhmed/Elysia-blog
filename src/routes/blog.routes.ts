import { Elysia } from "elysia";
import {
  createBlog,
  deleteBlog,
  getAllBlog,
  getBlog,
  imageUpload,
  searchBlog,
  updateBlog,
} from "../controller/blog.controller";

export const blogRoute = new Elysia({ prefix: "/blog" })
  .get("/", getAllBlog)
  .post("/", createBlog)
  .get("/search", searchBlog)
  .get("/id/:id", getBlog)
  .put("/id/:id", updateBlog)
  .delete("/id/:id", deleteBlog)
  .get("/image", imageUpload);
