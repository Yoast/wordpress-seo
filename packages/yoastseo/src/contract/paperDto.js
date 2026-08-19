import { z } from "zod";
import Paper from "../values/Paper.js";
import { productDataSchema } from "./productData.js";
import { productImageSchema } from "./productImages.js";

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
 * wrong types, malformed payloads, and unknown keys throw at the boundary.
 * Per-assessment field needs are NOT enforced: every field except `text` is optional,
 * so a consumer that omits, e.g. `keyphrase` simply receives no keyphrase
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
	// Opaque data bag for consumers that register their own custom analysis, e.g., assessments. Validated as an object only —
	// its contents are intentionally unchecked because typing the inner keys would couple the contract to
	// consumer-specific shapes.
	customData: z.record( z.unknown() ).optional().describe( "Opaque data for consumer-defined custom assessments; contents are not validated." ),
	// Typed e-commerce slice consumed by the native product assessments. Unlike `customData`, its shape IS validated
	// (see productData.js); producers that have not migrated may still send the legacy flat keys via `customData`.
	productData: productDataSchema.optional().describe( "Product analysis data for the native e-commerce assessments (Product identifiers, SKU)." ),
	// Typed image slice (see productImages.js); its shape IS validated, like `productData`. Providing it — even
	// as an empty array — scopes the image assessments to these images instead of the images in the text.
	productImages: z.array( productImageSchema ).optional().describe( "The product's own images (featured, gallery, variations). Providing this field scopes the image assessments to these images; an empty array means a product without images." ),
	// WordPress-transitional fields — optional and DEPRECATED. They are real analysis inputs (they change
	// WP scores), so they're in the contract for browser/remote result parity.
	// Kept optional so non-WP consumers simply omit them.
	wpBlocks: z.array( z.unknown() ).optional().describe( "Deprecated (WP-transitional): WordPress block-editor blocks." ),
	shortcodes: z.array( z.string() ).optional().describe( "Deprecated (WP-transitional): shortcode tags present in the text." ),
	isFrontPage: z.boolean().optional().describe( "Deprecated (WP-transitional): whether the page is the site front page." ),
} ).strict();

/**
 * @typedef {import("zod").infer<typeof paperDtoSchema>} PaperDto
 */

/**
 * Validates a PaperDto and maps it onto the engine's internal Paper.
 *
 * This is the single place that knows how contract fields land on Paper attributes
 * (notably `keyphrase` -> `keyword`); the engine, assessors, and researches are
 * untouched. Throws a `ZodError` when the payload is structurally invalid.
 * Absent optional fields are left to Paper's own defaults, so missing inputs degrade
 * gracefully rather than throwing.
 *
 * @param {PaperDto} dto The serializable input contract.
 * @returns {Paper} The constructed Paper.
 */
export function toPaper( dto ) {
	const data = paperDtoSchema.parse( dto );

	// `keyphrase` is canonical; `keyword` is a deprecated alias. Keyphrase wins when both are supplied.
	const keyphrase = data.keyphrase ?? data.keyword;

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
		productData: data.productData,
		productImages: data.productImages,
		wpBlocks: data.wpBlocks,
		shortcodes: data.shortcodes,
		isFrontPage: data.isFrontPage,
	};

	// Omit absent optional fields entirely rather than passing explicit `undefined`, so Paper's own
	// defaults apply and the constructed attributes only ever carry keys the consumer actually supplied.
	const presentAttributes = Object.fromEntries(
		Object.entries( attributes ).filter( ( [ , value ] ) => typeof value !== "undefined" )
	);

	return new Paper( data.text, presentAttributes );
}
