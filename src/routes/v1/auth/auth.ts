import express from "express";
import Logger from "js-logger";

const logger = Logger.get("AuthRouter");
const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  if (req.body == null) {
    return res.status(400).send({
      message: "Request body cannot be empty",
    });
  }
});

export { authRouter };
