import {
	LOAD_FACEBOOK_PREVIEW,
	SET_FACEBOOK_TITLE,
	SET_FACEBOOK_DESCRIPTION,
	SET_FACEBOOK_IMAGE_URL,
	SET_FACEBOOK_IMAGE_TYPE,
	SET_FACEBOOK_IMAGE_ID,
	SET_FACEBOOK_IMAGE,
	CLEAR_FACEBOOK_IMAGE,
} from "../actions/facebookEditor";

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
 * A reducer for the FacebookPreview object.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The updated socialpreview results object.
 */
const facebookReducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		case LOAD_FACEBOOK_PREVIEW:
			return { ...state, title: action.title, description: action.description, image: { id: action.id, url: action.imageUrl } };
		case SET_FACEBOOK_TITLE :
			return { ...state, title: action.title };
		case SET_FACEBOOK_DESCRIPTION :
			return { ...state, description: action.description };
		case SET_FACEBOOK_IMAGE :
			return { ...state, image: { ...action.image } };
		case SET_FACEBOOK_IMAGE_URL :
			return { ...state, image: { ...state.image, url: action.imageUrl } };
		case SET_FACEBOOK_IMAGE_TYPE :
			return { ...state, image: { ...state.image, type: action.imageType } };
		case SET_FACEBOOK_IMAGE_ID :
			return { ...state, image: { ...state.image, id: action.imageId } };
		case CLEAR_FACEBOOK_IMAGE :
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

export default facebookReducer;
