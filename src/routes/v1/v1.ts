import express from "express";

import { runtimesRouter } from "./runtimes/runtimes";
import { executeRouter } from "./execute/execute";
import { authRouter } from "./auth/auth";

const v1Router = express.Router();

v1Router.use("/runtimes", runtimesRouter);
v1Router.use("/execute", executeRouter);
v1Router.use("/auth", authRouter);

export { v1Router };
