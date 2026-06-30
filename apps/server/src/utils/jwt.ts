import authConfig from "@config/auth.config";
import type { ContactInfo, User } from "@database/generated/prisma/client";
import jwt from "jsonwebtoken";

export type AccessTokenProps = {
  userId: User["user_id"];
  email: ContactInfo["email"];
  role: User["role"];
};

export const signAccessToken = ({ userId, role, email }: AccessTokenProps) =>
  jwt.sign({ userId, role, email }, authConfig.jwtSecret!, {
    expiresIn: authConfig.jwtSecretExpiresIn as any,
  });

export const refreshAccessToken = ({ userId, role, email }: AccessTokenProps) =>
  jwt.sign({ userId, role, email }, authConfig.jwtRefreshSecret!, {
    expiresIn: authConfig.jwtRefreshSecretExpiresIn as any,
  });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, authConfig.jwtSecret!) as AccessTokenProps;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, authConfig.jwtRefreshSecret!) as AccessTokenProps;
