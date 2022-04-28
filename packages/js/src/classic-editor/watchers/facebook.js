import * as dom from "../helpers/dom";
import createDomSync from "./helpers/createDomSync";

/**
 * Syncs a post's Facebook fields from the SEO store to the hidden fields
 * inside the editor.
 *
 * @param {Object} selectors The SEO store selectors.
 *
 * @param {function} selectors.selectFacebookTitle A selector for getting the Facebook title from the store.
 * @param {function} selectors.selectFacebookDescription A selector for getting the Facebook description from the store.
 * @param {function} selectors.selectFacebookImageURL A selector for getting the Facebook image URL from the store.
 * @param {function} selectors.selectFacebookImageID A selector for getting the Facebook image ID from the store.
 *
 * @return {void}
 */
export const createPostFacebookSync = ( selectors ) => {
	createDomSync(
		selectors.selectFacebookTitle,
		{
			domGet: dom.getPostFBTitle,
			domSet: dom.setPostFBTitle,
		},
		"facebookTitle"
	);
	createDomSync(
		selectors.selectFacebookDescription,
		{
			domGet: dom.getPostFBDescription,
			domSet: dom.setPostFBDescription,
		},
		"facebookDescription"
	);
	createDomSync(
		selectors.selectFacebookImageURL,
		{
			domGet: dom.getPostFBImageURL,
			domSet: dom.setPostFBImageUrl,
		},
		"facebookImageURL"
	);
	createDomSync(
		selectors.selectFacebookImageID,
		{
			domGet: dom.getPostFBImageID,
			domSet: dom.setPostFBImageID,
		},
		"facebookImageID"
	);
}
