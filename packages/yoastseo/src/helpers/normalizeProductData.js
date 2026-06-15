import { isEmpty } from "lodash";

/**
 * @typedef {import("../values/Paper").default} Paper
 */

/**
 * The normalized product analysis data consumed by the native product assessments (Product identifiers, SKU).
 *
 * `isVariableProduct` replaces the WooCommerce-specific `productType` enum: it is the single binary distinction the
 * assessments actually need — whether the product can carry independently-identified variants. The optional
 * `canRetrieve*` keys are deliberately optional: an absent key means "retrieval is possible" (see
 * `normalizeProductData`), so they must never be defaulted to `false`. Key casing mirrors the producers and must
 * be preserved.
 *
 * @typedef {Object} ProductData
 * @property {boolean}   isVariableProduct                Whether the product can carry independently-identified variants.
 * @property {boolean}   [hasVariants]                    Whether the product currently has variants.
 * @property {boolean}   [hasGlobalIdentifier]            Whether the product has a global identifier.
 * @property {boolean}   [hasGlobalSKU]                   Whether the product has a global SKU.
 * @property {boolean}   [doAllVariantsHaveIdentifier]    Whether every variant has an identifier.
 * @property {boolean}   [doAllVariantsHaveSKU]           Whether every variant has a SKU.
 * @property {boolean}   [canRetrieveGlobalIdentifier]    Whether the global identifier can be retrieved. Absent ⇒ possible.
 * @property {boolean}   [canRetrieveGlobalSku]           Whether the global SKU can be retrieved. Absent ⇒ possible.
 * @property {boolean}   [canRetrieveVariantIdentifiers]  Whether variant identifiers can be retrieved. Absent ⇒ possible.
 * @property {boolean}   [canRetrieveVariantSkus]         Whether variant SKUs can be retrieved. Absent ⇒ possible.
 */

/**
 * Narrows a Paper's product analysis data to the `ProductData` shape consumed by the product assessments.
 *
 * Reads the first-class `productData` attribute, falling back to the legacy flat product keys in `customData` for
 * producers and npm consumers that have not migrated to the `productData` field yet. The platform-neutral
 * `isVariableProduct` boolean is derived from a legacy `productType === "variable"` when a producer has not sent it,
 * so the assessments never read `productType` directly. Optional keys are passed through untouched to preserve their
 * `undefined ≠ false` applicability semantics.
 *
 * @param {Paper} paper The paper to read the product data from.
 *
 * @returns {ProductData} The normalized product data.
 */
export default function normalizeProductData( paper ) {
	const productData = paper.getProductData();
	// Fall back to the legacy flat product keys in customData for unmigrated producers and npm consumers.
	const source = isEmpty( productData ) ? paper.getCustomData() : productData;

	return {
		...source,
		// Derive the platform-neutral boolean from the legacy productType enum when a producer has not sent it.
		isVariableProduct: source.isVariableProduct ?? ( source.productType === "variable" ),
	};
}
