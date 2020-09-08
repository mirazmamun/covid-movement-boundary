import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import L from 'leaflet';
import { Marker } from 'react-leaflet';

import { promiseToFlyTo, getCurrentLocation, promiseDrawCircle, watchCurrentLoation, drawPolygon } from 'lib/map';

import Layout from 'components/Layout';
import Map from 'components/Map';

// melbourne
const LOCATION = {
  lat: -37.854205,
  lng: 144.6656561,
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 4;
const ZOOM = 13;

const popupContentGatsby = `
  <div class="popup-gatsby">
    <div class="popup-gatsby-content">
      <p>Hello 👋</p>
      <p>we have located your home :home:</p>
    </div>
  </div>
`;

const IndexPage = () => {
  const markerRef = useRef();

  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */

  async function mapEffect({ leafletElement } = {}) {
    if (!leafletElement) return;

    const popup = L.popup({
      maxWidth: 800,
    });

    try {
      const location = await getCurrentLocation().catch(() => LOCATION);

      const { current = {} } = markerRef || {};
      const { leafletElement: marker } = current;

      marker.setLatLng(location);
      popup.setLatLng(location);
      marker.bindPopup(popup);
      marker.setPopupContent(popupContentGatsby)
      await promiseToFlyTo(leafletElement, {
        zoom: ZOOM,
        center: location,
      });
      // draw circle
      await promiseDrawCircle({ map: leafletElement, latlng: location, radius: 5000 });
      // add some random point
      const doDrawPolygon = drawPolygon()
      await watchCurrentLoation({ success: (latlng) => {
        console.log(latlng);
        // draw polygon
        doDrawPolygon({ map: leafletElement, latlng});
      }, failure: (err) => {
        console.err(err);
      } })
    } catch (e) {
      alert('You must give location permission for this app to work');
    }
  }

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'OpenStreetMap',
    zoom: DEFAULT_ZOOM,
    mapEffect,
  };

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>

      <Map {...mapSettings}>
        <Marker ref={markerRef} position={CENTER} />
      </Map>
    </Layout>
  );
};

export default IndexPage;
