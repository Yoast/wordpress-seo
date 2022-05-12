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
 * @returns {void}
 */
export const createPostFacebookSync = ( selectors ) => {
	createDomSync(
		selectors.selectFacebookTitle,
		{
			domGet: dom.getPostFacebookTitle,
			domSet: dom.setPostFacebookTitle,
		},
		"facebookTitle"
	);
	createDomSync(
		selectors.selectFacebookDescription,
		{
			domGet: dom.getPostFacebookDescription,
			domSet: dom.setPostFacebookDescription,
		},
		"facebookDescription"
	);
	createDomSync(
		selectors.selectFacebookImageURL,
		{
			domGet: dom.getPostFacebookImageUrl,
			domSet: dom.setPostFacebookImageUrl,
		},
		"facebookImageURL"
	);
	createDomSync(
		selectors.selectFacebookImageID,
		{
			domGet: dom.getPostFacebookImageID,
			domSet: dom.setPostFacebookImageID,
		},
		"facebookImageID"
	);
};

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
 * @returns {void}
 */
export const createTermFacebookSync = ( selectors ) => {
	createDomSync(
		selectors.selectFacebookTitle,
		{
			domGet: dom.getTermFacebookTitle,
			domSet: dom.setTermFacebookTitle,
		},
		"facebookTitle"
	);
	createDomSync(
		selectors.selectFacebookDescription,
		{
			domGet: dom.getTermFacebookDescription,
			domSet: dom.setTermFacebookDescription,
		},
		"facebookDescription"
	);
	createDomSync(
		selectors.selectFacebookImageURL,
		{
			domGet: dom.getTermFacebookImageUrl,
			domSet: dom.setTermFacebookImageUrl,
		},
		"facebookImageURL"
	);
	createDomSync(
		selectors.selectFacebookImageID,
		{
			domGet: dom.getTermFacebookImageID,
			domSet: dom.setTermFacebookImageID,
		},
		"facebookImageID"
	);
};
