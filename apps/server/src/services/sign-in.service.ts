import bcrypt from "bcrypt";

import { AUTH_ERRORS } from "@errors/auth.errors";
import { AppError } from "@errors/app-error";

import { refreshAccessToken, signAccessToken } from "@utils/jwt";
import { findUserByEmail } from "@repository/user.repository";
import { upsertRefreshToken } from "@repository/refresh-token.repository";

type signInServiceProps = {
  email: string;
  password: string;
};

export const signInService = async ({ email, password }: signInServiceProps) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, 400);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new AppError(AUTH_ERRORS.INVALID_PASSWORD, 400);
  }

  const { contactInfo } = user;
  const { email: userEmail } = contactInfo || { email: "" };

  const payload = { id: user.user_id, role: user.role, email: userEmail };

  const token = signAccessToken(payload);
  const refreshToken = refreshAccessToken(payload);

  if (refreshToken) {
    await upsertRefreshToken({ userId: user.user_id, token: refreshToken });
  }

  return { token, refreshToken };
};
