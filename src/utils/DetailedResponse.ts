// /src/utils/DetailedResponse.ts
import IResponseEmbeddable from "./IResponseEmbeddable";

enum Status {
  Success = "success",
  Error = "error",
  Warning = "warning"
}

class DetailedResponse {
  public results: IResponseEmbeddable | null;
  public message: string | null;
  public status: Status;
  public errorMessage: Error | null;
  public isError: Boolean;

  constructor(
    results: IResponseEmbeddable | null,
    message: string | null,
    status: Status,
    errorMessage: Error | null,
    isError: Boolean) {
    this.results = results;
    this.message = message;
    this.status = status;
    this.errorMessage = errorMessage;
    this.isError = isError;
  }
}

export { Status, DetailedResponse };
export default DetailedResponse;