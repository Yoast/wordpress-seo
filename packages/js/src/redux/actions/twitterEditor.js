/* External dependencies */
import { select } from "@wordpress/data";
import { get } from "lodash";

export const SET_TWITTER_TITLE = "SET_TWITTER_TITLE";
export const SET_TWITTER_DESCRIPTION = "SET_TWITTER_DESCRIPTION";
export const SET_TWITTER_IMAGE = "SET_TWITTER_IMAGE";
export const CLEAR_TWITTER_IMAGE = "CLEAR_TWITTER_IMAGE";
export const LOAD_TWITTER_PREVIEW = "LOAD_TWITTER_PREVIEW";

/**
 * An action creator for setting the socialPreview title.
 *
 * @param {String} title The title.
 *
 * @returns {Object} The action object.
 */
export const setTwitterPreviewTitle = ( title ) => {
	return { type: SET_TWITTER_TITLE, title };
};

/**
 * An action creator for setting the socialPreview description.
 *
 * @param {String} description The description.
 *
 * @returns {Object} The action object.
 */
export const setTwitterPreviewDescription = ( description ) => {
	return { type: SET_TWITTER_DESCRIPTION, description };
};

/**
 * An action creator for setting the socialPreview image.
 *
 * @param {String} image The image object.
 *
 * @returns {Object} The action object.
 */
export const setTwitterPreviewImage = ( image ) => {
	return { type: SET_TWITTER_IMAGE, image };
};

/**
 * An action creator for setting the socialPreview image.
 *
 * @returns {Object} The action object.
 */
export const clearTwitterPreviewImage = () => {
	return { type: CLEAR_TWITTER_IMAGE };
};

/**
 * An action creator for loading all Twitter preview data.
 *
 * @returns {object} The action object.
 */
export const loadTwitterPreviewData = () => {
	const {
		getSocialDescriptionTemplate,
		getSocialTitleTemplate,
	} = select( "yoast-seo/editor" );

	return {
		type: LOAD_TWITTER_PREVIEW,
		imageId: get( window, "wpseoScriptData.metabox.metadata.twitter-image-id", "" ),
		imageUrl: get( window, "wpseoScriptData.metabox.metadata.twitter-image", "" ),
		description: get( window, "wpseoScriptData.metabox.metadata.twitter-description", "" ) || getSocialDescriptionTemplate(),
		title: get( window, "wpseoScriptData.metabox.metadata.twitter-title", "" ) || getSocialTitleTemplate(),
	};
};
