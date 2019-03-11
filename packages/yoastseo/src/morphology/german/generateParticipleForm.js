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
 * Generates participle forms with separable or separable/inseparable prefixes.
 *
 * @param {Object}      morphologyDataVerbs The German morphology data for verbs.
 * @param {string}      stemmedWord         The stem to check.
 * @param {string[]}    prefixes            The prefixes to check.
 *
 * @returns {string} The created participle form.
 */
const generateParticipleFormWithSeparablePrefix = function( morphologyDataVerbs, stemmedWord, prefixes ) {
	for ( const currentPrefix of prefixes ) {
		if ( stemmedWord.startsWith( currentPrefix ) ) {
			const stemmedWordWithoutPrefix = stemmedWord.slice( currentPrefix.length, stemmedWord.length );

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
	let participleFormWithPrefix = generateParticipleFormWithSeparablePrefix(
		morphologyDataVerbs,
		stemmedWord,
		morphologyDataVerbs.verbPrefixesSeparable
	);

	if ( participleFormWithPrefix.length > 0 ) {
		return participleFormWithPrefix;
	}

	/*
	 * Check forms with a separable/non-separable prefix used in its separable form, e.g. ("überkochen" - "übergekocht")
	 * For its these prefixes used in the inseparable form, the resulting participle would be the same as
	 * the 3rd person singular, so we don't need to create a separate form here (e.g., "überführen" - "überführt").
	 */
	participleFormWithPrefix = generateParticipleFormWithSeparablePrefix(
		morphologyDataVerbs,
		stemmedWord,
		morphologyDataVerbs.verbPrefixesSeparableOrInseparable
	);

	if ( participleFormWithPrefix.length > 0 ) {
		return participleFormWithPrefix;
	}

	return generateRegularParticipleForm( morphologyDataVerbs, stemmedWord );
}
