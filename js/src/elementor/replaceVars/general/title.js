import { select } from "@wordpress/data";

/**
 * Returns the replacement for the %%title%% variable.
 *
 * @returns {string} The title.
 */
function getReplacement() {
	return select( "yoast-seo/editor" ).getEditorDataTitle();
}

/**
 * Represents the title replacement variable.
 *
 * @returns {Object} The title replacement variable.
 */
export default {
	name: "title",
	label: "Title",
	placeholder: "%%title%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%title%%", "g" ),
};
