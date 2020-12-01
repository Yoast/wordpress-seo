import { get } from "lodash";

/**
 * Returns the replacement for the %%sep%% variable.
 *
 * @returns {string} The separator.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.sep", "" );
}

/**
 * Represents the sep replacement variable.
 *
 * @returns {Object} The sep replacement variable.
 */
export default {
	name: "sep",
	label: "Separator",
	placeholder: "%%sep%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%sep%%(\\s*%%sep%%)*", "g" ),
};
