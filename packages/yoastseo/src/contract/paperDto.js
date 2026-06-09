import { isUndefined } from "lodash";
import { z } from "zod";
import Paper from "../values/Paper.js";

/**
 * Serializable input contract for the analysis engine.
 *
 * The core surface is platform-neutral, but the contract also carries a few **optional, deprecated**
 * WordPress-transitional fields (`wpBlocks`, `shortcodes`, `isFrontPage`). They're included because they
 * are real analysis *inputs* — they change the resulting scores for WordPress content (e.g. shortcodes are
 * stripped before word-counting/keyphrase matching; blocks drive tree construction). So a remote/API
 * analysis of a WordPress page can only reproduce the in-browser scores if it can send them.
 * They are marked deprecated as they will be removed once the engine's structured content (blocks, shortcodes)
 * is fully neutral and optional, and the front page gets a proper context-aware assessment.
 *
 * Two validation tiers (see the issue): structural validity is enforced here —
 * wrong types, malformed payloads, and unknown keys throw at the boundary. Per
 * assessment field needs are NOT enforced: every field except `text` is optional,
 * so a consumer that omits e.g. `keyphrase` simply receives no keyphrase
 * assessments, matching the engine's existing graceful-skip behaviour.
 *
 * `.strict()` rejects unknown keys, catching typos (e.g. `keyphrse`).
 * The one blessed exception is `keyword`: a deprecated alias for `keyphrase`, accepted so
 * existing consumers (which speak the engine's `keyword`) can adopt the contract
 * without renaming. They will be removed at a future major once they migrate to `keyphrase`.
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
	// Open-ended extensibility bag (e.g. product identifiers/SKU data, read by the product assessments).
	// Validated as an object only — its contents are intentionally unchecked, because typing the inner keys
	// would couple the contract to platform-specific (product/Shopify) shapes.
	customData: z.record( z.unknown() ).optional().describe( "Open-ended custom data; contents are not validated." ),
	// WordPress-transitional fields — optional and DEPRECATED. They are real analysis inputs (they change
	// WP scores), so they're in the contract for browser/remote result parity; #264's neutral structured
	// content will replace them. Kept optional so non-WP consumers simply omit them.
	wpBlocks: z.array( z.unknown() ).optional().describe( "Deprecated (WP-transitional, see #264): WordPress block-editor blocks." ),
	shortcodes: z.array( z.string() ).optional().describe( "Deprecated (WP-transitional, see #264): shortcode tags present in the text." ),
	isFrontPage: z.boolean().optional().describe( "Deprecated (WP-transitional, see #264): whether the page is the site front page." ),
	// `siteUrl` / `domain` are intentionally NOT in the contract yet: no consumer feeds them through Paper
	// today and no assessment reads them. They belong to the competing-links assessment, which currently
	// gets the site URL from context. Add them (full URL incl. scheme vs bare host — see #97) as part of
	// that assessment's refactor, when there is a real reader to shape the semantics against.
} ).strict();

/**
 * @typedef {import("zod").infer<typeof paperDtoSchema>} PaperDTO
 */

/**
 * The keys the base contract handles itself. Anything else a consumer adds via `paperDtoSchema.extend()`
 * is treated as a pass-through extra by `createToPaper` and copied onto the Paper's attributes verbatim.
 * Derived from the schema so it stays in sync automatically.
 *
 * @type {Set<string>}
 */
const BASE_KEYS = new Set( Object.keys( paperDtoSchema.shape ) );

/**
 * Builds a `toPaper` mapper bound to a given schema, so consumers that register their own analyses/assessments can
 * extend the contract with extra input fields and have those fields validated and passed through to Paper.
 *
 * Pass `paperDtoSchema.extend({ myField: z.string() })`: the extended schema validates the extra field
 * (and, being a strict object, still rejects genuinely unknown keys), and any key not handled by the base
 * contract is copied verbatim onto the Paper's attributes — where a consumer's custom assessment can read
 * it via `paper._attributes.myField`. The base `keyphrase` -> `keyword` mapping and the rest of the neutral
 * surface are applied exactly as in {@link toPaper}.
 *
 * @param {import("zod").ZodType} [schema] The schema to validate against. Defaults to the base contract.
 * @returns {(dto: object) => Paper} A mapper that validates `dto` and returns the constructed Paper.
 */
export function createToPaper( schema = paperDtoSchema ) {
	return function( dto ) {
		const data = schema.parse( dto );

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
			customData: data.customData,
			wpBlocks: data.wpBlocks,
			shortcodes: data.shortcodes,
			isFrontPage: data.isFrontPage,
		};

		// Consumer-defined extra fields (validated by the extended schema) are passed through verbatim.
		Object.keys( data ).forEach( ( key ) => {
			if ( ! BASE_KEYS.has( key ) ) {
				attributes[ key ] = data[ key ];
			}
		} );

		return new Paper( data.text, attributes );
	};
}

/**
 * Validates a PaperDTO and maps it onto the engine's internal Paper.
 *
 * This is the single place that knows how contract fields land on Paper attributes
 * (notably `keyphrase` -> `keyword`); the engine, assessors, and researches are
 * untouched. Throws a `ZodError` when the payload is structurally invalid.
 * Absent optional fields are left to Paper's own defaults, so missing inputs degrade
 * gracefully rather than throwing.
 *
 * Consumers that need extra, validated input fields for their own assessments should build a mapper with
 * {@link createToPaper} and an extended schema instead.
 *
 * @param {PaperDTO} dto The serializable input contract.
 * @returns {Paper} The constructed Paper.
 */
export const toPaper = createToPaper();
