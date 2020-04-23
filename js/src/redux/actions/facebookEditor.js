import FacebookFields from "../../helpers/fields/FacebookFields";

export const SET_FACEBOOK_TITLE = "SET_FACEBOOK_TITLE";
export const SET_FACEBOOK_DESCRIPTION = "SET_FACEBOOK_DESCRIPTION";
export const SET_FACEBOOK_IMAGE_URL = "SET_FACEBOOK_IMAGE_URL";
export const SET_FACEBOOK_IMAGE_TYPE = "SET_FACEBOOK_IMAGE_TYPE";
export const SET_FACEBOOK_IMAGE_ID = "SET_FACEBOOK_IMAGE_ID";
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
	FacebookFields.title = title;
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
	FacebookFields.description = description;
	return { type: SET_FACEBOOK_DESCRIPTION, description };
};

/**
 * An action creator for setting the socialPreview image.
 *
 * @param {String} imageUrl The image url.
 *
 * @returns {object} The action object.
 */
export const setFacebookPreviewImageUrl = ( imageUrl ) => {
	FacebookFields.imageUrl = imageUrl;
	return { type: SET_FACEBOOK_IMAGE_URL, imageUrl };
};

/**
 * An action creator for setting the socialPreview imageType.
 *
 * @param {String} imageType The image type.
 *
 * @returns {object} The action object.
 */
export const setFacebookPreviewImageType = ( imageType ) => {
	return { type: SET_FACEBOOK_IMAGE_TYPE, imageType };
};

/**
 * An action creator for setting the socialPreview imageId.
 *
 * @param {number} imageId The image id.
 *
 * @returns {object} The action object.
 */
export const setFacebookPreviewImageId = ( imageId ) => {
	FacebookFields.imageId = imageId;
	return { type: SET_FACEBOOK_IMAGE_ID, imageId };
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
	return {
		type: LOAD_FACEBOOK_PREVIEW,
		imageId: FacebookFields.imageId,
		imageUrl: FacebookFields.imageUrl,
		description: FacebookFields.description,
		title: FacebookFields.title,
	};
};
