export interface InterpolationResult {
  content: string;
  replacements: number;
}

const VARIABLE_NAME = /^[A-Za-z0-9_-]+$/;
const VARIABLE_REFERENCE = /\{\{([A-Za-z0-9_-]+)\}\}/g;

export function readDocsVariables(value: unknown, source: string): Record<string, string> | undefined {
  if (value === undefined) return undefined;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${source}: variables must be an object of string values`);
  }

  const variables: Record<string, string> = {};
  for (const [name, replacement] of Object.entries(value)) {
    if (!VARIABLE_NAME.test(name)) {
      throw new Error(`${source}: variable name "${name}" contains unsupported characters`);
    }
    if (typeof replacement !== "string") {
      throw new Error(`${source}: variable "${name}" must have a string value`);
    }
    variables[name] = replacement;
  }
  return variables;
}

/** Replace Mintlify-style `{{name}}` references with values from `docs.json`. */
export function interpolateDocsVariables(
  content: string,
  variables: Record<string, string>,
  source: string,
): InterpolationResult {
  let replacements = 0;
  const interpolated = content.replace(VARIABLE_REFERENCE, (_reference, name: string) => {
    if (!Object.hasOwn(variables, name)) {
      throw new Error(`${source}: variable "${name}" is not defined in docs.json`);
    }
    replacements++;
    return variables[name];
  });
  return { content: interpolated, replacements };
}
