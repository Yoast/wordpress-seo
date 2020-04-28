import {
	LOAD_TWITTER_PREVIEW,
	SET_TWITTER_TITLE,
	SET_TWITTER_DESCRIPTION,
	SET_TWITTER_IMAGE_URL,
	SET_TWITTER_IMAGE_TYPE,
	SET_TWITTER_IMAGE_ID,
	SET_TWITTER_IMAGE,
	CLEAR_TWITTER_IMAGE,
} from "../actions/twitterEditor";

/**
 * Initial state
 */
const initialState = {
	title: "",
	description: "",
	errors: [],
	image: {
		bytes: null,
		type: null,
		height: null,
		width: null,
		url: "",
		id: null,
	},
};

/* eslint-disable complexity */
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
			return { ...state, image: { ...action.image } };
		case SET_TWITTER_IMAGE_URL :
			return { ...state, image: { ...state.image, url: action.imageUrl } };
		case SET_TWITTER_IMAGE_TYPE :
			return { ...state, image: { ...state.image, type: action.imageType } };
		case SET_TWITTER_IMAGE_ID :
			return { ...state, image: { ...state.image, id: action.imageId } };
		case CLEAR_TWITTER_IMAGE :
			return { ...state, image: {
				bytes: null,
				type: null,
				height: null,
				width: null,
				url: "",
				id: null,
			} };
	  default:
			return state;
	}
};
/* eslint-enable complexity */

export default twitterReducer;
