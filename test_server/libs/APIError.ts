interface APIErrorConstructor {
  message: string;
  code: number;
  extra?: Record<string, any>;
}

export class APIError extends Error {
  message = "Internal Server Error";
  code = 500;
  extra: APIErrorConstructor["extra"] = {};

  constructor({ message, code, extra }: APIErrorConstructor) {
    super(message);
    Object.setPrototypeOf(this, APIError.prototype);

    this.message = message;
    this.code = code;
    if (extra) this.extra = extra;
  }
}
