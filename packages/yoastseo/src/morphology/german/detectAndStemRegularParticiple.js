import exceptionsParticiplesActive from "../../researches/german/passiveVoice/exceptionsParticiplesActive";
import { exceptions } from "../../researches/german/passiveVoice/regex";

/**
 * Detects whether a word is a regular participle without a prefix and if so, returns the stem.
 *
 * @param {Object}  morphologyDataVerbs The German morphology data for verbs.
 * @param {string}  word                The word (not stemmed) to check.
 *
 * @returns {string}    The stem.
 */
const detectAndStemParticiplesWithoutPrefixes = function( morphologyDataVerbs, word ) {
	const participleRegex1 = new RegExp( "^" + morphologyDataVerbs.participleRegexes.participleRegexGeStemTEnd );
	const participleRegex2 = new RegExp( "^" + morphologyDataVerbs.participleRegexes.participleRegexGeStemTdEt );

	/*
	 * Check if it's a ge + stem ending in d/t + et participle.
	 * As this is the more specific regex, it needs to be checked before the ge + stem + t regex.
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

	return "";
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
 * @returns {string} The stem.
 */
const detectAndStemParticiplePerPrefixClass = function( word, prefixes, regexPart, startStem, endStem ) {
	for ( let i = 0; i < prefixes.length; i++ ) {
		const currentPrefix = prefixes[ i ];
		const participleRegex = new RegExp( "^" + currentPrefix + regexPart );

		if ( participleRegex.test( word ) ) {
			const wordWithoutPrefix = word.slice( currentPrefix.length - word.length );
			const wordWithoutParticipleAffixes = wordWithoutPrefix.slice( startStem, wordWithoutPrefix.length - endStem );

			return ( currentPrefix + wordWithoutParticipleAffixes );
		}
	}

	return "";
};

/**
 * Detects whether a word is a regular participle with a prefix and if so, returns the stem.
 *
 * @param {Object}  morphologyDataVerbs The German morphology data for verbs.
 * @param {string}  word                The word (not stemmed) to check.
 *
 * @returns {string} The stem.
 */
const detectAndStemParticiplesWithPrefixes = function( morphologyDataVerbs, word ) {
	const prefixExceptionChecks = [
		/*
		 * Check if it's a separable prefix + ge + stem ending in d/t + et participle.
		 * As this is the more specific regex, which needs to be checked before the ge + stem + t regex.
		 */
		() => {
			return detectAndStemParticiplePerPrefixClass(
				word,
				morphologyDataVerbs.verbPrefixesSeparable,
				morphologyDataVerbs.participleRegexes.participleRegexGeStemTdEt,
				2,
				2,
			);
		},
		// Check if it's a separable prefix + ge + stem + t participle.
		() => {
			return detectAndStemParticiplePerPrefixClass(
				word,
				morphologyDataVerbs.verbPrefixesSeparable,
				morphologyDataVerbs.participleRegexes.participleRegexGeStemTEnd,
				2,
				1,
			);
		},
		// Check if it's an inseparable prefix + stem ending in d/t + et participle.
		() => {
			return detectAndStemParticiplePerPrefixClass(
				word,
				morphologyDataVerbs.verbPrefixesInseparable,
				morphologyDataVerbs.participleRegexes.participleRegexStemTdEt,
				0,
				2,
			);
		},
		// Check if it's an inseparable prefix + stem + t/sst participle.
		() => {
			return detectAndStemParticiplePerPrefixClass(
				word,
				morphologyDataVerbs.verbPrefixesInseparable,
				morphologyDataVerbs.participleRegexes.participleRegexStemTSst,
				0,
				1,
			);
		},
		/*
	    * Check if it's a separable/inseparable prefix + ge + stem ending in d/t + et participle.
	    * As this is the more specific regex, which needs to be checked before the ge + stem + t regex.
	    */
		() => {
			return detectAndStemParticiplePerPrefixClass(
				word,
				morphologyDataVerbs.verbPrefixesSeparableOrInseparable,
				morphologyDataVerbs.participleRegexes.participleRegexGeStemTdEt,
				2,
				2,
			);
		},
		// Check if it's a separable/inseparable prefix + ge + stem + t participle.
		() => {
			return detectAndStemParticiplePerPrefixClass(
				word,
				morphologyDataVerbs.verbPrefixesSeparableOrInseparable,
				morphologyDataVerbs.participleRegexes.participleRegexGeStemTEnd,
				2,
				1,
			);
		},
		// Check if it's an separable/inseparable prefix + stem ending in d/t + et participle.
		() => {
			return detectAndStemParticiplePerPrefixClass(
				word,
				morphologyDataVerbs.verbPrefixesSeparableOrInseparable,
				morphologyDataVerbs.participleRegexes.participleRegexStemTdEt,
				0,
				2,
			);
		},
		// Check if it's an separable/inseparable prefix + stem + t/sst participle.
		() => {
			return detectAndStemParticiplePerPrefixClass(
				word,
				morphologyDataVerbs.verbPrefixesSeparableOrInseparable,
				morphologyDataVerbs.participleRegexes.participleRegexStemTSst,
				0,
				1,
			);
		},
	];

	for ( let i = 0; i < prefixExceptionChecks.length; i++ ) {
		const stem = prefixExceptionChecks[ i ]();
		if ( stem.length > 0 ) {
			return stem;
		}
	}

	return "";
};

/**
 * Detects whether a word is a regular participle and if so, returns the stem.
 *
 * @param {Object}  morphologyDataVerbs The German morphology data for verbs.
 * @param {string}  word                The word (not stemmed) to check.
 *
 * @returns {string} The stem.
 */
export function detectAndStemRegularParticiple( morphologyDataVerbs, word ) {
	if ( exceptions( word ).length > 0 || exceptionsParticiplesActive().includes( word ) ) {
		return "";
	}

	let stem = detectAndStemParticiplesWithoutPrefixes( morphologyDataVerbs, word );

	if ( stem.length > 0 ) {
		return stem;
	}

	stem = detectAndStemParticiplesWithPrefixes( morphologyDataVerbs, word );

	if ( stem.length > 0 ) {
		return stem;
	}

	return "";
}
