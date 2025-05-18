
function findObjectByKey(array, key) {
    return array.find(obj => obj && Object.hasOwn(obj, key));
}

function keyIsYear(key, centuryPrefixes) {
    const centuryPrefix = key.slice(0, 2);
    return (
        key.length === 4 &&
        !isNaN(key) &&
        (centuryPrefixes.includes(centuryPrefix))
    );
}

export { findObjectByKey, keyIsYear };