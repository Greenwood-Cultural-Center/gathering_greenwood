// /src/uitls/ResponseHandler.d.ts
import { IResponseEmbeddable } from "./IResponseEmbeddable";


declare namespace ResponseHandler {
  export enum Status {
    Success = "success",
    Error = "error",
    Warning = "warning"
  }

  export class DetailedResponse {
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
        isError: Boolean
    )
  }
  export class ResultsJson {
    public buildings: Array<any>;
    public people: Array<any>;
    public census_records: Array<any>;
    public documents: Array<any>;
    public media: Array<any>;
    public stories: Array<any>;
    public count: Array<Count>;

    private constructor(params: {
      buildings: Array<any>;
      people: Array<any>;
      census_records: Array<any>;
      documents: Array<any>;
      media: Array<any>;
      stories: Array<any>;
      count: Array<Count>;
    });
    public static fromJson(callback: (response: DetailedResponse) => void, obj: any): void;
    public TotalCount(): Count | null;
    public static isResultsJson(obj: any): obj is ResultsJson;
  }
  export class Count {
    public buildings: number;
    public people: number;
    public census_records: number;
    public documents: number;
    public media: number;
    public stories: number;
    public year?: string; // Optional property
    public totalFlag: boolean;

    get total(): number;
    constructor(params?: {
      buildings: number;
      people: number;
      census_records: number;
      documents: number;
      media: number;
      stories: number;
      year?: string; // Optional property
      totalFlag?: boolean;
    });
    public static JSONToCount(jsonCount: any, year): Count;
    public static isCount(obj: any): obj is Count;
  }
  export class ResultsGeoJson {
    public type: string;
    public features: Array<Feature>;

    constructor(params: {
      type: string;
      features: Array<Feature>;
    });

    public static fromJson(callback: (response: DetailedResponse) => void, obj: any): void;
    public static isResultsGeoJson(obj: any): obj is ResultsGeoJson;
  }

  export class Feature {
    public type: string;
    public geometry: Geometry;
    public properties: any;

    constructor(type: string, geometry: Geometry, properties: any);
  }

  export class Geometry {
    public type: string;
    public coordinates: Array<string>;

    constructor(type: string, coordinates: Array<string>);
  }
}

export default ResponseHandler;