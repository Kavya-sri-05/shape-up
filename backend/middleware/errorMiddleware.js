const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  };
  
  const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err?.message || 'Server Error';
  
    if (err?.name === "CastError" && err?.kind === "ObjectId") {
      statusCode = 404;
      message = "Resource not found";
    }
  
    if (err?.code === 11000) {
      statusCode = 400;
      message = "Duplicate field value entered";
    }
  
    if (err?.name === "ValidationError") {
      statusCode = 400;
      message = Object.values(err.errors).map(val => val.message).join(", ");
    }
  
    res.status(statusCode).json({
      success: false,
      message,
      stack: process.env.NODE_ENV === "production" ? null : err?.stack,
    });
  };
  
  export { notFound, errorHandler };