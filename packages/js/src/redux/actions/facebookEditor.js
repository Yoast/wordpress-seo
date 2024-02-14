/* External dependencies */
import { select } from "@wordpress/data";

/* Internal dependencies */
import MetaboxFieldSync from "../../helpers/fields/MetaboxFieldSync";


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
		MetaboxFieldSync.setFieldValue( "opengraph-title", "" );
	} else {
		MetaboxFieldSync.setFieldValue( "opengraph-title", title );
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
		MetaboxFieldSync.setFieldValue( "opengraph-description", "" );
	} else {
		MetaboxFieldSync.setFieldValue( "opengraph-description", description );
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
	MetaboxFieldSync.setFieldValue( "opengraph-image", image.url );
	MetaboxFieldSync.setFieldValue( "opengraph-image-id", image.id );
	return { type: SET_FACEBOOK_IMAGE, image };
};

/**
 * An action creator for setting the socialPreview image.
 *
 * @returns {object} The action object.
 */
export const clearFacebookPreviewImage = () => {
	MetaboxFieldSync.setFieldValue( "opengraph-image", "" );
	MetaboxFieldSync.setFieldValue( "opengraph-image-id", "" );
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
		imageId: MetaboxFieldSync.getInitialValue( "opengraph-image-id" ),
		imageUrl: MetaboxFieldSync.getInitialValue( "opengraph-image" ),
		description: MetaboxFieldSync.getInitialValue( "opengraph-description" ) || getSocialDescriptionTemplate(),
		title: MetaboxFieldSync.getInitialValue( "opengraph-title" ) || getSocialTitleTemplate(),
	};
};
