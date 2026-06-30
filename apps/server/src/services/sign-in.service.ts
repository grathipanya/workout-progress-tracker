import bcrypt from "bcrypt";

import { AUTH_ERRORS } from "@errors/auth.errors";
import { AppError } from "@errors/app-error";

import { prisma } from "@database/db";

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
  });

  if (!user) {
    throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, 400);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new AppError(AUTH_ERRORS.INVALID_PASSWORD, 400);
  }

  return user;
};
