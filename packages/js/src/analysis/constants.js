export const refreshDelay = 500;

/**
 * The identifier of the Image alt attributes assessment.
 *
 * The assessment is only registered by Yoast WooCommerce SEO, so a result carrying this identifier can only
 * appear while that add-on is active.
 *
 * @type {string}
 */
export const IMAGE_ALT_TAGS_ASSESSMENT_ID = "imageAltTags";

/**
 * Builds the name of the slot rendered next to the Image alt attributes assessment result.
 *
 * The name is location specific on purpose: the metabox and the sidebar are mounted at the same time, and the
 * slot registry keys slots by name alone, so two slots sharing one name would overwrite each other. A filler
 * therefore registers one fill per location.
 *
 * @param {string} location Where the analysis is rendered, either "metabox" or "sidebar".
 *
 * @returns {string} The slot name.
 */
export const getImageAltTagsButtonSlotName = ( location ) => `yoast.seoAnalysis.imageAltTagsButton.${ location }`;
