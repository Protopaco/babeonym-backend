import badRequestResponse from "./badRequest";
import conflictResponse from "./conflict";
import internalServerErrorResponse from "./internalServerError";
import notAuthenticatedResponse from "./notAuthenticated";

const response = {
  ...badRequestResponse,
  ...conflictResponse,
  ...internalServerErrorResponse,
  ...notAuthenticatedResponse,
};

export default response;
