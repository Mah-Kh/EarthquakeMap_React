import React, { useState, useMemo, useContext } from "react";
import { DataContext } from "../context/DataContext";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = process.env.REACT_APP_MAP_API_KEY;

const Map = () => {
  const {
    data,
    mapMarkers,
    createMarkerSize,
    formReset,
    selectedMapMarkers,
    mapView,
  } = useContext(DataContext);

  const [mapMarkersArray, setMapMarkersArray] = useState([]);
  const [updateMapMarkersArray, setUpdateMapMarkersArray] = useState([]);

  const loadMap = (data) => {
    if (data) {
      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: mapView.center,
        zoom: mapView.zoom,
      });
      map.addControl(new mapboxgl.NavigationControl(), "bottom-left");
      return map;
    }
  };
  // create map after recive data and save map as a constant to use it in other functions
  const map = useMemo(() => loadMap(data), [data]);

  // Remove markers from map
  const removeMarkers = () => {
    if (map) {
      // Remove default markers
      if (mapMarkersArray.length > 0) {
        mapMarkersArray.forEach((m) => {
          m.remove();
        });
      }
      // remove selected markers
      if (updateMapMarkersArray.length > 0) {
        updateMapMarkersArray.forEach((m) => {
          m.remove();
        });
      }
    }
  };

  // add markers to map
  const addMarkers = (markers) => {
    let markersArray = [];
    markers.map((marker) => {
      const el = createMarkerSize(marker.mag);
      let newMarker = new mapboxgl.Marker(el)
        .setLngLat(marker.coordinate)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(`<h3>${marker.title}</h3>`)
        )
        .addTo(map);
      markersArray.push(newMarker);
    });
    return markersArray;
  };

  const loadMarkers = (mapMarkers) => {
    removeMarkers();
    if (mapMarkers) {
      let markers = addMarkers(mapMarkers);
      setMapMarkersArray(markers);
    }
  };
  // initialaize first markers on map based on the api data and save markers in mapMarkersArray state
  const defaultMarkers = useMemo(() => loadMarkers(mapMarkers), [mapMarkers]);

  const loadSelectedMarkers = () => {
    removeMarkers();
    if (selectedMapMarkers) {
      let markers = addMarkers(selectedMapMarkers);
      setUpdateMapMarkersArray(markers);
    }
  };

  // update markers on the map based on the form input
  const updateSelectedMarkers = useMemo(
    () => loadSelectedMarkers(),
    [selectedMapMarkers]
  );

  // zoom on map based on the selected place
  const mapFlyTo = useMemo(() => {
    if (map) {
      map.flyTo({ center: mapView.center, zoom: mapView.zoom });
    }
  }, [mapView]);

  const resetMarkers = useMemo(() => {
    if (map) {
      if (formReset === true) {
        loadMarkers(mapMarkers);
        map.flyTo({ center: mapView.center, zoom: mapView.zoom });
      }
    }
  }, [formReset]);

  return <div id="map"></div>;
};

export default Map;
