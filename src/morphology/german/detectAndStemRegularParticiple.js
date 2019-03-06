import exceptionsParticiplesActive from "../../researches/german/passiveVoice/exceptionsParticiplesActive";
import { exceptions } from "../../researches/german/passiveVoice/regex";

export function detectAndStemRegularParticiple( morphologyDataVerbs, word ) {
	const participleRegex1 = new RegExp( "^" + morphologyDataVerbs.participleRegexes.participleRegexGeStemTEnd );
	const participleRegex2 = new RegExp( "^" + morphologyDataVerbs.participleRegexes.participleRegexGeStemTdEt );

	if ( exceptions( word ).length > 0 || exceptionsParticiplesActive().includes( word ) ) {
		return "";
	}

	/*
	 * Check if it's a ge + stem ending in d/t + et participle.
	 * As this is the more specific regex, which needs to be checked before the ge + stem + t regex.
	 */
	if ( participleRegex2.test( word ) ) {
		// Remove the two-letter prefix and the two-letter suffix.
		return ( word.slice( 2, word.length - 2 ) );
	}

	// Check if it's a ge + stem + t participle.
	if ( participleRegex1.test( word ) ) {
		// Remove the two-letter prefix and the one-letter suffix.
		return ( word.slice( 2, word.length - 1 ) );
	}

	/*
	 * Check if it's a separable prefix + ge + stem ending in d/t + et participle.
	 * As this is the more specific regex, which needs to be checked before the ge + stem + t regex.
	 */
	for ( let i = 0; i < morphologyDataVerbs.verbPrefixesSeparable.length; i++ ) {
		const currentPrefix = morphologyDataVerbs.verbPrefixesSeparable[ i ];
		const participleRegex = new RegExp( "^" + currentPrefix + morphologyDataVerbs.participleRegexes.participleRegexGeStemTdEt );

		if ( participleRegex.test( word ) ) {
			const wordWithoutPrefix = word.slice( currentPrefix.length - word.length );
			const wordWithoutParticipleAffixes = wordWithoutPrefix.slice( 2, wordWithoutPrefix.length - 2 );

			return ( currentPrefix + wordWithoutParticipleAffixes );
		}
	}

	// Check if it's a separable prefix + ge + stem + t participle.
	for ( let i = 0; i < morphologyDataVerbs.verbPrefixesSeparable.length; i++ ) {
		const currentPrefix = morphologyDataVerbs.verbPrefixesSeparable[ i ];
		const participleRegex = new RegExp( "^" + currentPrefix + morphologyDataVerbs.participleRegexes.participleRegexGeStemTEnd );

		if ( participleRegex.test( word ) ) {
			const wordWithoutPrefix = word.slice( currentPrefix.length - word.length );
			const wordWithoutParticipleAffixes = wordWithoutPrefix.slice( 2, wordWithoutPrefix.length - 1 );

			return ( currentPrefix + wordWithoutParticipleAffixes );
		}
	}

	/*
	 * Check if it's an inseparable prefix + stem ending in d/t + et participle.
	 * As this is the more specific regex, which needs to be checked before the ge + stem + t regex.
	 */
	for ( let i = 0; i < morphologyDataVerbs.verbPrefixesInseparable.length; i++ ) {
		const currentPrefix = morphologyDataVerbs.verbPrefixesInseparable[ i ];
		const participleRegex = new RegExp( "^" + currentPrefix + morphologyDataVerbs.participleRegexes.participleRegexStemTdEt );

		if ( participleRegex.test( word ) ) {
			const wordWithoutPrefix = word.slice( currentPrefix.length - word.length );
			const wordWithoutParticipleAffixes = wordWithoutPrefix.slice( 0, wordWithoutPrefix.length - 2 );

			return ( currentPrefix + wordWithoutParticipleAffixes );
		}
	}

	// Check if it's an inseparable prefix + stem + t/sst participle.
	for ( let i = 0; i < morphologyDataVerbs.verbPrefixesInseparable.length; i++ ) {
		const currentPrefix = morphologyDataVerbs.verbPrefixesInseparable[ i ];
		const participleRegex = new RegExp( "^" + currentPrefix + morphologyDataVerbs.participleRegexes.participleRegexStemTSst );

		if ( participleRegex.test( word ) ) {
			const wordWithoutPrefix = word.slice( currentPrefix.length - word.length );
			const wordWithoutParticipleAffixes = wordWithoutPrefix.slice( 0, wordWithoutPrefix.length - 1 );

			return ( currentPrefix + wordWithoutParticipleAffixes );
		}
	}

	return [];
}
