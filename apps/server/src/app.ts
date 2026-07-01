import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { authenticateUser } from "@middleware/auth";
import { authRouter } from "@routes/auth.routes";

import errorHandler from "@middleware/error-handler";

const app = express();

app.use(
  cors({
    origin: process.env.LOCAL_APP_URL,
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Sample API Route
app.get("/", (req, res) => {
  res.json({ message: "hello" });
});

app.get("/protected", authenticateUser, (req, res) => {
  res.json({ message: "This is a protected route" });
});

app.use("/auth", authRouter);

app.use(errorHandler);

export default app;
