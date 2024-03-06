/* External dependencies */
import { select } from "@wordpress/data";
import { get } from "lodash";

export const SET_FACEBOOK_TITLE = "SET_FACEBOOK_TITLE";
export const SET_FACEBOOK_DESCRIPTION = "SET_FACEBOOK_DESCRIPTION";
export const SET_FACEBOOK_IMAGE = "SET_FACEBOOK_IMAGE";
export const CLEAR_FACEBOOK_IMAGE = "CLEAR_FACEBOOK_IMAGE";
export const LOAD_FACEBOOK_PREVIEW = "LOAD_FACEBOOK_PREVIEW";

/**
 * An action creator for setting the socialPreview title.
 *
 * @param {String} title The title.
 *
 * @returns {object} The action object.
 */
export const setFacebookPreviewTitle = ( title ) => {
	return { type: SET_FACEBOOK_TITLE, title };
};

/**
 * An action creator for setting the socialPreview description.
 *
 * @param {String} description The description.
 *
 * @returns {object} The action object.
 */
export const setFacebookPreviewDescription = ( description ) => {
	return { type: SET_FACEBOOK_DESCRIPTION, description };
};

/**
 * An action creator for setting the socialPreview image.
 *
 * @param {String} image The image object.
 *
 * @returns {object} The action object.
 */
export const setFacebookPreviewImage = ( image ) => {
	return { type: SET_FACEBOOK_IMAGE, image };
};

/**
 * An action creator for setting the socialPreview image.
 *
 * @returns {object} The action object.
 */
export const clearFacebookPreviewImage = () => {
	return { type: CLEAR_FACEBOOK_IMAGE };
};

/**
 * An action creator for loading all Facebook preview data.
 *
 * @returns {object} The action object.
 */
export const loadFacebookPreviewData = () => {
	const {
		getSocialDescriptionTemplate,
		getSocialTitleTemplate,
	} = select( "yoast-seo/editor" );

	return {
		type: LOAD_FACEBOOK_PREVIEW,
		imageId: get( window, "wpseoScriptData.metabox.metadata.opengraph-image-id", "" ),
		imageUrl: get( window, "wpseoScriptData.metabox.metadata.opengraph-image", "" ),
		description: get( window, "wpseoScriptData.metabox.metadata.opengraph-description", "" ) || getSocialDescriptionTemplate(),
		title: get( window, "wpseoScriptData.metabox.metadata.opengraph-title", "" ) || getSocialTitleTemplate(),
	};
};
