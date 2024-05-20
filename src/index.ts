import { Elysia } from "elysia";
import { dbConnection } from "./config/dbConnection";
import { Blog } from "./model/blog.model";
import { blogRoute } from "./routes/blog.routes";
import { swagger } from "@elysiajs/swagger";
import { Lucia } from "lucia";
import { User, adapter } from "./model/user.model";
import { userRoute } from "./routes/user.routes";

// config
dbConnection();
const port: number = Number(Bun.env.SERVER_PORT);
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: false,
    },
  },
  // sessionExpiresIn: new TimeSpan(20, "m"),
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
      // githubId: attributes.github_id,
    };
  },
});

const app = new Elysia()
  .decorate("Blog", Blog)
  .decorate("User", User)
  .decorate("lucia", lucia)
  .use(swagger())
  .use(userRoute)
  .use(blogRoute)
  .listen(port);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
