import {
	LOAD_FACEBOOK_PREVIEW,
	SET_FACEBOOK_TITLE,
	SET_FACEBOOK_DESCRIPTION,
	SET_FACEBOOK_IMAGE,
	CLEAR_FACEBOOK_IMAGE,
} from "../actions/facebookEditor";

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
			return {
				...state,
				warnings: action.image.warnings,
				image: {
					id: action.image.id,
					url: action.image.url,
				},
			};
		case CLEAR_FACEBOOK_IMAGE :
			return { ...state,
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

export default facebookReducer;
