import { get } from "lodash";

/**
 * Returns the replacement for the %%sitedesc%% variable.
 *
 * @returns {string} The sitedesc.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.sitedesc", "" );
}

/**
 * Represents the sitedesc replacement variable.
 *
 * @returns {Object} The sitedesc replacement variable.
 */
export default {
	name: "sitedesc",
	label: "Tagline",
	placeholder: "%%sitedesc%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%sitedesc%%", "g" ),
};
