import { get, isUndefined } from "lodash";

/**
 * Returns the replacement for the %%parent_title%% variable.
 * @returns {string} The parent_title string.
 */
function getReplacement() {
	let text = "";
	const parent = jQuery( "#parent_id, #parent" ).eq( 0 );

	if ( ! isUndefined( parent ) && ! isUndefined( parent.prop( "options" ) ) ) {
		const parentText = parent.find( "option:selected" ).text();

		if ( parentText !== get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.no_parent_text", "" ) ) {
			text = parentText;
		}
	}
	return text;
}

/**
 * Represents the parent_title replacement variable.
 *
 * @returns {Object} The parent_title replacement variable.
 */
export default {
	name: "parent_title",
	label: "Category",
	placeholder: "%%parent_title%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%parent_title%%", "g" ),
};
