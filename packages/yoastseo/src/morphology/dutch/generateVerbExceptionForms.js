import { addVerbSuffixes } from "./addVerbSuffixes";
import { applySuffixesToStem } from "../morphoHelpers/suffixHelpers";
import { flatten } from "lodash-es";
import { flattenSortLength } from "../morphoHelpers/flattenSortLength";
import { findAndApplyModificationsVerbsNouns } from "./suffixHelpers";

/**
 * Creates the present forms of irregular strong verbs.
 *
 * @param {Object} verb The list that contains the present, past and participle stems of strong verbs.
 * @param {Object} morphologyDataVerbs The Dutch morphology data file for verbs.
 * @param {Object} morphologyDataAddSuffixes The Dutch morphology data for adding suffixes.
 * @param {string} stemmedWord The stem.
 *
 * @returns {string[]} The verb forms created.
 */
const createIrregularStrongVerbsPresent = function( verb, morphologyDataVerbs, morphologyDataAddSuffixes, stemmedWord ) {
	const enAndEndSuffixes = morphologyDataVerbs.suffixesWithStemModification;
	const modifiedPresentStem = findAndApplyModificationsVerbsNouns( verb.present, morphologyDataAddSuffixes );
	const forms = [
		verb.present,
		...applySuffixesToStem( modifiedPresentStem,  enAndEndSuffixes ),
	];
	if ( stemmedWord.endsWith( "t" ) ) {
		return forms;
	}
	forms.push( verb.present.concat( "t" ) );
	return forms;
};

/**
 * Creates the past forms of irregular strong verbs.
 *
 * @param {Object} verb The list that contains the present, past and participle stems of strong verbs.
 * @param {Object} morphologyDataVerbs The Dutch morphology data file for verbs.
 * @param {Object} morphologyDataAddSuffixes The Dutch morphology data for adding suffixes.
 *
 * @returns {string[]} The verb forms created.
 */
const createIrregularStrongVerbsPast = function( verb, morphologyDataVerbs, morphologyDataAddSuffixes ) {
	const modifiedPastStem = findAndApplyModificationsVerbsNouns( verb.past, morphologyDataAddSuffixes );
	const enAndEndSuffixes = morphologyDataVerbs.suffixesWithStemModification;
	return [
		verb.past,
		modifiedPastStem.concat( enAndEndSuffixes[ 0 ] ),
	];
};

/**
 * Creates the past participle form(s) of strong verbs
 *
 * @param {string} stem The list that contains the present, past and participle stems of strong verbs.
 * @param {string} suffix The array containing the participle suffix
 * @param {Object} morphologyDataVerbs The Dutch morphology data file for verbs.
 * @param {Object} morphologyDataAddSuffixes The Dutch morphology data for adding suffixes.
 * @returns {string} The verb forms created.
 */
const createIrregularStrongVerbsParticiple = function( stem, suffix, morphologyDataVerbs, morphologyDataAddSuffixes ) {
	// Create the past participle form which gets suffix -en. Requires stem modification beforehand.
	if ( suffix === morphologyDataVerbs.strongAndIrregularVerbs.suffixes.pastParticipleEn ) {
		return findAndApplyModificationsVerbsNouns( stem, morphologyDataAddSuffixes ).concat( suffix );
	}
	/*
	 * Create the past participle form which gets suffix -t or -d.
	 * If the participle stem ends in either -t or -d, it would not get any additional suffix.
	 * If the stem ends in neither -d or -t, it will get suffix -t.
	*/
	if ( stem.endsWith( "t" ) || stem.endsWith( "d" ) ) {
		return stem;
	}
	return stem.concat( suffix );
};

/**
 * Checks whether the stemmed word is listed in the strong verbs exception list.
 *
 * @param {Object} verb The list that contains the present, past and participle stems of strong verbs.
 * @param {string} stemmedWord The stem.
 * @returns {boolean} Whether the stem is listed in the exception list.
 */
const checkStems = function( verb, stemmedWord ) {
	if ( Object.values( verb ).indexOf( stemmedWord ) > -1 ) {
		return true;
	}
};

/**
 * Creates the verb forms of strong verbs which have regular past form including the ones which have two past participle forms.
 *
 * @param {Object} morphologyDataVerbs The Dutch morphology data file for verbs.
 * @param {Object} morphologyDataAddSuffixes The Dutch morphology data for adding suffixes.
 * @param {string} stemmedWord The stem.
 *
 * @returns {string[]} The verb forms created.
 */
const generateStrongRegularVerbs = function( morphologyDataVerbs, morphologyDataAddSuffixes, stemmedWord ) {
	const regularStrongVerbs = morphologyDataVerbs.strongAndIrregularVerbs.strongVerbStems.regularStrongVerbs;
	const suffixEn = morphologyDataVerbs.strongAndIrregularVerbs.suffixes.pastParticipleEn;
	const suffixT = morphologyDataVerbs.strongAndIrregularVerbs.suffixes.pastParticipleT;
	// Creates the verb forms of strong verbs which have regular past form and have two past participle forms (-en and -d).
	for ( const verb of regularStrongVerbs.regularStrongVerbsEnAndDEnding ) {
		if ( checkStems( verb, stemmedWord ) ) {
			return [
				verb.stem,
				...addVerbSuffixes( verb.stem, morphologyDataAddSuffixes, morphologyDataVerbs ),
				createIrregularStrongVerbsParticiple( verb.participle[ 0 ], suffixEn, morphologyDataVerbs, morphologyDataAddSuffixes ),
				createIrregularStrongVerbsParticiple( verb.participle[ 1 ], suffixT, morphologyDataVerbs, morphologyDataAddSuffixes ),
			];
		}
	}
	// Creates the verb forms of strong verbs which have regular past form and receive suffix -en in participle form.
	for ( const verb of regularStrongVerbs.regularStrongVerbsEnEnding ) {
		if ( checkStems( verb, stemmedWord ) ) {
			return [
				verb.stem,
				...addVerbSuffixes( verb.stem, morphologyDataAddSuffixes, morphologyDataVerbs ),
				createIrregularStrongVerbsParticiple( verb.participle, suffixEn, morphologyDataVerbs, morphologyDataAddSuffixes ),
			];
		}
	}
	return [];
};

/**
 * Creates the verb forms of strong verbs which have irregular simple past and past participle form.
 *
 * @param {Object} morphologyDataVerbs The Dutch morphology data file for verbs.
 * @param {Object} morphologyDataAddSuffixes The Dutch morphology data for adding suffixes.
 * @param {string} stemmedWord The stem.
 *
 * @returns {string[]} The verb forms created.
 */
const generateIrregularStrongVerbs = function( morphologyDataVerbs, morphologyDataAddSuffixes, stemmedWord ) {
	const irregularStrongVerbs = morphologyDataVerbs.strongAndIrregularVerbs.strongVerbStems.irregularStrongVerbs;
	const suffixEn = morphologyDataVerbs.strongAndIrregularVerbs.suffixes.pastParticipleEn;
	const suffixT = morphologyDataVerbs.strongAndIrregularVerbs.suffixes.pastParticipleT;
	/*
	 * Creates the verb forms of strong verbs which have irregular past form
	 * and whose past participle is the same with simple past plural form
	*/
	for ( const verb of irregularStrongVerbs.strongVerbsWithSamePastPluralAndParticipleEn ) {
		if ( checkStems( verb, stemmedWord ) ) {
			return [
				...createIrregularStrongVerbsPresent( verb, morphologyDataVerbs, morphologyDataAddSuffixes, stemmedWord ),
				...createIrregularStrongVerbsPast( verb, morphologyDataVerbs, morphologyDataAddSuffixes ),
			];
		}
	}
	// Creates the verb forms of strong verbs which have irregular past form and receive suffix -en in participle form.
	for ( const verb of irregularStrongVerbs.irregularStrongVerbsEnEnding ) {
		if ( checkStems( verb, stemmedWord ) ) {
			return [
				...createIrregularStrongVerbsPresent( verb, morphologyDataVerbs, morphologyDataAddSuffixes, stemmedWord ),
				...createIrregularStrongVerbsPast( verb, morphologyDataVerbs, morphologyDataAddSuffixes ),
				createIrregularStrongVerbsParticiple( verb.participle, suffixEn, morphologyDataVerbs, morphologyDataAddSuffixes ),
			];
		}
	}
	// Creates the verb forms of strong verbs which have irregular past form and receive suffix -t/-d in participle form.
	for ( const verb of irregularStrongVerbs.irregularStrongVerbsDOrTEnding ) {
		if ( checkStems( verb, stemmedWord ) ) {
			return [
				...createIrregularStrongVerbsPresent( verb, morphologyDataVerbs, morphologyDataAddSuffixes, stemmedWord ),
				...createIrregularStrongVerbsPast( verb, morphologyDataVerbs, morphologyDataAddSuffixes ),
				createIrregularStrongVerbsParticiple( verb.participle, suffixT, morphologyDataVerbs, morphologyDataAddSuffixes ),
			];
		}
	}

	// Creates the verb forms of strong verbs in which their past form do not need to double their last consonant before attaching -en.
	for ( const verb of irregularStrongVerbs.noConsonantDoublingStrongVerbsEnEnding ) {
		if ( checkStems( verb, stemmedWord ) ) {
			return [
				...createIrregularStrongVerbsPresent( verb, morphologyDataVerbs, morphologyDataAddSuffixes, stemmedWord ),
				verb.past,
				// The past stem does not need to undergo stem modification before attaching suffix -en.
				verb.past.concat( suffixEn ),
				createIrregularStrongVerbsParticiple( verb.participle, suffixEn, morphologyDataVerbs, morphologyDataAddSuffixes ),
			];
		}
	}
	return [];
};

/**
 * Creates the present and past forms of strong verbs whose both regular and irregular past forms.
 *
 * @param {Object} verb The list that contains the present, past and participle stems of strong verbs.
 * @param {Object} morphologyDataVerbs The Dutch morphology data file for verbs.
 * @param {Object} morphologyDataAddSuffixes The Dutch morphology data for adding suffixes.
 *
 * @returns {string[]} The verb forms created.
 */
const createFormsBothRegularAndIrregularStrongVerbs = function( verb, morphologyDataVerbs, morphologyDataAddSuffixes ) {
	const suffixEn = morphologyDataVerbs.strongAndIrregularVerbs.suffixes.pastParticipleEn;
	return [
		verb.regularStem,
		...addVerbSuffixes( verb.regularStem, morphologyDataAddSuffixes, morphologyDataVerbs ),
		verb.irregularStem,
		findAndApplyModificationsVerbsNouns( verb.irregularStem, morphologyDataAddSuffixes ).concat( suffixEn ),
	];
};

/**
 * Creates the verb forms of strong verbs which have both regular and irregular past forms.
 *
 * @param {Object} morphologyDataVerbs The Dutch morphology data file for verbs.
 * @param {Object} morphologyDataAddSuffixes The Dutch morphology data for adding suffixes.
 * @param {string} stemmedWord The stem.
 *
 * @returns {string[]} The verb forms created.
 */
const generateBothRegularAndIrregularStrongVerbs = function( morphologyDataVerbs, morphologyDataAddSuffixes, stemmedWord ) {
	const bothRegularAndIrregularStrongVerbs = morphologyDataVerbs.strongAndIrregularVerbs.strongVerbStems.bothRegularAndIrregularStrongVerbs;
	const suffixEn = morphologyDataVerbs.strongAndIrregularVerbs.suffixes.pastParticipleEn;
	const suffixT = morphologyDataVerbs.strongAndIrregularVerbs.suffixes.pastParticipleT;
	/*
	 * Creates the verb forms of strong verbs which have both regular and irregular past form
	 * and whose past participle is the same with simple present plural form
	*/
	for ( const verb of bothRegularAndIrregularStrongVerbs.bothRegularAndIrregularStrongVerbsNoParticiple ) {
		if ( checkStems( verb, stemmedWord ) ) {
			return createFormsBothRegularAndIrregularStrongVerbs( verb, morphologyDataVerbs, morphologyDataAddSuffixes );
		}
	}
	// Creates the verb forms of strong verbs which have both regular and irregular past form and receive suffix -en and -d/-t in participle form
	for ( const verb of bothRegularAndIrregularStrongVerbs.bothRegularAndIrregularStrongVerbsTwoParticiples ) {
		if ( checkStems( verb, stemmedWord ) ) {
			return [
				...createFormsBothRegularAndIrregularStrongVerbs( verb, morphologyDataVerbs, morphologyDataAddSuffixes ),
				createIrregularStrongVerbsParticiple( verb.participle[ 0 ], suffixEn, morphologyDataVerbs, morphologyDataAddSuffixes ),
				createIrregularStrongVerbsParticiple( verb.participle[ 1 ], suffixT, morphologyDataVerbs, morphologyDataAddSuffixes ),
			];
		}
	}
	// Creates the verb forms of strong verbs which have both regular and irregular past form and receive suffix -en in participle form
	for ( const verb of bothRegularAndIrregularStrongVerbs.bothRegularAndIrregularStrongVerbsEnEnding ) {
		if ( checkStems( verb, stemmedWord ) ) {
			return [
				...createFormsBothRegularAndIrregularStrongVerbs( verb, morphologyDataVerbs, morphologyDataAddSuffixes ),
				createIrregularStrongVerbsParticiple( verb.participle, suffixEn, morphologyDataVerbs, morphologyDataAddSuffixes ),
			];
		}
	}
	return [];
};

/**
 * Checks whether a given stem falls into any of the verb exception categories and creates the
 * correct forms if that is the case.
 *
 * @param {Object} morphologyDataVerbs The Dutch morphology data file for verbs.
 * @param {Object} morphologyDataAddSuffixes The Dutch morphology data for adding suffixes.
 * @param {string} stemmedWord The stem to check.
 *
 * @returns {string[]} The created verb forms.
 */
export function generateVerbExceptionForms( morphologyDataVerbs, morphologyDataAddSuffixes, stemmedWord ) {
	const doNotStemPrefix = morphologyDataVerbs.strongAndIrregularVerbs.doNotStemPrefix;
	const prefixes = flattenSortLength( morphologyDataVerbs.compoundVerbsPrefixes );
	// Check whether the inputted stem is started with one of the separable compound prefixes
	let foundPrefix = prefixes.find( prefix => stemmedWord.startsWith( prefix ) );
	let stemmedWordWithoutPrefix = "";

	// Check whether the stemmedWord is in the list of strong verbs starting with be-, ont- or ver- that do not need to be stemmed.
	if ( doNotStemPrefix.includes( stemmedWord ) ) {
		foundPrefix = null;
		// If the inputted stem is started with one of the separable compound prefixes, the prefix needs to be deleted for now.
	} else if ( typeof( foundPrefix ) === "string" ) {
		stemmedWordWithoutPrefix = stemmedWord.slice( foundPrefix.length );
		// At least 3 characters so that e.g. "be" is not found in the stem "berg".
		if ( stemmedWordWithoutPrefix.length > 2 ) {
			stemmedWord = stemmedWordWithoutPrefix;
		} else {
			// Reset foundPrefix so that it won't be attached when forms are generated.
			foundPrefix = null;
		}
	}
	// Check whether the stemmed word without prefix is listed in the exception list below. If it is, creates the verb form according to the list.
	const exceptionChecks = [
		generateStrongRegularVerbs,
		generateBothRegularAndIrregularStrongVerbs,
		generateIrregularStrongVerbs,
	];
	let exceptions = [];
	for ( let i = 0; i < exceptionChecks.length; i++ ) {
		const exceptionWords = exceptionChecks[ i ]( morphologyDataVerbs, morphologyDataAddSuffixes, stemmedWord );
		if ( exceptionWords.length > 0 ) {
			exceptions.push( exceptionWords );
		}
	}
	exceptions = flatten( exceptions );
	// If the original stem had a verb prefix, attach it back to the found exception forms.
	if ( typeof( foundPrefix ) === "string" ) {
		exceptions = exceptions.map( word => foundPrefix + word );
	}
	return exceptions;
}
