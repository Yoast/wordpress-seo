import createDomSync from "./helpers/createDomSync";
import * as dom from "../helpers/dom";

/**
 * Syncs a post's Twitter fields from the SEO store to the hidden fields
 * inside the editor.
 *
 * @param {Object} selectors The SEO store selectors.
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
			domGet: dom.getPostTwitterImageURL,
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
