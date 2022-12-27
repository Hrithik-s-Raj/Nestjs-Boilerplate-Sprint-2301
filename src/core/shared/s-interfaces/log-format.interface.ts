export interface SuccessLog {
  method: string;
  response_time: string;
  environment: string;
  request_url: string;
  IP: string;
  response_code: number;
  params: object;
  query: object;
  body: object;
}

export interface ErrorLog {
  environment: string;
  context: string;
  error_path: string;
  error_message: string;
  method: string;
  request_url: string;
  IP: string;
  response_code: number;
  params: object;
  query: object;
  body: object;
}
