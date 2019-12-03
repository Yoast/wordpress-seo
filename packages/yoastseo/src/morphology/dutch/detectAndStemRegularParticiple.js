import nonParticiples from "../../researches/dutch/passiveVoice/nonParticiples.js";

/**
 * Detects whether a word is a regular participle without a prefix and if so, returns the stem.
 *
 * @param {Object}  participleStemmingClasses The Dutch morphology data for verbs.
 * @param {string}  word                The word (not stemmed) to check.
 *
 * @returns {string|null} The stem or null if no participle was matched.
 */
const detectAndStemParticiplesWithoutPrefixes = function( participleStemmingClasses, word ) {
	const geStemTParticipleRegex = new RegExp( "^" + participleStemmingClasses[ 0 ].regex );

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
 * @param {Object}  morphologyDataVerbs The Dutch morphology data for verbs.
 * @param {string}  word                The word (not stemmed) to check.
 *
 * @returns {string|null} The stem or null if no participle with prefix was matched.
 */
const detectAndStemParticiplesWithPrefixes = function( morphologyDataVerbs, word ) {
	/*
	 * It's important to preserve order here, since the ge + stem ending in -t regex is more specific than
	 * the stem + t regex, and therefore must be checked first.
	 */
	for ( const participleClass of morphologyDataVerbs.participleStemmingClasses ) {
		const regex = participleClass.regex;
		const startStem = participleClass.startStem;
		const endStem = participleClass.endStem;
		const separable = participleClass.separable;

		const prefixes = separable
			? morphologyDataVerbs.compoundVerbsPrefixes.separable
			: morphologyDataVerbs.compoundVerbsPrefixes.inseparable;

		const stem = detectAndStemParticiplePerPrefixClass( word, prefixes, regex, startStem, endStem );

		if ( stem ) {
			return stem;
		}
	}

	return null;
};

/**
 * Checks whether the word is on an exception list of participles with an inseparable prefix that normally
 * is separable, and stems it if found on the list.
 *
 * @param {array} dataInseparableExceptions The list of the exception words.
 * @param {string} word 	The (unstemmed) word to check.
 *
 * @returns {null|string} The stemmed word or null if the word was not found on the exception list.
 */
const checkInseparableExceptions = function( dataInseparableExceptions, word ) {
	if ( dataInseparableExceptions.includes( word ) ) {
		return word.slice( 0, -1 );
	}
	return null;
};

/**
 * Detects whether a word is a regular participle and if so, returns the stem.
 *
 * @param {Object}  morphologyDataVerbs The Dutch morphology data for verbs.
 * @param {string}  word                The word (not stemmed) to check.
 *
 * @returns {string} The participle stem or null if no regular participle was matched.
 */
export function detectAndStemRegularParticiple( morphologyDataVerbs, word ) {
	// Check whether the word is not a participle
	if ( word.endsWith( "heid" ) || word.endsWith( "teit" ) || word.endsWith( "tijd" ) || nonParticiples().includes( word ) ) {
		return "";
	}

	let stem = detectAndStemParticiplesWithoutPrefixes( morphologyDataVerbs.participleStemmingClasses, word );

	if ( stem ) {
		return stem;
	}

	// Check whether the word is on an exception list of inseparable compound verbs with a prefix that is usually separable.
	stem = checkInseparableExceptions( morphologyDataVerbs.inseparableCompoundVerbs, word );

	if ( stem ) {
		return stem;
	}

	stem = detectAndStemParticiplesWithPrefixes( morphologyDataVerbs, word );

	if ( stem ) {
		return stem;
	}

	return null;
}
