import { addFilter, removeFilter } from "@wordpress/hooks";
import { helpers } from "yoastseo";

/**
 * Registers the SEO title width plugin.
 *
 * This "plugin" measures the SEO title width and adds it to the analysis data.
 *
 * @returns {function} Function to unregister the SEO title width plugin.
 */
const registerSeoTitleWidth = () => {
	const hookName = "yoast.seoStore.analysis.preparePaper";
	const namespace = "yoast/free/measureSeoTitleWidth";

	addFilter(
		hookName,
		namespace,
		paper => ( {
			...paper,
			seoTitleWidth: helpers.measureTextWidth( paper.seoTitle || paper.titleTemplate ),
		} ),
		// Priority of 11, because no replacevars are used in the SEO title width.
		11
	);

	return () => removeFilter( hookName, namespace );
};

export default registerSeoTitleWidth;
