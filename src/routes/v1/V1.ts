import express from "express";

import { runtimesRouter } from "./runtimes/RuntimesRouter";
import { executeRouter } from "./execute/ExecuteRouter";
import { authRouter } from "./auth/AuthRouter";

const v1Router = express.Router();

v1Router.use("/runtimes", runtimesRouter);
v1Router.use("/execute", executeRouter);
v1Router.use("/auth", authRouter);

export { v1Router };
