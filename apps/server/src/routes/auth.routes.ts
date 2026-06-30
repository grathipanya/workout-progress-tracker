import express from "express";

import {
  registerController,
  signOutController,
  signInController,
  refreshController,
} from "@controller/auth.controller";

import { authenticateUser, refreshTokenValidation } from "@middleware/auth";

export const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/sign-in", signInController);
authRouter.post("/sign-out", authenticateUser, signOutController);
authRouter.post("/refresh", refreshTokenValidation, refreshController);
