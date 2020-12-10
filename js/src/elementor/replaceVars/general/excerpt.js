import { select } from "@wordpress/data";
import { excerptFromContent } from "../../../helpers/replacementVariableHelpers";

/**
 * Returns the replacement for the %%excerpt%% variable.
 *
 * @returns {string} The excerpt.
 */
function getReplacement() {
	const {
		getEditorDataContent,
		getEditorDataExcerpt,
	} = select( "yoast-seo/editor" );
	const excerpt = getEditorDataExcerpt();

	// Fallback to the first piece of the content.
	if ( excerpt === "" ) {
		return excerptFromContent( getEditorDataContent() );
	}

	return excerpt;
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
		{
			name: "caption",
			label: "Caption",
			placeholder: "%%caption%%",
		},
	],
	getReplacement,
	regexp: new RegExp( "%%excerpt%%|%%excerpt_only%%|%%caption%%", "g" ),
};
