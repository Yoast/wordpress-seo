import { isUndefined } from "lodash-es";
import isContentAnalysisActive from "../../analysis/is-content-analysis-active";
import isKeywordAnalysisActive from "../../analysis/is-keyword-analysis-active";
import isCornerstoneActive from "../../analysis/is-cornerstone-content-active";
import isWordFormRecognitionActive from "../../analysis/is-word-form-recognition-active";
import isSEMrushIntegrationActive from "../../analysis/is-semrush-integration-active";
import isZapierIntegrationActive from "../../analysis/is-zapier-integration-active";
import isZapierConnected from "../../analysis/is-zapier-connected";

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
