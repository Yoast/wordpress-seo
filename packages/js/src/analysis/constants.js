export const refreshDelay = 500;

/**
 * The identifiers of the assessments that get a slot next to their result, instead of the Yoast AI Optimize button.
 *
 * These are the alt text assessments. Yoast WooCommerce SEO and Shopify SEO fill these slots with their own alt text
 * generation button. Some of these assessments are registered by those add-ons, not by Yoast SEO itself, so a
 * result with that identifier only appears while one of them is active.
 *
 * To offer a slot next to another assessment, add its identifier here.
 *
 * @type {string[]}
 */
export const ASSESSMENT_BUTTON_SLOT_IDS = [ "imageAltTags", "altTextLength" ];

/**
 * Builds the name of the slot rendered next to an assessment result.
 *
 * The name is location specific on purpose: the metabox and the sidebar are mounted at the same time, and the
 * slot registry keys slots by name alone, so two slots sharing one name would overwrite each other. A filler
 * therefore registers one fill per location.
 *
 * @param {string} id       The assessment identifier, one of `ASSESSMENT_BUTTON_SLOT_IDS`.
 * @param {string} location Where the analysis is rendered, either "metabox" or "sidebar".
 *
 * @returns {string} The slot name.
 */
export const getAssessmentButtonSlotName = ( id, location ) => `yoast.seoAnalysis.${ id }Button.${ location }`;
