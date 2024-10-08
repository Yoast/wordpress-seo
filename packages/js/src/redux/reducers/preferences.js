import { isUndefined, get } from "lodash";
import isContentAnalysisActive from "../../analysis/isContentAnalysisActive";
import isKeywordAnalysisActive from "../../analysis/isKeywordAnalysisActive";
import isInclusiveLanguageAnalysisActive from "../../analysis/isInclusiveLanguageAnalysisActive";
import isCornerstoneActive from "../../analysis/isCornerstoneContentActive";
import isWordFormRecognitionActive from "../../analysis/isWordFormRecognitionActive";
import isSEMrushIntegrationActive from "../../analysis/isSEMrushIntegrationActive";
import isWincherIntegrationActive from "../../analysis/isWincherIntegrationActive";

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
		isInclusiveLanguageAnalysisActive: isInclusiveLanguageAnalysisActive(),
		isWordFormRecognitionActive: isUndefined( window.wpseoPremiumMetaboxData ) && isWordFormRecognitionActive(),
		isCornerstoneActive: isCornerstoneActive(),
		isBreadcrumbsDisabled: ! ! window.wpseoAdminL10n.isBreadcrumbsDisabled,
		isPrivateBlog: ! ! window.wpseoScriptData.isPrivateBlog,
		isSEMrushIntegrationActive: isSEMrushIntegrationActive(),
		shouldUpsell: isUndefined( window.wpseoPremiumMetaboxData ),
		displayAdvancedTab: displayAdvancedTab,
		displaySchemaSettings: displayAdvancedTab && !! window.wpseoScriptData.isPost,
		displaySchemaSettingsFooter: window.wpseoScriptData.metabox.schema.displayFooter,
		useOpenGraphData: window.wpseoScriptData.metabox.showSocial.facebook,
		useTwitterData: window.wpseoScriptData.metabox.showSocial.twitter,
		isWincherIntegrationActive: isWincherIntegrationActive(),
		isInsightsEnabled: get( window, "wpseoScriptData.metabox.isInsightsEnabled", false ),
		isNewsEnabled: get( window, "wpseoScriptData.metabox.isNewsSeoActive", false ),
		isAiFeatureActive: Boolean( window.wpseoAdminL10n.isAiFeatureActive ),
		isWooCommerceSeoActive: get( window, "wpseoScriptData.metabox.isWooCommerceSeoActive", false ),
		isWooCommerceActive: get( window, "wpseoScriptData.metabox.isWooCommerceActive", false ),
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
