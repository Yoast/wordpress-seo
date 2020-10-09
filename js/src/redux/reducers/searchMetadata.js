import {
	LOAD_SEARCH_METADATA,
	SET_SEARCH_METADATA_TITLE,
	SET_SEARCH_METADATA_DESCRIPTION,
	SET_SEARCH_METADATA_KEYPHRASE,
} from "../actions/searchMetadata";

const INITIAL_STATE = {
	title: "",
	description: "",
	keyphrase: "",
};

/**
 * Reduces the dispatched action for the searchMetadata state.
 *
 * @param {Object} state The current state.
 * @param {Object} action The action that was just dispatched.
 *
 * @returns {Object} The new state.
 */
const searchMetadataReducer = ( state = INITIAL_STATE, action ) => {
	switch ( action.type ) {
		case LOAD_SEARCH_METADATA:
			return {
				...state,
				title: action.title,
				description: action.description,
				keyphrase: action.keyphrase,
			};
		case SET_SEARCH_METADATA_TITLE:
			return {
				...state,
				title: action.title,
			};
		case SET_SEARCH_METADATA_DESCRIPTION:
			return {
				...state,
				description: action.description,
			};
		case SET_SEARCH_METADATA_KEYPHRASE:
			return {
				...state,
				keyphrase: action.keyphrase,
			};
	}

	return state;
}

export default searchMetadataReducer;