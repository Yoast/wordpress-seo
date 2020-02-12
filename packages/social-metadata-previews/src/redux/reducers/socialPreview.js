import { combineReducers } from "redux";

import { SET_TITLE, SET_DESCRIPTION, SET_IMAGE_URL, SET_IMAGE_TYPE } from "../actions/socialPreview";

/**
 * Initial state
 */
const initialState = {
	title: "",
	description: "",
	errors: [],
	imageUrl: "",
	imageId: "",
	imageType: "",
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
		case SET_TITLE :
			return { ...state, title: action.title };
		case SET_DESCRIPTION :
			return { ...state, description: action.description };
		case SET_IMAGE_URL :
			return { ...state, imageUrl: action.imageUrl };
		case SET_IMAGE_TYPE :
			return { ...state, imageType: action.imageType };
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
