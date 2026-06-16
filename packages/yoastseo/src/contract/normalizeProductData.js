import { isEmpty } from "lodash";

/**
 * @typedef {import("../values/Paper").default} Paper
 * @typedef {import("./productData").ProductData} ProductData
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
 * This lives apart from `productData.js` on purpose: the schema there imports `zod`, but the assessments (which are
 * in the core analysis bundle) need only this narrower, so keeping it zod-free — and importing it directly rather
 * than via the contract barrel — keeps `zod` out of the core graph. It also deliberately does not run
 * `productDataSchema.parse()`: the in-editor path builds the Paper directly and never crosses the contract boundary,
 * so the defaulting/derivation must happen here at the point of consumption rather than as a schema transform.
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
