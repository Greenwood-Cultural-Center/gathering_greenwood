const centuryPrefixes:Array<String> = ["16","17","18", "19", "20", "21", "22", "23"];

function findObjectByKey(array: Array<any>, key: string): Array<any>[] {
  return array.find(obj => obj && Object.hasOwn(obj, key));
}

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