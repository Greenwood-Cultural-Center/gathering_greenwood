import utils from "../utils/utils.js";
import { Status, DetailedResponse } from "../utils/DetailedResponse.js";

class ResultsGeoJson {
  constructor(params) {
    this.id = "search-source";
    this.type = params.type;
    this.features = params.features;
  }

  static fromJson(callback, obj) {
    if (
      !obj ||
      (Array.isArray(obj) &&
      obj.every(
        (result) =>
        Object.keys(result).length === 1 &&
        utils.isYear(Object.keys(result)[0]) &&
        result[Object.keys(result)[0]].features.length === 0
      )) ||
      (!Array.isArray(obj) &&
      obj.type === "FeatureCollection" &&
      obj.features.length === 0)
    ) {
      const response = new DetailedResponse(ResultsGeoJson.createEmpty(), "No Results Found", Status.Success, null, false);
      callback(response);
      return;
    }

    if (
      !(
      (Array.isArray(obj) &&
        obj.every((result) =>
        Object.keys(result).length === 1 &&
        utils.isYear(Object.keys(result)[0]) &&
        result[Object.keys(result)[0]].type === "FeatureCollection" &&
        Array.isArray(result[Object.keys(result)[0]].features)
        )) ||
      (!Array.isArray(obj) &&
        obj.type === "FeatureCollection" &&
        Array.isArray(obj.features))
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
      type: "FeatureCollection",
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

  isEmpty() {
    return (
      this.features.length === 0
    );
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