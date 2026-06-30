import express from "express";

import { signInController } from "@controller/sign-in.controller";

export const signInRouter = express.Router();

signInRouter.post("/", signInController);
