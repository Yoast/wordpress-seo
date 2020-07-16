import {
	LOAD_TWITTER_PREVIEW,
	SET_TWITTER_TITLE,
	SET_TWITTER_DESCRIPTION,
	SET_TWITTER_IMAGE,
	CLEAR_TWITTER_IMAGE,
} from "../actions/twitterEditor";

/**
 * Initial state
 */
const initialState = {
	title: "",
	description: "",
	warnings: [],
	image: {
		url: "",
		id: "",
	},
};

/**
 * A reducer for the TwitterPreview object.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The updated socialpreview results object.
 */
const twitterReducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		case LOAD_TWITTER_PREVIEW:
			return { ...state, title: action.title, description: action.description, image: { id: action.id, url: action.imageUrl } };
		case SET_TWITTER_TITLE :
			return { ...state, title: action.title };
		case SET_TWITTER_DESCRIPTION :
			return { ...state, description: action.description };
		case SET_TWITTER_IMAGE :
			return { ...state, image: { id: action.image.id, url: action.image.url }, warnings: action.image.warnings };
		case CLEAR_TWITTER_IMAGE :
			return {
				...state,
				image: {
					url: "",
					id: "",
				},
				warnings: [],
			};
	  default:
			return state;
	}
};

export default twitterReducer;
