import bcrypt from "bcrypt";

import { createUser } from "@repository/user.repository";

import { AUTH_ERRORS } from "@errors/auth.errors";
import { AppError } from "@errors/app-error";

import { refreshAccessToken, signAccessToken, type AccessTokenProps } from "@utils/jwt";
import { findUserByEmail, findUserById } from "@repository/user.repository";
import {
  upsertRefreshToken,
  clearRefreshToken,
  getActiveRefreshTokenByUserId,
} from "@repository/refresh-token.repository";

type RegisterUserProps = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export const registerUserService = async ({
  firstName,
  lastName,
  email,
  password,
}: RegisterUserProps) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const {
    firstName: createdFirstName,
    lastName: createdLastName,
    role,
  } = await createUser({
    firstName,
    lastName,
    hashedPassword,
    email,
  });

  return { createdFirstName, createdLastName, role };
};

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

  const userEmail = user.contactInfo?.email ?? "";

  const payload: AccessTokenProps = { userId: user.user_id, role: user.role, email: userEmail };

  const token = signAccessToken(payload);
  const refreshToken = refreshAccessToken(payload);
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  await upsertRefreshToken({ userId: user.user_id, tokenHash: hashedRefreshToken });

  return {
    token,
    refreshToken,
    user: { firstName: user.firstName, lastName: user.lastName, email: userEmail },
  };
};

export const signOutService = async (userId: number) => {
  await clearRefreshToken(userId);
};

type RefreshSessionProps = {
  userId: number;
  refreshToken: string;
};

export const refreshSessionService = async ({ userId, refreshToken }: RefreshSessionProps) => {
  const storedRefreshToken = await getActiveRefreshTokenByUserId(userId);
  const { tokenHash, revokedAt } = storedRefreshToken || {};

  if (!tokenHash || revokedAt) {
    throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, 401);
  }

  const isRefreshTokenValid = await bcrypt.compare(refreshToken, tokenHash);
  if (!isRefreshTokenValid) {
    throw new AppError(AUTH_ERRORS.INVALID_PASSWORD, 401);
  }

  const user = await findUserById(userId);
  if (!user) {
    throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, 401);
  }

  const userEmail = user.contactInfo?.email ?? "";
  const payload: AccessTokenProps = { userId: user.user_id, role: user.role, email: userEmail };

  const token = signAccessToken(payload);
  const nextRefreshToken = refreshAccessToken(payload);
  const nextRefreshTokenHash = await bcrypt.hash(nextRefreshToken, 10);

  await upsertRefreshToken({ userId: user.user_id, tokenHash: nextRefreshTokenHash });

  return {
    token,
    refreshToken: nextRefreshToken,
    user: { firstName: user.firstName, lastName: user.lastName, email: userEmail },
  };
};
