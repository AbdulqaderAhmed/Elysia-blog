import path from "path";

export const getAllBlog = async ({ set, Blog }: { set: any; Blog: any }) => {
  try {
    const blog = await Blog.find();
    set.status = 200;

    return {
      blogs: blog,
    };
  } catch (error) {
    set.status = 500;
    return {
      error,
    };
  }
};

export const getBlog = async ({
  set,
  params: { id },
  Blog,
}: {
  set: any;
  params: any;
  Blog: any;
}) => {
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      throw new Error("No such blog found");
    }
    set.status = 200;
    return {
      blog,
    };
  } catch (error) {
    set.status = 500;
    return {
      error,
    };
  }
};

export const searchBlog = async ({
  set,
  query: { title },
  Blog,
}: {
  set: any;
  query: any;
  Blog: any;
}) => {
  try {
    const blog = await Blog.find({
      title: { $regex: title, $options: "i" },
    });
    set.status = 200;

    return { blog };
  } catch (error) {
    set.status = 500;
    return {
      error,
    };
  }
};

export const createBlog = async ({
  set,
  Blog,
  body,
  lucia,
  headers,
}: {
  set: any;
  Blog: any;
  body: any;
  lucia: any;
  headers: any;
}) => {
  const {
    title,
    description,
    image,
  }: { title: String; description: String; image: Buffer } = body;

  try {
    const authHeader = headers["authorization"];
    const sessionID = lucia.readBearerToken(authHeader ?? "");

    const { session } = await lucia.validateSession(sessionID);

    if (!session) {
      set.status = 401;
      return {
        error: "You are not logged in",
      };
    }

    if (image) {
      const allowedFileType = ["image/jpeg", "image/jpg", "image/png"];
      const randomName = Date.now();
      const extName = path.extname(image.name);
      if (!allowedFileType.includes(image.memetype)) {
        set.status = 400;
        return {
          error: "Invalid file type",
        };
      }
      const fileName = randomName + extName;

      const img = Bun.file(
        await Bun.write("./public/uploads/" + fileName, image)
      );

      const newblog = await Blog.create({
        author: session.userId,
        title,
        description,
        image: fileName,
      });
      set.status = 201;
      return {
        newblog,
      };
    } else {
      const newblog = await Blog.create({
        author: session.userId,
        title,
        description,
      });
      set.status = 201;
      return {
        newblog,
      };
    }
  } catch (error: any) {
    set.status = 500;
    return {
      error: error.message,
    };
  }
};

export const updateBlog = async ({
  set,
  params: { id },
  Blog,
  body,
  lucia,
  headers,
}: {
  set: any;
  params: any;
  body: any;
  Blog: any;
  lucia: any;
  headers: any;
}) => {
  const { title, description }: { title: String; description: String } = body;

  try {
    const authHeader = headers["authorization"];
    const sessionID = lucia.readBearerToken(authHeader ?? "");

    const { session, user } = await lucia.validateSession(sessionID);

    if (!session) {
      set.status = 401;
      return {
        error: "You are not logged in",
      };
    }

    const blogInfo = await Blog.findById(id);

    if (!blogInfo && id !== blogInfo?._id) {
      set.status = 404;
      return {
        error: "Blog not found!",
      };
    }

    if (blogInfo.author.toString() !== user.id.toString()) {
      set.status = 401;
      return {
        error: "You are not allowed to update this blog",
      };
    }

    const updateBlog = await Blog.findByIdAndUpdate(
      id,
      {
        $set: { title, description },
      },
      { new: true }
    );
    set.status = 202;
    return {
      updateBlog,
    };
  } catch (error: any) {
    set.status = 500;
    return {
      error: error.message,
    };
  }
};

export const deleteBlog = async ({
  set,
  params: { id },
  Blog,
  lucia,
  headers,
}: {
  set: any;
  params: any;
  Blog: any;
  lucia: any;
  headers: any;
}) => {
  try {
    const authHeader = headers["authorization"];
    const sessionID = await lucia.readBearerToken(authHeader ?? "");

    const { session, user } = await lucia.validateSession(sessionID);

    if (!session) {
      set.status = 401;
      return {
        error: "You are not logged in",
      };
    }

    const blogInfo = await Blog.findById(id);

    if (!blogInfo && id !== blogInfo?._id) {
      set.status = 404;
      return {
        error: "Blog not found!",
      };
    }

    if (blogInfo.author.toString() !== user.id.toString()) {
      set.status = 401;
      return {
        error: "You are not allowed to delete this blog",
      };
    }

    await Blog.findByIdAndDelete(id);
    set.status = 202;

    const blog = await Blog.find();
    return {
      blogs: blog,
    };
  } catch (error: any) {
    set.status = 500;
    return {
      error: error.message,
    };
  }
};

export const imageUpload = async ({
  lucia,
  headers,
}: {
  lucia: any;
  headers: any;
}) => {
  try {
    // VALIDATION USING BEARER TOKEN BY ASSIGNING IN LOCALSTORAGE

    const authorizationHeader = headers["authorization"];
    const sessionId = lucia.readBearerToken(authorizationHeader ?? "");

    const { session, user } = await lucia.validateSession(sessionId);

    console.log(session, user);
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
