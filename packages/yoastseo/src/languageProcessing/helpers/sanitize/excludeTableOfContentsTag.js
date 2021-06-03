const tableOfContentsTagRegex = new RegExp( "(<div class='wp-block-yoast-seo-table-of-contents yoast-table-of-contents'>).*?(</div>)", "igs" );

/**
 * Excludes table of contents text
 *
 * @param {String} text The text to check
 *
 * @returns {String}    The stripped text
 */
export default function excludeTableOfContentsTag( text ) {
	text = text.replace( tableOfContentsTagRegex, "" );
	return text;
}
