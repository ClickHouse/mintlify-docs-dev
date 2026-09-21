import { buttonVariants } from "@/components/ui/button/variants";
// Recursive schema controls. Nested JSON drafts live only as long as their field is mounted.
import { useId, useState } from "react";
import type { OpenApiSchema, OpenApiDocument } from "@/lib/openapi";
import { schemaFor, validateValue, type Values } from "./playground-model";
import PlaygroundCode from "./PlaygroundCode";

function JsonInput({
  value,
  onChange,
  label,
}: {
  value: unknown;
  onChange: (v: unknown) => void;
  label: string;
}) {
  const [draft, setDraft] = useState<{ text: string; error: string }>();
  const text = draft?.text ?? JSON.stringify(value, null, 2) ?? "";
  const error = draft?.error ?? "";
  return (
    <>
      <textarea
        aria-label={label}
        value={text}
        spellCheck={false}
        onChange={(e) => {
          const text = e.target.value;
          try {
            const next = text.trim() ? JSON.parse(text) : undefined;
            onChange(next);
            setDraft({ text, error: "" });
            e.target.setCustomValidity("");
          } catch {
            setDraft({ text, error: "Enter valid JSON." });
            e.target.setCustomValidity("Enter valid JSON.");
          }
        }}
      />
      {error && (
        <span role="alert" className="pg-error">
          {error}
        </span>
      )}
    </>
  );
}

export default function Field({
  name,
  input,
  value,
  onChange,
  doc,
  required = false,
  depth = 0,
}: {
  name: string;
  input: OpenApiSchema;
  value: unknown;
  onChange: (v: unknown) => void;
  doc: OpenApiDocument;
  required?: boolean;
  depth?: number;
}) {
  const id = useId();
  const [chosenVariant, setChosenVariant] = useState(0);
  const schema = schemaFor(input, doc);
  if (schema.readOnly) return null;
  const variants = schema.oneOf ?? schema.anyOf;
  if (variants?.length) {
    const { oneOf: _oneOf, anyOf: _anyOf, ...base } = schema;
    const matching =
      value === undefined
        ? -1
        : variants.findIndex((variant) => {
            try {
              validateValue(variant, value, doc);
              return true;
            } catch {
              return false;
            }
          });
    const variantIndex = matching >= 0 ? matching : chosenVariant;
    const selected = schemaFor(variants[variantIndex], doc);
    const labels = variants.map((variant, index) => {
      const option = schemaFor(variant, doc);
      const discriminator = Object.values(option.properties ?? {}).find(
        (p) => p.const !== undefined || p.enum?.length === 1,
      );
      return String(
        option.title ??
          discriminator?.const ??
          discriminator?.enum?.[0] ??
          `Option ${index + 1}`,
      );
    });
    return (
      <div className="pg-field">
        <label htmlFor={id}>{name} type</label>
        <select
          id={id}
          aria-label={`${name} type`}
          value={variantIndex}
          onChange={(e) => {
            const index = Number(e.target.value);
            setChosenVariant(index);
            const option = schemaFor(variants[index], doc);
            const defaults = Object.fromEntries(
              Object.entries(option.properties ?? {})
                .filter(
                  ([, p]) => p.const !== undefined || p.enum?.length === 1,
                )
                .map(([key, p]) => [key, p.const ?? p.enum![0]]),
            );
            const shared =
              value && typeof value === "object" && !Array.isArray(value)
                ? Object.fromEntries(
                    Object.entries(value).filter(([key, entry]) => {
                      const property = option.properties?.[key];
                      if (!property) return false;
                      try {
                        validateValue(property, entry, doc);
                        return true;
                      } catch {
                        return false;
                      }
                    }),
                  )
                : {};
            const next = { ...shared, ...defaults };
            onChange(Object.keys(next).length ? next : undefined);
          }}
        >
          {labels.map((label, index) => (
            <option key={index} value={index}>
              {label}
            </option>
          ))}
        </select>
        <Field
          key={variantIndex}
          name={name}
          input={{ allOf: [base, selected] }}
          value={value}
          onChange={onChange}
          doc={doc}
          required={required}
          depth={depth + 1}
        />
      </div>
    );
  }

  const type = Array.isArray(schema.type)
    ? schema.type.find((t) => t !== "null")
    : (schema.type ?? (schema.properties ? "object" : "string"));
  const complex = !!(
    schema.oneOf ||
    schema.anyOf ||
    depth > 8 ||
    (type === "object" && !schema.properties)
  );
  return (
    <div
      className={`pg-field ${!complex && type !== "object" && type !== "array" ? "pg-scalar" : ""}`}
    >
      <label htmlFor={id}>
        <strong>{name}</strong>{" "}
        <small>
          {type}
          {schema.format ? ` · ${schema.format}` : ""}
        </small>
        {required && <em>required</em>}
        {schema.deprecated === true && <em>deprecated</em>}
      </label>
      {schema.description && <p>{schema.description}</p>}
      {complex ? (
        <>
          <span className="pg-hint">
            JSON value
            {schema.oneOf || schema.anyOf ? " · schema alternatives" : ""}
          </span>
          <JsonInput label={name} value={value} onChange={onChange} />
          <details className="pg-schema-details">
            <summary>View schema</summary>
            <PlaygroundCode
              code={JSON.stringify(schema, null, 2)}
              language="json"
            />
          </details>
        </>
      ) : schema.enum || type === "boolean" ? (
        <select
          id={id}
          value={value === undefined ? "" : JSON.stringify(value)}
          required={required}
          onChange={(e) =>
            onChange(
              e.target.value === "" ? undefined : JSON.parse(e.target.value),
            )
          }
        >
          <option value="">Not set</option>
          {(schema.enum ?? [true, false]).map((v) => (
            <option key={JSON.stringify(v)} value={JSON.stringify(v)}>
              {String(v)}
            </option>
          ))}
        </select>
      ) : type === "object" ? (
        <div className="pg-nested">
          {Object.entries(schema.properties ?? {}).map(([key, child]) => (
            <Field
              key={key}
              name={key}
              input={child}
              value={(value as Values | undefined)?.[key]}
              required={
                !!schema.required?.includes(key) &&
                (required || value !== undefined)
              }
              doc={doc}
              depth={depth + 1}
              onChange={(v) => {
                const next = { ...((value as Values) ?? {}) };
                if (v === undefined) delete next[key];
                else next[key] = v;
                onChange(Object.keys(next).length ? next : undefined);
              }}
            />
          ))}
          {schema.additionalProperties && (
            <div className="pg-hint">
              Use JSON mode to add custom properties.
            </div>
          )}
        </div>
      ) : type === "array" ? (
        <div className="pg-nested">
          {((value as unknown[]) ?? []).map((v, index) => (
            <div className="pg-array-item" key={index}>
              <Field
                name={`${name}[${index}]`}
                input={schema.items ?? {}}
                value={v}
                doc={doc}
                required
                depth={depth + 1}
                onChange={(next) =>
                  onChange(
                    (value as unknown[]).map((x, i) =>
                      i === index ? next : x,
                    ),
                  )
                }
              />
              <button
                className={buttonVariants({ size: "sm" })}
                type="button"
                onClick={() =>
                  onChange((value as unknown[]).filter((_, i) => i !== index))
                }
              >
                Remove item {index + 1}
              </button>
            </div>
          ))}
          <div className="pg-array-actions">
            <button
              className={buttonVariants({ size: "sm" })}
              type="button"
              onClick={() => {
                const item = schemaFor(schema.items ?? {}, doc);
                onChange([
                  ...((value as unknown[]) ?? []),
                  item.type === "object" || item.properties
                    ? {}
                    : item.type === "boolean"
                      ? false
                      : item.type === "number" || item.type === "integer"
                        ? 0
                        : "",
                ]);
              }}
            >
              Add an item
            </button>
            {value !== undefined && (
              <button
                className={buttonVariants({ size: "sm" })}
                type="button"
                onClick={() => onChange(undefined)}
              >
                Omit array
              </button>
            )}
          </div>
        </div>
      ) : (
        <input
          id={id}
          aria-label={name}
          required={required}
          type={type === "number" || type === "integer" ? "number" : "text"}
          step={type === "integer" ? 1 : "any"}
          value={value === undefined ? "" : String(value)}
          placeholder={
            schema.example === undefined ? name : String(schema.example)
          }
          min={typeof schema.minimum === "number" ? schema.minimum : undefined}
          max={typeof schema.maximum === "number" ? schema.maximum : undefined}
          onChange={(e) =>
            onChange(
              e.target.value === ""
                ? undefined
                : type === "number" || type === "integer"
                  ? Number(e.target.value)
                  : e.target.value,
            )
          }
        />
      )}
    </div>
  );
}
