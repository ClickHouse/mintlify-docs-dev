/**
 * The only `tslib` helper used by `@tanem/svg-injector`.
 *
 * The injector calls this with ordinary string arrays, so concatenating a
 * materialized copy provides the spread semantics it needs without requiring
 * Rolldown to resolve a transitive pnpm package at build time.
 */
export function __spreadArray<T>(to: T[], from: ArrayLike<T>, _pack?: boolean): T[] {
  return to.concat(Array.from(from));
}
