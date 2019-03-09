import L from 'leaflet';
import { Feature } from 'geojson';
import { map } from 'ramda';

// @function formatNum(num: Number, digits?: Number): Number
// Returns the number `num` rounded to `digits` decimals, or to 6 decimals by default.
export function formatNum(num: number, digits: number | undefined): number {
  const pow = Math.pow(10, (digits === undefined ? 6 : digits));
  return Math.round(num * pow) / pow;
}

// @function latLngToCoords(latlng: LatLng, precision?: Number): Array
// Reverse of [`coordsToLatLng`](#geojson-coordstolatlng)
export function latLngToCoords(latlng: L.LatLng, precision: number): number[] {
  precision = typeof precision === 'number' ? precision : 6;
  return latlng.alt !== undefined ?
    [
      formatNum(latlng.lng, precision),
      formatNum(latlng.lat, precision),
      formatNum(latlng.alt, precision),
    ] :
    [
      formatNum(latlng.lng, precision),
      formatNum(latlng.lat, precision),
    ];
  }

// @function latLngsToCoords(latlngs: Array, levelsDeep?: Number, closed?: Boolean): Array
// Reverse of [`coordsToLatLngs`](#geojson-coordstolatlngs)
// `closed` determines whether the first point should be appended to the end of the array to close the feature,
// only used when `levelsDeep` is 0. False by default.
export function latLngsToCoords(latlngs: [], levelsDeep?: number, closed?: boolean, precision?: any) {
  const coords: any[] = [];
  for (const latlng of latlngs) {
    coords.push(
      levelsDeep ?
      latLngsToCoords(latlng, levelsDeep - 1, closed, precision)
      : latLngToCoords(latlng, precision),
    );
  }
  if (!levelsDeep && closed) {
    coords.push(coords[0]);
  }
  return coords;
}

// @function coordsToLatLng(coords: Array): LatLng
// Creates a `LatLng` object from an array of 2 numbers (longitude, latitude)
// or 3 numbers (longitude, latitude, altitude) used in GeoJSON for points.
export const coordsToLatLng = (coords: [number, number, number]): L.LatLng =>
  new L.LatLng(coords[1], coords[0], coords[2]);

// @function coordsToLatLngs(coords: Array, levelsDeep?: Number, coordsToLatLng?: Function): Array
// Creates a multidimensional array of `LatLng`s from a GeoJSON coordinates array.
// `levelsDeep` specifies the nesting level
//    (0 is for an array of points, 1 for an array of arrays of points, etc., 0 by default).
// Can use a custom [`coordsToLatLng`](#geojson-coordstolatlng) function.
export const coordsToLatLngs = (
  coords: [],
  levelsDeep?: number,
  callbackCoordsToLatLng: (coords: [number, number, number]) => L.LatLng = coordsToLatLng,
) => {
  return map(
    levelsDeep ?
      coord => coordsToLatLngs(coord, levelsDeep - 1, callbackCoordsToLatLng) :
      coordsToLatLng,
    coords,
  );
};

// @function asFeature(geojson: Object): Object
// Normalize GeoJSON geometries/features into GeoJSON features.
export function asFeature(geojson: Feature) {
  if (geojson.type === 'Feature' || geojson.type === 'FeatureCollection') {
    return geojson;
  }
  return {
    type: 'Feature',
    properties: {},
    geometry: geojson,
  };
}
