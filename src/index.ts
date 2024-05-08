import { Elysia } from "elysia";
import { dbConnection } from "./config/dbConnection";
import { Blog } from "./model/blog.model";
import { blogRoute } from "./routes/blog.routes";
import { swagger } from "@elysiajs/swagger";

// config
dbConnection();
const port: number = Number(Bun.env.SERVER_PORT);

const app = new Elysia()
  .decorate("Blog", Blog)
  .use(swagger())
  .use(blogRoute)
  .listen(port);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
