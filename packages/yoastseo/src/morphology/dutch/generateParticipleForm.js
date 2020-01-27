/**
 *  Checks whether the stem is on the list of stems with a separable prefix that in this specific verb acts
 *  as inseparable. The exception list includes only those stems that need to take the -d suffix. Those that need
 *  the -t suffix or no suffix are the same as another form (1st or 3rd person singular) created elsewhere.
 *
 * @param {string} stemmedWord The stem to check.
 * @param {string[]} inseparableCompoundVerbsStems	The list of exception stems.
 * @returns {string|null} The created participle form or null if the stem was not found on the exception list.
 */
const generateInseparableExceptionParticipleForm = function( stemmedWord, inseparableCompoundVerbsStems ) {
	if ( inseparableCompoundVerbsStems.includes( stemmedWord ) ) {
		return stemmedWord + "d";
	}
};

/**
 * Determines which suffix should be attached to the stem based on the stem ending. If f or s is preceded by a
 * diphthong or double vowel, the suffix should be -d, but if anything else precedes f or s, the suffix should be
 * -t. This is why the more specific f/s rule for the -d suffix is checked first.
 *
 * @param {Object} morphologyDataVerbs 	The Dutch morphology data for verbs.
 * @param {string} stemmedWord	The stemmed word.
 * @returns {Object} The affixes.
 */
const determineSuffix = function( morphologyDataVerbs, stemmedWord ) {
	if ( stemmedWord.endsWith( "d" ) || stemmedWord.endsWith( "t" ) ) {
		return "";
	}
	if ( stemmedWord.search( new RegExp( morphologyDataVerbs.participleStemEndings.dSuffix ) ) !== -1 ) {
		return morphologyDataVerbs.participleAffixes.dSuffix;
	}
	if ( stemmedWord.search( new RegExp( morphologyDataVerbs.participleStemEndings.tSuffix ) ) !== -1 ) {
		return morphologyDataVerbs.participleAffixes.tSuffix;
	}
	return morphologyDataVerbs.participleAffixes.dSuffix;
};

/**
 * Generates past participle forms for stems without separable or inseprable prefixes.
 *
 * @param {Object}  morphologyDataVerbs     The Dutch morphology data for verbs.
 * @param {string}  stemmedWord             The stemmed word for which to generate the participle.
 * @param {string}  suffix            		The suffix to add.
 * @returns {string} A past participle form.
 */
const generateRegularParticipleForm = function( morphologyDataVerbs, stemmedWord, suffix ) {
	const prefix = morphologyDataVerbs.participleAffixes.prefix;

	return prefix + stemmedWord + suffix;
};

/**
 * Generates participle forms with separable prefixes.
 *
 * @param {Object}      morphologyDataVerbs The Dutch morphology data for verbs.
 * @param {string}      stemmedWord         The stem to check.
 * @param {string}      suffix        		The suffix to add.
 * @param {string[]}    prefixes            The prefixes to check.
 *
 * @returns {string|null} The created participle form or null if the stem doesn't start with a prefix.
 */
const generateParticipleFormWithSeparablePrefix = function( morphologyDataVerbs, stemmedWord, suffix, prefixes ) {
	for ( const currentPrefix of prefixes ) {
		if ( stemmedWord.startsWith( currentPrefix ) ) {
			const stemmedWordWithoutPrefix = stemmedWord.slice( currentPrefix.length, stemmedWord.length );

			const prefix = morphologyDataVerbs.participleAffixes.prefix;

			return currentPrefix + prefix + stemmedWordWithoutPrefix + suffix;
		}
	}

	return null;
};

/**
 * Checks whether the stem begins with an inseparable prefix and returns the prefix if it is found.
 *
 * @param {Object} morphologyDataVerbs	The Dutch morphology data for verbs.
 * @param {string} stemmedWord	The stem to check.
 * @param {string[]} prefixes	The prefixes to check.
 * @returns {string|null}	The participle form or null if the stem doesn't start with a prefix or if it takes
 * 							the -d suffix.
 */
const checkInseparablePrefix = function( morphologyDataVerbs, stemmedWord, prefixes ) {
	for ( const currentPrefix of prefixes ) {
		if ( stemmedWord.startsWith( currentPrefix ) )  {
			return currentPrefix;
		}
	}
	return null;
};

/**
 * Generates participle forms for a given stem.
 *
 * @param {Object}  morphologyDataVerbs The Dutch morphology data for verbs.
 * @param {string}  stemmedWord         The stem to check.
 * @returns {string|null} The created participle form or null if no participle needs to be created.
 */
export function generateParticipleForm( morphologyDataVerbs, stemmedWord ) {
	const inseparableExceptionParticiple = generateInseparableExceptionParticipleForm(
		stemmedWord,
		morphologyDataVerbs.inseparableCompoundVerbsStems
	);

	if ( inseparableExceptionParticiple ) {
		return inseparableExceptionParticiple;
	}

	const suffix = determineSuffix( morphologyDataVerbs, stemmedWord );

	const participleFormWithSeparablePrefix = generateParticipleFormWithSeparablePrefix(
		morphologyDataVerbs,
		stemmedWord,
		suffix,
		morphologyDataVerbs.compoundVerbsPrefixes.separable
	);

	if ( participleFormWithSeparablePrefix ) {
		return participleFormWithSeparablePrefix;
	}

	const inseparablePrefix = checkInseparablePrefix(
		morphologyDataVerbs,
		stemmedWord,
		morphologyDataVerbs.compoundVerbsPrefixes.inseparable
	);

	/** If an inseparable prefix is found, the participle form should only be created if the stem takes the -d suffix
	 * in the participle. If it takes the -t suffix or on suffix, then it is the same as the third person singular present
	 * form so there is no need to create the participle form. */
	if ( inseparablePrefix ) {
		if ( suffix === "d" ) {
			return stemmedWord + suffix;
		}
		return null;
	}
	return generateRegularParticipleForm( morphologyDataVerbs, stemmedWord, suffix );
}
