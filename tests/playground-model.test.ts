import assert from "node:assert/strict";
import test from "node:test";
import {
  buildRequest,
  schemaFor,
  validateValue,
  requestSample,
} from "../src/components/api/playground-model.ts";
import type {
  PlaygroundConfig,
  RequestState,
} from "../src/components/api/playground-model.ts";
const config: PlaygroundConfig = {
  title: "Test",
  method: "patch",
  path: "/v1/items/{id}",
  document: {
    openapi: "3.0.0",
    paths: {},
    security: [{ basic: [] }],
    components: {
      securitySchemes: { basic: { type: "http", scheme: "basic" } },
      schemas: {
        Body: {
          type: "object",
          required: ["enabled"],
          properties: {
            enabled: { type: "boolean" },
            count: { type: "integer", minimum: 0 },
          },
        },
      },
    },
  },
  operation: {
    requestBody: {
      required: true,
      content: {
        "application/json": { schema: { $ref: "#/components/schemas/Body" } },
      },
    },
  },
  parameters: [
    { name: "id", in: "path", required: true, schema: { type: "string" } },
    {
      name: "tag",
      in: "query",
      schema: { type: "array", items: { type: "string" } },
    },
  ],
};
const state: RequestState = {
  server: "https://example.com",
  parameters: { "path:id": "a/b ?", "query:tag": ["a&b", "c"] },
  body: { enabled: false, count: 0 },
  username: "key",
  password: "secret",
  token: "",
};
test("encodes paths and repeated query values, preserves false/zero and Basic Auth", () => {
  const r = buildRequest(config, state);
  assert.equal(
    r.url,
    "https://example.com/v1/items/a%2Fb%20%3F?tag=a%26b&tag=c",
  );
  assert.equal(r.headers.Authorization, "Basic a2V5OnNlY3JldA==");
  assert.deepEqual(JSON.parse(r.body!), { enabled: false, count: 0 });
});
test("rejects missing required path/body and invalid nested values", () => {
  assert.throws(
    () => buildRequest(config, { ...state, parameters: {} }),
    /id is required/,
  );
  assert.throws(
    () => buildRequest(config, { ...state, body: undefined }),
    /body is required/,
  );
  assert.throws(
    () => buildRequest(config, { ...state, body: { enabled: "false" } }),
    /boolean/,
  );
  assert.throws(
    () =>
      buildRequest(config, { ...state, body: { enabled: false, count: -1 } }),
    /range/,
  );
});
test("explicitly empty operation security overrides document authentication", () => {
  assert.equal(
    buildRequest(
      { ...config, operation: { ...config.operation, security: [] } },
      state,
    ).headers.Authorization,
    undefined,
  );
});
test("merges allOf properties and validates required members", () => {
  const input = {
    allOf: [
      {
        type: "object",
        properties: { a: { type: "string" } },
        required: ["a"],
      },
      {
        type: "object",
        properties: { b: { type: "boolean" } },
        required: ["b"],
      },
    ],
  };
  assert.deepEqual(schemaFor(input, config.document).required, ["a", "b"]);
  assert.throws(
    () => validateValue(input, { a: "ok" }, config.document),
    /b is required/,
  );
});
test("samples contain the same URL and payload as the executed request", () => {
  const r = buildRequest(config, state);
  for (const language of ["cURL", "Python", "JavaScript"]) {
    const sample = requestSample(r, language);
    assert.ok(sample.includes(r.url));
    assert.ok(sample.includes("enabled"));
    assert.ok(sample.includes(r.headers.Authorization));
  }
});
test("validates discriminated alternatives and exclusive bounds", () => {
  const union = {
    oneOf: [
      {
        type: "object",
        required: ["kind"],
        properties: { kind: { const: "a" } },
      },
      {
        type: "object",
        required: ["kind"],
        properties: { kind: { const: "b" } },
      },
    ],
  };
  validateValue(union, { kind: "a" }, config.document);
  assert.throws(
    () => validateValue(union, { kind: "c" }, config.document),
    /exactly one/,
  );
  assert.throws(
    () =>
      validateValue(
        { type: "number", minimum: 0, exclusiveMinimum: true },
        0,
        config.document,
      ),
    /range/,
  );
});
test("bearer auth and optional body omission", () => {
  const c = {
    ...config,
    document: {
      ...config.document,
      security: [{ bearer: [] }],
      components: {
        securitySchemes: { bearer: { type: "http", scheme: "bearer" } },
      },
    },
    operation: {},
  };
  const r = buildRequest(c, {
    ...state,
    token: "example-token",
    body: undefined,
  });
  assert.equal(r.headers.Authorization, "Bearer example-token");
  assert.equal(r.body, undefined);
  assert.equal(r.headers["Content-Type"], undefined);
});
