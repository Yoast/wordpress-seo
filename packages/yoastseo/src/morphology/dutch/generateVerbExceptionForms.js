import {
	findAndApplyModifications,
	addVerbSuffixes,
} from "./addVerbSuffixes";
import { applySuffixesToStem } from "../morphoHelpers/suffixHelpers";
import { flatten } from "lodash-es";
/**
 * Creates the verb forms of strong verbs which have regular past form including the ones which have two past participle forms.
 *
 * @param {Object} morphologyDataVerbs			The Dutch morphology data file for verbs.
 * @param {Object} morphologyDataAddSuffixes	The Dutch morphology data for adding suffixes.
 * @param {string} stemmedWord					The stem.
 *
 * @returns {string[]}							The verb forms created.
 */
export function generateStrongRegularVerbs( morphologyDataVerbs, morphologyDataAddSuffixes, stemmedWord ) {
	const regularStrongVerbs = morphologyDataVerbs.strongAndIrregularVerbs.strongVerbStems.regularStrongVerbs;
	const suffixPastParticipleD = morphologyDataVerbs.strongAndIrregularVerbs.suffixes.pastParticipleD;
	const suffixEn = morphologyDataVerbs.strongAndIrregularVerbs.suffixes.pastParticipleEn;
	//	Creates the verb forms of strong verbs which have regular past form and have two past participle forms.
	for ( const verb of regularStrongVerbs.regularStrongVerbsEnAndDEnding ) {
		if ( verb.stem === stemmedWord || verb.participle === stemmedWord ) {
			const modifiedParticiple = findAndApplyModifications( verb.participle, morphologyDataAddSuffixes, morphologyDataVerbs );
			return [
				verb.stem,
				...addVerbSuffixes( verb.stem, morphologyDataAddSuffixes, morphologyDataVerbs ),
				modifiedParticiple.concat( suffixEn ),
				verb.participle.concat( suffixPastParticipleD ),
			];
		}
	}
	// 	Creates the verb forms of strong verbs which have regular past form and receive suffix -en in participle form.
	for ( const verb of regularStrongVerbs.regularStrongVerbsEnEnding ) {
		if ( verb.stem === stemmedWord || verb.participle === stemmedWord ) {
			return [
				verb.stem,
				...addVerbSuffixes( verb.stem, morphologyDataAddSuffixes, morphologyDataVerbs ),
				findAndApplyModifications( verb.participle, morphologyDataAddSuffixes, morphologyDataVerbs ).concat( suffixEn ),
			];
		}
	}
	return [];
}

/**
 * Creates the present and past forms of irregular strong verbs.
 *
 * @param {Object} verb				The list that contains the present, past and participle stems of strong verbs.
 * @param {Object} morphologyDataVerbs			The Dutch morphology data file for verbs.
 * @param {Object} morphologyDataAddSuffixes	The Dutch morphology data for adding suffixes.
 * @param {string} stemmedWord					The stem.
 *
 * @returns {string[]}							The verb forms created.
 */
const createIrregularStrongVerbsPresentAndPast = function( verb, morphologyDataVerbs, morphologyDataAddSuffixes, stemmedWord ) {
	const presentSuffixE = morphologyDataVerbs.suffixesWithStemModification;
	const modifiedPresentStem = findAndApplyModifications( verb.present, morphologyDataAddSuffixes, morphologyDataVerbs );
	const modifiedPastStem = findAndApplyModifications( verb.past, morphologyDataAddSuffixes, morphologyDataVerbs );
	const forms = [
		modifiedPastStem.concat( presentSuffixE[ 0 ] ),
		verb.past,
		verb.present,
		...applySuffixesToStem( modifiedPresentStem,  presentSuffixE ),
	];
	if ( stemmedWord.endsWith( "t" ) ) {
		return forms;
	}
	forms.push( stemmedWord.concat( "t" ) );
	return forms;
};
/**
 * Creates the verb forms of strong verbs which have irregular simple past and past participle form.
 *
 * @param {Object} morphologyDataVerbs			The Dutch morphology data file for verbs.
 * @param {Object} morphologyDataAddSuffixes	The Dutch morphology data for adding suffixes.
 * @param {string} stemmedWord					The stem.
 *
 * @returns {string[]}							The verb forms created.
 */
export function generateIrregularStrongVerbs( morphologyDataVerbs, morphologyDataAddSuffixes, stemmedWord ) {
	const irregularStrongVerbs = morphologyDataVerbs.strongAndIrregularVerbs.strongVerbStems.irregularStrongVerbs;
	const suffixEn = morphologyDataVerbs.strongAndIrregularVerbs.suffixes.pastParticipleEn;
	//	Creates the verb forms of strong verbs which have irregular past form
	// 	And whose past participle is the same with simple past plural form
	for ( const verb of irregularStrongVerbs.strongVerbsWithSamePastPluralAndParticipleEn ) {
		if ( verb.present === stemmedWord || verb.past === stemmedWord ) {
			return createIrregularStrongVerbsPresentAndPast( verb, morphologyDataVerbs, morphologyDataAddSuffixes, stemmedWord );
		}
	}
	// 	Creates the verb forms of strong verbs which have irregular past form and receive suffix -en in participle form.
	for ( const verb of irregularStrongVerbs.irregularStrongVerbsEnEnding ) {
		if ( verb.present === stemmedWord || verb.past === stemmedWord || verb.participle === stemmedWord ) {
			return [
				...createIrregularStrongVerbsPresentAndPast( verb, morphologyDataVerbs, morphologyDataAddSuffixes, stemmedWord ),
				findAndApplyModifications( verb.participle, morphologyDataAddSuffixes, morphologyDataVerbs ).concat( suffixEn ),
			];
		}
	}
	// 	Creates the verb forms of strong verbs which have irregular past form and receive suffix -t/-d in participle form.
	for ( const verb of irregularStrongVerbs.irregularStrongVerbsDOrTEnding ) {
		if ( verb.present === stemmedWord || verb.past === stemmedWord || verb.participle === stemmedWord ) {
			// Excluding the past participle forms in the return statement
			return createIrregularStrongVerbsPresentAndPast( verb, morphologyDataVerbs, morphologyDataAddSuffixes, stemmedWord );
		}
	}
	//	Creates the verb forms of strong verbs in which their past form do not need to double their last consonant before attaching -en
	for ( const verb of irregularStrongVerbs.noConsonantDoublingStrongVerbsEnEnding ) {
		if ( verb.present === stemmedWord || verb.past === stemmedWord || verb.participle === stemmedWord ) {
			const forms = createIrregularStrongVerbsPresentAndPast( verb, morphologyDataVerbs, morphologyDataAddSuffixes, stemmedWord );
			return [
				verb.past.concat( suffixEn ),
				...forms.slice( 1, forms.length ),
				findAndApplyModifications( verb.participle, morphologyDataAddSuffixes, morphologyDataVerbs ).concat( suffixEn ),
			];
		}
	}
	return [];
}
/**
 * Creates the present and past forms of strong verbs whose both regular and irregular past forms.
 *
 * @param {Object} verb				The list that contains the present, past and participle stems of strong verbs.
 * @param {Object} morphologyDataVerbs			The Dutch morphology data file for verbs.
 * @param {Object} morphologyDataAddSuffixes	The Dutch morphology data for adding suffixes.
 *
 * @returns {string[]}							The verb forms created.
 */
const createFormsBothRegularAndIrregularStrongVerbs = function( verb, morphologyDataVerbs, morphologyDataAddSuffixes ) {
	const suffixEn = morphologyDataVerbs.strongAndIrregularVerbs.suffixes.pastParticipleEn;
	const forms = [
		verb.regularStem,
		...addVerbSuffixes( verb.regularStem, morphologyDataAddSuffixes, morphologyDataVerbs ),
		verb.irregularStem,
		findAndApplyModifications( verb.irregularStem, morphologyDataAddSuffixes, morphologyDataVerbs ).concat( suffixEn ),
	];
	return forms;
};

/**
 * Creates the verb forms of strong verbs which have both regular and irregular past forms.
 *
 * @param {Object} morphologyDataVerbs			The Dutch morphology data file for verbs.
 * @param {Object} morphologyDataAddSuffixes	The Dutch morphology data for adding suffixes.
 * @param {string} stemmedWord					The stem.
 *
 * @returns {string[]}							The verb forms created.
 */
export function generateBothRegularAndIrregularStrongVerbs( morphologyDataVerbs, morphologyDataAddSuffixes, stemmedWord ) {
	const bothRegularAndIrregularStrongVerbs = morphologyDataVerbs.strongAndIrregularVerbs.strongVerbStems.bothRegularAndIrregularStrongVerbs;
	const suffixEn = morphologyDataVerbs.strongAndIrregularVerbs.suffixes.pastParticipleEn;
	//	Creates the verb forms of strong verbs which have both regular and irregular past form
	// 	And whose past participle is the same with simple present plural form
	for ( const verb of bothRegularAndIrregularStrongVerbs.bothRegularAndIrregularStrongVerbsNoParticiple ) {
		if ( verb.regularStem === stemmedWord || verb.irregularStem === stemmedWord ) {
			return createFormsBothRegularAndIrregularStrongVerbs( verb, morphologyDataVerbs, morphologyDataAddSuffixes );
		}
	}
	//	Creates the verb forms of strong verbs which have both regular and irregular past form and receive suffix -en and -d/-t in participle form
	for ( const verb of bothRegularAndIrregularStrongVerbs.bothRegularAndIrregularStrongVerbsEnAndTOrDEnding ) {
		if ( verb.regularStem === stemmedWord || verb.irregularStem === stemmedWord ) {
			// Excluding the past participle forms in the return statement
			return createFormsBothRegularAndIrregularStrongVerbs( verb, morphologyDataVerbs, morphologyDataAddSuffixes );
		}
	}
	//	Creates the verb forms of strong verbs which have both regular and irregular past form and receive suffix -en in participle form
	for ( const verb of bothRegularAndIrregularStrongVerbs.bothRegularAndIrregularStrongVerbsEnEnding ) {
		if ( verb.regularStem === stemmedWord || verb.irregularStem === stemmedWord ) {
			return [
				...createFormsBothRegularAndIrregularStrongVerbs( verb, morphologyDataVerbs, morphologyDataAddSuffixes ),
				findAndApplyModifications( verb.participle, morphologyDataAddSuffixes, morphologyDataVerbs ).concat( suffixEn ),
			];
		}
	}
	return [];
}

/**
 * Checks whether a given stem falls into any of the verb exception categories and creates the
 * correct forms if that is the case.
 *
 * @param {Object} morphologyDataVerbs			The Dutch morphology data file for verbs.
 * @param {Object} morphologyDataAddSuffixes	The Dutch morphology data for adding suffixes.
 * @param {string} stemmedWord					The stem to check.
 *
 * @returns {string[]} The created verb forms.
 */
export function generateVerbExceptionForms( morphologyDataVerbs, morphologyDataAddSuffixes, stemmedWord ) {
	const prefixes = morphologyDataVerbs.compoundVerbsPrefixes.separable;
	let stemmedWordWithoutPrefix = "";

	//	Check whether the inputted stem is started with one of the separable compound prefixes
	let foundPrefix = prefixes.find( prefix => stemmedWord.startsWith( prefix ) );

	//	If the inputted stem is started with one of the separable compound prefixes, the prefix needs to be deleted for now.
	if ( typeof( foundPrefix ) === "string" ) {
		stemmedWordWithoutPrefix = stemmedWord.slice( foundPrefix.length );
	}

	// At least 3 characters so that e.g. "be" is not found in the stem "berg".
	if ( stemmedWordWithoutPrefix.length > 2 && typeof( foundPrefix ) === "string" ) {
		stemmedWord = stemmedWordWithoutPrefix;
	} else {
		// Reset foundPrefix so that it won't be attached when forms are generated.
		foundPrefix = null;
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
	// If the original stem had a verb prefix, attach it to the found exception forms.
	if ( typeof( foundPrefix ) === "string" ) {
		exceptions = exceptions.map( word => foundPrefix + word );
	}
	return exceptions;
}
