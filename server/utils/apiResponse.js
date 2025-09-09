/**
 * Standard API response format
 */
class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

/**
 * Success response helper
 */
const successResponse = (res, data, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
};

/**
 * Error response helper
 */
const errorResponse = (res, message = "Internal Server Error", statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
    statusCode
  };
  
  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  ApiResponse,
  successResponse,
  errorResponse
};