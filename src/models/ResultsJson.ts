import { keyIsYear } from "../utils/utils";
import { Status, DetailedResponse } from "../utils/DetailedResponse";

const centuryPrefixes:Array<String> = ["18", "19", "20", "21", "22", "23"];

class ResultsJson {
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
  }) {
    this.buildings = params.buildings ?? [];
    this.people = params.people ?? [];
    this.census_records = params.census_records ?? [];
    this.documents = params.documents ?? [];
    this.stories = params.stories ?? [];
    this.media = params.media ?? [];
    this.count = params.count ?? [];
  }

  public static fromJson(callback: (response: DetailedResponse) => void, obj: any): void {
    // Ensure the callback is a function
    if (typeof callback !== "function") {
      throw new Error("Callback must be a function");
    }

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
          result && Object.keys(result).length > 0)) {
      var response = new DetailedResponse(
        null,
        null,
        Status.Error,
        new Error("Invalid results format"),
        true
      );
      callback(response);
    }

    // Check if the count object has the expected properties
    if (!obj.count.every((count: any) =>
          count && Object.keys(count).length > 0)) {
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
      var census_records:Array<any> = [];
      var documents:Array<any> = [];
      var media:Array<any> = [];
      var stories:Array<any> = [];
      var count:Array<Count> = [];

    // Check if it is the new or old format
    if (keyIsYear(Object.keys(obj.results[0])[0], centuryPrefixes)) {
      // Iterate through the results and populate the arrays
      // and the count array
      obj.results.map((result) => {
        let year = Object.keys(result)[0]
        let results = result[year]
        const buildingsArray = results.find(item => item.hasOwnProperty('buildings'))?.buildings;
        const peopleArray = results.find(item => item.hasOwnProperty('people'))?.people;
        const censusRecordsArray = results.find(item => item.hasOwnProperty('documents'))?.documents.filter(item => item.category === "Census Records");
        const documentsArray = results.find(item => item.hasOwnProperty('documents'))?.documents.filter(item => item.category !== "Census Records");
        const mediaArray = results.find(item => item.hasOwnProperty('media'))?.media;
        const storiesArray = results.find(item => item.hasOwnProperty('stories'))?.stories;
        buildingsArray ? buildingsArray === undefined || buildingsArray.length === 0 ? buildings.push(...buildingsArray) : buildings.push(... addYearProp(buildingsArray, year)) : false;
        peopleArray ? peopleArray === undefined || peopleArray.length === 0 ? people.push(...peopleArray) : people.push(... addYearProp(peopleArray, year)) : false;
        censusRecordsArray ? censusRecordsArray === undefined || censusRecordsArray.length === 0 ? census_records.push(...censusRecordsArray) : census_records.push(... addYearProp(censusRecordsArray, year)) : false;
        documentsArray ? documentsArray === undefined || documentsArray.length === 0 ? documents.push(...documentsArray) : documents.push(... addYearProp(documentsArray, year)) : false;
        mediaArray ? mediaArray === undefined || mediaArray.length === 0 ? media.push(...mediaArray) : media.push(... addYearProp(mediaArray, year)) : false;
        storiesArray ? storiesArray === undefined || storiesArray.length === 0 ? stories.push(...storiesArray) : stories.push(... addYearProp(storiesArray, year)) : false;
      });

      // Filter out the "Total", iterate through and populate the count array
      // and add the year property to each count
      obj.count.filter(year => Object.keys(year)[0] !== "Total").map((yearCount) => {
        let year = Object.keys(yearCount)[0]
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
        census_records.push(...result.documents.filter(item => item.category === "Census Records"));
        documents.push(...result.documents.filter(item => item.category !== "Census Records"));
        media.push(...result.media);
        stories.push(...result.stories);
      });

      // Filter out the "Total", iterate through and populate the count array
      // and add the year property to each count
      obj.count.filter(year => Object.keys(year)[0] !== "Total").map((yearCount) => {
        count.push(new Count({
          buildings: yearCount.buildings,
          people: yearCount.people,
          census_records: yearCount.census_records,
          documents: yearCount.documents,
          media: yearCount.media,
          stories: yearCount.stories,
          year: yearCount.yearCount
        }));
      });
    }

    var tempJson = new ResultsJson({
      buildings,
      people,
      census_records,
      documents,
      media,
      stories,
      count
    });

    var response = new DetailedResponse(
      tempJson,
      "Success",
      Status.Success,
      null,
      false);

    // Create a new instance of ResultsJson with the populated arrays
    callback(response);
  }

  public filterByYear(year: string): ResultsJson {
    // Check if the year is valid
    if (!year || typeof year !== "string") {
      throw new Error("Invalid year");
    }
    // Filter each category by the given year
    // and return a new ResultsJson object
    // If the array is empty, return an empty array
    // and if the year is not found, return an empty array
    let filteredBuildings = this.buildings.length === 0 ? [] : this.buildings.filter((building) => building.year === year);
    let filteredPeople = this.people.length === 0 ? [] : this.people.filter((person) => person.year === year);
    let filteredCensusRecords = this.census_records.length === 0 ? [] : this.census_records.filter((census_record) => census_record.year === year);
    let filteredDocuments = this.documents.length === 0 ? [] : this.documents.filter((document) => document.year === year);
    let filteredMedia = this.media.length === 0 ? [] : this.media.filter((media) => media.year === year);
    let filteredStories = this.stories.length === 0 ? [] : this.stories.filter((story) => story.year === year);
    let filteredCount = this.count.length === 0 ? [] : this.count.filter((count) => count.year === year);



    return new ResultsJson({
      buildings: filteredBuildings,
      people: filteredPeople,
      census_records: filteredCensusRecords,
      documents: filteredDocuments,
      media: filteredMedia,
      stories: filteredStories,
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
      totalCount.census_records += count.census_records;
      totalCount.documents += count.documents;
      totalCount.media += count.media;
      totalCount.stories += count.stories;
    });
    totalCount.totalFlag = true;
    return totalCount;
  }

  public static isResultsJson(obj: any): obj is ResultsJson {
    return (
      obj &&
      Array.isArray(obj.buildings) &&
      Array.isArray(obj.people) &&
      Array.isArray(obj.census_records) &&
      Array.isArray(obj.documents) &&
      Array.isArray(obj.media) &&
      Array.isArray(obj.stories) &&
      Array.isArray(obj.count) &&
      obj.count.every((count: any) => Count.isCount(count))
    );
  }
}

class Count {
  public buildings: number;
  public people: number;
  public census_records: number;
  public documents: number;
  public media: number;
  public stories: number;
  public year?: string; // Optional property
  public totalFlag: boolean = false;

  get total (): number {
    return this.buildings + this.people + this.census_records + this.documents + this.media + this.stories;
  };

  constructor(params?: {
    buildings: number;
    people: number;
    census_records: number;
    documents: number;
    media: number;
    stories: number;
    year?: string; // Optional property
    totalFlag?: boolean;
  }) {
    this.buildings = params?.buildings || 0;
    this.people = params?.people || 0;
    this.census_records = params?.census_records || 0;
    this.documents = params?.documents || 0;
    this.media = params?.media || 0;
    this.stories = params?.stories || 0;
    this.year = params?.year || undefined;
    this.totalFlag = params?.totalFlag || false;
  }

  public static JSONToCount(jsonCount: any, year): Count {
    let count = new Count({
      buildings: jsonCount.buildings,
      people: jsonCount.people,
      census_records: jsonCount.census_records,
      documents: jsonCount.documents,
      media: jsonCount.media,
      stories: jsonCount.stories,
      year: year
    });

    return count;
  }

  public static isCount(obj: any): obj is Count {
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