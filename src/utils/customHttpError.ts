export class customHttpError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;

    // Set the prototype explicitly to maintain proper instanceof behavior
    Object.setPrototypeOf(this, customHttpError.prototype);
  }
}
