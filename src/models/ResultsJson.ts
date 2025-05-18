import { keyIsYear } from "../utils/utils";
import { Status, DetailedResponse } from "../utils/DetailedResponse";

const centuryPrefixes:Array<String> = ["18", "19", "20", "21", "22", "23"];

class ResultsJson {
  public buildings: Array<any>;
  public people: Array<any>;
  public documents: Array<any>;
  public stories: Array<any>;
  public media: Array<any>;
  public count: Array<Count>;


  private constructor(params: {
    buildings: Array<any>;
    people: Array<any>;
    documents: Array<any>;
    stories: Array<any>;
    media: Array<any>;
    count: Array<Count>;
  }) {
    this.buildings = params.buildings;
    this.people = params.people;
    this.documents = params.documents;
    this.stories = params.stories;
    this.media = params.media;
    this.count = params.count;
  }

  public static fromJson(callback: (response: DetailedResponse) => void, obj: any): void {
    // Check if the object is valid and has the expected structure
    if (!obj ||
        !obj.results ||
        !Array.isArray(obj.results) &&
        !obj.count ||
        !Array.isArray(obj.count)) {
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
    if (!obj.results.every((result: any) =>
          result.keys && result.keys().length > 0)) {
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
      // Initialize empty arrays for each category
      // and a count array
      var buildings:Array<any> = [];
      var people:Array<any> = [];
      var documents:Array<any> = [];
      var stories:Array<any> = [];
      var media:Array<any> = [];
      var count:Array<Count> = [];


    // Check if it is the new or old format
    if (keyIsYear(obj.results[0].keys()[0], centuryPrefixes)) {
      // Iterate through the results and populate the arrays
      // and the count array
      obj.results.map((result) => {
        let year = result.keys()[0]
        let results = result[year]
        buildings.push(... addYearProp(results.buildings, year));
        people.push(...addYearProp(results.people, year));
        documents.push(...addYearProp(results.documents, year));
        stories.push(...addYearProp(results.stories, year));
        media.push(...addYearProp(results.media, year));
      });

      // Filter out the "Total", iterate through and populate the count array
      // and add the year property to each count
      obj.count.filter(year => year.keys()[0] !== "Total").map((yearCount) => {
        let year = yearCount.keys()[0]
        let counts = yearCount[year]
        count.push(Count.JSONToCount(counts, year));
      });

      // Add the year property to each category
      function addYearProp(category: Array<any>, year: string): Array<any> {
        category.map((item) => {
          item.year = year;
        });

        return category;
      }
    }
    else {
      // Iterate through the results and populate the arrays
      // and the count array
      obj.results.map((result) => {
        buildings.push(...result.buildings);
        people.push(...result.people);
        documents.push(...result.documents);
        stories.push(...result.stories);
        media.push(...result.media);
      });

      // Filter out the "Total", iterate through and populate the count array
      // and add the year property to each count
      obj.count.filter(year => year.keys()[0] !== "Total").map((yearCount) => {
        count.push(new Count({
          buildings: yearCount.buildings,
          people: yearCount.people,
          documents: yearCount.documents,
          stories: yearCount.stories,
          media: yearCount.media,
          year: yearCount.yearCount
        }));
      });
    }

    // Create a new instance of ResultsJson with the populated arrays
    callback(new DetailedResponse(new ResultsJson({
      buildings,
      people,
      documents,
      stories,
      media,
      count
    }),
    "Success",
    Status.Success,
    null,
    false));
  }

  public filterByYear(year: string): ResultsJson {
    let filteredBuildings = this.buildings.filter((building) => building.year === year);
    let filteredPeople = this.people.filter((person) => person.year === year);
    let filteredDocuments = this.documents.filter((document) => document.year === year);
    let filteredStories = this.stories.filter((story) => story.year === year);
    let filteredMedia = this.media.filter((media) => media.year === year);
    let filteredCount = this.count.filter((count) => count.year === year);
    return new ResultsJson({
      buildings: filteredBuildings,
      people: filteredPeople,
      documents: filteredDocuments,
      stories: filteredStories,
      media: filteredMedia,
      count: filteredCount
    });
  }

  // Method to calculate the total count of all categories
  public TotalCount(): Count | null {
    if (!this.count || this.count.length === 0) {
      return null;
    }
    let totalCount = new Count();
    this.count.map((count) => {
      totalCount.buildings += count.buildings;
      totalCount.people += count.people;
      totalCount.documents += count.documents;
      totalCount.stories += count.stories;
      totalCount.media += count.media;
    });
    totalCount.totalFlag = true;
    return totalCount;
  }

  public static isResultsJson(obj: any): obj is ResultsJson {
    return (
      obj &&
      Array.isArray(obj.buildings) &&
      Array.isArray(obj.people) &&
      Array.isArray(obj.documents) &&
      Array.isArray(obj.stories) &&
      Array.isArray(obj.media) &&
      Array.isArray(obj.count) &&
      obj.count.every((count: any) => Count.isCount(count))
    );
  }
}

class Count {
  public buildings: number;
  public people: number;
  public documents: number;
  public stories: number;
  public media: number;
  public year?: string; // Optional property
  public totalFlag: boolean = false;

  get total (): number {
    return this.buildings + this.people + this.documents + this.stories + this.media;
  };

  constructor(params?: {
    buildings: number;
    people: number;
    documents: number;
    stories: number;
    media: number;
    year?: string; // Optional property
    totalFlag?: boolean;
  }) {
    this.buildings = params?.buildings || 0;
    this.people = params?.people || 0;
    this.documents = params?.documents || 0;
    this.stories = params?.stories || 0;
    this.media = params?.media || 0;
    this.year = params?.year || undefined;
    this.totalFlag = params?.totalFlag || false;
  }

  public static JSONToCount(jsonCount: any, year): Count {
    let count = new Count({
      buildings: jsonCount.buildings,
      people: jsonCount.people,
      documents: jsonCount.documents,
      stories: jsonCount.stories,
      media: jsonCount.media,
      year: year
    });

    return count;
  }

  public static isCount(obj: any): obj is Count {
    return (
      obj &&
      typeof obj.buildings === "number" &&
      typeof obj.people === "number" &&
      typeof obj.documents === "number" &&
      typeof obj.stories === "number" &&
      typeof obj.media === "number" &&
      (obj.year === undefined || typeof obj.year === "string")
    );
  }
}

export { ResultsJson, Count };
export default ResultsJson;