import IResponseEmbeddable from "./IResponseEmbeddable";

// Equivalent of TypeScript's enum
const Status = {
  Success: "success",
  Error: "error",
  Warning: "warning"
};

class DetailedResponse {
  constructor(results, message, status, error, isError) {
    this.results = results;           // Expected to be IResponseEmbeddable or null
    this.message = message;           // string or null
    this.status = status;             // one of Status
    this.error = error;               // Error or null
    this.isError = isError;           // boolean
  }
}

export { Status, DetailedResponse };
export default DetailedResponse;