/* External dependencies */
import { select } from "@wordpress/data";

/* Internal dependencies */
import FieldSync from "../../helpers/fields/FieldSync";

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
	if ( title.trim() === select( "yoast-seo/editor" ).getSocialTitleTemplate().trim() ) {
		FieldSync.setFieldValue( "twitter-title", "" );
	} else {
		FieldSync.setFieldValue( "twitter-title", title );
	}

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
	if ( description.trim() === select( "yoast-seo/editor" ).getSocialDescriptionTemplate().trim() ) {
		FieldSync.setFieldValue( "twitter-description", "" );
	} else {
		FieldSync.setFieldValue( "twitter-description", description );
	}

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
	FieldSync.setFieldValue( "twitter-image-id", image.id );
	FieldSync.setFieldValue( "twitter-image", image.url );
	return { type: SET_TWITTER_IMAGE, image };
};

/**
 * An action creator for setting the socialPreview image.
 *
 * @returns {Object} The action object.
 */
export const clearTwitterPreviewImage = () => {
	FieldSync.setFieldValue( "twitter-image-id", "" );
	FieldSync.setFieldValue( "twitter-image", "" );
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
		imageId: FieldSync.getInitialValue( "twitter-image-id" ),
		imageUrl: FieldSync.getInitialValue( "twitter-image" ),
		description: FieldSync.getInitialValue( "twitter-description" ) || getSocialDescriptionTemplate(),
		title: FieldSync.getInitialValue( "twitter-title" ) || getSocialTitleTemplate(),
	};
};
