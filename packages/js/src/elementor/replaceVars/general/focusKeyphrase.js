import { select } from "@wordpress/data";

/**
 * Returns the replacement for the %%keyword%% variable.
 *
 * @returns {string} The keyword.
 */
function getReplacement() {
	return select( "yoast-seo/editor" ).getFocusKeyphrase();
}

/**
 * Represents the focus keyword replacement variable.
 *
 * @returns {Object} The focus keyword replacement variable.
 */
export default {
	name: "focuskw",
	label: "Focus keyphrase",
	placeholder: "%%focuskw%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%focuskw%%|%%keyword%%", "g" ),
};
