import express from "express";

import { registerController } from "@controller/register.controller";

export const registerRouter = express.Router();

registerRouter.post("/", registerController);
