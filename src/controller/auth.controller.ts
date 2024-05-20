import bycrptjs from "bcryptjs";

export const register = async ({
  set,
  User,
  lucia,
  body: { username, password },
  cookie: { user_session },
}: {
  set: any;
  User: any;
  lucia: any;
  body: { username: String; password: String };
  cookie: { user_session: any };
}) => {
  try {
    const hashPassword = bycrptjs.hashSync(String(password));

    if (
      typeof username !== "string" ||
      username.length < 3 ||
      username.length > 20
    ) {
      set.status = 400;
      return {
        error: "Username must be between 3 and 20 characters",
      };
    }

    if (
      typeof password !== "string" ||
      password.length < 6 ||
      password.length > 255
    ) {
      set.status = 400;
      return {
        error: "Password must be between 6 and 255 characters",
      };
    }

    const existUser = await User.findOne({ username });
    if (existUser) {
      set.status = 403;
      return {
        error: "User already exist",
      };
    }
    const user = await User.create({
      username,
      password: hashPassword,
    });

    const session = await lucia.createSession(user._id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    set.status = 201;

    user_session.set({
      name: sessionCookie.name,
      value: sessionCookie.value,
      httpOnly: true,
      secure: false,
    });

    return {
      user,
    };
  } catch (error: any) {
    set.status = 500;
    return { error: error.message };
  }
};

export const login = async ({
  set,
  lucia,
  User,
  body: { username, password },
  cookie: { user_session },
}: {
  set: any;
  lucia: any;
  User: any;
  body: { username: String; password: String };
  cookie: { user_session: any };
}) => {
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 20
  ) {
    set.status = 400;
    return {
      error: "Username must be between 3 and 20 characters",
    };
  }

  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    set.status = 400;
    return {
      error: "Password must be between 6 and 255 characters",
    };
  }
  try {
    const existUser = await User.findOne({ username });
    if (!existUser) {
      set.status = 403;
      return {
        error: "User does not exist",
      };
    }

    const validPassword = bycrptjs.compareSync(password, existUser.password);
    if (!validPassword) {
      set.status = 403;
      return {
        error: "Invalid password",
      };
    }

    const { password: hashPassword, ...user } = existUser._doc;

    const session = await lucia.createSession(user._id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    set.status = 200;

    user_session.set({
      name: sessionCookie.name,
      value: sessionCookie.value,
      attributes: sessionCookie.attributes,
      httpOnly: true,
      secure: false,
    });

    return {
      user,
    };
  } catch (error) {
    set.status = 500;
    return { error };
  }
};

export const logout = async ({
  set,
  lucia,
  cookie: { user_session },
}: {
  set: any;
  lucia: any;
  cookie: { user_session: any };
}) => {
  try {
    const { session } = await lucia.validateSession(user_session.value);
    if (!session) {
      set.status = 401;
      return {
        error: "Invalid session",
      };
    }

    await lucia.invalidateUserSessions(session.userId);

    const sessionCookie = lucia.createBlankSessionCookie();

    user_session.set({
      name: sessionCookie.name,
      value: sessionCookie.value,
      attributes: sessionCookie.attributes,
      httpOnly: true,
      secure: false,
    });

    return { message: "User logged out!" };
  } catch (error: any) {
    set.status = 500;
    return { error: error.message };
  }
};
