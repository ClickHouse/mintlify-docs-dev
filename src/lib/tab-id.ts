const requestCounters = new WeakMap<object, number>();

/** Return a page-local stable ID for a server-rendered tab group. */
export function nextTabId(locals: object): string {
  const index = requestCounters.get(locals) ?? 0;
  requestCounters.set(locals, index + 1);
  return `nb-tabs-${index}`;
}
