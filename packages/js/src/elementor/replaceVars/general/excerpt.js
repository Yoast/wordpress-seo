import { select } from "@wordpress/data";

/**
 * Returns the replacement for the %%excerpt%% variable.
 *
 * @returns {string} The excerpt.
 */
function getReplacement() {
	return select( "yoast-seo/editor" ).getEditorDataExcerptWithFallback();
}

/**
 * Represents the excerpt replacement variable.
 *
 * @returns {Object} The excerpt replacement variable.
 */
export default {
	name: "excerpt",
	label: "Excerpt",
	placeholder: "%%excerpt%%",
	aliases: [
		{
			name: "excerpt_only",
			label: "Excerpt only",
			placeholder: "%%excerpt_only%%",
		},
	],
	getReplacement,
	regexp: new RegExp( "%%excerpt%%|%%excerpt_only%%", "g" ),
};
