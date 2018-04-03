const getSentences = require( "../stringProcessing/getSentences.js" );
const stripHTMLTags = require( "../stringProcessing/stripHTMLTags.js" ).stripFullTags;
const getLanguage = require( "../helpers/getLanguage.js" );
const Sentence = require( "../values/Sentence.js" );

const forEach = require( "lodash/forEach" );

const determinePassiveSentencePart = require( "./passiveVoice/periphrastic/determinePassiveSentencePart.js" );
const determinePassiveSentence = require( "./passiveVoice/morphological/determinePassiveSentence.js" );

const getSentencePartsDefault = require( "./passiveVoice/periphrastic/getSentenceParts.js" );
const getSentencePartsGerman = require( "./german/passiveVoice/getSentenceParts.js" );

const morphologicalLanguages = [ "ru", "tr" ];
const periphrasticLanguages = [ "en", "de", "nl", "fr", "es", "it", "pt", "cn" ];
const morphologicalAndPeriphrasticLanguages = [ "sv", "da", "nb" ];

/**
 * Looks for morphological passive voice.
 *
 * @param {Array} sentenceObjects Sentences extracted from the text.
 * @param {string} language Language of the text.
 * @returns {object} The number of passives found in the text and the passive sentences.
 */
let getPassivesMorphological = function( sentenceObjects, language ) {
	let passiveSentencesByType = [];

	forEach( sentenceObjects, function( sentence ) {
		let strippedSentence = stripHTMLTags( sentence.getSentenceText() ).toLocaleLowerCase();

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
let getPassivesPeriphrastic = function( sentenceObjects, language ) {
	let passiveSentencesByType = [];
	forEach( sentenceObjects, function( sentence ) {
		let strippedSentence = stripHTMLTags( sentence.getSentenceText() ).toLocaleLowerCase();
		let sentenceParts = [];

		if ( language === "de" ) {
			sentenceParts = getSentencePartsGerman( strippedSentence );
		} else {
			sentenceParts = getSentencePartsDefault( strippedSentence, language );
		}

		let passive = false;
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
let getPassives = function( sentenceObjects, language ) {
	let passiveSentences = [];

	if ( morphologicalLanguages.includes( language ) ) {
		passiveSentences = getPassivesMorphological( sentenceObjects, language );
	} else if ( periphrasticLanguages.includes( language ) ) {
		passiveSentences = getPassivesPeriphrastic( sentenceObjects, language );
	} else if ( morphologicalAndPeriphrasticLanguages.includes( language ) ) {
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
	let text = paper.getText();
	let locale = paper.getLocale();
	let language = getLanguage( locale );
	let sentences = getSentences( text );

	let sentenceObjects = [];

	forEach( sentences, function( sentence ) {
		sentenceObjects.push( new Sentence( sentence, locale ) );
	} );

	return {
		total: sentences.length,
		passives: getPassives( sentenceObjects, language ).passiveSentences.passiveSentencesByType,
	};
};
