import utils from "../utils/utils";
import { Status, DetailedResponse } from "../utils/DetailedResponse";
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
          (result.keys && ( Object.keys(result).length > 0 && Object.keys(result).length <= 2 )) ||
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

    // Create the vars to hold the results
    let type:string = "";
    let features: Array<Feature> = [];


    // Check if it is the new or old format
    if (utils.isYear(Object.keys(obj[0])[0])) {
      // Iterate through the results and populate the arrays
      // and the count array
      obj.map((result) => {
        let year = Object.keys(result)[0]
        let results = result[year]
        type = results.type;
        results.features.map((feature: any) => {
          if (feature === undefined || !feature) {
            return;
          }
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
    const filteredFeatures = this.features.length === 0 ? [] : this.features.filter((feature) => feature.properties.year === year);

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