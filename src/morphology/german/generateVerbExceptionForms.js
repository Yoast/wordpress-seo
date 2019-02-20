import { applySuffixesToStem, applySuffixesToStems } from "../morphoHelpers/suffixHelpers";
import { flattenDeep, forOwn, uniq as unique } from "lodash-es";

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
	const suffixes = {
		present: dataStrongVerbs.suffixes.presentAllClasses.slice(),
		pastParticiple: new Array( dataStrongVerbs.suffixes.pastParticiple.slice() ),
	};

	const suffixesPerClass = dataStrongVerbs.suffixes.classDependent;

	// Add class-specific suffixes.
	forOwn( suffixesPerClass, function( stemData, stemClass ) {
		if ( stemClass === verbClass ) {
			forOwn( stemData, function( additionalSuffixes, suffixClass ) {
				suffixes[ suffixClass ] = additionalSuffixes;
			} );
		}
	} );

	const forms = [ stems.present, stems.past ];

	forOwn( stems, function( stem, stemClass ) {
		forms.push(
			Array.isArray( stem )
				? applySuffixesToStems( stem, suffixes[ stemClass ] )
				: applySuffixesToStem( stem, suffixes[ stemClass ] )
		);
	} );

	return unique( flattenDeep( forms ) );
};

/**
 * Checks whether a verb falls into a given strong verb exception paradigm and if so,
 * returns the correct forms.
 *
 * @param {Object}  morphologyDataVerbs The German morphology data for verbs.
 * @param {Object}  paradigm              The current paradigm to generate forms for.
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
	stemsFlattened = flattenDeep( stemsFlattened );

	/*
	 * Sort in order to make sure that if the stem to check is e.g. "gehalt", "halt" isn't matched before "gehalt".
	 * (Both are part of the same paradigm). Otherwise, if "halt" is matched, the "ge" will be interpreted as preceding
	 * lexical material and added to all forms.
	 */
	stemsFlattened = stemsFlattened.sort( ( a, b ) => b.length - a.length );

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

	for ( let i = 0; i < stems.length; i++ ) {
		const paradigm = stems[ i ];

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
	let exceptions = [];

	const prefixes = morphologyDataVerbs.verbPrefixes;
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
	exceptions = generateFormsStrongVerbs( morphologyDataVerbs, stemmedWordToCheck, foundPrefix );

	// If the original stem had a verb prefix, attach it to the found exception forms.
	if ( typeof( foundPrefix ) === "string" ) {
		exceptions = exceptions.map( word => foundPrefix.concat( word ) );
	}

	if ( exceptions.length > 0 ) {
		return exceptions;
	}

	return exceptions;
}
