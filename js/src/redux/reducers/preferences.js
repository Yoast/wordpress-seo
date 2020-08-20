import { isUndefined, get } from "lodash-es";
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
	const displayAdvancedTab = !! window.wpseoAdminL10n.displayAdvancedTab;

	return {
		isContentAnalysisActive: isContentAnalysisActive(),
		isKeywordAnalysisActive: isKeywordAnalysisActive(),
		isWordFormRecognitionActive: isUndefined( window.wpseoPremiumMetaboxData ) && isWordFormRecognitionActive(),
		isCornerstoneActive: isCornerstoneActive(),
		shouldUpsell: isUndefined( window.wpseoPremiumMetaboxData ),
		displayAdvancedTab: displayAdvancedTab,
		displaySchemaSettings: displayAdvancedTab && !! window.wpseoScriptData.isPost,
		displaySchemaSettingsFooter: get( window, "wpseoScriptData.metabox.schema.displayFooter", false ),
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
