import {
  Content,
  Container,
  Field,
  Control,
  Label,
  Input,
  Button,
  Select,
  Title,
  Textarea,
  Navbar,
  Hero,
  Column,
  Card,
  Box,
  Radio
} from "rbx";

import "./App.css";
import { DisplayFormikState } from "./helper";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";

import { usePosition } from "use-position";

import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  correo: Yup.string().email("Invalid email")
});

const App = ({ google }) => {
//-25.2968361,-57.668129

  const { latitude, longitude } = usePosition();

  const formik = useFormik({
    initialValues: {
      canal: "Llamada",
      nombre: "",
      apellido: "",
      telefono: "",
      correo: "",
      place: "",
      street: "",
      neighborhood: "",
      city: "",
      department: "",
      tipo_denuncia: "aglomeracion",
      observaciones: "",
      coordenadas: null,
      estado: "pendiente"
    },
    onSubmit: async(values, {resetForm}) => {
      // await new Promise(resolve => setTimeout(resolve, 500));
      fetch("/",{
        method: "post",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(values, null, 2)
      }).then((res) => res.json())
      .then((data) => {
        console.log("got",data)
        resetForm({values: ""})
      })
      .catch((err) => console.log(err))
      // alert(JSON.stringify(values, null, 2));
    },
    validationSchema
  });
  const {
    values,
    touched,
    errors,
    dirty,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    setFieldValue
  } = formik;

  const [markerPosition, setMarkerPosition] = useState(null);
  const [place, setPlace] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const positionAvailable = latitude && longitude;
  const mapRef = useRef(null);
  const autocomplete = useRef(null);
  const autocompleteService = useRef(null);
  const geocoder = useRef(null);
  const autocompleteEl = useRef(null);

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

  const markerHandler = (mapProps, map, e) => {
    const latlng = {
      lat: parseFloat(e.latLng.lat()),
      lng: parseFloat(e.latLng.lng())
    };
    setFieldValue("coordenadas", latlng, true);
    callGeocoderAPI({ latlng });
    setMarkerPosition(latlng);
  };

  useEffect(() => {
    setMarkerPosition({ lat: latitude, lng: longitude });
  }, [latitude, longitude]);

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
    <React.Fragment>
      <Hero>
        <Hero.Body>
          <Container>
            <Column>
              <Title>Gestión de denuncias</Title>
            </Column>
          </Container>
          <Container as="form" 
              onSubmit={handleSubmit}
              onKeyDown={e => {
                if ((e.charCode || e.keyCode) === 13) {
                  e.preventDefault();
                }
              }}
          >
          <Column></Column>
          <Column>
          
                <Box>
                <Field horizontal>
                  <Field.Body>
                    <Field>
                    <Label htmlFor="canal">Canal de denuncia</Label>
                      <Control>
                        <Select.Container fullwidth>
                          <Select
                            id="canal"
                            name="canal"
                            value={values.canal}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            <Select.Option value="llamada" label="Llamada">
                              Llamada
                            </Select.Option>
                            <Select.Option
                              value="redes_sociales"
                              label="Redes Sociales"
                            >
                              Redes Sociales
                            </Select.Option>
                            <Select.Option value="correo" label="Correo electrónico">
                              Correo electrónico
                            </Select.Option>
                            <Select.Option value="otros" label="Otros">
                              Otros
                            </Select.Option>
                          </Select>
                        </Select.Container>
                      </Control>
                    </Field>
                    <Field>
                      <Label htmlFor="tipo_denuncia">Tipo de denuncia</Label>
                      <Control>
                        <Select.Container fullwidth>
                          <Select
                            id="tipo_denuncia"
                            name="tipo_denuncia"
                            value={values.tipo_denuncia}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            <Select.Option
                              value="aglomeracion"
                              label="Aglomeración en espacio público"
                            >
                              Aglomeración en espacio público
                            </Select.Option>
                            <Select.Option
                              value="medidas_sanitarias"
                              label="Incumplimiento de medidas sanitarias"
                            >
                              Incumplimiento de medidas sanitarias
                            </Select.Option>
                            <Select.Option
                              value="cuarentena"
                              label="Incumplimiento de cuarentena"
                            >
                              Incumplimiento de cuarentena
                            </Select.Option>
                            <Select.Option
                              value="sintomas"
                              label="Reporte de síntomas"
                            >
                              Reporte de síntomas
                            </Select.Option>
                            <Select.Option value="otros" label="Otros">
                              Otros
                            </Select.Option>
                          </Select>
                        </Select.Container>
                        {errors.tipo_denuncia && touched.tipo_denuncia && (
                          <div className="input-feedback">
                            {errors.tipo_denuncia}
                          </div>
                        )}
                      </Control>
                    </Field>
                  </Field.Body>
                </Field>
                </Box>
                
                {values.tipo_denuncia == "medidas_sanitarias" && (
                  <Box>
                  <Field>
                    <Label htmlFor="detalle_tipo_acceso">Acceso al local</Label>
                    <Control>
                      <label>
                        <input
                          type="radio"
                          id="detalle_tipo_acceso"
                          checked={values.detalle_tipo_acceso === "lavaderos"}
                          onChange={() => setFieldValue("detalle_tipo_acceso", "lavaderos")}
                          onBlur={handleBlur}/> tienen lavaderos de manos con jabón de coco o pulverizador con alcohol hidrolizado.
                      </label><br/>
                      <label>
                        <input
                          type="radio"
                          id="detalle_tipo_acceso"
                          checked={values.detalle_tipo_acceso === "toma_temperatura"}
                          onChange={() => setFieldValue("detalle_tipo_acceso", "toma_temperatura")}
                          onBlur={handleBlur}/> se toma la temperatura del personal ingresante.
                      </label><br/>                      
                      <label>
                        <input
                          type="radio"
                          id="detalle_tipo_acceso"
                          checked={values.detalle_tipo_acceso === "registro_temperatura"}
                          onChange={() => setFieldValue("detalle_tipo_acceso", "registro_temperatura")}
                          onBlur={handleBlur}/> se toma la temperatura del personal ingresante.
                      </label><br/>                      
                      <label>
                        <input
                          type="radio"
                          id="detalle_tipo_acceso"
                          checked={values.detalle_tipo_acceso === "tapaboca"}
                          onChange={() => setFieldValue("detalle_tipo_acceso", "tapaboca")}
                          onBlur={handleBlur}/> el personal llega e ingresa con tapabocas.
                      </label><br/>                      
                      <label>
                        <input
                          type="radio"
                          id="detalle_tipo_acceso"
                          checked={values.detalle_tipo_acceso === "desinfecta"}
                          onChange={() => setFieldValue("detalle_tipo_acceso", "desinfecta")}
                          onBlur={handleBlur}/> se desinfecta al personal rociandolo con pulverizador de alcohol hidrolizado.
                      </label>
                      <br/><br/>
                      <Label htmlFor="detalle_tipo_dentro">Dentro del local</Label>
                      <label>
                        <input
                          type="radio"
                          id="detalle_tipo_dentro"
                          checked={values.detalle_tipo_dentro === "distancia"}
                          onChange={() => setFieldValue("detalle_tipo_dentro", "distancia")}
                          onBlur={handleBlur}/> se respeta la distancia de 2 metros entre empleados.
                      </label><br/>
                      <label>
                        <input
                          type="radio"
                          id="detalle_tipo_dentro"
                          checked={values.detalle_tipo_dentro === "alcohol_gel"}
                          onChange={() => setFieldValue("detalle_tipo_dentro", "alcohol_gel")}
                          onBlur={handleBlur}/> a cada empleado se proporciona alcohol en gel.
                      </label><br/>
                    </Control>
                  </Field>
              </Box>
                )}

                <Box>
                <Field horizontal>
                  <Field.Body>
                    <Field>
                    <Label htmlFor="nombre">Nombre</Label>
                      <Control>
                        <Input
                          id="nombre"
                          placeholder="Nombre del denunciante"
                          type="text"
                          value={values.nombre}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                          className={
                            errors.nombre && touched.nombre
                              ? "text-input error"
                              : "text-input"
                          }
                        />
                        {errors.nombre && touched.nombre && (
                          <div className="input-feedback">{errors.nombre}</div>
                        )}
                      </Control>
                    </Field>
                    <Field>
                    <Label htmlFor="apellido">Apellido</Label>
                      <Control>
                        <Input
                          id="apellido"
                          placeholder="Apellido del denunciante"
                          type="text"
                          value={values.apellido}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                          className={
                            errors.apellido && touched.apellido
                              ? "text-input error"
                              : "text-input"
                          }
                        />
                        {errors.apellido && touched.apellido && (
                          <div className="input-feedback">{errors.apellido}</div>
                        )}
                      </Control>
                    </Field>
                  </Field.Body>
                </Field>
                </Box>

                <Box>
                <Field horizontal>
                  <Field.Body>
                    <Field>
                    <Label htmlFor="telefono">Teléfono</Label>
                      <Control>
                        <Input
                          id="telefono"
                          placeholder="Número de celular o línea baja del denunciante"
                          type="tel"
                          value={values.telefono}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                          className={
                            errors.telefono && touched.telefono
                              ? "text-input error"
                              : "text-input"
                          }
                        />
                        {errors.telefono && touched.telefono && (
                          <div className="input-feedback">{errors.telefono}</div>
                        )}
                      </Control>
                    </Field>
                    <Field>
                    <Label htmlFor="correo">Correo electrónico</Label>
                      <Control>
                        <Input
                          id="correo"
                          placeholder="Correo electrónico del denunciante"
                          type="email"
                          value={values.correo}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                          className={
                            errors.correo && touched.correo
                              ? "text-input error"
                              : "text-input"
                          }
                        />
                        {errors.correo && touched.correo && (
                          <div className="input-feedback">{errors.correo}</div>
                        )}
                      </Control>
                    </Field>
                  </Field.Body>
                </Field>   
                </Box>

                <Box>
                    <Field>
                      <Label htmlFor="place">Lugar</Label>
                      <Control>
                        <Input
                          id="place"
                          ref={autocompleteEl}
                          placeholder="Ingresa el lugar"
                          type="text"
                          value={values.place}
                          onChange={handleChange}
                          onKeyPress={e => {
                            e.stopPropagation();
                          }}
                          onBlur={handleBlur}
                          className={
                            errors.place && touched.place
                              ? "text-input error"
                              : "text-input"
                          }
                        />
                        {errors.place && touched.place && (
                          <div className="input-feedback">{errors.place}</div>
                        )}
                      </Control>
                    </Field>
                </Box>

                <Box>
                    <Field>
                      <Label htmlFor="street">Dirección</Label>
                      <Control>
                        <Input
                          id="street"
                          placeholder=""
                          type="tel"
                          value={street}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={
                            errors.street && touched.street
                              ? "text-input error"
                              : "text-input"
                          }
                        />
                        {errors.street && touched.street && (
                          <div className="input-feedback">{errors.street}</div>
                        )}
                      </Control>
                    </Field>
                </Box>

                <Box>
                    <Field>
                      <Label htmlFor="city">Ciudad</Label>
                      <Control>
                        <Input
                          id="city"
                          placeholder=""
                          type="tel"
                          value={city}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={
                            errors.city && touched.city
                              ? "text-input error"
                              : "text-input"
                          }
                        />
                        {errors.city && touched.city && (
                          <div className="input-feedback">{errors.city}</div>
                        )}
                      </Control>
                    </Field>
                </Box>

                <Box>
                    <Field>
                      {positionAvailable ? (
                        <>
                          <Label htmlFor="complaintType">Ubicación</Label>
                          <Map
                            ref={mapRef}
                            google={google}
                            containerStyle={{
                              height: "40vh",
                              width: "100%",
                              position: "relative"
                            }}
                            initialCenter={{
                              lat: latitude,
                              lng: longitude
                            }}
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
                        </>
                      ) : (
                        <Label>Cargando...</Label>
                      )}
                    </Field>
                </Box>

                <Box>
                    <Field>
                      <Label htmlFor="observaciones">Observaciones</Label>
                      <Control>
                        <Textarea
                          id="observaciones"
                          placeholder=""
                          type="tel"
                          value={values.observaciones}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={
                            errors.observaciones && touched.observaciones
                              ? "text-input error"
                              : "text-input"
                          }
                        />
                        {errors.observaciones && touched.observaciones && (
                          <div className="input-feedback">
                            {errors.observaciones}
                          </div>
                        )}
                      </Control>
                    </Field>
                </Box>
                <Column>
                <Field kind="group">
                  <Button.Group size="medium">
                    <Button rounded color="success" disabled={isSubmitting}>
                      Enviar denuncia
                    </Button>

                    <Button
                      rounded
                      color="danger"
                      outlined
                      type="button"
                      className="outline"
                      onClick={handleReset}
                      disabled={!dirty || isSubmitting}
                    >
                      Reestablecer campos
                    </Button>
                  </Button.Group>
                </Field>
                </Column>

                {process.env.NODE_ENV !== "production" && (
                  <DisplayFormikState {...formik} />
                )}
              
            </Column>
            <Column></Column>
          </Container>
        </Hero.Body>
      </Hero>
    </React.Fragment>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyBkRE2KGVntDC8fsLDvdTk-z4zdOe9wqpY", //process.env.REACT_APP_GMAPS_API_KEY, // google maps key
  language: "es-419",
  libraries: ["places"]
})(App);
