/**
 * Gets the default state.
 *
 * @returns {Object} The default state.
 */
function getDefaultState() {
	return {
		isPost: window.wpseoScriptData.hasOwnProperty( "isPost" ),
		isTerm: window.wpseoScriptData.hasOwnProperty( "isTerm" ),
		noIndex: window.wpseoAdminL10n.noIndex === "1",
		postTypeNameSingular: window.wpseoAdminL10n.postTypeNameSingular,
		postTypeNamePlural: window.wpseoAdminL10n.postTypeNamePlural,
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
