import isUndefined from "lodash/isUndefined";
import isContentAnalysisActive from "../../analysis/isContentAnalysisActive";
import isKeywordAnalysisActive from "../../analysis/isKeywordAnalysisActive";
import isCornerstoneActive from "../../analysis/isCornerstoneContentActive";

/**
 * Gets the default state.
 *
 * @returns {Object} The default state.
 */
function getDefaultState() {
	return {
		isContentAnalysisActive: isContentAnalysisActive(),
		isKeywordAnalysisActive: isKeywordAnalysisActive(),
		isCornerstoneActive: isCornerstoneActive() && isUndefined( window.wpseoTermScraperL10n ),
		shouldUpsell: isUndefined( window.wpseoPremiumMetaboxData ) && isUndefined( window.wpseoTermScraperL10n ),
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
