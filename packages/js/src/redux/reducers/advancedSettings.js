/* eslint-disable complexity */
import {
	SET_NO_INDEX,
	SET_NO_FOLLOW,
	SET_ADVANCED,
	SET_BREADCRUMBS_TITLE,
	SET_CANONICAL_URL,
	LOAD_ADVANCED_SETTINGS,
	SET_WORDPROOF_TIMESTAMP,
} from "../actions/advancedSettings";

/**
 * Initial state
 */
const initialState = {
	noIndex: "",
	noFollow: "",
	advanced: [],
	breadcrumbsTitle: "",
	canonical: "",
	wordproofTimestamp: false,
	isLoading: true,
};

/**
 * A reducer for the AdvancedSettings object.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The updated AdvancedSettings object.
 */
const advancedSettingsReducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		case LOAD_ADVANCED_SETTINGS:
			return {
				...state,
				...action.settings,
			};
		case SET_NO_INDEX:
			return { ...state, noIndex: action.value };
		case SET_NO_FOLLOW:
			return { ...state, noFollow: action.value };
		case SET_ADVANCED:
			return { ...state, advanced: action.value };
		case SET_CANONICAL_URL:
			return { ...state, canonical: action.value };
		case SET_WORDPROOF_TIMESTAMP:
			return { ...state, wordproofTimestamp: action.value };
		case SET_BREADCRUMBS_TITLE:
			return { ...state, breadcrumbsTitle: action.value };
	  default:
			return state;
	}
};

export default advancedSettingsReducer;
/* eslint-enable complexity */
