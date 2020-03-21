// Helper styles for demo
import "./App.css";
import { DisplayFormikState } from "./helper";

import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";

const App = () => (
  <div className="app">
    <h1>Gestión de denuncias</h1>

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
            <label htmlFor="usedChannel" style={{ display: "block" }}>
              Canal utilizado para la denuncia
            </label>
            <select
              id="usedChannel"
              name="usedChannel"
              value={values.usedChannel}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ display: "block" }}
            >
              <option value="llamada" label="Llamada" />
              <option value="redes_sociales" label="Redes Sociales" />
              <option value="email" label="Correo electrónico" />
              <option value="otros" label="Otros" />
            </select>
            {errors.usedChannel && touched.usedChannel && (
              <div className="input-feedback">{errors.usedChannel}</div>
            )}
            <br />
            <label htmlFor="name" style={{ display: "block" }}>
              Nombre
            </label>
            <input
              id="name"
              placeholder="Ingresa tu nombre"
              type="text"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                errors.name && touched.name ? "text-input error" : "text-input"
              }
            />
            {errors.name && touched.name && (
              <div className="input-feedback">{errors.name}</div>
            )}
            <br />
            <label htmlFor="lastName" style={{ display: "block" }}>
              Apellido
            </label>
            <input
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
              <div className="input-feedback">{errors.lastName}</div>
            )}
            <br />
            <label htmlFor="phone" style={{ display: "block" }}>
              Número
            </label>
            <input
              id="phone"
              placeholder="Número de celular o línea baja"
              type="text"
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
            <br />
            <label htmlFor="email" style={{ display: "block" }}>
              Correo electrónico
            </label>
            <input
              id="email"
              placeholder="Ingresa tu correo eléctronico"
              type="text"
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
            <br />
            <label htmlFor="complaintType" style={{ display: "block" }}>
              Canal utilizado para la denuncia
            </label>
            <select
              id="complaintType"
              name="complaintType"
              value={values.complaintType}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ display: "block" }}
            >
              <option value="aglomeracion" label="Aglomeración en espacio público" />
              <option value="medidas_sanitarias" label="Incumplimiento de medidas sanitarias" />
              <option value="cuarentena" label="Incumplimiento de cuarentena" />
              <option value="sintomas" label="Reporte de síntomas" />
              <option value="otros" label="Otros" />
            </select>
            {errors.complaintType && touched.complaintType && (
              <div className="input-feedback">{errors.complaintType}</div>
            )}
            <br />

            <button
              type="button"
              className="outline"
              onClick={handleReset}
              disabled={!dirty || isSubmitting}
            >
              Reset
            </button>
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>

            <DisplayFormikState {...props} />
          </form>
        );
      }}
    </Formik>
  </div>
);

export default App;
