export const SET_DOCUMENT_DATA = "SET_DOCUMENT_DATA";
export const SET_DOCUMENT_TEXT = "SET_DOCUMENT_TEXT";
export const SET_DOCUMENT_EXCERPT = "SET_DOCUMENT_EXCERPT";
export const SET_DOCUMENT_TITLE = "SET_DOCUMENT_TITLE";

/**
 * The set data action for the documentDataReducer.
 *
 * @param {Object} data The data (title, content, and excerpt) from the document.
 *
 * @returns {Object} An action for redux.
 */
export function setDocumentData( data ) {
	return {
		type: SET_DOCUMENT_DATA,
		data,
	};
}

/**
 * The set content action for the documentDataReducer.
 *
 * @param {string} content The content from the document.
 *
 * @returns {Object} An action for redux.
 */
export function setDocumentContent( content ) {
	return {
		type: SET_DOCUMENT_TEXT,
		content,
	};
}

/**
 * The set excerpt action for the documentDataReducer.
 *
 * @param {string} excerpt The excerpt from the document.
 *
 * @returns {Object} An action for redux.
 */
export function setDocumentExcerpt( excerpt ) {
	return {
		type: SET_DOCUMENT_EXCERPT,
		excerpt,
	};
}

/**
 * The set title action for the documentDataReducer.
 *
 * @param {string} title The title from the document.
 *
 * @returns {Object} An action for redux.
 */
export function setDocumentTitle( title ) {
	return {
		type: SET_DOCUMENT_TITLE,
		title,
	};
}
