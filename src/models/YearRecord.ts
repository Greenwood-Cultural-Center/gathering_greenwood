// src/models/YearRecord.ts
import objectHash from 'object-hash';
import utils from "../utils/utils"; // Must export isYear(year: string | number): boolean

// ===== Types =====

/**
 * Represents DOM-related metadata for a year.
 */
export type YearProps = Readonly<{
  inputId: string;
  labelId: string;
  centuryClass: string;
  decadeClass: string;
  yearPartClass: string;
}>;

/**
 * Represents a normalized year entry with derived parts and metadata.
 */
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

/**
 * Immutable record mapping year strings to YearData.
 */
export type YearRecord = Readonly<Record<string, YearData>>;

export interface YearEntry {
  year: string | number;
  mapDate: string;
}

export interface YearSummaryConfig {
  key: string;
  mapDate: string;
  value: string;
}

// ===== Factories =====

/**
 * Create a single YearData object from a given year and index.
 */
export function createYear(year: string | number, mapDate: string, index: number): YearData {
  if (!utils.isYear(year)) {
    throw new Error(`Invalid year format: ${year.toString()}. Expected 4 digit year.`);
  }

  const yStr = year.toString();
  const suffix = index + 1;

  const props = Object.freeze({
    inputId: `input-${suffix}`,
    labelId: `label-${suffix}`,
    centuryClass: `century-${suffix}`,
    decadeClass: `decade-${suffix}`,
    yearPartClass: `year-${suffix}`,
  });

  const base: Omit<YearData, "hash"> = {
    year: yStr,
    mapDate,
    value: yStr,
    centuryPart: yStr.slice(0, 2),
    decadePart: yStr.slice(2, 3),
    yearPart: yStr.slice(3, 4),
    props,
  };

  return Object.freeze({
    ...base,
    hash: objectHash(base),
  });
}

/**
 * Create a special YearData summary object representing a range of years.
 */
export function createYearRangeSummary( firstYear: number, lastYear: number, index: number): YearData {
  const suffix = index + 1;

  const props = Object.freeze({
    inputId: `input-${suffix}`,
    labelId: `label-${suffix}`,
    centuryClass: `century-${suffix}`,
    decadeClass: `decade-${suffix}`,
    yearPartClass: `year-${suffix}`,
  });

  const base: Omit<YearData, "hash"> = {
    year: `${firstYear} - ${lastYear}`,
    mapDate: "",
    value: "",
    centuryPart: "",
    decadePart: "",
    yearPart: "",
    props,
  };

  return Object.freeze({
    ...base,
    hash: objectHash(base),
  });
}

/**
 * Build a deeply immutable YearRecord from an array of [year, mapDate] tuples.
 * Includes an automatically generated year range summary.
 */
export function buildYearRecord(
  entries: YearEntry[],
  summary: YearSummaryConfig = {
    key: "summary-range",
    mapDate: "",
    value: "",
  }
): YearRecord {
  const record: Record<string, YearData> = {};

  entries.forEach(({ year, mapDate }, i) => {
    const yStr = year.toString();
    record[yStr] = createYear(year, mapDate, i);
  });

  const yearsOnly = entries.map(({ year }) => parseInt(year.toString(), 10));
  const minYear = Math.min(...yearsOnly);
  const maxYear = Math.max(...yearsOnly);

  const summaryEntry = Object.freeze({
    ...createYearRangeSummary(minYear, maxYear, entries.length),
    year: summary.key,
    value: summary.value,
    mapDate: summary.mapDate,
    hash: objectHash({
      year: summary.key,
      value: summary.value,
      mapDate: summary.mapDate,
    }),
  });

  record[summary.key] = summaryEntry;

  return Object.freeze(record);
}