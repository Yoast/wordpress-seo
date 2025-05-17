import SyllableCountStep from "./syllableCountStep.js";

import { forEach, isUndefined } from "lodash";

/**
 * A SyllableCountIterator contains individual SyllableCountSteps.
 */
export default class SyllableCountIterator {
	/**
	 * Creates a syllable count iterator.
	 *
	 * @param {object} config The config object containing an array with syllable exclusions.
	 * @constructor
	 */
	constructor( config ) {
		this.countSteps = [];
		if ( ! isUndefined( config ) ) {
			this.createSyllableCountSteps( config.deviations.vowels );
		}
	}

	/**
	 * Creates a syllable count step object for each exclusion.
	 *
	 * @param {object} syllableCounts The object containing all exclusion syllables including the multipliers.
	 * @returns {void}
	 */
	createSyllableCountSteps( syllableCounts ) {
		forEach( syllableCounts, function( syllableCountStep ) {
			this.countSteps.push( new SyllableCountStep( syllableCountStep ) );
		}.bind( this ) );
	}

	/**
	 * Returns all available count steps.
	 *
	 * @returns {Array} All available count steps.
	 */
	getAvailableSyllableCountSteps() {
		return this.countSteps;
	}

	/**
	 * Counts the syllables for all the steps and returns the total syllable count.
	 *
	 * @param {String} word The word to count syllables in.
	 * @returns {number} The number of syllables found based on exclusions.
	 */
	countSyllables( word ) {
		let syllableCount = 0;
		forEach( this.countSteps, function( step ) {
			syllableCount += step.countSyllables( word );
		} );
		return syllableCount;
	}
}
