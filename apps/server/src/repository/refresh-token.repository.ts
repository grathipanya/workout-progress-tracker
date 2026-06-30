import { prisma } from "@database/db";
import type { RefreshToken, User } from "@database/generated/prisma/client";

type upsertRefreshTokenProps = {
  userId: User["user_id"];
  token: RefreshToken["token"];
};

export const upsertRefreshToken = async ({ userId, token }: upsertRefreshTokenProps) => {
  return prisma.refreshToken.upsert({
    where: {
      userId,
    },
    update: {
      token,
    },
    create: {
      userId,
      token,
    },
  });
};
