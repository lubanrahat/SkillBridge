export class AppError extends Error {
  constructor(
    public statusCode: number,
    public override message: string,
    public code: string = "ERROR",
    public details?: unknown,
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
