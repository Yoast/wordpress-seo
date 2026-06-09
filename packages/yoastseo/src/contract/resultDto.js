import { z } from "zod";
import scoreToRating from "../scoring/interpreters/scoreToRating.js";

/**
 * @typedef {import("../values/AssessmentResult").default} AssessmentResult
 */

/**
 * Serializable shape of a single highlighting mark, mirroring `Mark.serialize()`.
 *
 * The schema is intentionally non-strict: `Mark.serialize()` also emits a `_parseClass` transport key,
 * which is stripped here so the contract carries a clean, transport-agnostic shape.
 */
const markSchema = z.object( {
	original: z.string().describe( "The original, unmarked source text." ),
	marked: z.string().describe( "The text with highlighting markup applied." ),
	fieldsToMark: z.array( z.string() ).optional().describe( "The fields the mark applies to." ),
	position: z.unknown().optional().describe( "Source-code range for position-based highlighting." ),
} );

/**
 * Serializable output contract for the analysis engine: the stable shape of a single `AssessmentResult`.
 *
 * This is the result-side sibling of the `PaperDTO` input contract. It exposes only the result-intrinsic
 * surface a non-WordPress consumer needs, and folds two interpretation/selection concerns into the boundary
 * so they cannot drift:
 * - `rating` is the interpreted score (a pure function of `score`); it is computed in {@link toResultDTO}
 *   and never stored on the result, so it can never disagree with `score`.
 * - `isOptimizable` and `isBeta` are the engine's neutral per-result UI-eligibility signals (mapped from the
 *   deprecated `hasAIFixes()`/`hasBetaBadge()` getters); presentation stays a consumer concern.
 *
 * The schema is deliberately NOT `.strict()`: unlike the input contract, the engine produces this payload, so
 * there is no consumer typo to catch — and the non-strict mark schema relies on extra keys being stripped.
 */
export const resultDtoSchema = z.object( {
	identifier: z.string().describe( "Stable assessment id, e.g. 'keyphraseLength'." ),
	score: z.number().describe( "Raw engine score. Prefer `rating` for display." ),
	rating: z.enum( [ "error", "feedback", "bad", "ok", "good" ] )
		.describe( "Interpreted score: error=-1, feedback=0, bad=1-4, ok=5-7, good>7." ),
	text: z.string().describe( "Feedback message for this result." ),
	marks: z.array( markSchema ).default( [] ).describe( "Highlighting payload for this result." ),
	editFieldName: z.string().default( "" )
		.describe( "Neutral target field for the edit/jump action ('' when none); matches the input-contract field names." ),
	editFieldAriaLabel: z.string().default( "" )
		.describe( "Pre-translated aria-label for the edit/jump action ('' when none). i18n caveat: like `text`, this " +
			"is a translated string; a future i18n contract may replace it with a key derived from `editFieldName`." ),
	isOptimizable: z.boolean().default( false )
		.describe( "Whether an automated fix is available for this result (engine-computed, score-gated)." ),
	isBeta: z.boolean().default( false )
		.describe( "Whether this result is from an assessment still in beta/experimental status." ),
} );

/**
 * @typedef {import("zod").infer<typeof resultDtoSchema>} ResultDTO
 */

/**
 * Maps an engine `AssessmentResult` onto the stable, serializable `ResultDTO`.
 *
 * This is the single place that knows how the engine's result surface lands on the contract: it interprets
 * `score` into `rating`, maps the neutral `isOptimizable`/`isBeta` signals off the (deprecated) branded
 * getters, and serializes marks into their transport-agnostic shape. The value object stays uninterpreted.
 *
 * Intended for results from `assessor.getValidResults()`, which only yields results with a numeric score, so
 * `rating` is always one of the enum values. Throws a `ZodError` if the produced payload is structurally
 * invalid.
 *
 * @param {AssessmentResult} result The result to map.
 *
 * @returns {ResultDTO} The validated, consumer-facing result.
 */
export function toResultDTO( result ) {
	return resultDtoSchema.parse( {
		identifier: result.getIdentifier(),
		score: result.getScore(),
		rating: scoreToRating( result.getScore() ),
		text: result.getText(),
		marks: result.getMarks().map( mark => mark.serialize() ),
		// Always present (the getters return "" when unset), so the shape stays stable for consumers.
		editFieldName: result.getEditFieldName(),
		editFieldAriaLabel: result.getEditFieldAriaLabel(),
		isOptimizable: result.isOptimizable(),
		isBeta: result.isBeta(),
	} );
}
