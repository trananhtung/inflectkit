import { Rule, DEFAULT_PLURAL, DEFAULT_SINGULAR, DEFAULT_IRREGULAR, DEFAULT_UNCOUNTABLE } from "./rules.js";

// ── Inflector class ────────────────────────────────────────────────────────────

export class Inflector {
  private _plural: Rule[] = [...DEFAULT_PLURAL].reverse();
  private _singular: Rule[] = [...DEFAULT_SINGULAR].reverse();
  private _irregulars = new Map<string, string>(); // singular → plural
  private _uncountable = new Set<string>();

  constructor() {
    for (const [s, p] of DEFAULT_IRREGULAR) this._irregulars.set(s.toLowerCase(), p.toLowerCase());
    for (const w of DEFAULT_UNCOUNTABLE) this._uncountable.add(w.toLowerCase());
  }

  // ── Configuration ────────────────────────────────────────────────────────────

  addPluralRule(rule: RegExp | string, replacement: string): this {
    this._plural.unshift({ regex: typeof rule === "string" ? new RegExp(rule, "i") : rule, replacement });
    return this;
  }

  addSingularRule(rule: RegExp | string, replacement: string): this {
    this._singular.unshift({ regex: typeof rule === "string" ? new RegExp(rule, "i") : rule, replacement });
    return this;
  }

  addIrregular(singular: string, plural: string): this {
    this._irregulars.set(singular.toLowerCase(), plural.toLowerCase());
    return this;
  }

  addUncountable(word: string | string[]): this {
    const words = Array.isArray(word) ? word : [word];
    for (const w of words) this._uncountable.add(w.toLowerCase());
    return this;
  }

  // ── Core transforms ──────────────────────────────────────────────────────────

  /** Pluralize an English word. Pass `count` to auto-select singular when count === 1. */
  pluralize(word: string, count?: number): string {
    if (count === 1) return word;
    return this._applyRules(word, "plural");
  }

  /** Singularize an English word. */
  singularize(word: string): string {
    return this._applyRules(word, "singular");
  }

  /** Return `"1st"`, `"2nd"`, `"3rd"`, `"4th"` etc. */
  ordinalize(n: number): string {
    const abs = Math.abs(Math.trunc(n));
    const mod100 = abs % 100;
    if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
    switch (abs % 10) {
      case 1: return `${n}st`;
      case 2: return `${n}nd`;
      case 3: return `${n}rd`;
      default: return `${n}th`;
    }
  }

  /**
   * CamelCase a word.
   * - `"foo_bar"` → `"FooBar"` (upperFirst = true, default)
   * - `"foo_bar"` → `"fooBar"` (upperFirst = false)
   */
  camelize(word: string, upperFirst = true): string {
    let result = word
      .replace(/[_-](\w)/g, (_, c: string) => c.toUpperCase())
      .replace(/\/(\w)/g, (_, c: string) => `::${c.toUpperCase()}`);
    return upperFirst
      ? result.charAt(0).toUpperCase() + result.slice(1)
      : result.charAt(0).toLowerCase() + result.slice(1);
  }

  /** `"FooBar"` → `"foo_bar"` */
  underscore(word: string): string {
    return word
      .replace(/::/g, "/")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
      .replace(/([a-z\d])([A-Z])/g, "$1_$2")
      .replace(/-/g, "_")
      .toLowerCase();
  }

  /** `"foo_bar"` → `"foo-bar"` */
  dasherize(word: string): string {
    return word.replace(/_/g, "-");
  }

  /**
   * Make a db column name human-readable.
   * `"foo_bar_id"` → `"Foo bar"` (capitalize first word, strip trailing _id)
   */
  humanize(word: string): string {
    let result = word
      .replace(/_id$/i, "")
      .replace(/_/g, " ")
      .trim();
    return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
  }

  /** Titleize every word: `"foo bar baz"` → `"Foo Bar Baz"` */
  titleize(word: string): string {
    return this.humanize(this.underscore(word))
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  /**
   * Convert model name to table name.
   * `"RawScaledScorer"` → `"raw_scaled_scorers"`
   */
  tableize(word: string): string {
    return this.pluralize(this.underscore(word));
  }

  /**
   * Convert table name to class name.
   * `"raw_scaled_scorers"` → `"RawScaledScorer"`
   */
  classify(word: string): string {
    return this.camelize(this.singularize(word.replace(/.*\./, "")));
  }

  /**
   * Turn a number into a string with a thousands separator.
   * `1234567` → `"1,234,567"`
   */
  numberWithDelimiter(n: number, delimiter = ","): string {
    const [int, dec] = String(n).split(".");
    const formatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, delimiter);
    return dec !== undefined ? `${formatted}.${dec}` : formatted;
  }

  // ── Internal ─────────────────────────────────────────────────────────────────

  private _applyRules(word: string, type: "plural" | "singular"): string {
    if (!word || !word.trim()) return word;

    const lower = word.toLowerCase();

    // Uncountable
    if (this._uncountable.has(lower)) return word;

    // Irregular
    if (type === "plural") {
      for (const [s, p] of this._irregulars) {
        if (lower === s) return this._matchCase(word, p);
        if (lower === p) return word;
      }
    } else {
      for (const [s, p] of this._irregulars) {
        if (lower === p) return this._matchCase(word, s);
        if (lower === s) return word;
      }
    }

    // Rules
    const rules = type === "plural" ? this._plural : this._singular;
    for (const { regex, replacement } of rules) {
      if (regex.test(word)) {
        return word.replace(regex, replacement);
      }
    }

    return word;
  }

  /** Preserve the capitalisation of the original when applying a matched form. */
  private _matchCase(original: string, result: string): string {
    if (original === original.toUpperCase()) return result.toUpperCase();
    if (original[0] === original[0].toUpperCase()) {
      return result.charAt(0).toUpperCase() + result.slice(1);
    }
    return result;
  }
}
