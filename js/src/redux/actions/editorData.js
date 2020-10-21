export const SET_EDITOR_DATA_CONTENT = "SET_EDITOR_DATA_CONTENT";
export const SET_EDITOR_DATA_TITLE = "SET_EDITOR_DATA_TITLE";
export const SET_EDITOR_DATA_EXCERPT = "SET_EDITOR_DATA_EXCERPT";
export const SET_EDITOR_DATA_IMAGE_URL = "SET_EDITOR_DATA_IMAGE_URL";

/**
 * Sets the content.
 *
 * @param {string} content The content.
 *
 * @returns {Object} An action to dispatch.
 */
export function setEditorDataContent( content ) {
	return {
		type: SET_EDITOR_DATA_CONTENT,
		content,
	};
}

/**
 * Sets the title.
 *
 * @param {string} title The title.
 *
 * @returns {Object} An action to dispatch.
 */
export function setEditorDataTitle( title ) {
	return {
		type: SET_EDITOR_DATA_TITLE,
		title,
	};
}

/**
 * Sets the excerpt.
 *
 * @param {string} excerpt The excerpt.
 *
 * @returns {Object} An action to dispatch.
 */
export function setEditorDataExcerpt( excerpt ) {
	return {
		type: SET_EDITOR_DATA_EXCERPT,
		excerpt,
	};
}

/**
 * Sets the image URL.
 *
 * @param {string} imageUrl The image's URL.
 *
 * @returns {Object} An action to dispatch.
 */
export function setEditorDataImageUrl( imageUrl ) {
	return {
		type: SET_EDITOR_DATA_IMAGE_URL,
		imageUrl,
	};
}
