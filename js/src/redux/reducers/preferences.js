import isContentAnalysisActive from "../../analysis/isContentAnalysisActive";
import isKeywordAnalysisActive from "../../analysis/isKeywordAnalysisActive";

const defaultState = {
	isContentAnalysisActive: isContentAnalysisActive(),
	isKeywordAnalysisActive: isKeywordAnalysisActive(),
};

/**
 * A reducer for the preferences.
 *
 * @param {Object} state  The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The state.
 */
function preferencesReducer( state = defaultState, action ) {
	return state;
}

export default preferencesReducer;
