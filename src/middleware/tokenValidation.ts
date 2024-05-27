export const validateToken = async (headers: any, lucia: any, set: any) => {
  const authorizationHeader = headers["authorization"];
  const sessionId = lucia.readBearerToken(authorizationHeader ?? "");

  const { session, user } = await lucia.validateSession(sessionId);

  if (!session && session == undefined) {
    set.status = 401;
    throw new Error("You are not logged in");
  }

  return { session, user };
};
