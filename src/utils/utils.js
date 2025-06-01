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

export function titleCase(s) {
  return s.toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
}

export function formatRawGeoJson(rawGeoJson, id='search-source', inject_year=null) {
  if (rawGeoJson.type !== 'FeatureCollection') {
    console.warn('Invalid GeoJSON type, expected FeatureCollection.');
    return { type:'geojson', data: { id: id, type: 'FeatureCollection', features: [] } };
  }
  if (rawGeoJson.features.length === 0) {
    console.warn('No features found in GeoJSON data.');
    return { type:'geojson', data: { id: id, type: 'FeatureCollection', features: [] } };
  }
  if (!rawGeoJson.features.every(feature => feature && feature.type === 'Feature')) {
    console.warn('Some features are not valid GeoJSON features.');
    return { type:'geojson', data: { id: id, type: 'FeatureCollection', features: [] } };
  }
  if (!rawGeoJson.features.every(feature => feature.geometry && feature.properties)) {
    console.warn('Some features are missing geometry or properties.');
    return { type:'geojson', data: { id: id, type: 'FeatureCollection', features: [] } };
  }
  if (!rawGeoJson.features.every(feature => feature.properties && typeof feature.properties === 'object')) {
    console.warn('Some features have invalid properties, converting to empty object.');
    return { type:'geojson', data: { id: id, type: 'FeatureCollection', features: [] } };
  }

  if(!rawGeoJson.id) {
    rawGeoJson.id = id;
  };
  rawGeoJson.features = rawGeoJson.features.map(feature => {
    if (!feature.properties.year) {
      return {
        ...feature,
        properties: {
          ...feature.properties,
          year: inject_year
        }
      };
    }
    return feature;
  });

  rawGeoJson.features = rawGeoJson.features.filter(feature => {
    if (!feature || !feature.geometry || !feature.properties) {
      console.warn('Skipping invalid feature:', feature);
      return false;
    }
    if (typeof feature.properties !== 'object') {
      console.warn('Feature properties are not an object, converting to empty object:', feature);
      feature.properties = {};
    }
    if (!feature.geometry.type || !['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon'].includes(feature.geometry.type)) {
      console.warn('Feature geometry type is invalid or missing, skipping:', feature);
      return false;
    }
    if (!feature.geometry.coordinates || !Array.isArray(feature.geometry.coordinates) || feature.geometry.coordinates.some(coord => coord === null || Number.isNaN(coord)) || feature.geometry.coordinates.some(coords => Array.IsArray && coords.some(c => c === null|| !Number.isNaN(c)))) {
      console.warn('Feature geometry coordinates are invalid or missing, skipping:', feature);
      return false;
    }
    if (feature.geometry.type === 'Point' && feature.geometry.coordinates.length !== 2) {
      console.warn('Point geometry must have exactly two coordinates, skipping:', feature);
      return false;
    }
    if (feature.geometry.type === 'LineString' && feature.geometry.coordinates.length < 2) {
      console.warn('LineString geometry must have at least two coordinates, skipping:', feature);
      return false;
    }
    if (feature.geometry.type === 'Polygon' && feature.geometry.coordinates.length < 1) {
      console.warn('Polygon geometry must have at least one ring, skipping:', feature);
      return false;
    }
    if (feature.geometry.type === 'MultiPoint' && feature.geometry.coordinates.some(coord => coord.length !== 2)) {
      console.warn('MultiPoint geometry must have coordinates with exactly two values, skipping:', feature);
      return false;
    }
    if (feature.geometry.type === 'MultiLineString' && feature.geometry.coordinates.some(line => line.length < 2)) {
      console.warn('MultiLineString geometry must have at least two coordinates in each line, skipping:', feature);
      return false;
    }
    if (feature.geometry.type === 'MultiPolygon' && feature.geometry.coordinates.some(polygon => polygon.length < 1)) {
      console.warn('MultiPolygon geometry must have at least one ring in each polygon, skipping:', feature);
      return false;
    }
    return true;
  }).map(feature => {
    if (feature.geometry.coordinates.every(coord => Array.isArray(coord))) {
      feature.geometry.coordinates = feature.geometry.coordinates.map(coords => coords.map(coord => coord.parseFloat(coord)));
    }
    else {
      feature.geometry.coordinates = feature.geometry.coordinates.map(coord => parseFloat(coord));
    }
    return feature;
  });

  return {
    type: 'geojson',
    data: rawGeoJson
  }
}

const utils = {
  findObjectByKey,
  isYear,
  hashString,
  titleCase,
  formatRawGeoJson,
  centuryPrefixes
};

export default utils;