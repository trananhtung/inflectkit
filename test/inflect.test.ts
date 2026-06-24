import {
  pluralize, singularize, ordinalize, camelize, underscore,
  dasherize, humanize, titleize, tableize, classify, numberWithDelimiter,
  defaultInflector, Inflector,
} from "../src/index.js";

// ── pluralize ─────────────────────────────────────────────────────────────────

describe("pluralize", () => {
  const cases: Array<[string, string]> = [
    ["post",     "posts"],
    ["octopus",  "octopi"],
    ["sheep",    "sheep"],        // uncountable
    ["word",     "words"],
    ["CamelOctopus", "CamelOctopi"],
    ["bus",      "buses"],
    ["matrix",   "matrices"],
    ["box",      "boxes"],
    ["quiz",     "quizzes"],
    ["person",   "people"],       // irregular
    ["man",      "men"],          // irregular
    ["child",    "children"],     // irregular
    ["foot",     "feet"],         // irregular
    ["tooth",    "teeth"],        // irregular
    ["move",     "moves"],        // irregular
    ["axis",     "axes"],
    ["diagnosis","diagnoses"],
    ["life",     "lives"],
    ["wife",     "wives"],
    ["knife",    "knives"],
    ["leaf",     "leaves"],
    ["half",     "halves"],
    ["fly",      "flies"],
    ["photo",    "photos"],
    ["studio",   "studios"],
    ["buffalo",  "buffalo"],    // uncountable — "buffalo" is both singular and plural
    ["deer",     "deer"],         // uncountable
    ["fish",     "fish"],         // uncountable
    ["information", "information"], // uncountable
    ["species",  "species"],      // uncountable
  ];

  test.each(cases)("pluralize(%s) → %s", (input, expected) => {
    expect(pluralize(input)).toBe(expected);
  });

  test("pluralize with count=1 returns singular", () => {
    expect(pluralize("cat", 1)).toBe("cat");
  });

  test("pluralize with count=2 returns plural", () => {
    expect(pluralize("cat", 2)).toBe("cats");
  });

  test("pluralize with count=0 returns plural", () => {
    expect(pluralize("cat", 0)).toBe("cats");
  });

  test("empty string returns empty", () => {
    expect(pluralize("")).toBe("");
  });
});

// ── singularize ───────────────────────────────────────────────────────────────

describe("singularize", () => {
  const cases: Array<[string, string]> = [
    ["posts",     "post"],
    ["octopi",    "octopus"],
    ["sheep",     "sheep"],       // uncountable
    ["words",     "word"],
    ["buses",     "bus"],
    ["matrices",  "matrix"],
    ["quizzes",   "quiz"],
    ["people",    "person"],      // irregular
    ["men",       "man"],         // irregular
    ["children",  "child"],       // irregular
    ["feet",      "foot"],        // irregular
    ["teeth",     "tooth"],       // irregular
    ["axes",      "axis"],
    ["diagnoses", "diagnosis"],
    ["lives",     "life"],
    ["wives",     "wife"],
    ["knives",    "knife"],
    ["leaves",    "leaf"],
    ["halves",    "half"],
    ["flies",     "fly"],
    ["deer",      "deer"],        // uncountable
    ["fish",      "fish"],        // uncountable
    ["information","information"],// uncountable
    ["species",   "species"],     // uncountable
    ["series",    "series"],      // uncountable
  ];

  test.each(cases)("singularize(%s) → %s", (input, expected) => {
    expect(singularize(input)).toBe(expected);
  });
});

// ── ordinalize ────────────────────────────────────────────────────────────────

describe("ordinalize", () => {
  const cases: Array<[number, string]> = [
    [1,   "1st"], [2,   "2nd"], [3,   "3rd"],
    [4,   "4th"], [5,   "5th"], [10,  "10th"],
    [11,  "11th"], [12, "12th"], [13, "13th"],
    [21,  "21st"], [22, "22nd"], [23, "23rd"],
    [100, "100th"], [101, "101st"], [111, "111th"],
    [112, "112th"], [113, "113th"], [121, "121st"],
    [0,   "0th"],
    [-1,  "-1st"], [-2, "-2nd"], [-13, "-13th"],
  ];

  test.each(cases)("ordinalize(%i) → %s", (n, expected) => {
    expect(ordinalize(n)).toBe(expected);
  });
});

// ── camelize ──────────────────────────────────────────────────────────────────

describe("camelize", () => {
  test("snake_case → CamelCase (default)", () => {
    expect(camelize("foo_bar")).toBe("FooBar");
  });

  test("snake_case → lowerCamelCase", () => {
    expect(camelize("foo_bar", false)).toBe("fooBar");
  });

  test("already CamelCase unchanged", () => {
    expect(camelize("FooBar")).toBe("FooBar");
  });

  test("multiple underscores", () => {
    expect(camelize("foo_bar_baz")).toBe("FooBarBaz");
  });

  test("namespace slash", () => {
    expect(camelize("foo/bar")).toBe("Foo::Bar");
  });

  test("single word", () => {
    expect(camelize("foo")).toBe("Foo");
  });

  test("lowercase single", () => {
    expect(camelize("foo", false)).toBe("foo");
  });
});

// ── underscore ────────────────────────────────────────────────────────────────

describe("underscore", () => {
  test("CamelCase → snake_case", () => {
    expect(underscore("FooBar")).toBe("foo_bar");
  });

  test("lowerCamel → snake_case", () => {
    expect(underscore("fooBar")).toBe("foo_bar");
  });

  test("Acronym handling", () => {
    expect(underscore("HTMLParser")).toBe("html_parser");
  });

  test("multiple words", () => {
    expect(underscore("FooBarBaz")).toBe("foo_bar_baz");
  });

  test("dashes become underscores", () => {
    expect(underscore("foo-bar")).toBe("foo_bar");
  });

  test("namespace :: → /", () => {
    expect(underscore("Foo::Bar")).toBe("foo/bar");
  });

  test("already snake_case unchanged", () => {
    expect(underscore("foo_bar")).toBe("foo_bar");
  });
});

// ── dasherize ─────────────────────────────────────────────────────────────────

describe("dasherize", () => {
  test("foo_bar → foo-bar", () => {
    expect(dasherize("foo_bar")).toBe("foo-bar");
  });

  test("multiple underscores", () => {
    expect(dasherize("foo_bar_baz")).toBe("foo-bar-baz");
  });

  test("no underscores unchanged", () => {
    expect(dasherize("foobar")).toBe("foobar");
  });
});

// ── humanize ─────────────────────────────────────────────────────────────────

describe("humanize", () => {
  test("foo_bar → Foo bar", () => {
    expect(humanize("foo_bar")).toBe("Foo bar");
  });

  test("strips trailing _id", () => {
    expect(humanize("author_id")).toBe("Author");
  });

  test("multiple words", () => {
    expect(humanize("foo_bar_baz")).toBe("Foo bar baz");
  });

  test("already human", () => {
    expect(humanize("FooBar")).toBe("Foobar");
  });
});

// ── titleize ──────────────────────────────────────────────────────────────────

describe("titleize", () => {
  test("foo bar → Foo Bar", () => {
    expect(titleize("foo bar")).toBe("Foo Bar");
  });

  test("snake_case", () => {
    expect(titleize("foo_bar_baz")).toBe("Foo Bar Baz");
  });

  test("CamelCase", () => {
    expect(titleize("FooBar")).toBe("Foo Bar");
  });
});

// ── tableize ─────────────────────────────────────────────────────────────────

describe("tableize", () => {
  test("RawScaledScorer → raw_scaled_scorers", () => {
    expect(tableize("RawScaledScorer")).toBe("raw_scaled_scorers");
  });

  test("FancyCategory → fancy_categories", () => {
    expect(tableize("FancyCategory")).toBe("fancy_categories");
  });

  test("Person → people", () => {
    expect(tableize("Person")).toBe("people");
  });
});

// ── classify ─────────────────────────────────────────────────────────────────

describe("classify", () => {
  test("raw_scaled_scorers → RawScaledScorer", () => {
    expect(classify("raw_scaled_scorers")).toBe("RawScaledScorer");
  });

  test("people → Person", () => {
    expect(classify("people")).toBe("Person");
  });

  test("fancy_categories → FancyCategory", () => {
    expect(classify("fancy_categories")).toBe("FancyCategory");
  });

  test("schema.foo_bars → FooBar (strips schema prefix)", () => {
    expect(classify("schema.foo_bars")).toBe("FooBar");
  });
});

// ── numberWithDelimiter ───────────────────────────────────────────────────────

describe("numberWithDelimiter", () => {
  test("1234567 → 1,234,567", () => {
    expect(numberWithDelimiter(1234567)).toBe("1,234,567");
  });

  test("1000 → 1,000", () => {
    expect(numberWithDelimiter(1000)).toBe("1,000");
  });

  test("999 → 999 (no delimiter needed)", () => {
    expect(numberWithDelimiter(999)).toBe("999");
  });

  test("custom delimiter", () => {
    expect(numberWithDelimiter(1234567, ".")).toBe("1.234.567");
  });

  test("decimal preserved", () => {
    expect(numberWithDelimiter(1234.56)).toBe("1,234.56");
  });
});

// ── Custom Inflector instance ─────────────────────────────────────────────────

describe("Inflector instance", () => {
  test("addIrregular", () => {
    const inf = new Inflector();
    inf.addIrregular("cactus", "cactuses");
    expect(inf.pluralize("cactus")).toBe("cactuses");
    expect(inf.singularize("cactuses")).toBe("cactus");
  });

  test("addUncountable", () => {
    const inf = new Inflector();
    inf.addUncountable("broccoli");
    expect(inf.pluralize("broccoli")).toBe("broccoli");
    expect(inf.singularize("broccoli")).toBe("broccoli");
  });

  test("addUncountable array", () => {
    const inf = new Inflector();
    inf.addUncountable(["broccoli", "kale"]);
    expect(inf.pluralize("kale")).toBe("kale");
  });

  test("addPluralRule", () => {
    const inf = new Inflector();
    inf.addPluralRule(/(ox)$/i, "$1en");
    expect(inf.pluralize("ox")).toBe("oxen");
  });

  test("addSingularRule", () => {
    const inf = new Inflector();
    inf.addSingularRule(/(ox)en$/i, "$1");
    expect(inf.singularize("oxen")).toBe("ox");
  });

  test("defaultInflector is shared", () => {
    expect(defaultInflector).toBeInstanceOf(Inflector);
    expect(pluralize("cat")).toBe(defaultInflector.pluralize("cat"));
  });

  test("instance methods are independent of default", () => {
    const inf = new Inflector();
    inf.addUncountable("widget");
    expect(inf.pluralize("widget")).toBe("widget");
    expect(pluralize("widget")).toBe("widgets"); // default unaffected
  });
});

// ── Case preservation ─────────────────────────────────────────────────────────

describe("case preservation", () => {
  test("ALLCAPS irregular preserved", () => {
    expect(pluralize("PERSON")).toBe("PEOPLE");
  });

  test("Title case irregular preserved", () => {
    expect(pluralize("Person")).toBe("People");
  });

  test("lowercase irregular stays lowercase", () => {
    expect(pluralize("person")).toBe("people");
  });
});
