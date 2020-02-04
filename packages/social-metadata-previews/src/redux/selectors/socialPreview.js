import { get } from "lodash";

/**
 * A selector for the title.
 *
 * @param {Object} state The redux state.
 * @param {String} platform The platform ( Facebook | Twitter ).
 *
 * @returns {Object} The action object.
 */
export const titleSelector = ( state, platform ) => {
	return get( state, `socialPreview.${ platform }.title`, false );
};

/**
 * A selector for the description.
 *
 * @param {Object} state The redux state.
 * @param {String} platform The platform ( Facebook | Twitter ).
 *
 * @returns {Object} The action object.
 */
export const descriptionSelector = ( state, platform ) => {
	return get( state, `socialPreview.${ platform }.description`, false );
};

/**
 * A selector for the imageUrl.
 *
 * @param {Object} state The redux state.
 * @param {String} platform The platform ( Facebook | Twitter ).
 *
 * @returns {Object} The action object.
 */
export const imageUrlSelector = ( state, platform ) => {
	return get( state, `socialPreview.${ platform }.imageUrl`, false );
};

/**
 * A selector for the imageType.
 *
 * @param {Object} state The redux state.
 * @param {String} platform The platform ( Facebook | Twitter ).
 *
 * @returns {Object} The action object.
 */
export const imageTypeSelector = ( state, platform ) => {
	return get( state, `socialPreview.${ platform }.imageType`, false );
};

/**
 * A selector for the author.
 *
 * @param {Object} state The redux state.
 * @param {String} platform The platform ( Facebook | Twitter ).
 *
 * @returns {Object} The action object.
 */
export const authorSelector = ( state, platform ) => {
	return get( state, `socialPreview.${ platform }.author`, false );
};

/**
 * A selector for the siteName.
 *
 * @param {Object} state The redux state.
 * @param {String} platform The platform ( Facebook | Twitter ).
 *
 * @returns {Object} The action object.
 */
export const siteNameSelector = ( state, platform ) => {
	return get( state, `socialPreview.${ platform }.siteName`, false );
};
