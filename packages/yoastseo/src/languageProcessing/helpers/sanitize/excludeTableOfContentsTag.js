const tableOfContentsTagRegex = new RegExp( "(<div class='wp-block-yoast-seo-table-of-contents yoast-table-of-contents'>).*?(</div>)", "igs" );

/**
 * Excludes table of contents from text.
 *
 * @param {String} text The text to check.
 *
 * @returns {String} The text without table of contents.
 */
export default function excludeTableOfContentsTag( text ) {
	text = text.replace( tableOfContentsTagRegex, "" );
	return text;
}
