import { isEmpty, isUndefined } from "lodash";
import { z } from "zod";
import Paper from "../values/Paper.js";

/**
 * Serializable, platform-neutral input contract for the analysis engine.
 *
 * Proof of concept for lingo-other-tasks#634. zod is the source of truth; a JSON
 * Schema can be generated from it for non-JS / wire consumers.
 *
 * Two validation tiers (see the issue): structural validity is enforced here —
 * wrong types, malformed payloads, and unknown keys throw at the boundary. Per
 * assessment field needs are NOT enforced: every field except `text` is optional,
 * so a consumer that omits e.g. `keyphrase` simply receives no keyphrase
 * assessments, matching the engine's existing graceful-skip behaviour.
 *
 * `.strict()` rejects unknown keys, catching typos (e.g. `keyphrse`). The one
 * blessed exception is `keyword`: a deprecated alias for `keyphrase`, accepted so
 * existing consumers (which speak the engine's `keyword`) can adopt the contract
 * without renaming. Remove it at a future major once they migrate to `keyphrase`.
 */
export const paperDtoSchema = z.object( {
	text: z.string().describe( "The content to analyse (HTML or plain text)." ),
	keyphrase: z.string().optional().describe( "The focus keyphrase." ),
	keyword: z.string().optional().describe( "Deprecated alias for `keyphrase`; prefer `keyphrase`." ),
	synonyms: z.string().optional().describe( "Comma-separated synonyms of the keyphrase." ),
	locale: z.string().optional().describe( "Locale, e.g. \"en_US\". The engine defaults to \"en_US\" when absent." ),
	description: z.string().optional().describe( "The SEO meta description." ),
	title: z.string().optional().describe( "The SEO title." ),
	slug: z.string().optional().describe( "The URL slug." ),
	permalink: z.string().optional().describe( "The full permalink URL of the content." ),
	titleWidth: z.number().optional().describe( "Rendered width of the SEO title in pixels." ),
	textTitle: z.string().optional().describe( "The title of the text or article itself." ),
	date: z.string().optional().describe( "Publication date." ),
	writingDirection: z.enum( [ "LTR", "RTL" ] ).optional().describe( "Writing direction of the content." ),
	siteUrl: z.string().optional().describe( "Full site URL including scheme, e.g. \"https://example.com\"." ),
	domain: z.string().optional().describe( "Bare host without scheme, e.g. \"example.com\"." ),
} ).strict();

/**
 * @typedef {import("zod").infer<typeof paperDtoSchema>} PaperDTO
 */

/**
 * Validates a PaperDTO and maps it onto the engine's internal Paper.
 *
 * This is the single place that knows how contract fields land on Paper attributes
 * (notably `keyphrase` -> `keyword`); the engine, assessors, and researches are
 * untouched. Throws a `ZodError` when the payload is structurally invalid. Absent
 * optional fields are left to Paper's own defaults, so missing inputs degrade
 * gracefully rather than throwing.
 *
 * @param {PaperDTO} dto The serializable input contract.
 * @returns {Paper} The constructed Paper, ready for `assessor.assess( paper )`.
 */
export function toPaper( dto ) {
	const data = paperDtoSchema.parse( dto );

	// `keyphrase` is canonical; `keyword` is a deprecated alias. Keyphrase wins when both are supplied.
	const keyphrase = isUndefined( data.keyphrase ) ? data.keyword : data.keyphrase;

	const attributes = {
		keyword: keyphrase,
		synonyms: data.synonyms,
		locale: data.locale,
		description: data.description,
		title: data.title,
		slug: data.slug,
		permalink: data.permalink,
		titleWidth: data.titleWidth,
		textTitle: data.textTitle,
		date: data.date,
		writingDirection: data.writingDirection,
	};

	// `siteUrl`/`domain` have no Paper attribute today — competing-links reads the
	// site URL from WordPress context. Stash them in customData as a placeholder
	// until that engine-side plumbing exists (lingo-other-tasks#634).
	const customData = {};
	if ( ! isUndefined( data.siteUrl ) ) {
		customData.siteUrl = data.siteUrl;
	}
	if ( ! isUndefined( data.domain ) ) {
		customData.domain = data.domain;
	}
	if ( ! isEmpty( customData ) ) {
		attributes.customData = customData;
	}

	return new Paper( data.text, attributes );
}
