class ErrorReponseDTO {
  status;
  message;
  error;
  constructor(message, error, status) {
    this.message = message;
    this.status = status;
    this.error = error;
  }
}

module.exports = ErrorReponseDTO;
