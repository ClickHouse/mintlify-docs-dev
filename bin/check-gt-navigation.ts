import fs from "node:fs";
import path from "node:path";

const repositoryRoot = process.cwd();
const configPath = path.join(repositoryRoot, "gt.config.json");
const docsPath = path.join(repositoryRoot, "docs.json");
const translatableKeys = ["group", "tab", "item", "anchor", "dropdown"] as const;
const expectedSelectors = translatableKeys.map((key) => `$..${key}`);

function fail(message: string): never {
  throw new Error(`check-gt-navigation: ${message}`);
}

function readJson(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function asRecord(value: unknown, description: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(`${description} must be an object`);
  }

  return value as Record<string, unknown>;
}

function assertTranslationSchema(): void {
  const config = asRecord(readJson(configPath), "gt.config.json");
  const options = asRecord(config.options, "gt.config.json options");
  const jsonSchema = asRecord(options.jsonSchema, "gt.config.json options.jsonSchema");
  const docsSchema = asRecord(jsonSchema["./docs.json"], "the ./docs.json translation schema");

  if (docsSchema.resolveRefs !== true) {
    fail("the ./docs.json translation schema must resolve navigation $ref files");
  }

  const composite = asRecord(docsSchema.composite, "the ./docs.json composite schema");
  const languages = asRecord(
    composite["$.navigation.languages"],
    "the $.navigation.languages composite schema",
  );

  if (languages.type !== "array" || languages.key !== "$.language" || languages.splitEntries !== true) {
    fail("the language navigation schema must remain a split array keyed by $.language");
  }

  if (!Array.isArray(languages.include)) {
    fail("the language navigation schema must declare its translatable fields");
  }

  const included = new Set(languages.include);
  for (const selector of expectedSelectors) {
    if (!included.has(selector)) {
      fail(`the language navigation schema must include ${selector}`);
    }
  }

  const transform = asRecord(languages.transform, "the language navigation path transforms");
  for (const selector of ["$..pages[*]", "$..root"]) {
    const rule = asRecord(transform[selector], `the ${selector} transform`);
    if (rule.match !== "^/?(.*)$" || rule.replace !== "{locale}/$1") {
      fail(`${selector} must map navigation paths to {locale}/$1`);
    }
  }
}

function assertNavigationCoverage(): void {
  const docs = asRecord(readJson(docsPath), "docs.json");
  const navigation = asRecord(docs.navigation, "docs.json navigation");
  if (!Array.isArray(navigation.languages)) {
    fail("docs.json navigation.languages must be an array");
  }

  const english = navigation.languages.find((entry) => {
    return Boolean(entry && typeof entry === "object" && !Array.isArray(entry) && entry.language === "en");
  });
  if (!english) {
    fail("docs.json must contain an English navigation entry");
  }

  const visitedFiles = new Set<string>();
  let labelCount = 0;

  function visit(value: unknown, sourceDirectory: string): void {
    if (Array.isArray(value)) {
      for (const entry of value) visit(entry, sourceDirectory);
      return;
    }

    if (!value || typeof value !== "object") return;
    const record = value as Record<string, unknown>;

    if (typeof record.$ref === "string") {
      const referencedPath = path.resolve(sourceDirectory, record.$ref);
      const relativePath = path.relative(repositoryRoot, referencedPath);
      if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
        fail(`navigation reference escapes the repository: ${record.$ref}`);
      }
      if (!fs.existsSync(referencedPath)) {
        fail(`navigation reference does not exist: ${relativePath}`);
      }
      if (visitedFiles.has(referencedPath)) return;
      visitedFiles.add(referencedPath);
      visit(readJson(referencedPath), path.dirname(referencedPath));
      return;
    }

    for (const [key, entry] of Object.entries(record)) {
      if (translatableKeys.includes(key as (typeof translatableKeys)[number])) {
        if (typeof entry !== "string" || entry.trim() === "") {
          fail(`${key} in the English navigation must be a non-empty string`);
        }
        labelCount += 1;
      }
      visit(entry, sourceDirectory);
    }
  }

  visit(english, repositoryRoot);
  if (labelCount === 0) {
    fail("the English navigation contains no translatable labels");
  }

  console.log(
    `check-gt-navigation: ${labelCount} labels across ${visitedFiles.size} referenced navigation files`,
  );
}

assertTranslationSchema();
assertNavigationCoverage();
