import {
	isUndefined,
} from "lodash-es";

/**
 * Returns the replacement for the %%parent_title%% variable.
 * @returns {string} The parent_title string.
 */
function getReplacement() {
	let text = "";
	const parent = jQuery( "#parent_id, #parent" ).eq( 0 );

	if ( ! isUndefined( parent ) && ! isUndefined( parent.prop( "options" ) ) ) {
		const parentText = parent.find( "option:selected" ).text();

		if ( parentText !== window.wpseoScriptData.analysis.plugins.replaceVars.no_parent_text ) {
			text = parentText;
		}
	}
	return text;
}

/**
 * Replaces the %%parent_title%% variable in a text if in scope.
 *
 * @param {string} text The text to replace the variable in.
 * @returns {string} The modified text.
 */
export default function replace( text ) {
	return text.replace(
		new RegExp( "%%parent_title%%", "g" ),
		getReplacement()
	);
}
