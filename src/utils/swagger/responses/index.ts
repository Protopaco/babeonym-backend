import badRequestResponse from "./badRequest";
import conflictResponse from "./conflict";
import internalServerErrorResponse from "./internalServerError";
import notAuthenticatedResponse from "./notAuthenticated";
import successResponse from "./sucess";

const response = {
  ...badRequestResponse,
  ...conflictResponse,
  ...internalServerErrorResponse,
  ...notAuthenticatedResponse,
  ...successResponse,
};

export default response;
