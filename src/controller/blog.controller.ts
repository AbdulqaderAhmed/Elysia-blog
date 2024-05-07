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
}: {
  set: any;
  Blog: any;
  body: any;
}) => {
  const { title, description }: { title: String; description: String } = body;
  try {
    const newblog = await Blog.create({
      title,
      description,
    });
    set.status = 201;

    return {
      newblog,
    };
  } catch (error) {
    set.status = 500;
    return {
      error,
    };
  }
};

export const updateBlog = async ({
  set,
  params: { id },
  Blog,
  body,
}: {
  set: any;
  params: any;
  body: any;
  Blog: any;
}) => {
  const { title, description }: { title: String; description: String } = body;
  if (!id) {
    throw new Error("No such blog found");
  }
  try {
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
  } catch (error) {
    set.status = 500;
    return {
      error,
    };
  }
};

export const deleteBlog = async ({
  set,
  params: { id },
  Blog,
}: {
  set: any;
  params: any;
  Blog: any;
}) => {
  if (!id) {
    throw new Error("No such blog found");
  }
  try {
    await Blog.findByIdAndDelete(id);
    set.status = 202;

    const blog = await Blog.find();
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
