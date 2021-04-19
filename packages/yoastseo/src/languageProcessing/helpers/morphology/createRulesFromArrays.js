/**
 * Creates an object with a regex and a replacement pair to be processed.
 *
 * @param {Array}   rule        A pair or triplet of strings of which the first one is the regex to match
 *                              and the second (and the third) is the replacement.
 * @param {string}  [flags=i]   The regex flags to use.
 *
 * @returns {{ reg: RegExp, repl: string }|{ reg: RegExp, repl1: string, repl2: string }|null} Object to be used in the regex-based rules.
 */
const createSingleRuleFromArray = function( rule, flags = "i" ) {
	if ( rule.length === 2 ) {
		return {
			reg: new RegExp( rule[ 0 ], flags ),
			repl: rule[ 1 ],
		};
	}
	if ( rule.length === 3 ) {
		return {
			reg: new RegExp( rule[ 0 ], flags ),
			repl1: rule[ 1 ],
			repl2: rule[ 2 ],
		};
	}
	return null;
};

/**
 * Creates an array of objects with a regex and a replacement pair to be processed.
 *
 * @param {Array}   rules       An array with pairs or triplets of strings of which the first one is the regex to match
 *                              and the second (and the third) is the replacement.
 * @param {string} [flags=i]    The regex flags to use.
 *
 * @returns {Array} Array of objects to be used in the regex-based rules.
 */
const createRulesFromArrays = function( rules, flags = "i" ) {
	return rules.map( rule => createSingleRuleFromArray( rule, flags ) );
};

export {
	createSingleRuleFromArray,
	createRulesFromArrays,
};

export default createRulesFromArrays;
