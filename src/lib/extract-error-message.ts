const isBasicError = (val: unknown): val is Record<"message", string> =>
  typeof val === "object" &&
  val !== null &&
  "message" in val &&
  typeof val.message === "string";

export const extractErrorMessage = (errorObject: unknown): string => {
  // If the error object is a standard error, return the message
  if (isBasicError(errorObject)) return errorObject.message;

  // If the error object is a string, return it
  if (typeof errorObject === "string") return errorObject;

  // Last resort, if we are unable to reasonably derive
  // an error message from the object, we just stringify
  // the whole thing and return that
  return JSON.stringify(errorObject);
};
