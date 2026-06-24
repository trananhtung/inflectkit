export { Inflector } from "./inflector.js";
export type { Rule } from "./rules.js";

// ── Default instance + top-level convenience functions ────────────────────────

import { Inflector } from "./inflector.js";

/** The shared default Inflector instance. Modify via `defaultInflector.addIrregular(...)` etc. */
export const defaultInflector = new Inflector();

/** Pluralize an English word. Pass `count` to auto-select singular when count === 1. */
export function pluralize(word: string, count?: number): string {
  return defaultInflector.pluralize(word, count);
}

/** Singularize an English word. */
export function singularize(word: string): string {
  return defaultInflector.singularize(word);
}

/** Return ordinal string: `1 → "1st"`, `2 → "2nd"`, `3 → "3rd"`, `4 → "4th"` … */
export function ordinalize(n: number): string {
  return defaultInflector.ordinalize(n);
}

/**
 * CamelCase a word.
 * - `"foo_bar"` → `"FooBar"` (upperFirst = true, default)
 * - `"foo_bar"` → `"fooBar"` (upperFirst = false)
 */
export function camelize(word: string, upperFirst?: boolean): string {
  return defaultInflector.camelize(word, upperFirst);
}

/** `"FooBar"` → `"foo_bar"` */
export function underscore(word: string): string {
  return defaultInflector.underscore(word);
}

/** `"foo_bar"` → `"foo-bar"` */
export function dasherize(word: string): string {
  return defaultInflector.dasherize(word);
}

/** `"foo_bar_id"` → `"Foo bar"` (capitalize first, strip _id) */
export function humanize(word: string): string {
  return defaultInflector.humanize(word);
}

/** `"foo bar"` → `"Foo Bar"` */
export function titleize(word: string): string {
  return defaultInflector.titleize(word);
}

/** `"RawScaledScorer"` → `"raw_scaled_scorers"` */
export function tableize(word: string): string {
  return defaultInflector.tableize(word);
}

/** `"raw_scaled_scorers"` → `"RawScaledScorer"` */
export function classify(word: string): string {
  return defaultInflector.classify(word);
}

/** `1234567` → `"1,234,567"` */
export function numberWithDelimiter(n: number, delimiter?: string): string {
  return defaultInflector.numberWithDelimiter(n, delimiter);
}
