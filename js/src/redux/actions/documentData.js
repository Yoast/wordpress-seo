export const SET_DOCUMENT_DATA = "SET_DOCUMENT_DATA";
export const SET_DOCUMENT_TEXT = "SET_DOCUMENT_TEXT";
export const SET_DOCUMENT_EXCERPT = "SET_DOCUMENT_EXCERPT";
export const SET_DOCUMENT_TITLE = "SET_DOCUMENT_TITLE";

/**
 * The set data action for the documentDataReducer
 *
 * @param {Object} data The data from the document.
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
 * The set text action for the documentDataReducer.
 *
 * @param {string} text The text from the document.
 *
 * @returns {Object} An action for redux.
 */
export function setDocumentText( text ) {
	return {
		type: SET_DOCUMENT_TEXT,
		text,
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
