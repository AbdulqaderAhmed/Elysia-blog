import { Elysia } from "elysia";
import { dbConnection } from "./config/dbConnection";
import { Blog } from "./model/blog.model";
import { blogRoute } from "./routes/blog.routes";

// config
dbConnection();
const port: number = Number(Bun.env.SERVER_PORT);

const app = new Elysia().decorate("Blog", Blog).use(blogRoute).listen(port);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
