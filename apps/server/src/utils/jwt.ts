import authConfig from "@config/auth.config";
import type { ContactInfo, User } from "@database/generated/prisma/client";
import jwt from "jsonwebtoken";

type AccessTokenProps = {
  id: User["user_id"];
  email: ContactInfo["email"];
  role: User["role"];
};

export const signAccessToken = ({ id, role, email }: AccessTokenProps) =>
  jwt.sign({ id, role, email }, authConfig.jwtSecret!, { expiresIn: "3m" });

export const refreshAccessToken = ({ id, role, email }: AccessTokenProps) =>
  jwt.sign({ id, role, email }, authConfig.jwtRefreshSecret!, { expiresIn: "24h" });
