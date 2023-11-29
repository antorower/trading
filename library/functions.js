export const ErrorHandler = async (user, error, defaultMessage, file) => {  
  try {
    let message = defaultMessage;
    let status = 500;
    if (error?.name === "ValidationError") {
      message = "It seems there's a validation issue. Please refresh the page and try again.";
      status = 400;
      await SaveValidationError(user, error, file, status);
    } else if (error?.name === "CastError") {
      message = "It seems there's a cast issue. Please refresh the page and try again.";
      status = 400;
      await SaveCastError(user, error, file, status);
    } else if (error?.name === "MongoServerError") {      
      message = "It seems there's a duplication error. Please refresh the page and try again.";
      status = 409;
      await SaveMongoError(user, error, file, status);
    } else if (error?.clerkError) {
      console.log("Clerk Erorr General Error", error);
      console.log("Clerk Error", error.clerkError);
      message = "An authentication error occurred during your request.";
      status = error.status;
      await SaveError(user, "Clerk authentication issue", {}, file, "ErrorHandler -> Clerk Authentication Error", status);
    } else {      
      if (error.status != 500) {        
        message = error.message;        
        status = error.status;
      } else {
        message = defaultMessage;
        status = 500;
      }
      await SaveError(user, error.message, error, file, "ErrorHandler", status);
    }
    const response = { message, status };
    return response;
  } catch (error) {
    console.log("Error inside error handler: ", error);
    await SaveError(user, error.message, {}, "File: library/functions/ErrorHandler | Function: catch");
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
