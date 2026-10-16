// A thrown error that carries an HTTP status, so routes can `throw new
// HttpError(401, '...')` and the central errorHandler turns it into a clean
// JSON response.
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}