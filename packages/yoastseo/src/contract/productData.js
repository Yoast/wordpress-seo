import { z } from "zod";

/**
 * Serializable contract for the product analysis data consumed by the native e-commerce SEO assessments
 * (Product identifiers, SKU). It is the e-commerce slice of the {@link PaperDto} input contract: a producer
 * (WooCommerce, Shopify, or any headless consumer) maps its own product model onto these fields, and the
 * assessments score from them without knowing the platform.
 *
 * The narrower that applies this contract at the consumption boundary, `normalizeProductData`, lives in its own
 * zod-free module so the core analysis assessments don't pull `zod` into their bundle.
 *
 * Field semantics that are load-bearing:
 * - `isVariableProduct` replaces the WooCommerce-specific `productType` enum — it is the single binary
 *   distinction the assessments need: whether the product can carry independently identified variants. It is
 *   optional on input; `normalizeProductData` resolves it (defaulting to `false`, and deriving it from a
 *   legacy `productType === "variable"` for producers that have not migrated).
 * - `productType` is accepted only as a deprecated back-compat source for `isVariableProduct`; the assessments
 *   never read it directly.
 * - The `canRetrieve*` flags are checked with a strict `=== false` guard at the call sites, so an *absent* flag
 *   means "retrieval is possible" and must never be coerced to `false`. They are kept optional here so a
 *   producer (e.g. Shopify) that omits them keeps the assessment applicable.
 *
 * `.strict()` rejects unknown keys, catching typos. Consumers that need open-ended extra data should use the
 * Paper's opaque `customData` bag instead.
 */
export const productDataSchema = z.object( {
	isVariableProduct: z.boolean().optional().describe( "Whether the product can carry independently-identified variants. Absent ⇒ false." ),
	productType: z.string().optional().describe( "Deprecated: legacy product-type slug, accepted only as a back-compat source for `isVariableProduct`." ),
	hasVariants: z.boolean().optional().describe( "Whether the product currently has variants. Absent ⇒ false." ),
	hasGlobalIdentifier: z.boolean().optional().describe( "Whether the product has a global identifier." ),
	hasGlobalSKU: z.boolean().optional().describe( "Whether the product has a global SKU." ),
	doAllVariantsHaveIdentifier: z.boolean().optional().describe( "Whether every variant has an identifier." ),
	doAllVariantsHaveSKU: z.boolean().optional().describe( "Whether every variant has a SKU." ),
	canRetrieveGlobalIdentifier: z.boolean().optional().describe( "Whether the global identifier can be retrieved. Absent ⇒ possible." ),
	canRetrieveGlobalSku: z.boolean().optional().describe( "Whether the global SKU can be retrieved. Absent ⇒ possible." ),
	canRetrieveVariantIdentifiers: z.boolean().optional().describe( "Whether variant identifiers can be retrieved. Absent ⇒ possible." ),
	canRetrieveVariantSkus: z.boolean().optional().describe( "Whether variant SKUs can be retrieved. Absent ⇒ possible." ),
} ).strict();

/**
 * @typedef {import("zod").infer<typeof productDataSchema>} ProductData
 */
