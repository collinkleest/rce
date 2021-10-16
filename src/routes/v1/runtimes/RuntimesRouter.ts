import express from "express";
import { runtimes } from "../../../data/Runtimes";
const runtimesRouter = express.Router();

runtimesRouter.get("/", (req, res) => {
  res.status(200).send(runtimes);
});

export { runtimesRouter };
