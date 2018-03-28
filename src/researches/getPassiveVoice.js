var getSentences = require( "../stringProcessing/getSentences.js" );
var stripHTMLTags = require( "../stringProcessing/stripHTMLTags.js" ).stripFullTags;
var getLanguage = require( "../helpers/getLanguage.js" );
var Sentence = require( "../values/Sentence.js" );

var forEach = require( "lodash/forEach" );

var determinePassiveSentencePart = require( "./passiveVoice/periphrastic/determinePassiveSentencePart.js" );
var determinePassiveSentence = require( "./passiveVoice/morphological/determinePassiveSentence.js" );

var getSentencePartsDefault = require( "./passiveVoice/periphrastic/getSentenceParts.js" );
var getSentencePartsGerman = require( "./german/passiveVoice/getSentenceParts.js" );

var morphologicalPassiveLanguages = [ "ru", "tr" ];
var periphrasticPassiveLanguages = [ "en", "de", "nl", "fr", "es", "it", "pt", "cn" ];
var morphologicalAndPeriphrasticPassiveLanguages = [ "sv", "da", "nb" ];

/**
 * Looks for morphological passive voice.
 *
 * @param {Array} sentenceObjects Sentences extracted from the text.
 * @param {string} language Language of the text.
 * @returns {object} The number of passives found in the text and the passive sentences.
 */
var getPassivesMorphological = function( sentenceObjects, language ) {
	var passiveSentencesByType = [];

	forEach( sentenceObjects, function( sentence ) {
		var strippedSentence = stripHTMLTags( sentence.getSentenceText() ).toLocaleLowerCase();
		var passive = false;

		sentence.setPassive( determinePassiveSentence( strippedSentence, language ) );

		if ( sentence.isPassive() === true ) {
			passiveSentencesByType.push( sentence.getSentenceText() );
		}
	} );
	return {
		passiveSentencesByType,
	};
};

/**
 * Looks for periphrastic passive voice.
 *
 * @param {Array} sentenceObjects Sentences extracted from the text.
 * @param {string} language Language of the text.
 * @returns {object} The number of passives found in the text and the passive sentences.
 */
var getPassivesPeriphrastic = function( sentenceObjects, language ) {
	var passiveSentencesByType = [];
	forEach( sentenceObjects, function( sentence ) {
		var strippedSentence = stripHTMLTags( sentence.getSentenceText() ).toLocaleLowerCase();
		var sentenceParts = [];

		if ( language === "de" ) {
			sentenceParts = getSentencePartsGerman( strippedSentence );
		} else {
			sentenceParts = getSentencePartsDefault( strippedSentence, language );
		}

		var passive = false;
		forEach( sentenceParts, function( sentencePart ) {
			sentencePart.setPassive( determinePassiveSentencePart( sentencePart.getSentencePartText(), sentencePart.getAuxiliaries(), language ) );
			passive = passive || sentencePart.isPassive();
		} );
		if ( passive === true ) {
			passiveSentencesByType.push( sentence.getSentenceText() );
		}
	} );
	return {
		passiveSentencesByType,
	};
};

/**
 * Determines which passive voice marking should be executed for a text based on the language.
 *
 * @param {Array} sentenceObjects Sentences extracted from the text.
 * @param {string} language Language of the text.
 * @returns {object} The number of passives found in the text and the passive sentences.
 */
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
