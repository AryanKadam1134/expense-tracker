class ApiRes<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;

  constructor(
    statusCode: number,
    data: T,
    message: string = "success",
    success: boolean = true,
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400 || success;
  }
}

export default ApiRes;
