import { Request, Response } from "express";

/*
 *   Checks body of request
 *   @param request
 */
const loginValidator = (request: Request, response: Response) => {
  if (request.body === null) {
    response;
  }
};
