import { isUndefined } from "lodash";

import arrayToRegex from "../regex/createRegexFromArray.js";

/**
 * A SyllableCountStep is an individual step in a SyllableCountIterator.
 */
export default class SyllableCountStep {
	/**
	 * Constructs a language syllable regex that contains a regex for matching syllable exclusion.
	 *
	 * @param {object} syllableRegex The object containing the syllable exclusions.
	 * @constructor
	 */
	constructor( syllableRegex ) {
		this._hasRegex = false;
		this._regex = "";
		this._multiplier = "";
		this.createRegex( syllableRegex );
	}

	/**
	 * Checks whether a valid regex has been set.
	 *
	 * @returns {boolean} True if a regex has been set, false if not.
	 */
	hasRegex() {
		return this._hasRegex;
	}

	/**
	 * Creates a regex based on the given syllable exclusions, and sets the multiplier to use.
	 *
	 * @param {object} syllableRegex The object containing the syllable exclusions and multiplier.
	 * @returns {void}
	 */
	createRegex( syllableRegex ) {
		if ( ! isUndefined( syllableRegex ) && ! isUndefined( syllableRegex.fragments ) ) {
			this._hasRegex = true;
			this._regex = arrayToRegex( syllableRegex.fragments, true );
			this._multiplier = syllableRegex.countModifier;
		}
	}

	/**
	 * Returns the stored regular expression.
	 *
	 * @returns {RegExp} The stored regular expression.
	 */
	getRegex() {
		return this._regex;
	}

	/**
	 * Matches syllable exclusions in a given word and returns the number found multiplied by the
	 * given multiplier. The result of this multiplication is the syllable count.
	 *
	 * @param {String} word The word to match for syllable exclusions.
	 * @returns {number} The amount of syllables found.
	 */
	countSyllables( word ) {
		if ( this._hasRegex ) {
			const match = word.match( this._regex ) || [];
			return match.length * this._multiplier;
		}
		return 0;
	}
}
