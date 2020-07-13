/**
 * Creates a basic stem for Hebrew by stripping common prefixes.
 *
 * @param {string} word The word for which to create a basic stem.
 *
 * @return {string} The basic stem.
 */
export function createBasicStem( word ) {
	const prefixes = [ "ב", "ה", "ו", "כ", "ל", "מ", "ש" ];

	if ( prefixes.some( prefix => word.startsWith( prefix ) ) ) {
		word = word.slice( 1 );
	}

	return word;
}
