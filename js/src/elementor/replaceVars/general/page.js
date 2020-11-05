import { get } from "lodash";

/**
 * Returns the replacement for the %%page%% variable.
 *
 * @returns {string} The page.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.page", "" );
}

/**
 * Represents the page replacement variable.
 *
 * @returns {Object} The page replacement variable.
 */
export default {
	name: "page",
	label: "Page",
	placeholder: "%%page%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%page%%", "g" ),
};
