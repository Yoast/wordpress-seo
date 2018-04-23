/*
 * The script collects all the lists of function words per language and returns this collection to a Researcher or a
 * stringProcessing script
 */

let germanFunctionWords = require( "../researches/german/functionWords.js" )();
let englishFunctionWords = require( "../researches/english/functionWords.js" )();
let dutchFunctionWords = require( "../researches/dutch/functionWords.js" )();
let spanishFunctionWords = require( "../researches/spanish/functionWords.js" )();
let italianFunctionWords = require( "../researches/italian/functionWords.js" )();
let frenchFunctionWords = require( "../researches/french/functionWords.js" )();
let portugueseFunctionWords = require( "../researches/portuguese/functionWords.js" )();
let russianFunctionWords = require( "../researches/russian/functionWords.js" )();

module.exports = function() {
	return {
		en: englishFunctionWords,
		de: germanFunctionWords,
		nl: dutchFunctionWords,
		fr: frenchFunctionWords,
		es: spanishFunctionWords,
		it: italianFunctionWords,
		pt: portugueseFunctionWords,
		ru: russianFunctionWords,
	};
};
