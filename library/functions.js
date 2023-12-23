export const ErrorHandler = async (user, error, defaultMessage, file) => {
  console.log("---------------------> Error Handler", error);
  console.log("-----> From: ", file);
  console.log("-----> Message: ", defaultMessage);
  console.log("-----> Error: ", error?.message);
  try {
    let userMessage = defaultMessage;
    let saveMessage = error?.message ? error.message : defaultMessage;
    let status = 500;

    if (error?.name === "ValidationError") {
      userMessage = "It seems there's a validation issue, please refresh the page and try again";
      status = 400;
      await SaveValidationError(user, error, file, status);
    } else if (error?.name === "CastError") {
      userMessage = "It seems there's a cast issue. Please refresh the page and try again.";
      status = 400;
      await SaveCastError(user, error, file, status);
    } else if (error?.name === "MongoServerError") {
      userMessage = "It seems there's a duplication error. Please refresh the page and try again.";
      status = 409;
      await SaveMongoError(user, error, file, status);
    } else if (error?.clerkError) {
      userMessage = "An authentication error occurred during your request.";
      status = error?.status ? error.status : 500;
      await SaveError(user, "Clerk authentication issue", error, file, "ErrorHandler -> Clerk Authentication Error", status);
    } else {
      saveMessage = error?.message ? error.message : defaultMessage;
      status = error?.status ? error.status : 500;
      await SaveError(user, saveMessage, error, file, "ErrorHandler", status);
    }
    return { userMessage, status };
  } catch (error) {
    console.log("Error inside error handler: ", error);
    await SaveError(user, error.message, error, "File: library/functions/ErrorHandler | Function: catch");
  }
};

export const SaveValidationError = async (user, error, file, statusCode) => {
  try {
    await SaveError(user, error.message, error.errors, file, "SaveValidationError", statusCode);
    return;
  } catch (error) {
    console.log("Error during SaveValidationError in api/user/request-new-account: ", error);
  }
};

export const SaveCastError = async (user, error, file, statusCode) => {
  try {
    const errorDetails = {
      path: error.path,
      value: error.value,
      kind: error.kind,
      message: error.message,
    };
    await SaveError(user, error.message, errorDetails, file, "SaveCastError", statusCode);
  } catch (error) {
    console.error("Error during SaveCastError in api/user/request-new-account: ", error);
  }
};

export const SaveMongoError = async (user, error, file, statusCode) => {
  try {
    const errorDetails = {
      code: error.code,
      keyValue: error.keyValue,
      message: error.message,
    };
    await SaveError(user, error.message, errorDetails, file, "SaveMongoError", statusCode);
  } catch (error) {
    console.error("Error during SaveMongoErrorDetails in api/user/request-new-account: ", error);
  }
};

export const SaveError = async (user, errorMessage, errorsObject, file, location, statusCode) => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/errors/create-error`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: user, errorMessage: errorMessage, errorsObject: errorsObject, file: file, location: location, statusCode: statusCode }),
    });
    return true;
  } catch (error) {
    console.log("Error inside Save Error", error);
    return false;
  }
};

/*if (error.status != 500) {
    message = error.message;
    status = error.status;
  } else {
    message = defaultMessage;
    status = 500;
  }*/
