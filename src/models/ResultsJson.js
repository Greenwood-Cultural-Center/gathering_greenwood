import utils from "../utils/utils.js";
import { Status, DetailedResponse } from "../utils/DetailedResponse.js";

const centuryPrefixes = ["18", "19", "20", "21", "22", "23"];

class ResultsJson {
  constructor(params) {
    this.buildings = params.buildings;
    this.people = params.people;
    this.census_records = params.census_records;
    this.documents = params.documents;
    this.stories = params.stories;
    this.media = params.media;
    this.count = params.count;
  }

  static fromJson(callback, obj) {
    if (typeof callback !== "function") {
      throw new Error("Callback must be a function");
    }

    if (!obj || !obj.results || !Array.isArray(obj.results) || !obj.count || !Array.isArray(obj.count)) {
      const response = new DetailedResponse(ResultsJson.createEmpty(), "No Results Found", Status.Success, null, false);
      callback(response);
      return;
    }

    if (
      !obj ||
      (Array.isArray(obj.results) && !obj.results.every((result) => result && Object.keys(result).length > 0)) ||
      !(typeof obj.results === "object" && Object.keys(obj.results).length > 0)
    ) {
      const response = new DetailedResponse(null, null, Status.Error, new Error("Invalid results format"), true);
      callback(response);
      return;
    }

    if (!obj || (Array.isArray(obj.count) && !obj.results.every((result) => result && Object.keys(result).length > 0)) ||
       !(typeof obj.count === "object" && Object.keys(obj.count).length > 0)) {
      const response = new DetailedResponse(null, null, Status.Error, new Error("Invalid count format"), true);
      callback(response);
      return;
    }

    let FinalResultsJson = ResultsJson.createEmpty();

    if (Array.isArray(obj.results) && utils.isYear(Object.keys(obj.results[0])[0])) {
      const results = obj.results;

      const YearRecords = results.map((entry) => {
        const [year, contentEntry] = Object.entries(entry)[0];

        if (!Array.isArray(contentEntry)) {
          throw new Error("Invalid content format");
        }

        const content = contentEntry;

        const buildingBlock = content.find((c) => c.buildings);
        const peopleBlock = content.find((c) => c.people);
        const docBlock = content.find((c) => c.documents);
        const mediaBlock = content.find((c) => c.media);
        const storyBlock = content.find((c) => c.stories);

        return {
          buildings: buildingBlock?.buildings?.map((b) => ({ ...b, year })) || [],
          people: peopleBlock?.people?.map((p) => ({ ...p, year })) || [],
          census_records: docBlock?.documents?.filter((item) => item.category === "Census Records").map((d) => ({ ...d, year })) || [],
          documents: docBlock?.documents?.filter((item) => item.category !== "Census Records").map((d) => ({ ...d, year })) || [],
          media: mediaBlock?.media?.map((m) => ({ ...m, year })) || [],
          stories: storyBlock?.stories?.map((s) => ({ ...s, year })) || []
        };
      });

      const count = obj.count.filter((c) => Object.keys(c)[0] !== "Total")

      const YearCountRecords = count.map((entry) => {
        const [year, contentEntry] = Object.entries(entry)[0];
        if (typeof contentEntry !== "object") {
          throw new Error("Invalid content format");
        }
          return new Count({
            year,
            buildings: contentEntry?.buildings || 0,
            people: contentEntry?.people || 0,
            census_records: contentEntry?.census_records || 0,
            documents: contentEntry?.documents || 0,
            media: contentEntry?.media || 0,
            stories: contentEntry?.stories || 0,
            totalFlag: year === "Total"
          });
      });

      FinalResultsJson = new ResultsJson({
        buildings: YearRecords.flatMap((entry) => entry.buildings),
        people: YearRecords.flatMap((entry) => entry.people),
        census_records: YearRecords.flatMap((entry) => entry.census_records),
        documents: YearRecords.flatMap((entry) => entry.documents),
        media: YearRecords.flatMap((entry) => entry.media),
        stories: YearRecords.flatMap((entry) => entry.stories),
        count: YearCountRecords
      });

    } else {
      const newObj = obj;
      const results = newObj.results;
      const tempJson = ResultsJson.createEmpty();

      tempJson.buildings = results.buildings;
      tempJson.people = results.people;
      tempJson.census_records = results.documents.filter((item) => item.category === "Census Records");
      tempJson.documents = results.documents.filter((item) => item.category !== "Census Records");
      tempJson.media = results.media;
      tempJson.stories = results.stories;

      const count = [];

      newObj.count
        .filter((c) => c.year !== "Total")
        .forEach((yearCount) => {
          count.push(new Count({ ...yearCount, totalFlag: false }));
        });

      // newObj.count
      //   .filter((year) => Object.keys(year)[0] === "Total")
      //   .forEach((yearCount) => {
      //     count.push(new Count({ ...yearCount, totalFlag: true }));
      //   });

      FinalResultsJson = new ResultsJson({
        buildings: tempJson.buildings,
        people: tempJson.people,
        census_records: tempJson.census_records,
        documents: tempJson.documents,
        media: tempJson.media,
        stories: tempJson.stories,
        count
      });
    }

    const response = new DetailedResponse(FinalResultsJson, "Success", Status.Success, null, false);
    callback(response);
  }

  static createEmpty() {
    return new ResultsJson({
      buildings: [],
      people: [],
      census_records: [],
      documents: [],
      media: [],
      stories: [],
      count: []
    });
  }

  filterByYear(year) {
    if (!year || typeof year !== "string") {
      throw new Error("Invalid year");
    }

    return new ResultsJson({
      buildings: this.buildings.filter((b) => b.year === year),
      people: this.people.filter((p) => p.year === year),
      census_records: this.census_records.filter((r) => r.year === year),
      documents: this.documents.filter((d) => d.year === year),
      media: this.media.filter((m) => m.year === year),
      stories: this.stories.filter((s) => s.year === year),
      count: this.count.filter((c) => c.year === year)
    });
  }

  TotalCount() {
    if (!this.count || this.count.length === 0) {
      return null;
    }

    const totalCount = new Count();

    this.count.forEach((count) => {
      totalCount.buildings += count.buildings;
      totalCount.people += count.people;
      totalCount.census_records += count.census_records;
      totalCount.documents += count.documents;
      totalCount.media += count.media;
      totalCount.stories += count.stories;
    });

    totalCount.totalFlag = true;
    return totalCount;
  }

  static isResultsJson(obj) {
    return (
      obj &&
      Array.isArray(obj.buildings) &&
      Array.isArray(obj.people) &&
      Array.isArray(obj.census_records) &&
      Array.isArray(obj.documents) &&
      Array.isArray(obj.media) &&
      Array.isArray(obj.stories) &&
      Array.isArray(obj.count) &&
      obj.count.every((count) => Count.isCount(count))
    );
  }
}

class Count {
  constructor(params = {}) {
    this.buildings = params.buildings || 0;
    this.people = params.people || 0;
    this.census_records = params.census_records || 0;
    this.documents = params.documents || 0;
    this.media = params.media || 0;
    this.stories = params.stories || 0;
    this.year = params.year || undefined;
    this.totalFlag = params.totalFlag || false;
  }

  get total() {
    return (
      this.buildings +
      this.people +
      this.census_records +
      this.documents +
      this.media +
      this.stories
    );
  }

  static JSONToCount(jsonCount, year) {
    return new Count({
      buildings: jsonCount.buildings,
      people: jsonCount.people,
      census_records: jsonCount.census_records,
      documents: jsonCount.documents,
      media: jsonCount.media,
      stories: jsonCount.stories,
      year
    });
  }

  static isCount(obj) {
    return (
      obj &&
      typeof obj.buildings === "number" &&
      typeof obj.people === "number" &&
      typeof obj.census_records === "number" &&
      typeof obj.documents === "number" &&
      typeof obj.media === "number" &&
      typeof obj.stories === "number" &&
      (obj.year === undefined || typeof obj.year === "string")
    );
  }
}

export { ResultsJson, Count };
export default ResultsJson;