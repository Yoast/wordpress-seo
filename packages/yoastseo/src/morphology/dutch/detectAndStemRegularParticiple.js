import nonParticiples from "../../researches/dutch/passiveVoice/nonParticiples.js";
import { doesWordMatchRegex } from "../morphoHelpers/regexHelpers";
import { modifyStem } from "./stemModificationHelpers";

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
 * Checks whether a word that was detected as a participle should not have the suffix (-t or -d) removed because it is part
 * of the stem. For example, in the participle 'geantwoord', the -d belongs to the stem so it should not be removed.
 * The checks are conducted on the word without the prefix, so 'antwoord' in the case of 'geantwoord'.
 *
 * For words ending in -t, there are three checks:
 * 1) An exception list (exceptions to a rule) containing words where -t SHOULD be stemmed,
 * 2) The rule, defined using a regex with word endings where -t is part of the stem,
 * 3) A list of verbs with stem ending in -t, to cover cases that were not possible to find using a regex.
 *
 * For words ending in -d, we check a list of verbs with stem ending in -d.
 *
 * @param {string}	wordWithoutPrefix	The word without prefix(es).
 * @param {Object}	morphologyDataNL	The Dutch morphology data.
 * @returns {boolean}					Whether the suffix should be stemmed.
 */
const shouldSuffixBeStemmed = function( wordWithoutPrefix, morphologyDataNL ) {
	if ( wordWithoutPrefix.endsWith( "t" ) ) {
		// Return true (suffix should be stemmed) if word was found on the exception list of verbs which should have the final -t stemmed.
		const exceptionsTShouldBeStemmed = morphologyDataNL.stemming.stemExceptions.ambiguousTAndDEndings.verbsTShouldBeStemmed;
		if ( exceptionsTShouldBeStemmed.includes( wordWithoutPrefix ) ) {
			return true;
		}
		// Return false (suffix should not be stemmed) if word matches the regex for stems ending in -t.
		if ( doesWordMatchRegex( wordWithoutPrefix, morphologyDataNL.stemming.stemExceptions.ambiguousTAndDEndings.tOrDArePartOfStem.tEnding ) ) {
			return false;
		}
		/*
		 * Return false (suffix should not be stemmed) if the word was found on the list of verbs with stem ending in -t (e.g. haast)
		 * Otherwise, return true (if no checks are matched, the default condition is for -t to be stemmed).
		 */
		const exceptionsTShouldNotBeStemmed = morphologyDataNL.stemming.stemExceptions.wordsNotToBeStemmedExceptions.verbs;
		return ! exceptionsTShouldNotBeStemmed.includes( wordWithoutPrefix );
	}
	if ( wordWithoutPrefix.endsWith( "d" ) ) {
		const exceptionsDShouldNotBeStemmed = morphologyDataNL.verbs.doNotStemD;
		return ! exceptionsDShouldNotBeStemmed.includes( wordWithoutPrefix );
	}
};

/**
 * Detects whether a word is a participle of a regular verb without prefixes other than ge-. If it is, checks whether
 * the word is an exception that should not have the prefix or the suffix stemmed. Then stems the word accordingly
 * (remove prefix, suffix, or both).
 *
 * @param {Object}  morphologyDataNL	The Dutch morphology data.
 * @param {string}  word                The word (not stemmed) to check.
 *
 * @returns {string|null} The stem or null if no participle was matched.
 */
const detectAndStemParticiplesWithoutPrefixes = function( morphologyDataNL, word ) {
	const geStemTParticipleRegex = new RegExp( "^" + morphologyDataNL.verbs.participleStemmingClasses[ 0 ].regex );

	// Check if it's a ge + stem + t/d participle.
	if ( geStemTParticipleRegex.test( word ) ) {
		// Check if the ge- is actually part of the stem. If yes, stem only the suffix.
		const exception = ( checkAndStemIfExceptionWithoutGePrefix( morphologyDataNL.verbs.doNotStemGe, word ) );
		if ( exception ) {
			return exception;
		}

		// Remove the prefix.
		let wordWithoutPrefix = word.slice( 2 );

		// Check if stem starts with ë. If yes, replace ë with e.
		if ( wordWithoutPrefix.startsWith( "ë" ) ) {
			wordWithoutPrefix = "e" + wordWithoutPrefix.slice( 1 );
		}
		// Check whether the suffix should be stemmed. If yes, remove it and return the stem.
		if ( shouldSuffixBeStemmed( wordWithoutPrefix, morphologyDataNL ) ) {
			return ( wordWithoutPrefix.slice( 0, -1 ) );
		}

		return wordWithoutPrefix;
	}

	return null;
};

/**
 * Determines whether a given participle pattern combined with prefixes from a given class (separable or inseparable)
 * applies to a given word and if so, returns the stem.
 *
 * @param {Object}      morphologyDataNL 	The Dutch morphology data.
 * @param {string}      word        		The word (not stemmed) to check.
 * @param {boolean}     separable  			Whether the prefix is separable or not.
 * @param {string[]}    prefixes    		The prefixes of a certain prefix class.
 * @param {string}      regexPart   		The regex part for a given class (completed to a full regex within the function).
 *
 * @returns {string|null} The stem or null if no prefixed participle was matched.
 */
const detectAndStemParticiplePerPrefixClass = function( morphologyDataNL, word, separable, prefixes, regexPart ) {
	for ( const currentPrefix of prefixes ) {
		const participleRegex = new RegExp( "^" + currentPrefix + regexPart );

		if ( participleRegex.test( word ) ) {
			let wordWithoutPrefix = word.slice( currentPrefix.length - word.length );
			/*
			 * After removing a separable prefix, check whether the ge- belongs to the stem (e.g. the -ge- in opgebruikt).
			 * If it does, stem only the suffix.
			 */
			if ( separable ) {
				const exception = ( checkAndStemIfExceptionWithoutGePrefix( morphologyDataNL.verbs.doNotStemGe, wordWithoutPrefix ) );
				if ( exception ) {
					return  ( currentPrefix + exception );
				}
				wordWithoutPrefix = wordWithoutPrefix.slice( 2 );
			}
			// Check whether stem starts with ë. If yes, replace ë with e.
			if ( wordWithoutPrefix.startsWith( "ë" ) ) {
				wordWithoutPrefix = "e" + wordWithoutPrefix.slice( 1 );
			}

			if ( shouldSuffixBeStemmed( wordWithoutPrefix, morphologyDataNL ) ) {
				return ( currentPrefix + ( wordWithoutPrefix.slice( 0, -1 ) ) );
			}
			return ( currentPrefix + wordWithoutPrefix );
		}
	}

	return null;
};

/**
 * Detects whether a word is a regular participle of a compound verb. A compound verb has a prefix in addition to, or instead of, ge-.
 * For example, afgemaakt has the separable prefix af-, and beantwoord has the inseparable prefix be-. If a participle
 * of a compound verb is detected, it is stemmed by removing the ge- (in case of a verb with a separable prefix) and the suffix -t or -d.
 *
 * @param {Object}  morphologyDataNL 	The Dutch morphology data.
 * @param {string}  word                The word (not stemmed) to check.
 *
 * @returns {string|null} The stem or null if no participle with prefix was matched.
 */
const detectAndStemParticiplesWithPrefixes = function( morphologyDataNL, word ) {
	/*
	 * It's important to preserve order here, since the ge + stem ending in -t regex is more specific than
	 * the stem + t regex, and therefore must be checked first.
	 */
	for ( const participleClass of morphologyDataNL.verbs.participleStemmingClasses ) {
		const regex = participleClass.regex;
		const separable = participleClass.separable;

		const prefixes = separable
			? morphologyDataNL.verbs.compoundVerbsPrefixes.separable
			: morphologyDataNL.verbs.compoundVerbsPrefixes.inseparable;

		const stem = detectAndStemParticiplePerPrefixClass( morphologyDataNL, word, separable, prefixes, regex );

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
 * @param {string} 	 word						The word to check.
 * @returns {boolean} Whether the word is found on the exception list.
 */
const checkIfParticipleIsSameAsStem = function( dataParticiplesSameAsStem, word ) {
	return dataParticiplesSameAsStem.includes( word );
};

/**
 * Check whether the word is on an exception list of past participles with inseparable prefixes and ending in -end.
 * If not, stem the word that starts with an inseparable verb prefix and ends in -end as a present participle.
 *
 * @param {array}  inseparablePrefixes      The list of inseparable prefixes.
 * @param {array}  dataExceptionListToCheck The list of the exception words.
 * @param {array}  finalChangesRules        The array of regex-based rules to be applied to the stem.
 * @param {string} word 	                The (unstemmed) word to check.
 *
 * @returns {null|string} The stemmed word or null if the word was found on the exception list.
 */
const checkAndStemIfInseparablePrefixWithEndEnding = function( inseparablePrefixes, dataExceptionListToCheck, finalChangesRules, word ) {
	const startsWithInseparablePrefix = inseparablePrefixes.map( prefix => word.startsWith( prefix ) ).some( value => value === true );

	if ( startsWithInseparablePrefix && word.endsWith( "end" ) && ! dataExceptionListToCheck.includes( word ) ) {
		return modifyStem( word.slice( 0, -3 ), finalChangesRules );
	}
	return null;
};

/**
 * Detects whether a word is a regular participle and if so, returns the stem.
 *
 * @param {Object}  morphologyDataNL 	The Dutch morphology data.
 * @param {string}  word                The word (not stemmed) to check.
 *
 * @returns {string|null} The participle stem or null if no regular participle was matched.
 */
export function detectAndStemRegularParticiple( morphologyDataNL, word ) {
	// Check whether the word is not a participle. If it is not, return empty string.
	if ( word.endsWith( "heid" ) || word.endsWith( "teit" ) || word.endsWith( "tijd" ) || nonParticiples().includes( word ) ) {
		return "";
	}

	/**
	 * Check whether the word is on an exception list of verbs whose participle is the same as the stem. If the word is found
	 * on the list, return the stem.
	 */
	if ( checkIfParticipleIsSameAsStem( morphologyDataNL.verbs.inseparableCompoundVerbsNotToBeStemmed, word ) ) {
		return word;
	}

	// Check and stem if the word is a participle without any separable or inseparable prefix
	let stem = detectAndStemParticiplesWithoutPrefixes( morphologyDataNL, word );

	if ( stem ) {
		return stem;
	}

	/**
	 * Check whether the word is on an exception list of inseparable compound verbs with a prefix that is usually separable.
	 * If it is, remove just the suffix and return the stem.
	 */
	stem = checkAndStemIfExceptionWithoutGePrefix( morphologyDataNL.verbs.inseparableCompoundVerbs, word );

	if ( stem ) {
		return stem;
	}

	/**
	 * Check whether the word is on an exception list of past participles with inseparable prefixes and ending in -end.
	 * If not, stem the word that starts with an inseparable verb prefix and ends in -end as a present participle.
	 */
	stem = checkAndStemIfInseparablePrefixWithEndEnding(
		morphologyDataNL.verbs.compoundVerbsPrefixes.inseparable,
		morphologyDataNL.verbs.pastParticiplesEndingOnEnd,
		morphologyDataNL.stemming.stemModifications.finalChanges,
		word
	);

	if ( stem ) {
		return stem;
	}

	// Check and stem if the word is a participle with a separable or inseparable prefix
	stem = detectAndStemParticiplesWithPrefixes( morphologyDataNL, word );

	if ( stem ) {
		return stem;
	}

	return null;
}
