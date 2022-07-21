const estimatedReadingTimeRegex = new RegExp( "(<p class='yoast-reading-time__wrapper'>).*?(<\\/p>)",
	"gmi" );

/**
 * Excludes table of contents from text.
 *
 * @param {String} text The text to check.
 *
 * @returns {String} The text without table of contents.
 */
export default function excludeEstimatedReadingTime( text ) {
	console.log( text );
	text = text.replace( estimatedReadingTimeRegex, "" );
	console.log( text );
	return text.trim();
}
