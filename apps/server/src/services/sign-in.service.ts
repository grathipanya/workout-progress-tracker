import bcrypt from "bcrypt";

import { AUTH_ERRORS } from "@errors/auth.errors";
import { AppError } from "@errors/app-error";

import { prisma } from "@database/db";
import { refreshAccessToken, signAccessToken } from "@utils/jwt";

type signInServiceProps = {
  email: string;
  password: string;
};

export const signInService = async ({ email, password }: signInServiceProps) => {
  const user = await prisma.user.findFirst({
    where: {
      contactInfo: {
        email,
      },
    },
    include: {
      contactInfo: true,
    },
  });

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
    await prisma.refreshToken.upsert({
      where: {
        userId: user.user_id,
      },
      update: {
        token: refreshToken,
      },
      create: {
        userId: user.user_id,
        token: refreshToken,
      },
    });
  }

  return { token, refreshToken };
};
