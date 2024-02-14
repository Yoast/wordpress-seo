/* External dependencies */
import { select } from "@wordpress/data";

/* Internal dependencies */
import MetaboxFieldSync from "../../helpers/fields/MetaboxFieldSync";

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
		MetaboxFieldSync.setFieldValue( "twitter-title", "" );
	} else {
		MetaboxFieldSync.setFieldValue( "twitter-title", title );
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
		MetaboxFieldSync.setFieldValue( "twitter-description", "" );
	} else {
		MetaboxFieldSync.setFieldValue( "twitter-description", description );
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
	MetaboxFieldSync.setFieldValue( "twitter-image-id", image.id );
	MetaboxFieldSync.setFieldValue( "twitter-image", image.url );
	return { type: SET_TWITTER_IMAGE, image };
};

/**
 * An action creator for setting the socialPreview image.
 *
 * @returns {Object} The action object.
 */
export const clearTwitterPreviewImage = () => {
	MetaboxFieldSync.setFieldValue( "twitter-image-id", "" );
	MetaboxFieldSync.setFieldValue( "twitter-image", "" );
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
		imageId: MetaboxFieldSync.getInitialValue( "twitter-image-id" ),
		imageUrl: MetaboxFieldSync.getInitialValue( "twitter-image" ),
		description: MetaboxFieldSync.getInitialValue( "twitter-description" ) || getSocialDescriptionTemplate(),
		title: MetaboxFieldSync.getInitialValue( "twitter-title" ) || getSocialTitleTemplate(),
	};
};
