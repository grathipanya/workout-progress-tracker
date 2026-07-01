import { prisma } from "@package/db";
import type { RefreshToken, User } from "@package/db/generated/prisma/client";

type upsertRefreshTokenProps = {
  userId: User["user_id"];
  tokenHash: RefreshToken["tokenHash"];
};

export const upsertRefreshToken = async ({ userId, tokenHash }: upsertRefreshTokenProps) => {
  return prisma.refreshToken.upsert({
    where: {
      userId,
    },
    update: {
      tokenHash,
      revokedAt: null,
    },
    create: {
      userId,
      tokenHash,
    },
  });
};

export const getActiveRefreshTokenByUserId = async (userId: User["user_id"]) => {
  return prisma.refreshToken.findUnique({
    where: { userId },
    select: {
      tokenHash: true,
      revokedAt: true,
    },
  });
};

export const revokeRefreshToken = async (userId: User["user_id"]) => {
  return prisma.refreshToken.update({
    where: {
      userId,
    },
    data: {
      revokedAt: new Date(),
    },
  });
};

export const clearRefreshToken = async (userId: User["user_id"]) => {
  return prisma.refreshToken.update({
    where: {
      userId,
    },
    data: {
      tokenHash: null,
    },
  });
};
