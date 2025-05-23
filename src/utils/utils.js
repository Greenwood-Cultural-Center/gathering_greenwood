export const centuryPrefixes = ["16", "17", "18", "19", "20", "21", "22", "23"];

export function findObjectByKey(array, key) {
  return array.find(obj => obj && Object.hasOwn(obj, key));
}

export function isYear(value) {
  const centuryPrefix = value.toString().slice(0, 2);
  if (typeof value === 'number') {
    return (
      value >= 1000 &&
      value <= 9999 &&
      !isNaN(value) &&
      centuryPrefixes.includes(centuryPrefix)
    );
  } else {
    return (
      value.length === 4 &&
      !isNaN(Number(value)) &&
      centuryPrefixes.includes(centuryPrefix)
    );
  }
}

export async function hashString(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

const utils = {
  findObjectByKey,
  isYear,
  hashString,
  centuryPrefixes
};

export default utils;