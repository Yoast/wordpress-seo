import { get } from "lodash";

/**
 * Returns the replacement for the %%id%% variable.
 *
 * @returns {string} The ID.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.id", "" );
}

/**
 * Represents the ID replacement variable.
 *
 * @returns {Object} The ID replacement variable.
 */
export default {
	name: "id",
	label: "ID",
	placeholder: "%%id%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%id%%", "g" ),
};
