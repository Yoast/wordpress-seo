import {
	SET_EDITOR_DATA_CONTENT,
	SET_EDITOR_DATA_EXCERPT,
	SET_EDITOR_DATA_IMAGE_URL,
	SET_EDITOR_DATA_SLUG,
	SET_EDITOR_DATA_TITLE,
} from "../actions";

const INITIAL_STATE = {
	content: "",
	excerpt: "",
	imageUrl: "",
	slug: "",
	title: "",
};

/* eslint-disable complexity */
/**
 * Reduces the dispatched action for the editorData state.
 *
 * @param {Object} state The current state.
 * @param {Object} action The action that was just dispatched.
 *
 * @returns {Object} The new state.
 */
const editorDataReducer = ( state = INITIAL_STATE, action ) => {
	switch ( action.type ) {
		case SET_EDITOR_DATA_CONTENT:
			return {
				...state,
				content: action.content,
			};
		case SET_EDITOR_DATA_EXCERPT:
			return {
				...state,
				excerpt: action.excerpt,
			};
		case SET_EDITOR_DATA_IMAGE_URL:
			return {
				...state,
				imageUrl: action.imageUrl,
			};
		case SET_EDITOR_DATA_SLUG:
			return {
				...state,
				slug: action.slug,
			};
		case SET_EDITOR_DATA_TITLE:
			return {
				...state,
				title: action.title,
			};
	}
	return state;
};
/* eslint-enable complexity */

export default editorDataReducer;
