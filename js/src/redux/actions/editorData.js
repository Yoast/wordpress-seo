export const UPDATE_EDITOR_DATA = "UPDATE_EDITOR_DATA";
export const SET_EDITOR_DATA_CONTENT = "SET_EDITOR_DATA_CONTENT";
export const SET_EDITOR_DATA_TITLE = "SET_EDITOR_DATA_TITLE";
export const SET_EDITOR_DATA_EXCERPT = "SET_EDITOR_DATA_EXCERPT";
export const SET_EDITOR_DATA_SLUG = "SET_EDITOR_DATA_SLUG";

/**
 * Updates the editor data in redux.
 *
 * @param {Object} editorData The editor data.
 *
 * @returns {Object} An action for redux.
 */
export function updateEditorData( editorData ) {
	return {
		type: UPDATE_EDITOR_DATA,
		editorData,
	};
}

/**
 * Sets the content in redux.
 *
 * @param {string} content The content.
 *
 * @returns {Object} An action for redux.
 */
export function setEditorDataContent( content ) {
	return {
		type: SET_EDITOR_DATA_CONTENT,
		content,
	};
}

/**
 * Sets the title in redux.
 *
 * @param {string} title The title.
 *
 * @returns {Object} An action for redux.
 */
export function setEditorDataTitle( title ) {
	return {
		type: SET_EDITOR_DATA_TITLE,
		title,
	};
}

/**
 * Sets the excerpt in redux.
 *
 * @param {string} excerpt The excerpt.
 *
 * @returns {Object} An action for redux.
 */
export function setEditorDataExcerpt( excerpt ) {
	return {
		type: SET_EDITOR_DATA_EXCERPT,
		excerpt,
	};
}

/**
 * Sets the slug in redux.
 *
 * @param {string} slug The slug.
 *
 * @returns {Object} An action for redux.
 */
export function setEditorDataSlug( slug ) {
	return {
		type: SET_EDITOR_DATA_SLUG,
		slug,
	};
}
