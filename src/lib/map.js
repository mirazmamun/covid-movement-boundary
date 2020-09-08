import L from 'leaflet';

/**
 * promiseToFlyTo
 * @description
 */

export function promiseToFlyTo(map, { zoom, center }) {
  return new Promise((resolve, reject) => {
    const baseError = 'Failed to fly to area';

    if (!map.flyTo) {
      reject(`${baseError}: no flyTo method on map`);
    }

    if (typeof zoom !== 'number') {
      reject(`${baseError}: zoom invalid number ${zoom}`);
    }

    const mapCenter = center || map.getCenter();
    const mapZoom = zoom || map.getZoom();

    map.flyTo(mapCenter, mapZoom, {
      duration: 3,
    });

    map.once('moveend', () => {
      resolve();
    });
  });
}


/**
 * promiseToFlyTo
 * @description
 */

export function promiseDrawCircle({ map, latlng, radius = 5000 }) {
  return new Promise((resolve) => {
    L.circle(latlng, radius, {
      fill: '#ff0000',
      fillOpacity: 0.1,
      color: '#ff0000',
      opacity: 0.1
    }).addTo(map);
    resolve();
  });
}

/**
 * getCurrentLocation
 * @description
 */

export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err)
    );
  });
}

/**
 * Follow current location
 * @description watch current location
 */

export function watchCurrentLoation({ success = () => { }, failure = () => { } }) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.watchPosition(
      (pos) => { success({ lat: pos.coords.latitude, lng: pos.coords.longitude }); },
      (err) => { failure(err); }
    );
    resolve();
  });
}

/**
 * Draw polygons
 */
export function drawPolygon() {
  let polygons = [];

  return function ({ map, latlng }) {
    polygons.push(latlng);
    L.polyline(polygons, { color: 'red' }).addTo(map);
  }
}