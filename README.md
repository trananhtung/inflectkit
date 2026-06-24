# inflectkit

English word inflection: pluralize, singularize, ordinalize, camelize, underscore, humanize, titleize, classify. Zero dependencies, TypeScript.

[![npm](https://img.shields.io/npm/v/inflectkit)](https://www.npmjs.com/package/inflectkit)
[![npm downloads](https://img.shields.io/npm/dw/inflectkit)](https://www.npmjs.com/package/inflectkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Why inflectkit?

| Package | Weekly downloads | Problem |
|---------|-----------------|---------|
| `inflection` | 5.3M/week | Old API, cumbersome types |
| `inflected` | 1.7M/week | **Abandoned since 2021**, requires `@types/inflected` |
| `inflectkit` | — | Modern TypeScript-first, zero deps, extensible |

Port of Ruby's `ActiveSupport::Inflector` + Python's `inflect`.

## Install

```bash
npm install inflectkit
```

## Quick start

```ts
import { pluralize, singularize, ordinalize, camelize, underscore } from "inflectkit";

pluralize("post")        // "posts"
pluralize("cat", 1)      // "cat"   (singular when count === 1)
pluralize("cat", 3)      // "cats"
singularize("people")    // "person"
singularize("matrices")  // "matrix"
ordinalize(1)            // "1st"
ordinalize(11)           // "11th"
ordinalize(21)           // "21st"
camelize("foo_bar")      // "FooBar"
camelize("foo_bar", false) // "fooBar"
underscore("FooBar")     // "foo_bar"
```

## All functions

```ts
import {
  pluralize, singularize, ordinalize,
  camelize, underscore, dasherize,
  humanize, titleize, tableize, classify,
  numberWithDelimiter,
  defaultInflector, Inflector,
} from "inflectkit";

// pluralize
pluralize("post")                // "posts"
pluralize("octopus")             // "octopi"
pluralize("sheep")               // "sheep"  (uncountable)
pluralize("child")               // "children"
pluralize("bus")                 // "buses"
pluralize("matrix")              // "matrices"
pluralize("quiz")                // "quizzes"
pluralize("person")              // "people"
pluralize("foot")                // "feet"
pluralize("cat", 1)              // "cat"    (count overload)
pluralize("cat", 2)              // "cats"

// singularize
singularize("posts")             // "post"
singularize("people")            // "person"
singularize("children")          // "child"
singularize("octopi")            // "octopus"
singularize("matrices")          // "matrix"
singularize("fish")              // "fish"   (uncountable)

// ordinalize
ordinalize(1)   // "1st"
ordinalize(2)   // "2nd"
ordinalize(3)   // "3rd"
ordinalize(4)   // "4th"
ordinalize(11)  // "11th"
ordinalize(21)  // "21st"
ordinalize(101) // "101st"

// camelize
camelize("foo_bar")         // "FooBar"
camelize("foo_bar", false)  // "fooBar"
camelize("foo/bar")         // "Foo::Bar"

// underscore
underscore("FooBar")        // "foo_bar"
underscore("Foo::Bar")      // "foo/bar"

// dasherize
dasherize("foo_bar")        // "foo-bar"

// humanize
humanize("foo_bar")         // "Foo bar"
humanize("author_id")       // "Author"   (strips _id)

// titleize
titleize("foo_bar_baz")     // "Foo Bar Baz"
titleize("FooBar")          // "Foo Bar"

// tableize — model name → table name
tableize("RawScaledScorer") // "raw_scaled_scorers"
tableize("Person")          // "people"

// classify — table name → model name
classify("raw_scaled_scorers") // "RawScaledScorer"
classify("people")             // "Person"

// numberWithDelimiter
numberWithDelimiter(1234567)       // "1,234,567"
numberWithDelimiter(1234567, ".")  // "1.234.567"
```

## Custom rules and irregulars

```ts
import { Inflector } from "inflectkit";

// Create an independent inflector with custom rules
const inf = new Inflector();

// Custom irregular pair
inf.addIrregular("cactus", "cactuses");
inf.pluralize("cactus");  // "cactuses"
inf.singularize("cactuses");  // "cactus"

// Uncountable words
inf.addUncountable("broccoli");
inf.addUncountable(["kale", "quinoa"]);
inf.pluralize("broccoli");  // "broccoli"

// Custom regex rules
inf.addPluralRule(/(ox)$/i, "$1en");
inf.addSingularRule(/(ox)en$/i, "$1");
```

Or extend the shared default inflector:

```ts
import { defaultInflector } from "inflectkit";
defaultInflector.addIrregular("goose", "geese");
```

## Rails-compatible

`tableize`, `classify`, `camelize`, `underscore`, `humanize`, and `titleize` are fully compatible with Ruby's `ActiveSupport::Inflector`.

```ts
// Rails conventions
tableize("LineItem")    // "line_items"
classify("line_items")  // "LineItem"
tableize("Mouse")       // "mice"
classify("mice")        // "Mouse"
```

## Built-in irregulars

Includes all common English irregulars:

`person → people`, `man → men`, `child → children`, `foot → feet`, `tooth → teeth`, `goose → geese`, `mouse → mice`, `leaf → leaves`, `knife → knives`, `wife → wives`, `life → lives`, `half → halves`, `cactus → cacti`, `focus → foci`, `fungus → fungi`, `analysis → analyses`, `thesis → theses`, `crisis → crises` …

## Built-in uncountables

`equipment`, `information`, `rice`, `money`, `species`, `series`, `fish`, `sheep`, `deer`, `aircraft`, `news`, `politics`, `physics`, `mathematics` …

## License

MIT
