import { combineReducers } from "redux";

import {
	SET_SOCIAL_TITLE,
	SET_SOCIAL_DESCRIPTION,
	SET_SOCIAL_IMAGE_URL,
	SET_SOCIAL_IMAGE_TYPE,
	SET_SOCIAL_IMAGE_ID,
	SET_SOCIAL_IMAGE,
	CLEAR_SOCIAL_IMAGE,
} from "../actions/formActions";

/**
 * Initial state
 */
const initialState = {
	title: "",
	description: "",
	warnings: [],
	image: {
		bytes: null,
		type: null,
		height: null,
		width: null,
		url: "",
		id: null,
		alt: "",
	},
};

/**
 * A reducer for the socialpreview object.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The current action received.
 * @returns {Object} The updated socialpreview results object.
 */
function socialPreview( state = initialState, action ) {
	switch ( action.type ) {
		case SET_SOCIAL_TITLE :
			return { ...state, title: action.title };
		case SET_SOCIAL_DESCRIPTION :
			return { ...state, description: action.description };
		case SET_SOCIAL_IMAGE :
			return { ...state, image: { ...action.image } };
		case SET_SOCIAL_IMAGE_URL :
			return { ...state, image: { ...state.image, url: action.imageUrl } };
		case SET_SOCIAL_IMAGE_TYPE :
			return { ...state, image: { ...state.image, type: action.imageType } };
		case SET_SOCIAL_IMAGE_ID :
			return { ...state, image: { ...state.image, id: action.imageId } };
		case CLEAR_SOCIAL_IMAGE :
			return { ...state, image: {
				bytes: null,
				type: null,
				height: null,
				width: null,
				url: "",
				id: null,
				alt: "",
			} };
		default:
			return state;
	}
}

/**
 * A WrapperReducer.
 *
 * @param {Object} reducerFunction The current state of the object.
 * @param {Object} platformName The platform to generate a reducer for (Twitter | Facebook).
 * @returns {Object} The state or initializes the socialPreview reducer.
 */
function createNamedWrapperReducer( reducerFunction, platformName ) {
	return ( state, action ) => {
		const { platform } = action;
		// eslint-disable-next-line no-undefined
		const isInitializationCall = state === undefined;
		if ( isInitializationCall ) {
			return initialState;
		}
		if ( platform !== platformName ) {
			return state;
		}
		return reducerFunction( state, action );
	};
}

const socialPreviewsReducer = combineReducers( {
	facebook: createNamedWrapperReducer( socialPreview, "facebook" ),
	twitter: createNamedWrapperReducer( socialPreview, "twitter" ),
} );

export default socialPreviewsReducer;
