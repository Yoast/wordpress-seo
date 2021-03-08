import { get } from "lodash";

/**
 * Returns the replacement for the %%term_description%% variable.
 *
 * @returns {string} The term_description.
 */
function getReplacement() {
	return get( window, "YoastSEO.app.rawData.text", "" );
}

/**
 * Represents the term_description replacement variable.
 *
 * @returns {Object} The term_description replacement variable.
 */
export default {
	name: "term_description",
	label: "Term description",
	placeholder: "%%term_description%%",
	aliases: [
		{
			name: "tag_description",
			label: "Tag description",
			placeholder: "%%tag_description%%",
		},
		{
			name: "category_description",
			label: "Category description",
			placeholder: "%%category_description%%",
		},
	],
	getReplacement,
	regexp: new RegExp( "%%term_description%%|%%tag_description%%|%%category_description%%", "g" ),
};
