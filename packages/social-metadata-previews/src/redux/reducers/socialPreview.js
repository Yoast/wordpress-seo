import { combineReducers } from "redux";

import { SET_TITLE, SET_DESCRIPTION, SET_IMAGE_URL, SET_IMAGE_TYPE } from "../actions/socialPreview";

/**
 * Initial state
 */
const initialState = {
	title: "",
	description: "",
	imageUrl: "",
	imageId: "",
	author: "",
	siteName: "",
	errors: [],
	type: "",
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
			return { ...state, title: action.description };
		case SET_IMAGE_URL :
			return { ...state, title: action.imageUrl };
		case SET_IMAGE_TYPE :
			return { ...state, title: action.imageType };
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
		const isInitializationCall = ! ! state;
		if ( platform !== platformName && ! isInitializationCall ) {
			 return state;
		}
		return reducerFunction( state, action );
	};
}

const socialPreviewsReducer = combineReducers( {
	socialPreviewFacebook: createNamedWrapperReducer( socialPreview, "facebook" ),
	socialPreviewTwitter: createNamedWrapperReducer( socialPreview, "twitter" ),
} );

export default socialPreviewsReducer;
