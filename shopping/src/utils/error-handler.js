const { createLogger, transports } = require("winston");
const { AppError } = require("./app-errors");

const LogErrors = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: "app_error.log" }),
  ],
});

class ErrorLogger {
  constructor() {}
  async logError(err) {
    console.log("==================== Start Error Logger ===============");
    LogErrors.log({
      private: true,
      level: "error",
      message: `${new Date()}-${JSON.stringify(err)}`,
    });
    console.log("==================== End Error Logger ===============");
    // log error with Logger plugins

    return false;
  }

  isTrustError(error) {
    if (error instanceof AppError) {
      return error.isOperational;
    } else {
      return false;
    }
  }
}
// changed the method error handler
const ErrorHandler = async (err, req, res, next) => {
  const errorLogger = new ErrorLogger();

  // Uncaught exception handler
  process.on("uncaughtException", (reason, promise) => {
    console.log(reason, "UNHANDLED");
    throw reason; // You may need to handle process termination/restart
  });

  process.on("uncaughtException", (error) => {
    errorLogger.logError(error);
    if (errorLogger.isTrustError(err)) {
      // You might want to handle restarting the app here
    }
  });

  if (err) {
    // Log the error
    await errorLogger.logError(err);

    // Ensure statusCode exists, fallback to 500 if not
    const statusCode = err.statusCode || 500;

    if (errorLogger.isTrustError(err)) {
      if (err.errorStack) {
        const errorDescription = err.errorStack;
        return res.status(statusCode).json({ message: errorDescription });
      }
      return res.status(statusCode).json({ message: err.message });
    } else {
      // Handle non-trusted errors (app crash, critical issues)
      // You can trigger a process restart or logging as needed
    }

    // Default response if the error is not trusted
    return res.status(statusCode).json({ message: err.message });
  }

  next();
};

module.exports = ErrorHandler;

// const ErrorHandler = async (err, req, res, next) => {
//   const errorLogger = new ErrorLogger();

//   process.on("uncaughtException", (reason, promise) => {
//     console.log(reason, "UNHANDLED");
//     throw reason; // need to take care
//   });

//   process.on("uncaughtException", (error) => {
//     errorLogger.logError(error);
//     if (errorLogger.isTrustError(err)) {
//       //process exist // need restart
//     }
//   });

//   // console.log(err.description, '-------> DESCRIPTION')
//   // console.log(err.message, '-------> MESSAGE')
//   // console.log(err.name, '-------> NAME')
//   if (err) {
//     await errorLogger.logError(err);
//     const statusCode = err.statusCode || 500;
//     if (errorLogger.isTrustError(err)) {
//       if (err.errorStack) {
//         const errorDescription = err.errorStack;
//         return res.status(err.statusCode).json({ message: errorDescription });
//       }
//       return res.status(err.statusCode).json({ message: err.message });
//     } else {
//       //process exit // terriablly wrong with flow need restart
//     }
//     return res.status(err.statusCode).json({ message: err.message });
//   }
//   next();
// };

// module.exports = ErrorHandler;
