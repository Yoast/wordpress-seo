import exceptionsParticiplesActive from "../../config/internal/exceptionsParticiplesActive";
import { exceptions } from "../../config/internal/regex";

/**
 * Detects whether a word is a regular participle without a prefix and if so, returns the stem.
 *
 * @param {Object}  morphologyDataVerbs The German morphology data for verbs.
 * @param {string}  word                The word (not stemmed) to check.
 *
 * @returns {string|null} The stem or null if no participle was matched.
 */
const detectAndStemParticiplesWithoutPrefixes = function( morphologyDataVerbs, word ) {
	const geStemTParticipleRegex = new RegExp( "^" + morphologyDataVerbs.participleStemmingClasses[ 1 ].regex );
	const geStemEtParticipleRegex = new RegExp( "^" + morphologyDataVerbs.participleStemmingClasses[ 0 ].regex );

	/*
	 * Check if it's a ge + stem ending in d/t + et participle.
	 * As this is the more specific regex, it needs to be checked before the ge + stem + t regex.
	 */
	if ( geStemEtParticipleRegex.test( word ) ) {
		// Remove the two-letter prefix and the two-letter suffix.
		return ( word.slice( 2, word.length - 2 ) );
	}

	// Check if it's a ge + stem + t participle.
	if ( geStemTParticipleRegex.test( word ) ) {
		// Remove the two-letter prefix and the one-letter suffix.
		return ( word.slice( 2, word.length - 1 ) );
	}

	return null;
};

/**
 * Determines whether a given participle pattern combined with prefixes from a given class applies to a given word
 * and if so, returns the stem.
 *
 * @param {string}      word        The word (not stemmed) to check.
 * @param {string[]}    prefixes    The prefixes of a certain prefix class.
 * @param {string}      regexPart   The regex part for a given class (completed to a full regex within the function).
 * @param {number}      startStem   Where to start cutting off the de-prefixed word.
 * @param {number}      endStem     Where to end cutting off the de-prefixed word (from the end index).
 *
 * @returns {string|null} The stem or null if no prefixed participle was matched.
 */
const detectAndStemParticiplePerPrefixClass = function( word, prefixes, regexPart, startStem, endStem ) {
	for ( const currentPrefix of prefixes ) {
		const participleRegex = new RegExp( "^" + currentPrefix + regexPart );

		if ( participleRegex.test( word ) ) {
			const wordWithoutPrefix = word.slice( currentPrefix.length - word.length );
			const wordWithoutParticipleAffixes = wordWithoutPrefix.slice( startStem, wordWithoutPrefix.length - endStem );

			return ( currentPrefix + wordWithoutParticipleAffixes );
		}
	}

	return null;
};

/**
 * Detects whether a word is a regular participle with a prefix and if so, returns the stem.
 *
 * @param {Object}  morphologyDataVerbs The German morphology data for verbs.
 * @param {string}  word                The word (not stemmed) to check.
 *
 * @returns {string|null} The stem or null if no participle with prefix was matched.
 */
const detectAndStemParticiplesWithPrefixes = function( morphologyDataVerbs, word ) {
	const prefixesSeparableOrInseparable = morphologyDataVerbs.prefixes.separableOrInseparable;

	/*
	 * It's important to preserve order here, since the ge + stem ending in d/t + et regex is more specific than
	 * the ge + stem + t regex, and therefore must be checked first.
	 */
	for ( const participleClass of morphologyDataVerbs.participleStemmingClasses ) {
		const regex = participleClass.regex;
		const startStem = participleClass.startStem;
		const endStem = participleClass.endStem;
		const separable = participleClass.separable;

		const prefixes = separable
			? morphologyDataVerbs.prefixes.separable
			: morphologyDataVerbs.prefixes.inseparable;

		let stem = detectAndStemParticiplePerPrefixClass( word, prefixes, regex, startStem, endStem );

		if ( stem ) {
			return stem;
		}

		stem = detectAndStemParticiplePerPrefixClass( word, prefixesSeparableOrInseparable, regex, startStem, endStem );

		if ( stem ) {
			return stem;
		}
	}

	return null;
};

/**
 * Detects whether a word is a regular participle and if so, returns the stem.
 *
 * @param {Object}  morphologyDataVerbs The German morphology data for verbs.
 * @param {string}  word                The word (not stemmed) to check.
 *
 * @returns {string|null} The participle stem or null if no regular participle was matched.
 */
export function detectAndStemRegularParticiple( morphologyDataVerbs, word ) {
	if ( exceptions( word ).length > 0 || exceptionsParticiplesActive().includes( word ) ) {
		return "";
	}

	let stem = detectAndStemParticiplesWithoutPrefixes( morphologyDataVerbs, word );

	if ( stem ) {
		return stem;
	}

	stem = detectAndStemParticiplesWithPrefixes( morphologyDataVerbs, word );

	if ( stem ) {
		return stem;
	}

	return null;
}
