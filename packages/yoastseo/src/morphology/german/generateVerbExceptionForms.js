import { applySuffixesToStem, applySuffixesToStems } from "../morphoHelpers/suffixHelpers";
import { flatten, forOwn, uniq as unique } from "lodash-es";
import { allGermanVerbPrefixesSorted } from "./helpers";

/**
 * Adds suffixes to a given strong verb paradigm.
 *
 * @param {Object}  dataStrongVerbs The German morphology data for strong verbs.
 * @param {string}  verbClass       The verb class of the paradigm.
 * @param {Object}  stems           The stems of the paradigm.
 *
 * @returns {string[]} The created forms.
 */
const addSuffixesStrongVerbParadigm = function( dataStrongVerbs, verbClass, stems ) {
	// All classes have the same present and participle suffixes.
	const basicSuffixes = {
		present: dataStrongVerbs.suffixes.presentAllClasses.slice(),
		pastParticiple: new Array( dataStrongVerbs.suffixes.pastParticiple ),
	};

	// Add class-specific suffixes.
	const additionalSuffixes = dataStrongVerbs.suffixes.classDependent[ verbClass ];
	const allSuffixes = { ...basicSuffixes, ...additionalSuffixes };

	// Add the present and the past stem, since these can also be forms on their own.
	const forms = [ stems.present, stems.past ];

	forOwn( stems, function( stem, stemClass ) {
		forms.push(
			Array.isArray( stem )
				? applySuffixesToStems( stem, allSuffixes[ stemClass ] )
				: applySuffixesToStem( stem, allSuffixes[ stemClass ] )
		);
	} );

	return unique( flatten( forms ) );
};

/**
 * Checks whether a verb falls into a given strong verb exception paradigm and if so,
 * returns the correct forms.
 *
 * @param {Object}  morphologyDataVerbs The German morphology data for verbs.
 * @param {Object}  paradigm            The current paradigm to generate forms for.
 * @param {string}  stemmedWordToCheck  The stem to check.
 *
 * @returns {string[]} The created verb forms.
 */
const generateFormsPerParadigm = function( morphologyDataVerbs, paradigm, stemmedWordToCheck ) {
	const verbClass = paradigm.class;
	const stems = paradigm.stems;

	let stemsFlattened = [];

	forOwn( stems, ( stem ) => stemsFlattened.push( stem ) );
	// Some stem types have two forms, which means that a stem type can also contain an array. These get flattened here.
	stemsFlattened = flatten( stemsFlattened );

	if ( stemsFlattened.includes( stemmedWordToCheck ) ) {
		return addSuffixesStrongVerbParadigm( morphologyDataVerbs.strongVerbs, verbClass, stems );
	}

	return [];
};

/**
 * Checks whether a verb falls into one of the exception classes of strong verbs and if so,
 * returns the correct forms.
 *
 * @param {Object}  morphologyDataVerbs The German morphology data for verbs.
 * @param {string}  stemmedWordToCheck  The stem to check.
 *
 * @returns {string[]} The created verb forms.
 */
const generateFormsStrongVerbs = function( morphologyDataVerbs, stemmedWordToCheck ) {
	const stems = morphologyDataVerbs.strongVerbs.stems;

	for ( const paradigm of stems ) {
		const forms = generateFormsPerParadigm( morphologyDataVerbs, paradigm, stemmedWordToCheck );

		if ( forms.length > 0 ) {
			return forms;
		}
	}

	return [];
};

/**
 * Checks whether a give stem stem falls into any of the verb exception categories and creates the
 * correct forms if that is the case.
 *
 * @param {Object}  morphologyDataVerbs The German morphology data for verbs.
 * @param {string}  stemmedWordToCheck  The stem to check.
 *
 * @returns {string[]} The created verb forms.
 */
export function generateVerbExceptionForms( morphologyDataVerbs, stemmedWordToCheck ) {
	const prefixes = allGermanVerbPrefixesSorted( morphologyDataVerbs.prefixes );
	let stemmedWordToCheckWithoutPrefix = "";

	let foundPrefix = prefixes.find( prefix => stemmedWordToCheck.startsWith( prefix ) );

	if ( typeof( foundPrefix ) === "string" ) {
		stemmedWordToCheckWithoutPrefix = stemmedWordToCheck.slice( foundPrefix.length );
	}

	// At least 3 characters so that e.g. "be" is not found in the stem "berg".
	if ( stemmedWordToCheckWithoutPrefix.length > 2 && typeof( foundPrefix ) === "string" ) {
		stemmedWordToCheck = stemmedWordToCheckWithoutPrefix;
	} else {
		// Reset foundPrefix so that it won't be attached when forms are generated.
		foundPrefix = null;
	}

	// Check exceptions with full forms.
	let exceptions = generateFormsStrongVerbs( morphologyDataVerbs, stemmedWordToCheck );

	// If the original stem had a verb prefix, attach it to the found exception forms.
	if ( typeof( foundPrefix ) === "string" ) {
		exceptions = exceptions.map( word => foundPrefix + word );
	}

	if ( exceptions.length > 0 ) {
		return exceptions;
	}

	return exceptions;
}
