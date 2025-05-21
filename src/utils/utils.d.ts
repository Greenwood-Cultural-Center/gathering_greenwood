declare const centuryPrefixes: string[];

/**
 * Find the first object in an array that contains a specific key.
 * @param array The array of objects to search.
 * @param key The key to look for.
 * @returns The first matching object or undefined.
 */
declare function findObjectByKey(array: Array<any>, key: string): any | undefined;

/**
 * Check if a given value is a valid 4-digit year within supported centuries.
 * @param value The year as string or number.
 * @returns True if valid, false otherwise.
 */
declare function isYear(value: string | number): boolean;

/**
 * Generate a SHA-256 hash of a given string.
 * @param str The input string to hash.
 * @returns A promise resolving to the hex string of the hash.
 */
declare function hashString(str: string): Promise<string>;

declare const _default: {
  findObjectByKey: typeof findObjectByKey;
  isYear: typeof isYear;
  hashString: typeof hashString;
  centuryPrefixes: typeof centuryPrefixes;
};

export {
  centuryPrefixes,
  findObjectByKey,
  isYear,
  hashString,
};

export default _default;