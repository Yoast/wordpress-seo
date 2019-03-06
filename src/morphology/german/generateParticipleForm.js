/**
 * Adds a prefix and a suffix to a stem in order to create a past participle form
 *
 * @param {string}  stemmedWord             The stemmed word for which to create the past participle form.
 * @param {Object}  affixes                 The suffix and prefix data.
 * @param {string}  [additionalPrefix = ""] An additional prefix to attach to the beginning of the participle.
 *
 * @returns {string} The participle form.
 */
const addParticipleAffixes = function( stemmedWord, affixes, additionalPrefix = "" ) {
	return additionalPrefix + affixes.prefix + stemmedWord + affixes.suffix;
};

/**
 * Generates past participle forms.
 *
 * @param {Object}  morphologyDataVerbs     The German morphology data for verbs.
 * @param {string}  stemmedWord             The stemmed word for which to generate the participle.
 *
 * @returns {string} A past participle form.
 */
const generateRegularParticipleForm = function( morphologyDataVerbs, stemmedWord ) {
	if ( stemmedWord.endsWith( "d" ) || stemmedWord.endsWith( "t" ) ) {
		return addParticipleAffixes( stemmedWord, morphologyDataVerbs.participleAffixes.stemEndsInDOrT );
	}

	return addParticipleAffixes( stemmedWord, morphologyDataVerbs.participleAffixes.regular );
};

/**
 * Generates participle forms with separable prefixes.
 *
 * @param {Object}  morphologyDataVerbs The German morphology data for verbs.
 * @param {string}  stemmedWord         The stem to check.
 *
 * @returns {string} The created participle form.
 */
const generateParticipleFormWithSeparablePrefix = function( morphologyDataVerbs, stemmedWord ) {
	const separablePrefixes = morphologyDataVerbs.verbPrefixesSeparable;

	for ( let i = 0; i < separablePrefixes.length; i++ ) {
		const currentPrefix = separablePrefixes[ i ];

		if ( stemmedWord.startsWith( currentPrefix ) ) {
			const stemmedWordWithoutPrefix = stemmedWord.slice( currentPrefix.length, stemmedWord.length );

			// Test if the stemmed word is already a participle form itself.
			if ( stemmedWordWithoutPrefix.startsWith( "ge" ) ) {
				return "";
			}

			if ( stemmedWord.endsWith( "d" ) || stemmedWord.endsWith( "t" ) ) {
				return addParticipleAffixes( stemmedWordWithoutPrefix, morphologyDataVerbs.participleAffixes.stemEndsInDOrT, currentPrefix );
			}

			return addParticipleAffixes( stemmedWordWithoutPrefix, morphologyDataVerbs.participleAffixes.regular, currentPrefix );
		}
	}

	return "";
};

/**
 * Generates participle forms for a given stem.
 *
 * @param {Object}  morphologyDataVerbs The German morphology data for verbs.
 * @param {string}  stemmedWord         The stem to check.
 *
 * @returns {string} The created participle form.
 */
export function generateParticipleForm( morphologyDataVerbs, stemmedWord ) {
	// @todo needs to check here if a form is a participle - > not necessary because we stem participles before this function is called


	if ( generateParticipleFormWithSeparablePrefix( morphologyDataVerbs, stemmedWord ) !== "" ) {
		return generateParticipleFormWithSeparablePrefix( morphologyDataVerbs, stemmedWord );
	}

	return generateRegularParticipleForm( morphologyDataVerbs, stemmedWord );
}
