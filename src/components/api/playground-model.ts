import type { ApiResponseView } from "@cloudflare/nimbus-docs/api";
import type {
  OpenApiDocument,
  OpenApiSchema,
  OpenApiOperation,
  OpenApiParameter,
} from "@/lib/openapi";
export interface PlaygroundConfig {
  bodyExample?: unknown;
  descriptionHtml?: string;
  responses?: Pick<ApiResponseView, "status" | "example">[];
  title: string;
  method: string;
  path: string;
  document: OpenApiDocument;
  operation: OpenApiOperation;
  parameters: OpenApiParameter[];
}
export type Values = Record<string, unknown>;
export interface RequestState {
  server: string;
  parameters: Values;
  body?: unknown;
  username: string;
  password: string;
  token: string;
}
export interface BuiltRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
}
export function resolve<T extends { $ref?: string }>(
  value: T,
  doc: OpenApiDocument,
): T {
  const seen = new Set<string>();
  while (value.$ref) {
    const ref = value.$ref;
    if (!ref.startsWith("#/") || seen.has(ref))
      throw new Error(`Unsupported or circular reference: ${ref}`);
    seen.add(ref);
    let target: unknown = doc;
    for (const key of ref.slice(2).split("/"))
      target = (target as Record<string, unknown>)?.[
        key.replace(/~1/g, "/").replace(/~0/g, "~")
      ];
    if (!target || typeof target !== "object")
      throw new Error(`Missing reference: ${ref}`);
    const { $ref: _, ...rest } = value;
    value = { ...target, ...rest } as T;
  }
  return value;
}
export function schemaFor(
  input: OpenApiSchema,
  doc: OpenApiDocument,
  depth = 0,
): OpenApiSchema {
  if (depth > 30)
    throw new Error("Schema composition exceeds the playground limit.");
  const schema = resolve(input, doc);
  if (!schema.allOf) return schema;
  const { allOf, ...base } = schema;
  return allOf.reduce((a, b) => {
    const part = schemaFor(b, doc, depth + 1);
    return {
      ...a,
      ...part,
      properties: { ...a.properties, ...part.properties },
      required: [...new Set([...(a.required ?? []), ...(part.required ?? [])])],
    };
  }, base);
}
export function bodySchema(
  config: PlaygroundConfig,
): OpenApiSchema | undefined {
  const body =
    config.operation.requestBody &&
    resolve(config.operation.requestBody, config.document);
  return body?.content?.["application/json"]?.schema;
}
export function authType(
  config: PlaygroundConfig,
): "basic" | "bearer" | "none" {
  const requirements =
    config.operation.security ?? config.document.security ?? [];
  if (!requirements.length || requirements.some((r) => !Object.keys(r).length))
    return "none";
  const names = Object.keys(requirements[0]);
  if (names.length !== 1)
    throw new Error(
      "This authentication combination is not supported by the playground yet.",
    );
  const scheme = config.document.components?.securitySchemes?.[names[0]];
  if (
    scheme?.type === "http" &&
    (scheme.scheme === "basic" || scheme.scheme === "bearer")
  )
    return scheme.scheme;
  throw new Error(
    "This authentication scheme is not supported by the playground yet.",
  );
}
export function validateValue(
  input: OpenApiSchema,
  value: unknown,
  doc: OpenApiDocument,
  name = "Body",
  depth = 0,
): void {
  if (depth > 30)
    throw new Error("Request nesting exceeds the playground limit.");
  const schema = schemaFor(input, doc);
  if (
    value === null &&
    (schema.nullable ||
      (Array.isArray(schema.type) && schema.type.includes("null")))
  )
    return;
  // Union values are checked against each declared alternative, never coerced.
  const variants = schema.oneOf ?? schema.anyOf;
  if (variants) {
    const matches = variants.filter((variant) => {
      try {
        validateValue(variant, value, doc, name, depth + 1);
        return true;
      } catch {
        return false;
      }
    });
    if (!matches.length || (schema.oneOf && matches.length !== 1))
      throw new Error(
        `${name} must match ${schema.oneOf ? "exactly one" : "a"} schema alternative.`,
      );
  }
  if (
    schema.const !== undefined &&
    JSON.stringify(schema.const) !== JSON.stringify(value)
  )
    throw new Error(`${name} must equal ${JSON.stringify(schema.const)}.`);
  if (
    schema.enum &&
    !schema.enum.some((v) => JSON.stringify(v) === JSON.stringify(value))
  )
    throw new Error(`${name} must be one of the listed values.`);
  const type = Array.isArray(schema.type)
    ? schema.type.find((t) => t !== "null")
    : (schema.type ?? (schema.properties ? "object" : undefined));
  if (type === "null" && value !== null)
    throw new Error(`${name} must be null.`);
  if (type === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw new Error(`${name} must be an object.`);
    const object = value as Values;
    for (const key of schema.required ?? [])
      if (object[key] === undefined)
        throw new Error(`${name}.${key} is required.`);
    for (const [key, child] of Object.entries(object)) {
      if (schema.properties?.[key])
        validateValue(
          schema.properties[key],
          child,
          doc,
          `${name}.${key}`,
          depth + 1,
        );
      else if (schema.additionalProperties === false)
        throw new Error(`${name}.${key} is not an allowed property.`);
      else if (typeof schema.additionalProperties === "object")
        validateValue(
          schema.additionalProperties,
          child,
          doc,
          `${name}.${key}`,
          depth + 1,
        );
    }
  } else if (type === "array") {
    if (!Array.isArray(value)) throw new Error(`${name} must be an array.`);
    value.forEach(
      (v, i) =>
        schema.items &&
        validateValue(schema.items, v, doc, `${name}[${i}]`, depth + 1),
    );
  } else if (
    type &&
    type !== "null" &&
    (typeof value !== (type === "integer" ? "number" : type) ||
      (type === "integer" && !Number.isInteger(value)))
  )
    throw new Error(`${name} must be ${type}.`);
  if (typeof value === "string") {
    if (typeof schema.minLength === "number" && value.length < schema.minLength)
      throw new Error(`${name} is too short.`);
    if (typeof schema.maxLength === "number" && value.length > schema.maxLength)
      throw new Error(`${name} is too long.`);
    if (
      typeof schema.pattern === "string" &&
      !new RegExp(schema.pattern).test(value)
    )
      throw new Error(`${name} does not match the required pattern.`);
  }
  if (Array.isArray(value)) {
    if (typeof schema.minItems === "number" && value.length < schema.minItems)
      throw new Error(`${name} needs more items.`);
    if (typeof schema.maxItems === "number" && value.length > schema.maxItems)
      throw new Error(`${name} has too many items.`);
    if (
      schema.uniqueItems &&
      new Set(value.map((v) => JSON.stringify(v))).size !== value.length
    )
      throw new Error(`${name} requires unique items.`);
  }
  if (
    typeof value === "number" &&
    ((schema.exclusiveMinimum === true && value === schema.minimum) ||
      (typeof schema.exclusiveMinimum === "number" &&
        value <= schema.exclusiveMinimum) ||
      (schema.exclusiveMaximum === true && value === schema.maximum) ||
      (typeof schema.exclusiveMaximum === "number" &&
        value >= schema.exclusiveMaximum))
  )
    throw new Error(`${name} is outside the allowed range.`);
  if (
    typeof value === "number" &&
    (!Number.isFinite(value) ||
      (typeof schema.minimum === "number" && value < schema.minimum) ||
      (typeof schema.maximum === "number" && value > schema.maximum))
  )
    throw new Error(`${name} is outside the allowed range.`);
}
export function buildRequest(
  config: PlaygroundConfig,
  state: RequestState,
  strict = true,
): BuiltRequest {
  let path = config.path;
  const query = new URLSearchParams();
  const headers: Record<string, string> = { Accept: "application/json" };
  for (const raw of config.parameters) {
    const p = resolve(raw, config.document);
    const key = `${p.in}:${p.name}`;
    const value = state.parameters[key];
    if (value === undefined || value === "") {
      if (strict && (p.required || p.in === "path"))
        throw new Error(`${p.name} is required.`);
      continue;
    }
    if (strict && p.schema)
      validateValue(p.schema, value, config.document, p.name);
    if (p.in === "path")
      path = path.replaceAll(`{${p.name}}`, encodeURIComponent(String(value)));
    else if (p.in === "query") {
      if (Array.isArray(value))
        value.forEach((v) => query.append(p.name!, String(v)));
      else if (value !== null && typeof value === "object")
        throw new Error(
          `Object query parameter ${p.name} is not supported yet.`,
        );
      else query.append(p.name!, String(value));
    } else if (p.in === "header") headers[p.name!] = String(value);
    else throw new Error(`Parameter location ${p.in} is not supported yet.`);
  }
  const server = state.server.replace(/\/$/, "");
  if (!/^https?:\/\//.test(server) || server.includes("{"))
    throw new Error("Choose a valid API server URL.");
  const auth = authType(config);
  if (auth === "basic" && (state.username || state.password)) {
    const bytes = new TextEncoder().encode(
      `${state.username}:${state.password}`,
    );
    headers.Authorization = `Basic ${btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""))}`;
  } else if (auth === "bearer" && state.token)
    headers.Authorization = `Bearer ${state.token}`;
  let body: string | undefined;
  const schema = bodySchema(config);
  const requestBody =
    config.operation.requestBody &&
    resolve(config.operation.requestBody, config.document);
  if (strict && requestBody?.required && state.body === undefined)
    throw new Error("Request body is required.");
  if (state.body !== undefined) {
    if (strict && schema) validateValue(schema, state.body, config.document);
    body = JSON.stringify(state.body, null, 2);
    headers["Content-Type"] = "application/json";
  }
  return {
    url: server + path + (query.size ? `?${query}` : ""),
    method: config.method.toUpperCase(),
    headers,
    body,
  };
}
export function requestSample(request: BuiltRequest, language: string): string {
  const quote = (s: string) => `'${s.replaceAll("'", "'\\''")}'`;
  if (language === "JavaScript")
    return `const response = await fetch(${JSON.stringify(request.url)}, ${JSON.stringify({ method: request.method, headers: request.headers, ...(request.body === undefined ? {} : { body: request.body }) }, null, 2)});\nconsole.log(await response.text());`;
  if (language === "Python")
    return `import requests\n\nresponse = requests.request(\n    ${JSON.stringify(request.method)},\n    ${JSON.stringify(request.url)},\n    headers=${JSON.stringify(request.headers, null, 4)},${request.body === undefined ? "" : `\n    data=${JSON.stringify(request.body)},`}\n)\nprint(response.text)`;
  return [
    `curl --request ${request.method}`,
    `  --url ${quote(request.url)}`,
    ...Object.entries(request.headers).map(
      ([key, value]) => `  --header ${quote(`${key}: ${value}`)}`,
    ),
    ...(request.body === undefined
      ? []
      : [`  --data-raw ${quote(request.body)}`]),
  ].join(" \\\n");
}
