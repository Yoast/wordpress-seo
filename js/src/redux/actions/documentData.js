export const SET_DOCUMENT_DATA = "SET_DOCUMENT_DATA";
export const SET_DOCUMENT_TEXT = "SET_DOCUMENT_TEXT";

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
