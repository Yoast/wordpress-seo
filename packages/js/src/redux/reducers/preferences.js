import { isUndefined, get } from "lodash";
import isContentAnalysisActive from "../../analysis/isContentAnalysisActive";
import isKeywordAnalysisActive from "../../analysis/isKeywordAnalysisActive";
import isCornerstoneActive from "../../analysis/isCornerstoneContentActive";
import isWordFormRecognitionActive from "../../analysis/isWordFormRecognitionActive";
import isSEMrushIntegrationActive from "../../analysis/isSEMrushIntegrationActive";
import isZapierIntegrationActive from "../../analysis/isZapierIntegrationActive";
import isZapierConnected from "../../analysis/isZapierConnected";
import isWincherIntegrationActive from "../../analysis/isWincherIntegrationActive";
import isWordProofIntegrationActive from "../../analysis/isWordProofIntegrationActive";

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
		isBreadcrumbsDisabled: ! ! window.wpseoAdminL10n.isBreadcrumbsDisabled,
		isPrivateBlog: ! ! window.wpseoAdminL10n.isPrivateBlog,
		isSEMrushIntegrationActive: isSEMrushIntegrationActive(),
		shouldUpsell: isUndefined( window.wpseoPremiumMetaboxData ),
		displayAdvancedTab: displayAdvancedTab,
		displaySchemaSettings: displayAdvancedTab && !! window.wpseoScriptData.isPost,
		displaySchemaSettingsFooter: window.wpseoScriptData.metabox.schema.displayFooter,
		displayFacebook: window.wpseoScriptData.metabox.showSocial.facebook,
		displayTwitter: window.wpseoScriptData.metabox.showSocial.twitter,
		isZapierIntegrationActive: isZapierIntegrationActive(),
		isZapierConnected: isZapierConnected(),
		isWincherIntegrationActive: isWincherIntegrationActive(),
		isWordProofIntegrationActive: isWordProofIntegrationActive(),
		isInsightsEnabled: get( window, "wpseoScriptData.metabox.isInsightsEnabled", false ),
	};
}

/**
 * A reducer for the preferences.
 *
 * @param {Object} state The current state of the object.
 *
 * @returns {Object} The state.
 */
function preferencesReducer( state = getDefaultState() ) {
	return state;
}

export default preferencesReducer;
