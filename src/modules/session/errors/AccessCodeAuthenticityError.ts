export default class accessCodeError {
  public message: string;

  public statusCode: number;

  constructor(message: string, statusCode = 401) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
