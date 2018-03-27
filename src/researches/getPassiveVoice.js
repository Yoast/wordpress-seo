var getSentences = require( "../stringProcessing/getSentences.js" );
var stripHTMLTags = require( "../stringProcessing/stripHTMLTags.js" ).stripFullTags;
var getLanguage = require( "../helpers/getLanguage.js" );
var Sentence = require( "../values/Sentence.js" );

var forEach = require( "lodash/forEach" );

 /*
  * // Imports used for English, French and Spanish.
  * var getSentencePartsDefault = require( "./passiveVoice/getSentenceParts.js" );
  * var determinePassivesDefault = require( "./passiveVoice/determinePassives" );
  */
// Imports used for German.
var getSentencePartsGerman = require( "./german/passiveVoice/getSentenceParts.js" );
var determinePassivesGerman = require( "./german/passiveVoice/determinePassives.js" );

var morphologicalPassiveLanguages = [ "ru", "tr" ];
var periphrasticPassiveLanguages = [ "en", "de", "nl", "fr", "es", "it", "pt", "cn" ];
var morphologicalAndPeriphrasticPassiveLanguages = [ "sv", "da", "nb" ];

var getPassivesMorphological = function( sentenceObjects, language ) {
	var passiveSentencesByType = [];

	console.log( language );
	return {
		passiveSentences: passiveSentencesByType,
	};
};

var getPassivesPeriphrastic = function( sentenceObjects, language ) {
	var passiveSentencesByType = [];

	forEach( sentenceObjects, function( sentence ) {
		var strippedSentence = stripHTMLTags( sentence.getSentenceText() ).toLocaleLowerCase();
		// FIXME!
		var sentenceParts = getSentencePartsGerman( strippedSentence );

		var passive = false;
		forEach( sentenceParts, function( sentencePart ) {
			// FIXME!
			passive = determinePassivesGerman( sentencePart._sentencePartText );
			passive = passive || sentencePart.isPassive();
		} );
		if ( passive === true ) {
			passiveSentencesByType.push( sentence.getSentenceText() );
		}
	} );
	console.log( language );
	return {
		passiveSentencesByType,
	};
};

var getPassives = function( sentenceObjects, language ) {
	var passiveSentences = [];

	if ( morphologicalPassiveLanguages.includes( language ) ) {
		passiveSentences = getPassivesMorphological( sentenceObjects, language );
	} else if ( periphrasticPassiveLanguages.includes( language ) ) {
		passiveSentences = getPassivesPeriphrastic( sentenceObjects, language );
	} else if ( morphologicalAndPeriphrasticPassiveLanguages.includes( language ) ) {
		passiveSentences = getPassivesMorphological( sentenceObjects, language );
		passiveSentences.push( getPassivesPeriphrastic( sentenceObjects, language ) );
	}

	return {
		passiveSentences,
	};
};


/**
 * Determines the number of passive sentences in the text.
 *
 * @param {Paper} paper The paper object to get the text from.
 * @returns {object} The number of passives found in the text and the passive sentences.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var locale = paper.getLocale();
	var language = getLanguage( locale );
	var sentences = getSentences( text );

	var sentenceObjects = [];

	forEach( sentences, function( sentence ) {
		sentenceObjects.push( new Sentence( sentence, locale ) );
	} );

	return {
		total: sentences.length,
		passives: getPassives( sentenceObjects, language ).passiveSentences.passiveSentencesByType,
	};
};
