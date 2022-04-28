import { useState, useEffect, useMemo, createContext } from "react";
import axios from "axios";

export const DataContext = createContext();

function DataContextProvide(props) {
  const [data, setData] = useState(null);
  const [mapView, setMapView] = useState({ center: [-96, 37.8], zoom: 1 }); // default map view
  const [mapMarkers, setMapMarkers] = useState([]);
  const [selectedMapMarkers, setSelectedMapMarkers] = useState([]);
  const [formReset, setFormReset] = useState(false);

  // get data from api
  useEffect(async () => {
    const response = await axios.get(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
    );
    setData(response.data);
  }, []);

  // get the name of country from earthquake information
  const extractPlace = (place) => {
    let lastComma = place.lastIndexOf(",");
    // remove space
    if (place.substring(lastComma + 1, lastComma + 2) === " ") {
      lastComma++;
    }
    const contry = place.substring(lastComma);
    return contry;
  };

  // Create markers based on their magnitude and set differenet classes to style in css
  const createMarkerSize = (mag) => {
    const el = document.createElement("div");
    if (mag > 0 && mag <= 3) {
      el.className = "marker s-marker";
    } else if (mag > 3 && mag <= 4) {
      el.className = "marker m-marker";
    } else if (mag > 4 && mag <= 5) {
      el.className = "marker l-marker";
    } else if (mag > 5 && mag <= 6) {
      el.className = "marker xl-marker";
    } else if (mag > 6) {
      el.className = "marker xxl-marker";
    }
    return el;
  };

  const initializeData = (data) => {
    if (data) {
      const places = [];
      const times = [];
      const mags = [];
      const markerData = [];
      const formDefaultData = {
        startTime: "",
        endTime: "",
        minMag: 0,
        maxMag: 0,
        places: [],
        countries: [],
      };
      for (const { geometry, properties } of data.features) {
        mags.push(properties.mag);
        times.push(properties.time);
        places.push(properties.place);
        const markerTime = new Date(properties.time).toISOString().slice(0, 16);
        const marker = {
          time: markerTime,
          mag: properties.mag,
          coordinate: geometry.coordinates,
          title: properties.title,
        };
        markerData.push(marker);
      }
      setMapMarkers(markerData);
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);
      const maxMag = Math.max(...mags);
      formDefaultData.startTime = new Date(minTime).toISOString().slice(0, 16);
      formDefaultData.endTime = new Date(maxTime).toISOString().slice(0, 16);
      formDefaultData.maxMag = Math.ceil(maxMag);
      formDefaultData.places = places;
      const countries = [];
      for (const item in formDefaultData.places) {
        const place = formDefaultData.places[item];
        const country = extractPlace(place);
        if (countries.includes(country) === false) {
          countries.push(country);
        }
      }
      formDefaultData.countries = countries;
      return formDefaultData;
    }
  };
  // Create default Data based on the api information to use as default values in form inputs
  const defaultData = useMemo(() => initializeData(data), [data]);

  // create markers based on selected data after submit the form
  const updateMarkers = (selectedData, input) => {
    let selectedInfoForMarkers = [];
    for (const { geometry, properties } of input.features) {
      const markerTime = new Date(properties.time).toISOString().slice(0, 16);
      const mag = properties.mag;
      if (
        markerTime >= selectedData.startTime &&
        markerTime < selectedData.endTime &&
        mag >= selectedData.minMag &&
        mag <= selectedData.maxMag
      ) {
        const marker = {
          time: markerTime,
          mag: properties.mag,
          coordinate: geometry.coordinates,
          title: properties.title,
        };
        selectedInfoForMarkers.push(marker);
      }
    }
    return selectedInfoForMarkers;
  };

  const updateMapMarkers = (selectedData) => {
    let selectedInfoForMarkers = [];
    setSelectedMapMarkers(selectedInfoForMarkers);
    if (selectedData.place === "All") {
      selectedInfoForMarkers = updateMarkers(selectedData, data);
      setSelectedMapMarkers(selectedInfoForMarkers);
      setMapView({ center: [-96, 37.8], zoom: 1 });
    } else {
      // Find average cordinate of all Earthquacks in the selected place to zoom in on the map
      let averageCord = new Array();
      averageCord[0] = 0;
      averageCord[1] = 0;
      averageCord[2] = 0;
      let count = 0;
      for (const { geometry, properties } of data.features) {
        const country = extractPlace(properties.place);
        if (country === selectedData.place) {
          const markerTime = new Date(properties.time)
            .toISOString()
            .slice(0, 16);
          const mag = properties.mag;
          if (
            markerTime >= selectedData.startTime &&
            markerTime < selectedData.endTime &&
            mag >= selectedData.minMag &&
            mag <= selectedData.maxMag
          ) {
            const marker = {
              time: markerTime,
              mag: properties.mag,
              coordinate: geometry.coordinates,
              title: properties.title,
            };
            selectedInfoForMarkers.push(marker);
            setSelectedMapMarkers(selectedInfoForMarkers);
          }
          averageCord[0] += geometry.coordinates[0];
          averageCord[1] += geometry.coordinates[1];
          averageCord[2] += geometry.coordinates[2];
          count++;
        }
      }
      // if there are more than one earthquack in the selected country, find the average coordiante
      if (count > 0) {
        averageCord[0] /= count;
        averageCord[1] /= count;
        averageCord[2] /= count;
      }
      // zoom in the average coordinate of the selected place on the map
      setMapView({ center: averageCord, zoom: 4 });
    }
  };

  // get the selected values from form and display markers on the map based on the selected values
  const handleSelectedData = (formData) => {
    updateMapMarkers(formData);
  };

  const resetForm = () => {
    setFormReset(true);
    initializeData(data);
    setMapView({ center: [-96, 37.8], zoom: 1 });
  };

  const value = {
    data,
    defaultData,
    mapMarkers,
    selectedMapMarkers,
    mapView,
    formReset,
    createMarkerSize,
    handleSelectedData,
    resetForm,
  };
  return (
    <DataContext.Provider value={value}>{props.children}</DataContext.Provider>
  );
}

export default DataContextProvide;
