/* External dependencies */
import { select } from "@wordpress/data";

/* Internal dependencies */
import FacebookFields from "../../helpers/fields/FacebookFields";


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
	if ( title.trim() === select( "yoast-seo/editor" ).getSocialTitleTemplate().trim() ) {
		FacebookFields.title = "";
	} else {
		FacebookFields.title = title;
	}

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
	if ( description.trim() === select( "yoast-seo/editor" ).getSocialDescriptionTemplate().trim() ) {
		FacebookFields.description = "";
	} else {
		FacebookFields.description = description;
	}

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
	FacebookFields.imageUrl = image.url;
	FacebookFields.imageId = image.id;
	return { type: SET_FACEBOOK_IMAGE, image };
};

/**
 * An action creator for setting the socialPreview image.
 *
 * @returns {object} The action object.
 */
export const clearFacebookPreviewImage = () => {
	FacebookFields.imageId = "";
	FacebookFields.imageUrl = "";
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
		imageId: FacebookFields.imageId,
		imageUrl: FacebookFields.imageUrl,
		description: FacebookFields.description || getSocialDescriptionTemplate(),
		title: FacebookFields.title || getSocialTitleTemplate(),
	};
};
