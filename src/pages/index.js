import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import L from 'leaflet';

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

const startLocationTracking = async (leafletElement) => {

  try {
    const location = await getCurrentLocation().catch(() => LOCATION);
  
    const marker = L.circleMarker(location, {radius: 10, fillColor: 'rgb(25, 153, 0)', fillOpacity: 0.8, weight: 3, opacity: 0.8, color: 'rgb(25, 153, 0)', className: 'flashit'}).addTo(leafletElement);
    await promiseToFlyTo(leafletElement, {
      zoom: ZOOM,
      center: location,
    });
    // draw circle
    await promiseDrawCircle({ map: leafletElement, latlng: location, radius: 5000 });
    // add some random point
    const doDrawPolygon = drawPolygon()
    await watchCurrentLoation({
      success: (latlng) => {
        // draw polygon
        doDrawPolygon({ map: leafletElement, latlng });
        marker.setLatLng(latlng);
      }, failure: (err) => {
        console.err(err);
      }
    })
  } catch (e) {
    console.log(e);
    alert('You must give location permission for this app to work');
  }
}

const handleLocationPermission = (leafletElement) => {
  startLocationTracking(leafletElement);
}

const IndexPage = () => {
  // set the modal hidden
  const [modalState, setModalState] = useState(false);
  const [leafletState, setLeafletState] = useState(null);
  const [modalShowOnceState, setModalShowOnceState] = useState(false);
  const [mapShowState, setMapShowState] = useState(false);
  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */

  async function mapEffect({ leafletElement } = {}) {
    if (!leafletElement) return;
    // show modal
    if (!modalShowOnceState) {
      setLeafletState(leafletElement); 
      setModalState(true);
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

      <Map {...mapSettings} className={!mapShowState ? 'is-invisible' : ''}>
      </Map>
      {/** modal */}
      {/** TODO: move modal to its own component */}
      <div className={modalState ? "is-active modal" : "modal"}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Need Permission</p>
          </header>
          <section className="modal-card-body">
            You must give explicit permission to help you track your movement. FYI, we do not track your location information, 
            it will only be visible to you as long as you use this app. Accuracy of your location may vary depending on you device's location resolution.
          </section>
          <footer className="modal-card-foot">
            <button className="button is-success" onClick={() => { setMapShowState(true); setModalState(false); setModalShowOnceState(true); handleLocationPermission(leafletState); }}>Sure</button>
            <button className="button">I will pass</button>
          </footer>
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;
