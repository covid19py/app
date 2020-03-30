import { Field, Label, Control } from "rbx";

import React from "react";
import { hasProp } from "../helpers";
import { FieldContainer } from "./FieldContainer";

export function SectionContainer({ sections, setFieldValue, values }) {
  const dynamicForm = Object.keys(sections).map((section, index) => {
    const hasFields = hasProp(sections[section], "fields");
    const hasType = hasProp(sections[section], "type");
    const hasLabel = hasProp(sections[section], "label");

    if (hasFields) {
      const fields = sections[section].fields;

      const fieldsKeys = Object.keys(sections[section].fields);

      return (
        <Field key={index}>
          <Label>{sections[section].label}</Label>
          {fieldsKeys.map(field => (
            <Field horizontal key={field}>
              <Control>
                <FieldContainer
                  field={fields[field]}
                  id={field}
                  section={section}
                  setFieldValue={setFieldValue}
                  values={values}
                />
              </Control>
            </Field>
          ))}
        </Field>
      );
    }

    if (hasType && hasLabel) {
      return (
        <Field key={index}>
          <Field.Body horizontal key={section}>
            <FieldContainer
              field={sections[section]}
              id={section}
              setFieldValue={setFieldValue}
              values={values}
            />
          </Field.Body>
        </Field>
      );
    }
  });
  return dynamicForm;
}
