import { select } from "@wordpress/data";
/**
 * Checks if there are any warnings in the metabox.
 *
 * @returns {boolean} Whether there are any warnings.
 */
export const checkForMetaboxWarnings = () => {
	const isPremium = select( "yoast-seo/editor" ).getIsPremium();
	const warningsFree = select( "yoast-seo/editor" ).getWarningMessage();
	const warningsPremium = isPremium ? select( "yoast-seo-premium/editor" )?.getMetaboxWarning() ?? [] : [];

	return warningsPremium.length > 0 || warningsFree.length > 0;
};
