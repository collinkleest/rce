import express from "express";
import Logger from "js-logger";

import { RemoteJob } from "../../../core/RemoteJob";
import { RemoteJobParams } from "../../../models/remote-job";
import { RemoteOutputResponse } from "../../../models/resposnes/execute-responses";
import { DockerLangData } from "../../../data/DockerLangData";
import { runtimes } from "../../../data/Runtimes";
import { ExecuteRequestBody } from "../../../models/requests/execute-request";

const logger = Logger.get("ExecuteRouter");
const executeRouter = express.Router();

executeRouter.post("/", async (req, res) => {
  logger.info(`Request received with body of ${req.body} from ${req.ip}`);
  let { language } = req.body as ExecuteRequestBody;
  const { filename, code } = req.body as ExecuteRequestBody;

  if (!language || typeof language !== "string") {
    return res.status(400).send({
      message: "language is required as a string",
    });
  }

  if (!code || typeof code !== "string") {
    return res.status(400).send({
      message: "code is required as a string",
    });
  }

  if (!filename || typeof filename !== "string") {
    return res.status(400).send({
      message: "filename is required as a string",
    });
  }

  const langFromAlias = runtimes.find((runtime) =>
    runtime.aliases?.includes(language)
  )?.language;

  if (DockerLangData[language] === undefined && langFromAlias === undefined) {
    return res.status(400).send({
      message: `${language} is not a supported language`,
    });
  }

  language = langFromAlias ? langFromAlias : language;

  const fileNameTitle = filename.split(".").slice(0, -1).join(".");

  const remoteJobParams: RemoteJobParams = {
    language: language.trim(),
    code: code,
    filename: filename,
    image: DockerLangData[language].imageTag,
    runCommands: DockerLangData[language].runCommands(filename, fileNameTitle),
    mountPath: DockerLangData[language].mountPath,
  };

  const remoteJob: RemoteJob = new RemoteJob(remoteJobParams);

  try {
    await remoteJob.setup();
  } catch (err) {
    res.status(500).send({
      message: "Error in remote job setup",
      error: err,
    });
    logger.error("Error in remote job setup:");
    logger.error(err);
    throw err;
  }

  try {
    const remoteOutput = await remoteJob.execute();
    const output: RemoteOutputResponse = {
      language: language,
      output: {
        stdout: remoteOutput.stdout.toString(),
        stderr: remoteOutput.stderr.toString(),
      },
    };
    res.status(200).send(output as RemoteOutputResponse);
  } catch (err) {
    res.status(500).send({
      message: "Error in remote code execution",
      error: err,
    });
    logger.error("Error in remote job execution:");
    logger.error(err);
    throw err;
  }

  try {
    await remoteJob.cleanup();
  } catch (err) {
    logger.error("Error in remote job cleanup:");
    logger.error(err);
    throw err;
  }
});

export { executeRouter };
