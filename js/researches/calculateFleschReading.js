/** @module analyses/calculateFleschReading */

let stripNumbers = require( "../stringProcessing/stripNumbers.js" );
let countSentences = require( "../stringProcessing/countSentences.js" );
let countWords = require( "../stringProcessing/countWords.js" );
let countSyllables = require( "../stringProcessing/syllables/count.js" );
let formatNumber = require( "../helpers/formatNumber.js" );

let getLanguage = require( "../helpers/getLanguage.js" );

/**
 * Calculates an average from a total and an amount
 *
 * @param {number} total The total.
 * @param {number} amount The amount.
 * @returns {number} The average from the total and the amount.
 */
let getAverage = function( total, amount ) {
	return total / amount;
};

/**
 * This calculates the fleschreadingscore for a given text
 * The formula used:
 * 206.835 - 1.015 (total words / total sentences) - 84.6 ( total syllables / total words);
 *
 * @param {object} paper The paper containing the text
 * @returns {number} the score of the fleschreading test
 */
module.exports = function( paper ) {
	let score;
	let text = paper.getText();
	let locale = paper.getLocale();
	let language = getLanguage( locale );
	if ( text === "" ) {
		return 0;
	}

	text = stripNumbers( text );

	let numberOfSentences = countSentences( text );

	let numberOfWords = countWords( text );

	// Prevent division by zero errors.
	if ( numberOfSentences === 0 || numberOfWords === 0 ) {
		return 0;
	}

	let numberOfSyllables = countSyllables( text, locale );
	let averageWordsPerSentence = getAverage( numberOfWords, numberOfSentences );
	switch( language ) {
		case "nl":
			let syllablesPer100Words = numberOfSyllables * ( 100 / numberOfWords );
			score = 206.84 - ( 0.77 * syllablesPer100Words ) - ( 0.93 * ( averageWordsPerSentence  ) );
			break;
		case "de":
			score = 180 - averageWordsPerSentence - ( 58.5 * numberOfSyllables / numberOfWords );
			break;
		case "it":
			score = 217 - ( 1.3 * averageWordsPerSentence ) - ( 0.6 * syllablesPer100Words );
			break;
		case "en":
		default:
			score = 206.835 - ( 1.015 * ( averageWordsPerSentence ) ) - ( 84.6 * ( numberOfSyllables / numberOfWords ) );
			break;
	}


	return formatNumber( score );
};
