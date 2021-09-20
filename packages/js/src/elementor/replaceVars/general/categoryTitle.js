import { get } from "lodash";

/**
 * Returns the replacement for the %%category_title%% variable.
 *
 * @returns {string} The category title.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.category_title", "" );
}

/**
 * Represents the category title replacement variable.
 *
 * @returns {Object} The category title replacement variable.
 */
export default {
	name: "category_title",
	label: "Category Title",
	placeholder: "%%category_title%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%category_title%%", "g" ),
};
