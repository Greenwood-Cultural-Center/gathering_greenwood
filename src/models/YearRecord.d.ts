declare module "YearRecord" {
  export type YearProps = Readonly<{
    inputId: string;
    labelId: string;
    centuryClass: string;
    decadeClass: string;
    yearPartClass: string;
  }>;

  export type YearData = Readonly<{
    year: string;
    mapDate: string;
    value: string;
    centuryPart: string;
    decadePart: string;
    yearPart: string;
    props: YearProps;
    hash: string;
  }>;

  export type YearRecord = Readonly<Record<string, YearData>>;

  /**
   * Creates a single immutable YearData entry.
   * @param year - The year value as string or number.
   * @param mapDate - Date string used to filter or map.
   * @param index - Index used to generate IDs and classnames.
   */
  export function createYear(
    year: string | number,
    mapDate: string,
    index: number
  ): YearData;

  /**
   * Creates a YearData summary entry for a range of years.
   * @param firstYear - Minimum year.
   * @param lastYear - Maximum year.
   * @param index - Index to generate classes and IDs.
   */
  export function createYearRangeSummary(
    firstYear: number,
    lastYear: number,
    index: number
  ): YearData;

  export interface YearEntry {
    year: string | number;
    mapDate: string;
  }

  export interface YearSummaryConfig {
    key: string;
    mapDate: string;
    value: string;
  }

  /**
   * Builds a full YearRecord and includes a summary entry under a key.
   * @param entries - Array of objects with { year, mapDate }.
   * @param summary - Optional summary configuration object.
   */
  export function buildYearRecord(
    entries: YearEntry[],
    summary?: YearSummaryConfig
  ): YearRecord;
}