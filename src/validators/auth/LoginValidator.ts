import { Request, Response } from "express";
import HttpStatus from "http-status-codes";

/*
 *   Checks body of request
 *   @param request
 */
const loginValidator = (request: Request, response: Response) => {
  if (request.body === null) {
    response.status(HttpStatus.BAD_REQUEST).send({});
  }
};
