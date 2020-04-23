import TwitterFields from "../../helpers/fields/TwitterFields";

export const SET_TWITTER_TITLE = "SET_TWITTER_TITLE";
export const SET_TWITTER_DESCRIPTION = "SET_TWITTER_DESCRIPTION";
export const SET_TWITTER_IMAGE_URL = "SET_TWITTER_IMAGE_URL";
export const SET_TWITTER_IMAGE_TYPE = "SET_TWITTER_IMAGE_TYPE";
export const SET_TWITTER_IMAGE_ID = "SET_TWITTER_IMAGE_ID";
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
	TwitterFields.title = title;
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
	TwitterFields.description = description;
	return { type: SET_TWITTER_DESCRIPTION, description };
};

/**
 * An action creator for setting the socialPreview image.
 *
 * @param {String} imageUrl The image url.
 *
 * @returns {Object} The action object.
 */
export const setTwitterPreviewImageUrl = ( imageUrl ) => {
	TwitterFields.imageUrl = imageUrl;
	return { type: SET_TWITTER_IMAGE_URL, imageUrl };
};

/**
 * An action creator for setting the socialPreview imageType.
 *
 * @param {String} imageType The image type.
 *
 * @returns {Object} The action object.
 */
export const setTwitterPreviewImageType = ( imageType ) => {
	return { type: SET_TWITTER_IMAGE_TYPE, imageType };
};

/**
 * An action creator for setting the socialPreview imageId.
 *
 * @param {number} imageId The image id.
 *
 * @returns {Object} The action object.
 */
export const setTwitterPreviewImageId = ( imageId ) => {
	TwitterFields.imageId = imageId;
	return { type: SET_TWITTER_IMAGE_ID, imageId };
};

/**
 * An action creator for setting the socialPreview image.
 *
 * @param {String} image The image object.
 *
 * @returns {Object} The action object.
 */
export const setTwitterPreviewImage = ( image ) => {
	TwitterFields.imageId = image.id;
	TwitterFields.imageUrl = image.url;
	return { type: SET_TWITTER_IMAGE, image };
};

/**
 * An action creator for setting the socialPreview image.
 *
 * @returns {Object} The action object.
 */
export const clearTwitterPreviewImage = () => {
	TwitterFields.imageId = "";
	TwitterFields.imageUrl = "";
	return { type: CLEAR_TWITTER_IMAGE };
};

/**
 * An action creator for loading all Twitter preview data.
 *
 * @returns {object} The action object.
 */
export const loadTwitterPreviewData = () => {
	return {
		type: LOAD_TWITTER_PREVIEW,
		imageId: TwitterFields.imageId,
		imageUrl: TwitterFields.imageUrl,
		description: TwitterFields.description,
		title: TwitterFields.title,
	};
};
