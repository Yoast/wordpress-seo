import nonParticiples from "../../researches/dutch/passiveVoice/nonParticiples.js";

/**
 * Checks whether the word is on an exception list of participles that do not have a ge- prefix. If it is found on the list,
 * remove only the last letter (the suffix).
 *
 * @param {array} dataExceptionListToCheck The list of the exception words.
 * @param {string} word 	The (unstemmed) word to check.
 *
 * @returns {null|string} The stemmed word or null if the word was not found on the exception list.
 */
const checkAndStemIfExceptionWithoutGePrefix = function( dataExceptionListToCheck, word ) {
	if ( dataExceptionListToCheck.includes( word ) ) {
		return word.slice( 0, -1 );
	}
	return null;
};

/**
 * Detects whether a word is a participle of a regular verb without prefixes other than ge-. If it is, it stems the
 * participle by removing the prefix ge- (unless ge- is part of the stem) and the suffix -t or -d.
 *
 * @param {Object}  morphologyDataVerbs The Dutch morphology data for verbs.
 * @param {string}  word                The word (not stemmed) to check.
 *
 * @returns {string|null} The stem or null if no participle was matched.
 */
const detectAndStemParticiplesWithoutPrefixes = function( morphologyDataVerbs, word ) {
	const geStemTParticipleRegex = new RegExp( "^" + morphologyDataVerbs.participleStemmingClasses[ 0 ].regex );

	// Check if it's a ge + stem + t participle.
	if ( geStemTParticipleRegex.test( word ) ) {
		// Check if the ge- is actually part of the stem. If yes, stem only the suffix.
		const exception = ( checkAndStemIfExceptionWithoutGePrefix( morphologyDataVerbs.doNotStemGe, word ) );
		if ( exception ) {
			return exception;
		}

		// Remove the two-letter prefix and the one-letter suffix.
		return ( word.slice( 2, word.length - 1 ) );
	}

	return null;
};

/**
 * Determines whether a given participle pattern combined with prefixes from a given class (separable or inseparable)
 * applies to a given word and if so, returns the stem.
 *
 * @param {Object}      morphologyDataVerbs        The Dutch morphology data for verbs.
 * @param {string}      word        The word (not stemmed) to check.
 * @param {boolean}     separable   Whether the prefix is separable or not.
 * @param {string[]}    prefixes    The prefixes of a certain prefix class.
 * @param {string}      regexPart   The regex part for a given class (completed to a full regex within the function).
 * @param {number}      startStem   Where to start cutting off the de-prefixed word.
 *
 * @returns {string|null} The stem or null if no prefixed participle was matched.
 */
const detectAndStemParticiplePerPrefixClass = function( morphologyDataVerbs, word, separable, prefixes, regexPart, startStem ) {
	for ( const currentPrefix of prefixes ) {
		const participleRegex = new RegExp( "^" + currentPrefix + regexPart );

		if ( participleRegex.test( word ) ) {
			const wordWithoutPrefix = word.slice( currentPrefix.length - word.length );
			/**
			 * After removing a separable prefix, check whether the ge- belongs to the stem (e.g. the -ge- in opgebruikt).
			 * If it does, stem only the suffix.
			 */
			if ( separable ) {
				const exception = ( checkAndStemIfExceptionWithoutGePrefix( morphologyDataVerbs.doNotStemGe, wordWithoutPrefix ) );
				if ( exception ) {
					return  ( currentPrefix + exception );
				}
			}
			// Remove the suffix -t or -d (the last letter of the word).
			const wordWithoutParticipleAffixes = wordWithoutPrefix.slice( startStem, wordWithoutPrefix.length - 1 );

			// Attached the separable or inseparable prefix back and return the stem
			return ( currentPrefix + wordWithoutParticipleAffixes );
		}
	}

	return null;
};

/**
 * Detects whether a word is a regular participle of a compound verb. A compound verb has a prefix in addition to, or instead of, ge-.
 * For example, afgemaakt has the separable prefix af-, and beantwoord has the inseparable prefix be-. If a participle
 * of a compound verb is detected, it is stemmed by removing the ge- (in case of a verb with a separable prefix) and the suffix -t or -d.
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

		const stem = detectAndStemParticiplePerPrefixClass( morphologyDataVerbs, word, separable, prefixes, regex, startStem, endStem );

		if ( stem ) {
			return stem;
		}
	}

	return null;
};

/**
 *  Checks whether the word is on the list of participles that do not need to be stemmed, because the participle form
 *  is the same as the stem.
 *
 * @param {string[]} dataParticiplesSameAsStem	The list of exceptions whose stem is the same as the participle.
 * @param {string} word		The word to check.
 * @returns {boolean} Whether the word is found on the exception list.
 */
const checkIfParticipleIsSameAsStem = function( dataParticiplesSameAsStem, word ) {
	return dataParticiplesSameAsStem.includes( word );
};

/**
 * Detects whether a word is a regular participle and if so, returns the stem.
 *
 * @param {Object}  morphologyDataVerbs The Dutch morphology data for verbs.
 * @param {string}  word                The word (not stemmed) to check.
 *
 * @returns {string|null} The participle stem or null if no regular participle was matched.
 */
export function detectAndStemRegularParticiple( morphologyDataVerbs, word ) {

	// Check whether the word is not a participle. If it is not, return empty string.
	if ( word.endsWith( "heid" ) || word.endsWith( "teit" ) || word.endsWith( "tijd" ) || nonParticiples().includes( word ) ) {
		return "";
	}

	/**
	 * Check whether the word is on an exception list of verbs whose participle is the same as the stem. If the word is found
	 * on the list, return the stem.
	 */
	if ( checkIfParticipleIsSameAsStem( morphologyDataVerbs.inseparableCompoundVerbsNotToBeStemmed, word ) ) {
		return word;
	}

	let stem = detectAndStemParticiplesWithoutPrefixes( morphologyDataVerbs, word );

	if ( stem ) {
		return stem;
	}

	/**
	 * Check whether the word is on an exception list of inseparable compound verbs with a prefix that is usually separable.
	 * If it is, remove just the suffix and return the stem.
	 */
	stem = checkAndStemIfExceptionWithoutGePrefix( morphologyDataVerbs.inseparableCompoundVerbs, word );

	if ( stem ) {
		return stem;
	}

	stem = detectAndStemParticiplesWithPrefixes( morphologyDataVerbs, word );

	if ( stem ) {
		return stem;
	}

	return null;
}
