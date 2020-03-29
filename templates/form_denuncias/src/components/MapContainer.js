import React, { useState, useEffect, useRef } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";

const MapContainer = ({
  google,
  setFieldValue,
  setStreet,
  setCity,
  setCountry,
  setPlace,
  autocompleteEl
}) => {
  const [markerPosition, setMarkerPosition] = useState(null);

  const [initialLatLng, setInitialLatLng] = useState({
    lat: "",
    lng: ""
  });

  const autocomplete = useRef(null);
  const autocompleteService = useRef(null);
  const geocoder = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const latLng = {
      lat: -25.30065,
      lng: -57.63591
    };
    setInitialLatLng(latLng);
    setMarkerPosition(latLng);
  }, []);

  const placeChangedHandler = () => {
    //* This only have data when a place is selected from autcomplete dropdown
    try {
      const place = autocomplete.current.getPlace();
      const location = place.geometry.location;
      if (place) {
        const latlng = {
          lat: parseFloat(location.lat()),
          lng: parseFloat(location.lng())
        };
        setPlace(place.name);
        setFieldValue("coordenadas", latlng, true);
        setFieldValue("place", place.name, true);
        callGeocoderAPI({ latlng });
        setMarkerPosition(latlng);
      }
    } catch (err) {
      setPlace(autocompleteEl.current.value);
      console.error(err);
    }
  };

  const callGeocoderAPI = ({ latlng }) => {
    geocoder.current.geocode({ location: latlng }, function(results, status) {
      if (status === "OK") {
        if (results[0]) {
          setStreet(results[0].formatted_address);
          setFieldValue("street", results[0].formatted_address, true);
          const addressComponents = results[0].address_components;
          const city = addressComponents.find(component => {
            return component.types.find(type => type === "locality");
          });
          const country = addressComponents.find(component => {
            return component.types.find(type => type === "country");
          });
          setCity(city.long_name);
          setCountry(country.long_name);
          setFieldValue("city", city.long_name, true);
        }
      } else {
        console.error("Geocoder failed due to: " + status);
      }
    });
  };

  const markerHandler = (mapProps, map, e) => {
    const latlng = {
      lat: parseFloat(e.latLng.lat()),
      lng: parseFloat(e.latLng.lng())
    };
    setFieldValue("coordenadas", latlng, true);
    callGeocoderAPI({ latlng });
    setMarkerPosition(latlng);
  };

  const fetchPlaces = (mapProps, map) => {
    const { google } = mapProps;

    const options = {
      types: [],
      componentRestrictions: { country: "py" }
    };

    geocoder.current = new google.maps.Geocoder();

    autocomplete.current = new google.maps.places.Autocomplete(
      autocompleteEl.current,
      options
    );

    autocompleteService.current = new google.maps.places.AutocompleteService();

    autocomplete.current.addListener("place_changed", placeChangedHandler);
  };

  return (
    <Map
      ref={mapRef}
      google={google}
      containerStyle={{
        height: "40vh",
        width: "100%",
        position: "relative"
      }}
      initialCenter={initialLatLng}
      center={markerPosition}
      onClick={markerHandler}
      onReady={fetchPlaces}
      zoom={15}
    >
      <Marker
        onClick={() => console.log("clicked")}
        name={"Current location"}
        position={markerPosition}
        draggable={true}
        onDragend={markerHandler}
      />
    </Map>
  );
};

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GMAPS_API_KEY, // google maps key
  language: "es-419",
  libraries: ["places"]
})(MapContainer);
