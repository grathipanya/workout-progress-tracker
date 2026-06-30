import express from "express";
import cors from "cors";
import morgan from "morgan";

import { auth } from "@middleware/auth";
import { registerRouter } from "@routes/register";
import { signInRouter } from "@routes/sign-in";
import errorHandler from "@middleware/error-handler";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Sample API Route
app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/protected", auth, (req, res) => {
  res.send("This is a protected route");
});

app.use("/register", registerRouter);
app.use("/sign-in", signInRouter);

app.use(errorHandler);

export default app;
