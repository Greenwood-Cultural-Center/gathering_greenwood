import utils from "../utils/utils.js";
import { Status, DetailedResponse } from "../utils/DetailedResponse.js";

class ResultsGeoJson {
  constructor(params) {
    this.type = params.type;
    this.features = params.features;
  }

  static fromJson(callback, obj) {
    if (
      !obj ||
      !Array.isArray(obj) ||
      !obj[0].features ||
      !Array.isArray(obj[0].features) ||
      obj[0].features.length === 0
    ) {
      const response = new DetailedResponse(
        null,
        "No Results Found",
        Status.Success,
        null,
        false
      );
      callback(response);
      return;
    }

    if (
      !obj.every((result) =>
        (result.keys && Object.keys(result).length > 0 && Object.keys(result).length <= 2) ||
        (result.features && result.features.length > 0)
      )
    ) {
      const response = new DetailedResponse(
        null,
        null,
        Status.Error,
        new Error("Invalid results format"),
        true
      );
      callback(response);
      return;
    }

    let type = "";
    let features = [];

    if (utils.isYear(Object.keys(obj[0])[0])) {
      obj.map((result) => {
        const year = Object.keys(result)[0];
        const results = result[year];
        type = results.type;
        results.features.map((feature) => {
          if (!feature) return;
          const featureType = feature.type;
          const geometry = feature.geometry;
          feature.properties.year = year;
          const properties = feature.properties;
          features.push(new Feature(
            featureType,
            new Geometry(geometry.type, geometry.coordinates),
            properties
          ));
        });
      });
    } else {
      type = obj.type;
      obj.features.map((feature) => {
        const featureType = feature.type;
        const geometry = feature.geometry;
        const properties = feature.properties;
        features.push(new Feature(
          featureType,
          new Geometry(geometry.type, geometry.coordinates),
          properties
        ));
      });
    }

    callback(new DetailedResponse(
      new ResultsGeoJson({
        type: type,
        features: features
      }),
      "Success",
      Status.Success,
      null,
      false
    ));
  }

  static createEmpty() {
    return new ResultsGeoJson({
      type: "",
      features: []
    });
  }

  filterByYear(year) {
    const filteredFeatures = this.features.length === 0
      ? []
      : this.features.filter((feature) => feature.properties.year === year);

    return new ResultsGeoJson({
      type: this.type,
      features: filteredFeatures
    });
  }

  TotalCount() {
    return this.features.length;
  }

  static isResultsGeoJson(obj) {
    return obj &&
      typeof obj.type === "string" &&
      Array.isArray(obj.features);
  }
}

class Feature {
  constructor(type, geometry, properties) {
    this.type = type;
    this.geometry = geometry;
    this.properties = properties;
  }
}

class Geometry {
  constructor(type, coordinates) {
    this.type = type;
    this.coordinates = coordinates;
  }
}

export { ResultsGeoJson, Feature, Geometry };