import {
	SET_DOCUMENT_CONTENT,
	SET_DOCUMENT_DATA,
	SET_DOCUMENT_TITLE,
	SET_DOCUMENT_EXCERPT,
} from "../actions/documentData";

const INITIAL_STATE = {
	title: "",
	content: "",
	excerpt: "",
};

/**
 * Reduces the dispatched action for the document data state.
 *
 * @param {Object} state The current state.
 * @param {Object} action The action that was just dispatched.
 *
 * @returns {Object} The new state.
 */
function documentDataReducer( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case SET_DOCUMENT_DATA:
			return Object.assign( {}, state, {
				...action.data,
			} );
		case SET_DOCUMENT_CONTENT:
			return Object.assign( {}, state, {
				content: action.content,
			} );
		case SET_DOCUMENT_EXCERPT:
			return Object.assign( {}, state, {
				excerpt: action.excerpt,
			} );
		case SET_DOCUMENT_TITLE:
			return Object.assign( {}, state, {
				title: action.title,
			} );
		default: return state;
	}
}

export default documentDataReducer;
