import HttpStatus from "http-status-codes";
import { Error } from "./Error";
import { Message } from "./Message";

export interface BadRequestException {
  message: Message;
  statusCode: typeof HttpStatus;
  error: Error;
}
