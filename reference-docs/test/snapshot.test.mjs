import assert from "node:assert/strict";
import test from "node:test";
import { categorySlug, categories, functionsForCategory, loadSnapshot } from "../src/lib/snapshot.mjs";
import { renderFunctionBody } from "../src/lib/render-function-body.mjs";
import { archiveVersion, bodyUrl } from "../src/lib/reference-archive.mjs";

test("snapshot fixture produces the arithmetic function page", () => {
  const snapshot = loadSnapshot(new URL("../fixtures/snapshot", import.meta.url).pathname);
  assert.deepEqual(categories(snapshot), ["Arithmetic"]);
  assert.equal(categorySlug("Arithmetic"), "arithmetic");
  const body = renderFunctionBody(functionsForCategory(snapshot, "Arithmetic"));
  assert.match(body, /<h2>minus<\/h2>/);
  assert.match(body, /<h2>plus<\/h2>/);
});

test("body rendering never trusts source HTML", () => {
  const body = renderFunctionBody([{ name: "x", alias_to: "", is_aggregate: 0, description: "<script>bad()</script>" }]);
  assert.match(body, /&lt;script&gt;bad\(\)&lt;\/script&gt;/);
});

test("archived routes use the body-only sites prefix", () => {
  assert.equal(archiveVersion("26-9"), "26.9");
  assert.equal(archiveVersion("head"), null);
  assert.equal(
    bodyUrl("https://docs-artifacts.example", "26.9", "data-types/string"),
    "https://docs-artifacts.example/sites/26.9/en/data-types/string/body.html",
  );
});
