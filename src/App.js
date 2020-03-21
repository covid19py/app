// Helper styles for demo
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
  Level,
  Textarea,
  Radio
} from "rbx";

import "./App.css";
import { DisplayFormikState } from "./helper";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";

import { usePosition } from "use-position";

import React, { useState, useEffect, useRef } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

const App = ({ google }) => {
  const { latitude, longitude, timestamp, accuracy, error } = usePosition();
  const [markerPosition, setMarkerPosition] = useState(null);
  const [anonymous, setAnonymous] = useState(true);

  const positionAvailable = latitude && longitude;
  const mapRef = useRef(null);

  const onMapClicked = (mapProps, map, clickEvent) => {
    console.log(clickEvent.latLng.lat());
    console.log(clickEvent.latLng.lng());
    setMarkerPosition({
      lat: clickEvent.latLng.lat(),
      lng: clickEvent.latLng.lng()
    });
  };

  useEffect(() => {
    setMarkerPosition({ lat: latitude, lng: longitude });
  }, [latitude, longitude]);

  return (
    <Container>
      <Content>
        <div className="app">
          <Level>
            <Level.Item as="p" textAlign="centered">
              <Title size="3">Gestión de denuncias</Title>
            </Level.Item>
          </Level>

          <Formik
            initialValues={{
              usedChannel: "Llamada",
              name: "",
              lastName: "",
              phone: "",
              email: ""
            }}
            onSubmit={async values => {
              await new Promise(resolve => setTimeout(resolve, 500));
              alert(JSON.stringify(values, null, 2));
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email()
                .required("Required")
            })}
          >
            {props => {
              const {
                values,
                touched,
                errors,
                dirty,
                isSubmitting,
                handleChange,
                handleBlur,
                handleSubmit,
                handleReset
              } = props;
              return (
                <form onSubmit={handleSubmit}>
                  <Field>
                    <Label htmlFor="usedChannel">Canal de denuncia</Label>
                    <Control>
                      <Select.Container fullwidth>
                        <Select
                          id="usedChannel"
                          name="usedChannel"
                          value={values.usedChannel}
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
                          <Select.Option
                            value="email"
                            label="Correo electrónico"
                          >
                            Correo electrónico
                          </Select.Option>
                          <Select.Option value="otros" label="Otros">
                            Redes Sociales
                          </Select.Option>
                        </Select>
                      </Select.Container>
                    </Control>
                  </Field>

                  <Field>
                    <Label htmlFor="">Anónimo</Label>
                    <Field.Body>
                      <Field narrow>
                        <Control>
                          {["Si", "No"].map(value => (
                            <Label key={value}>
                              <Radio
                                name="member"
                                value={value}
                                onClick={e => {
                                  console.log(e.target.value);
                                  if (e.target.value === "Si") {
                                    setAnonymous(true);
                                  } else {
                                    setAnonymous(false);
                                  }
                                }}
                              />{" "}
                              {value}
                            </Label>
                          ))}
                        </Control>
                      </Field>
                    </Field.Body>
                  </Field>

                  {anonymous && (
                    <>
                      <Field>
                        <Label htmlFor="name">Nombre</Label>
                        <Control>
                          <Input
                            id="name"
                            placeholder="Ingresa tu nombre"
                            type="text"
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={
                              errors.name && touched.name
                                ? "text-input error"
                                : "text-input"
                            }
                          />
                          {errors.name && touched.name && (
                            <div className="input-feedback">{errors.name}</div>
                          )}
                        </Control>
                      </Field>

                      <Field>
                        <Label htmlFor="lastName">Apellido</Label>
                        <Control>
                          <Input
                            id="lastName"
                            placeholder="Ingresa tu apellido"
                            type="text"
                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={
                              errors.lastName && touched.lastName
                                ? "text-input error"
                                : "text-input"
                            }
                          />
                          {errors.lastName && touched.lastName && (
                            <div className="input-feedback">
                              {errors.lastName}
                            </div>
                          )}
                        </Control>
                      </Field>
                      <Field>
                        <Label htmlFor="phone">Teléfono</Label>
                        <Control>
                          <Input
                            id="phone"
                            placeholder="Número de celular o línea baja"
                            type="tel"
                            value={values.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={
                              errors.phone && touched.phone
                                ? "text-input error"
                                : "text-input"
                            }
                          />
                          {errors.phone && touched.phone && (
                            <div className="input-feedback">{errors.phone}</div>
                          )}
                        </Control>
                      </Field>
                    </>
                  )}

                  <Field>
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Control>
                      <Input
                        id="email"
                        placeholder="Ingresa tu correo eléctronico"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.email && touched.email
                            ? "text-input error"
                            : "text-input"
                        }
                      />
                      {errors.email && touched.email && (
                        <div className="input-feedback">{errors.email}</div>
                      )}
                    </Control>
                  </Field>

                  <Field>
                    <Label htmlFor="complaintType">Tipo de denuncia</Label>
                    <Control>
                      <Select.Container fullwidth>
                        <Select
                          id="complaintType"
                          name="complaintType"
                          value={values.complaintType}
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
                            value="medidas_sanitaria"
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
                      {errors.complaintType && touched.complaintType && (
                        <div className="input-feedback">
                          {errors.complaintType}
                        </div>
                      )}
                    </Control>
                  </Field>

                  <Field>
                    {positionAvailable && (
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
                        onClick={onMapClicked}
                        zoom={15}
                      >
                        <Marker
                          onClick={() => console.log("clicked")}
                          name={"Current location"}
                          position={markerPosition}
                        />
                      </Map>
                    )}
                  </Field>

                  {/* <Field horizontal>
    <Field.Label size="normal">
      <Label>Question</Label>
    </Field.Label>
    <Field.Body>
      <Field>
        <Control>
          <Textarea placeholder="Explain how we can help you" />
        </Control>
      </Field>
    </Field.Body>
  </Field> */}

                  <Field>
                    <Label htmlFor="observations">Observaciones</Label>
                    <Control>
                      <Textarea
                        id="observations"
                        placeholder=""
                        type="tel"
                        value={values.observations}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.observations && touched.observations
                            ? "text-input error"
                            : "text-input"
                        }
                      />
                      {errors.observations && touched.observations && (
                        <div className="input-feedback">
                          {errors.observations}
                        </div>
                      )}
                    </Control>
                  </Field>

                  <Field kind="group">
                    <Button.Group size="large">
                      <Button rounded color="success" disabled={isSubmitting}>
                        Submit
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
                        Reset
                      </Button>
                    </Button.Group>
                  </Field>

                  <DisplayFormikState {...props} />
                </form>
              );
            }}
          </Formik>
        </div>
      </Content>
    </Container>
  );
};

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GMAPS_API_KEY, // google maps key
  libraries: ["places"]
})(App);
