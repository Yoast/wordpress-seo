export const SET_SOCIAL_TITLE = "SET_SOCIAL_TITLE";

export const SET_SOCIAL_DESCRIPTION = "SET_SOCIAL_DESCRIPTION";

export const SET_SOCIAL_IMAGE_URL = "SET_SOCIAL_IMAGE_URL";

export const SET_SOCIAL_IMAGE_TYPE = "SET_SOCIAL_IMAGE_TYPE";

export const SET_SOCIAL_IMAGE_ID = "SET_SOCIAL_IMAGE_ID";

export const SET_SOCIAL_IMAGE = "SET_SOCIAL_IMAGE";

export const CLEAR_SOCIAL_IMAGE = "CLEAR_SOCIAL_IMAGE";

/**
 * An action creator for setting the socialPreview title.
 *
 * @param {String} title The title.
 * @param {String} platform The platform ( Facebook | Twitter ).
 *
 * @returns {Object} The action object.
 */
export const setSocialPreviewTitle = ( title, platform ) => {
	return { type: SET_SOCIAL_TITLE, platform, title };
};

/**
 * An action creator for setting the socialPreview description.
 *
 * @param {String} description The description.
 * @param {String} platform The platform ( Facebook | Twitter ).
 *
 * @returns {Object} The action object.
 */
export const setSocialPreviewDescription = ( description, platform ) => {
	return { type: SET_SOCIAL_DESCRIPTION, platform, description };
};

/**
 * An action creator for setting the socialPreview image.
 *
 * @param {String} imageUrl The image url.
 * @param {String} platform The platform ( Facebook | Twitter ).
 *
 * @returns {Object} The action object.
 */
export const setSocialPreviewImageUrl = ( imageUrl, platform ) => {
	return { type: SET_SOCIAL_IMAGE_URL, platform, imageUrl };
};

/**
 * An action creator for setting the socialPreview imageType.
 *
 * @param {String} imageType The image type.
 * @param {String} platform The platform ( Facebook | Twitter ).
 *
 * @returns {Object} The action object.
 */
export const setSocialPreviewImageType = ( imageType, platform ) => {
	return { type: SET_SOCIAL_IMAGE_TYPE, platform, imageType };
};

/**
 * An action creator for setting the socialPreview imageId.
 *
 * @param {number} imageId The image id.
 * @param {String} platform The platform ( Facebook | Twitter ).
 *
 * @returns {Object} The action object.
 */
export const setSocialPreviewImageId = ( imageId, platform ) => {
	return { type: SET_SOCIAL_IMAGE_ID, platform, imageId };
};

/**
 * An action creator for setting the socialPreview image.
 *
 * @param {String} image The image object.
 * @param {String} platform The platform ( Facebook | Twitter ).
 *
 * @returns {Object} The action object.
 */
export const setSocialPreviewImage = ( image, platform ) => {
	return { type: SET_SOCIAL_IMAGE, platform, image };
};

/**
 * An action creator for setting the socialPreview image.
 *
 * @param {String} platform The platform ( Facebook | Twitter ).
 *
 * @returns {Object} The action object.
 */
export const clearSocialPreviewImage = ( platform ) => {
	return { type: CLEAR_SOCIAL_IMAGE, platform };
};
