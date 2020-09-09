import { SET_CONTENT_IMAGE, SET_ELEMENTOR_TARGET, SET_SETTINGS } from "../actions/settings";

/**
 * A reducer for settings.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The state.
 */
export default function settingsReducer( state = {}, action ) {
	switch ( action.type ) {
		case SET_SETTINGS:
			return { ...state, ...action.settings };
		case SET_CONTENT_IMAGE: {
			const newSocialPreviews = Object.assign( {}, state.socialPreviews, { contentImage: action.src } );
			return {
				...state,
				socialPreviews: {
					...newSocialPreviews,
				},
			};
		}
		case SET_ELEMENTOR_TARGET:
			return {
				...state,
				elementorTarget: action.target,
			};
		default:
			return state;
	}
}
