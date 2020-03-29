import {
  Content,
  Container,
  Field,
  Control,
  Checkbox,
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
  Box
} from "rbx";

import "./Form.css";
import "react-notifications/lib/notifications.css";
import { DisplayFormikState } from "../helpers";
import MapContainer from "../components/MapContainer";

import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import customFields from "../../../../schemas/custom_fields_v2.json";

const formInitialValues = {
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
  estado: "pendiente",
  custom_fields: {}
};

const validationSchema = Yup.object().shape({
  correo: Yup.string().email("Invalid email")
});

const postUrl =
  process.env.NODE_ENV !== "production"
    ? `${process.env.REACT_APP_API_URL}/`
    : "/";

const App = () => {
  const [place, setPlace] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [showCustomFields, setShowCustomFields] = useState(null);

  const autocompleteEl = useRef(null);

  const formik = useFormik({
    initialValues: { ...formInitialValues },
    onSubmit: (values, { resetForm }) => {
      fetch(postUrl, {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values, null, 2)
      })
        .then(res => res.json())
        .then(data => {
          NotificationManager.success("", "Denuncia enviada");
          setShowCustomFields(null);
          resetForm({ ...formInitialValues });
          document.body.scrollTop = 0; // For Safari
          document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        })
        .catch(err => console.log(err));
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

  useEffect(() => {
    const hasCustomField = customFields[values.tipo_denuncia];
    if (hasCustomField) {
      const hasSections = customFields[values.tipo_denuncia].sections;
      if (hasSections) {
        const sections = customFields[values.tipo_denuncia].sections;
        const formValuesMapping = Object.keys(sections)
          .map((section, index) => {
            const hasFields = Object.prototype.hasOwnProperty.call(
              sections[section],
              "fields"
            );
            const hasType = Object.prototype.hasOwnProperty.call(
              sections[section],
              "type"
            );
            const hasLabel = Object.prototype.hasOwnProperty.call(
              sections[section],
              "label"
            );
            if (hasFields) {
              const fieldsKeys = Object.keys(sections[section].fields);
              const mappedFields = fieldsKeys
                .map(field => {
                  return {
                    [field]: false
                  };
                })
                .reduce(function(acc, cur, i) {
                  acc[Object.keys(cur)] = cur[Object.keys(cur)];
                  return acc;
                }, {});
              const customFields = {
                [section]: { ...mappedFields }
              };
              return customFields;
            }
            if (hasType && hasLabel) {
              return {
                [section]: ""
              };
            }
          })
          .reduce((acc, cur, i) => {
            acc[Object.keys(cur)] = cur[Object.keys(cur)];
            return acc;
          }, {});
        setFieldValue("custom_fields", formValuesMapping, false);
        setShowCustomFields(sections);
      }
    } else {
      setShowCustomFields(null);
    }
  }, [setFieldValue, values.tipo_denuncia]);

  const renderField = (field, id, section) => {
    switch (field.type) {
      case "checkbox":
        return (
          <Label style={{ lineHeight: 3 }}>
            <Checkbox
              id={`custom_fields.${section}.${id}`}
              value={values.custom_fields[section][id]}
              onChange={() => {
                setFieldValue(
                  `custom_fields.${section}.${id}`,
                  !values.custom_fields[section][id],
                  false
                );
              }}
              type="checkbox"
            />
            &nbsp;{field.label}
          </Label>
        );

      case "text":
        return (
          <Field>
            <Label htmlFor={`custom_fields.${id}`}>{field.label}</Label>
            <Control>
              <Input
                id={`custom_fields.${id}`}
                value={values.custom_fields[id]}
                autoComplete="off"
                name={`custom_fields.${id}`}
                type="text"
                onChange={e => {
                  setFieldValue(`custom_fields.${id}`, e.target.value, false);
                }}
              />
            </Control>
          </Field>
        );
      default:
        return null;
    }
  };

  const renderSections = sections => {
    const dynamicForm = Object.keys(sections).map((section, index) => {
      const hasFields = Object.prototype.hasOwnProperty.call(
        sections[section],
        "fields"
      );

      const hasType = Object.prototype.hasOwnProperty.call(
        sections[section],
        "type"
      );
      const hasLabel = Object.prototype.hasOwnProperty.call(
        sections[section],
        "label"
      );

      if (hasFields) {
        const fields = sections[section].fields;

        const fieldsKeys = Object.keys(sections[section].fields);

        return (
          <Field key={index}>
            <Label>{sections[section].label}</Label>
            {fieldsKeys.map(field => (
              <Field horizontal key={field}>
                <Control>{renderField(fields[field], field, section)}</Control>
              </Field>
            ))}
          </Field>
        );
      }

      if (hasType && hasLabel) {
        return (
          <Field key={index}>
            <Field.Body horizontal key={section}>
              <Control>{renderField(sections[section], section, null)}</Control>
            </Field.Body>
          </Field>
        );
      }
    });
    return dynamicForm;
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
          <Container
            as="form"
            onSubmit={handleSubmit}
            onKeyDown={e => {
              if ((e.charCode || e.keyCode) === 13) {
                e.preventDefault();
              }
            }}
          >
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
                            <Select.Option
                              value="correo"
                              label="Correo electrónico"
                            >
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
                              value="incumplimiento_medidas_sanitarias"
                              label="Incumplimiento de medidas sanitarias"
                            >
                              Incumplimiento de medidas sanitarias
                            </Select.Option>
                            <Select.Option
                              value="incumplimiento_cuarentena"
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
              {showCustomFields && (
                <Box>
                  <Field horizontal>
                    <Field.Body>{renderSections(showCustomFields)}</Field.Body>
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
                          <div className="input-feedback">
                            {errors.apellido}
                          </div>
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
                          <div className="input-feedback">
                            {errors.telefono}
                          </div>
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
                  <Label htmlFor="complaintType">Ubicación</Label>
                  <MapContainer
                    setFieldValue={setFieldValue}
                    setStreet={setStreet}
                    setCity={setCity}
                    setCountry={setCountry}
                    setPlace={setPlace}
                    autocompleteEl={autocompleteEl}
                  />
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
          <NotificationContainer />
        </Hero.Body>
      </Hero>
    </React.Fragment>
  );
};

export default App;
