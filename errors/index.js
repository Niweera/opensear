export const AccessDeniedError = class AccessDeniedError {
  constructor(message) {
    this.message = message;
  }
};

export const AuthenticationError = class AuthenticationError {
  constructor(message) {
    this.message = message;
  }
};

export const NotFoundError = class NotFoundError {
  constructor(message) {
    this.message = message;
  }
};

export const ValidationError = class ValidationError {
  constructor(message) {
    this.message = message;
  }
};
