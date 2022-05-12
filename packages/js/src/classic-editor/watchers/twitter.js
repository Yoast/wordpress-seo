import createDomSync from "./helpers/createDomSync";
import * as dom from "../helpers/dom";

/**
 * Syncs a post's Twitter fields from the SEO store to the hidden fields
 * inside the editor.
 *
 * @param {Object} selectors The SEO store selectors.
 * @returns {void}
 */
export const createPostTwitterSync = ( selectors ) => {
	createDomSync(
		selectors.selectTwitterTitle,
		{
			domGet: dom.getPostTwitterTitle,
			domSet: dom.setPostTwitterTitle,
		},
		"twitterTitle"
	);
	createDomSync(
		selectors.selectTwitterDescription,
		{
			domGet: dom.getPostTwitterDescription,
			domSet: dom.setPostTwitterDescription,
		},
		"twitterDescription"
	);
	createDomSync(
		selectors.selectTwitterImageURL,
		{
			domGet: dom.getPostTwitterImageUrl,
			domSet: dom.setPostTwitterImageUrl,
		},
		"twitterImageURL"
	);
	createDomSync(
		selectors.selectTwitterImageID,
		{
			domGet: dom.getPostTwitterImageID,
			domSet: dom.setPostTwitterImageID,
		},
		"twitterImageID"
	);
};

/**
 * Syncs a post's Twitter fields from the SEO store to the hidden fields
 * inside the editor.
 *
 * @param {Object} selectors The SEO store selectors.
 * @returns {void}
 */
export const createTermTwitterSync = ( selectors ) => {
	createDomSync(
		selectors.selectTwitterTitle,
		{
			domGet: dom.getTermTwitterTitle,
			domSet: dom.setTermTwitterTitle,
		},
		"twitterTitle"
	);
	createDomSync(
		selectors.selectTwitterDescription,
		{
			domGet: dom.getTermTwitterDescription,
			domSet: dom.setTermTwitterDescription,
		},
		"twitterDescription"
	);
	createDomSync(
		selectors.selectTwitterImageURL,
		{
			domGet: dom.getTermTwitterImageUrl,
			domSet: dom.setTermTwitterImageUrl,
		},
		"twitterImageURL"
	);
	createDomSync(
		selectors.selectTwitterImageID,
		{
			domGet: dom.getTermTwitterImageID,
			domSet: dom.setTermTwitterImageID,
		},
		"twitterImageID"
	);
};
