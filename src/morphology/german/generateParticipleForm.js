/**
 * Adds a prefix and a suffix to a stem in order to create a past participle form
 *
 * @param {string}  stemmedWord The stemmed word on which to
 * @param {Object}  affixes     The suffix and prefix data.
 *
 * @returns {string} The participle form.
 */
const addParticipleAffixes = function( stemmedWord, affixes ) {
	return affixes.prefix + stemmedWord + affixes.suffix;
};

/**
 * Generates past participle forms.
 *
 * @param {Object}  morphologyDataVerbs     The German morphology data for verbs.
 * @param {string}  stemmedWord             The stemmed word for which to generate the participle.
 *
 * @returns {string} A past participle form.
 */
export function generateParticipleForm( morphologyDataVerbs, stemmedWord ) {
	if ( stemmedWord.endsWith( "d" ) || stemmedWord.endsWith( "t" ) ) {
		return addParticipleAffixes( stemmedWord, morphologyDataVerbs.participleAffixes.stemEndsInDOrT );
	}

	return addParticipleAffixes( stemmedWord, morphologyDataVerbs.participleAffixes.regular );
}
