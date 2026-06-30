import { Prisma } from "@database/generated/prisma/client";
import { AppError } from "@errors/app-error";
import { AUTH_ERRORS } from "@errors/auth.errors";
import {
  registerUserService,
  signInService,
  signOutService,
  refreshSessionService,
} from "@services/auth.service";
import { send } from "@utils/response.utils";

import { type Request, type Response } from "express";

export const registerController = async (req: Request, res: Response) => {
  try {
    const user = await registerUserService(req.body);
    res.json(user);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return res.status(400).json({ error: "Email already exists" });
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const signInController = async (req: Request, res: Response) => {
  try {
    const { token, refreshToken, user } = await signInService(req.body);

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 5 * 60 * 1000, // 5 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    send.success(res, { user }, "Logged in successfully!");
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      switch (error.code) {
        case AUTH_ERRORS.USER_NOT_FOUND:
          return send.unauthorized(res, { error: "User not found" });
        case AUTH_ERRORS.INVALID_PASSWORD:
          return send.unauthorized(res, { error: "Invalid password" });
        default:
          return send.error(res, { error: "Internal server error" });
      }
    }

    send.error(res, { error: "Internal server error" });
  }
};

export const signOutController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    if (!userId)
      return send.error(res, "User ID not found in request. You must be signed in to sign out.");

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    await signOutService(userId);

    send.success(res, { message: "Logged out successfully!" });
  } catch (error) {
    send.error(res, "An error occurred while logging out.");
  }
};

export const refreshController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!userId || !incomingRefreshToken) {
      return send.unauthorized(res, { error: "No refresh token provided" });
    }

    const { token, refreshToken, user } = await refreshSessionService({
      userId,
      refreshToken: incomingRefreshToken,
    });

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 5 * 60 * 1000, // 5 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return send.success(res, { user }, "Session refreshed successfully!");
  } catch (error) {
    return send.unauthorized(res, { error: "Invalid or expired refresh token" });
  }
};
