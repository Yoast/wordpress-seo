import { isUndefined, pick } from "lodash";

/**
 * A DeviationFragment represents a partial deviation when counting syllables.
 */
export default class DeviationFragment {
	/**
	 * Constructs a new DeviationFragment.
	 *
	 * @param {Object} options Extra options that are used to match this deviation fragment.
	 * @param {string} options.location The location in the word where this deviation can occur.
	 * @param {string} options.word The actual string that should be counted differently.
	 * @param {number} options.syllables The amount of syllables this fragment has.
	 * @param {string[]} [options.notFollowedBy] A list of characters that this fragment shouldn't be followed with.
	 * @param {string[]} [options.alsoFollowedBy] A list of characters that this fragment could be followed with.
	 *
	 * @constructor
	 */
	constructor( options ) {
		this._location = options.location;
		this._fragment = options.word;
		this._syllables = options.syllables;
		this._regex = null;

		this._options = pick( options, [ "notFollowedBy", "alsoFollowedBy" ] );
	}

	/**
	 * Creates a regex that matches this fragment inside a word.
	 *
	 * @returns {void}
	 */
	createRegex() {
		const options = this._options;

		let fragment = this._fragment;

		if ( ! isUndefined( options.notFollowedBy ) ) {
			fragment += "(?![" + options.notFollowedBy.join( "" ) + "])";
		}

		if ( ! isUndefined( options.alsoFollowedBy ) ) {
			fragment += "[" + options.alsoFollowedBy.join( "" ) + "]?";
		}

		let regexString;
		switch ( this._location ) {
			case "atBeginning":
				regexString = "^" + fragment;
				break;

			case "atEnd":
				regexString = fragment + "$";
				break;

			case "atBeginningOrEnd":
				regexString = "(^" + fragment + ")|(" + fragment + "$)";
				break;

			default:
				regexString = fragment;
				break;
		}

		this._regex = new RegExp( regexString );
	}

	/**
	 * Returns the regex that matches this fragment inside a word.
	 *
	 * @returns {RegExp} The regex that matches this fragment.
	 */
	getRegex() {
		if ( null === this._regex ) {
			this.createRegex();
		}

		return this._regex;
	}

	/**
	 * Returns whether this fragment occurs in a word.
	 *
	 * @param {string} word The word to match the fragment in.
	 * @returns {boolean} Whether or not this fragment occurs in a word.
	 */
	occursIn( word ) {
		const regex = this.getRegex();

		return regex.test( word );
	}

	/**
	 * Removes this fragment from the given word.
	 *
	 * @param {string} word The word to remove this fragment from.
	 * @returns {string} The modified word.
	 */
	removeFrom( word ) {
		// Replace by a space to keep the remaining parts separated.
		return word.replace( this._fragment, " " );
	}

	/**
	 * Returns the amount of syllables for this fragment.
	 *
	 * @returns {number} The amount of syllables for this fragment.
	 */
	getSyllables() {
		return this._syllables;
	}
}
