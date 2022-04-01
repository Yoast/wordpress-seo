import {
	SET_SETTINGS,
	SET_CONTENT_IMAGE,
	UPDATE_SETTINGS,
} from "../actions";

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
		case UPDATE_SETTINGS: {
			const newSnippetEditorSettings = Object.assign( {}, state.snippetEditor, action.snippetEditor );
			return {
				...state,
				snippetEditor: {
					...newSnippetEditorSettings,
				},
			};
		}
		default:
			return state;
	}
}
