// /src/uitls/utils.ts
const centuryPrefixes:Array<String> = ["16","17","18", "19", "20", "21", "22", "23"];

/**
 * Find the first object in an array that contains a specific key.
 * @param array The array of objects to search.
 * @param key The key to look for.
 * @returns The first matching object or undefined.
 */
function findObjectByKey(array: Array<any>, key: string): any | undefined {
  return array.find(obj => obj && Object.hasOwn(obj, key));
}

/**
 * Check if a given value is a valid 4-digit year within supported centuries.
 * @param value The year as string or number.
 * @returns True if valid, false otherwise.
 */
function isYear(value: string|number): boolean {
  const centuryPrefix = value.toString().slice(0, 2);
  if (typeof value === 'number') {
    return (
      (value >=1000 && value <= 9999) &&
      !isNaN(value) &&
      centuryPrefixes.includes(centuryPrefix)
    )
  } else {
    return (
      value.length === 4 &&
      !isNaN(Number(value)) &&
      centuryPrefixes.includes(centuryPrefix)
    );
  }
}

/**
 * Generate a SHA-256 hash of a given string.
 * @param str The input string to hash.
 * @returns A promise resolving to the hex string of the hash.
 */
async function hashString(str: string): Promise<string>{
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export { centuryPrefixes, findObjectByKey, isYear, hashString }
export default { findObjectByKey, isYear, hashString, centuryPrefixes };