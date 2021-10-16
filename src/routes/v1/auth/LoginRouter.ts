import express from "express";
import Logger from "js-logger";

const logger = Logger.get("LoginRouter");
const loginRouter = express.Router();

loginRouter.post("/login", async (req, res) => {});
