import { keyIsYear } from "../utils/utils";
import { Status, DetailedResponse } from "../utils/DetailedResponse";

const centuryPrefixes:Array<String> = ["18", "19", "20", "21", "22", "23"];

class ResultsGeoJson {
  public type: string;
  public features: Array<Feature>;


  private constructor(params: {
    type: string;
    features: Array<Feature>;
  }) {
    this.type = params.type;
    this.features = params.features;
  }

  public static fromJson(callback: (response: DetailedResponse) => void, obj: any): void {
    // Check if the object is valid and has the expected structure
    if (!obj ||
        !Array.isArray(obj) ||
        !obj[0].features ||
        !Array.isArray(obj[0].features) ||
        obj[0].features.length === 0){
      var response = new DetailedResponse(
        null,
        "No Results Found",
        Status.Success,
        null,
        false
      );
      callback(response);
    }

    // Check if the object has the expected properties
    if (!obj.every((result: any) =>
          (result.keys && ( result.keys().length > 0 && result.keys().length <= 2 )) ||
          result.features && result.features.length > 0)) {
      var response = new DetailedResponse(
        null,
        null,
        Status.Error,
        new Error("Invalid results format"),
        true
      );
      callback(response);
    }

    if (!obj.count.every((count: any) =>
          count.keys && count.keys().length > 0)) {
      var response = new DetailedResponse(
        null,
        null,
        Status.Error,
        new Error("Invalid count format"),
        true
      );
      callback(response);
    }

    // Create the vars to hold the results
    let type:string = "";
    let features: Array<Feature> = [];


    // Check if it is the new or old format
    if (keyIsYear(obj[0].keys()[0], centuryPrefixes)) {
      // Iterate through the results and populate the arrays
      // and the count array
      obj.map((result) => {
        let year = result.keys()[0]
        let results = result[year]
        type = results.type;
        results.features.map((feature: any) => {
          let featureType = feature.type;
          let geometry = feature.geometry;
          feature.properties.year = year;
          let properties = feature.properties;
          features.push(new Feature(
            featureType,
            new Geometry(geometry.type, geometry.coordinates),
            properties
          ));
        });
      });

    }
    else {
      // Iterate through the results and populate the arrays
      type = obj.type;
      obj.features.map((feature) => {
        let featureType = feature.type;
        let geometry = feature.geometry;
        let properties = feature.properties;
        features.push(new Feature(
          featureType,
          new Geometry(geometry.type, geometry.coordinates),
          properties
        ));
      });
    }

    // Create a new instance of Json with the populated arrays
    callback(new DetailedResponse(new ResultsGeoJson({
      type: type,
      features: features
    }),
    "Success",
    Status.Success,
    null,
    false));
  }

  public filterByYear(year: string): ResultsGeoJson {
    const filteredFeatures = this.features.filter((feature) => {
      return feature.properties.year === year;
    }
    );
    return new ResultsGeoJson({
      type: this.type,
      features: filteredFeatures
    });
  }

  public static isResultsGeoJson(obj: any): obj is ResultsGeoJson {
    return (
      obj &&
      typeof obj.type === "string" &&
      Array.isArray(obj.features)
    );
  }
}

class Feature {
  public type: string;
  public geometry: Geometry;
  public properties: any;

  constructor(type: string, geometry: Geometry, properties: any) {
    this.type = type;
    this.geometry = geometry;
    this.properties = properties;
  }
}

class Geometry {
  public type: string;
  public coordinates: Array<string>;

  constructor(type: string, coordinates: Array<string>) {
    this.type = type;
    this.coordinates = coordinates;
  }
}

export { ResultsGeoJson, Feature, Geometry };
export default ResultsGeoJson;