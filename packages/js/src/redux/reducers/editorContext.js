import { get } from "lodash";

/**
 * Gets the default state.
 *
 * @returns {Object} The default state.
 */
function getDefaultState() {
	return {
		contentLocale: get( window, "wpseoScriptData.metabox.contentLocale", "" ),
		isBlockEditor: get( window, "wpseoScriptData.isBlockEditor", "0" ) === "1",
		isElementorEditor: get( window, "wpseoScriptData.isElementorEditor", "0" ) === "1",
		isPost: get( window, "wpseoScriptData", {} ).hasOwnProperty( "isPost" ),
		isTerm: get( window, "wpseoScriptData", {} ).hasOwnProperty( "isTerm" ),
		noIndex: get( window, "wpseoAdminL10n.noIndex", "0" ) === "1",
		postTypeNameSingular: get( window, "wpseoAdminL10n.postTypeNameSingular", "" ),
		postTypeNamePlural: get( window, "wpseoAdminL10n.postTypeNamePlural", "" ),
		postStatus: get( window, "wpseoScriptData.postStatus", "" ),
	};
}

/**
 * A reducer for the preferences.
 *
 * @param {Object} state  The current state of the object.
 *
 * @returns {Object} The state.
 */
function editorContextReducer( state = getDefaultState() ) {
	return state;
}

export default editorContextReducer;
