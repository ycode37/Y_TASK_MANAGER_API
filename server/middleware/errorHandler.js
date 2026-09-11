export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.errors,
    });
  }
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID",
    });
  }
  if (err.name === "ZodError") {
    return res.status(400).json({
      message: "Invalid Data ",
      errors: err.issues,
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: "Email Already Exists",
    });
  }

  return res.status(500).json({
    message: "Internal Server Error",
  });
};
