import { Field, Label, Checkbox, Control, Input } from "rbx";

import React from "react";

export const FieldContainer = ({ field, id, section, setFieldValue, values }) => {
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
              placeholder={field.label}
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
