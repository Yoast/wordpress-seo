import { isUndefined } from "lodash-es";
import isContentAnalysisActive from "../../analysis/isContentAnalysisActive";
import isKeywordAnalysisActive from "../../analysis/isKeywordAnalysisActive";
import isCornerstoneActive from "../../analysis/isCornerstoneContentActive";
import isWordFormRecognitionActive from "../../analysis/isWordFormRecognitionActive";

/**
 * Gets the default state.
 *
 * @returns {Object} The default state.
 */
function getDefaultState() {
	return {
		isContentAnalysisActive: isContentAnalysisActive(),
		isKeywordAnalysisActive: isKeywordAnalysisActive(),
		isWordFormRecognitionActive: isUndefined( window.wpseoPremiumMetaboxData ) && isWordFormRecognitionActive(),
		isCornerstoneActive: isCornerstoneActive(),
		shouldUpsell: isUndefined( window.wpseoPremiumMetaboxData ),
	};
}

/**
 * A reducer for the preferences.
 *
 * @param {Object} state  The current state of the object.
 *
 * @returns {Object} The state.
 */
function preferencesReducer( state = getDefaultState() ) {
	return state;
}

export default preferencesReducer;
