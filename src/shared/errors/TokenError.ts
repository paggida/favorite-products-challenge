export default class TokenError {
  public message: string;

  public data: object;

  public statusCode: number;

  constructor(message: string, data?: object, statusCode = 401) {
    this.message = message;
    this.statusCode = statusCode;

    if (data) {
      this.data = data;
    }
  }
}
