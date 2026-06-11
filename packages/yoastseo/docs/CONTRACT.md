# Serializable contract (`yoastseo/contract`)

Non-WordPress consumers (a hosted web API, the Shopify app, the Google Docs extension, …) can exchange documented, serializable shapes with the analysis engine instead of constructing `Paper` objects and hand-rolling result view models. The contract is a separate, **opt-in** entry point (`yoastseo/contract`), so its validation dependency (`zod`) is only loaded by consumers that import it — the package root, and therefore the WordPress bundle, is unaffected.

It has two halves: an **input** contract (`PaperDto` → `toPaper`) and an **output** contract (`ResultDto` → `toResultDto`). See also the [`PaperDto`](GLOSSARY.md#paperdto) and [`ResultDto`](GLOSSARY.md#resultdto) glossary entries.

## Input contract — `PaperDto` / `toPaper`

Non-WordPress consumers can send a documented, serializable input shape — a `PaperDto` — instead of constructing a `Paper` by hand.

```js
import { toPaper } from "yoastseo/contract";

// `toPaper` validates the input and returns an engine `Paper`.
const paper = toPaper( {
    text: "Text to analyze",
    keyphrase: "analyze",
    locale: "en_US",
} );

// `paper` can now be passed to `worker.analyze( paper )` or `assessor.assess( paper )`.
```

Notes:
- **Covers the analysis inputs.** The neutral core is `text`, `keyphrase`, `synonyms`, `locale`, `description`, `title`, `slug`, `permalink`, `titleWidth`, `textTitle`, `date`, `writingDirection`, and an open `customData` object. The contract also carries optional, **deprecated** WordPress-transitional fields (`wpBlocks`, `shortcodes`, `isFrontPage`): they are real analysis inputs that change WordPress scores, so a remote/API analysis needs them to reproduce in-browser results. They are marked deprecated. Non-WordPress consumers simply omit them.
- **`keyphrase` is the canonical field name.** `keyword` is accepted as a deprecated alias so existing consumers can adopt the contract without renaming.
- **Validation.** `toPaper` throws on structurally invalid input (wrong types, unknown keys). Omitting an optional field is fine — the assessments that need it are simply skipped, matching the engine's existing behaviour.
- **Extensible.** A consumer that registers its own assessments can validate extra fields by extending the schema:
  ```js
  import { z } from "zod";
  import { paperDtoSchema, createToPaper } from "yoastseo/contract";

  const toPaper = createToPaper( paperDtoSchema.extend( { myField: z.string() } ) );
  const paper = toPaper( { text: "…", myField: "…" } ); // `myField` is validated and available on the Paper
  ```

## Output contract — `ResultDto` / `toResultDto`

The same entry point exposes a documented, serializable **output** shape — a `ResultDto` — for the results an assessor returns. It is the result-side sibling of `PaperDto`: instead of each consumer hand-rolling a view model from an `AssessmentResult`, the `toResultDto` boundary maps one result to a stable, consumer-facing shape.

```js
import { toResultDto } from "yoastseo/contract";

const results = seoAssessor.getValidResults().map( toResultDto );
// => [ { identifier, score, rating, text, marks, editFieldName, editFieldAriaLabel, isOptimizable, isBeta }, … ]
```

Notes:
- **`rating` is interpreted in the boundary.** It is a pure function of `score` (`error`/`feedback`/`bad`/`ok`/`good`), computed by `toResultDto` and never stored on the result, so it cannot drift from `score`. Consumers no longer need to call `interpreters.scoreToRating` themselves.
- **Neutral signal names.** `isOptimizable` (an automated fix is available for this result) and `isBeta` (the assessment is still in beta) are the contract names for the engine signals exposed by the deprecated `AssessmentResult#hasAIFixes`/`#hasBetaBadge` getters. Presentation stays a consumer concern.
- **`marks`** carry the highlighting payload (`original`, `marked`, `fieldsToMark`, optional `position`) in a transport-agnostic shape. `editFieldName` is the neutral target field for an edit/jump action (an empty string when the result has none).
- **No separate edit-affordance flag.** There is intentionally no `hasJumps`-style boolean: render the edit/jump action when `editFieldName` is non-empty (`Boolean( result.editFieldName )`). The engine only ever sets a jump target together with the affordance, so the presence of `editFieldName` is the single source of truth.
- **i18n caveat.** Like `text`, `editFieldAriaLabel` is a pre-translated (`wordpress-seo` textdomain) string carried as-is for now; a future i18n contract may replace it with a stable key derived from `editFieldName`.

> **Deprecation — `AssessmentResult#hasAIFixes()` / `#hasBetaBadge()`.** These UI-branded getters are deprecated in favour of the neutral `isOptimizable()` / `isBeta()`. Consumers that read the signals directly off an `AssessmentResult` (instead of via `ResultDto`) should migrate. The old getters still return the same values but log a once-per-session console deprecation warning, and will be removed in a future major version. The `setHasAIFixes`/`setHasBetaBadge` setters and the worker-transport (`serialize`/`parse`) keys are unchanged.
