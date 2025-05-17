
function findObjectByKey(array, key) {
    return array.find(obj => obj && obj.hasOwnProperty(key));
}

export { findObjectByKey }