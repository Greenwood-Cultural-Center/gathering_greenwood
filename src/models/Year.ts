import utils from "../utils/utils";

class Year  {
  public readonly year: string;  // year
  public readonly mapDate: string; // date to filter map by
  public readonly d: string; // decade
  public readonly y: string; // year
  public readonly c: string; // century
  public readonly inputId: string; // input id
  public readonly labelId: string; // label id
  public readonly dClass: string; // decade class
  public readonly yClass: string; // year class
  public readonly cClass: string; // century class
  public readonly value: string; // value

  constructor(year: string|number, mapDate: string, index: number) {
    //Ensure year is a valid year
    if (!utils.isYear(year)){
      throw new Error(`Invalid year format: ${year.toString()}. Expected 4 digit year`);
    }

    year = year.toString();
    this.mapDate = mapDate;

    // Breakdown into century, decade, year
    this.d = this.year.slice(2, 3);
    this.y = this.year.slice(3, 4);
    this.c = this.year.slice(0, 2);

    // IDs and classes
    this.inputId = `input-${index + 1}`;
    this.labelId = `label-${index + 1}`;
    this.dClass = `d-${index + 1}`;
    this.yClass = `y-${index + 1}`;
    this.cClass = `c-${index + 1}`;

    // Assign a value to year to be used as value in inputs
    this.value = this.year;
  }
}

export default Year;