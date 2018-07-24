const getSentences = require( "../stringProcessing/getSentences.js" );
const stripHTMLTags = require( "../stringProcessing/stripHTMLTags.js" ).stripFullTags;
const getLanguage = require( "../helpers/getLanguage.js" );
const Sentence = require( "../values/Sentence.js" );

const forEach = require( "lodash/forEach" );

const isPassiveSentencePart = require( "./passiveVoice/periphrastic/determinePassiveSentencePart.js" );
const isPassiveSentence = require( "./passiveVoice/morphological/determinePassiveSentence.js" );

const getPeriphrasticSentencePartsDefault = require( "./passiveVoice/periphrastic/getSentenceParts.js" );
const getPeriphrasticSentencePartsSplitOnStopwords = require( "./passiveVoice/periphrastic/getSentencePartsSplitOnStopwords.js" );

const morphologicalLanguages = [ "ru", "tr" ];
const periphrasticLanguages = [ "en", "de", "nl", "fr", "es", "it", "pt", "cn" ];

/* Languages that employ both morphological and periphrastic passive voice marking have not been implemented yet.
 * const morphologicalAndPeriphrasticLanguages = [ "sv", "da", "nb" ];
 */

/**
 * Looks for morphological passive voice.
 *
 * @param {Array} sentences Sentences extracted from the text.
 * @param {string} language Language of the text.
 * @returns {Object} The found passive sentences.
 */
const getMorphologicalPassives = function( sentences, language ) {
	let passiveSentences = [];

	forEach( sentences, function( sentence ) {
		let strippedSentence = stripHTMLTags( sentence.getSentenceText() ).toLocaleLowerCase();

		sentence.setPassive( isPassiveSentence( strippedSentence, language ) );

		if ( sentence.isPassive() === true ) {
			passiveSentences.push( sentence.getSentenceText() );
		}
	} );
	return {
		passiveSentences,
	};
};

/**
 * Looks for periphrastic passive voice.
 *
 * @param {Array} sentences Sentences extracted from the text.
 * @param {string} language Language of the text.
 * @returns {Object} The found passive sentences.
 */
const getPeriphrasticPassives = function( sentences, language ) {
	let passiveSentences = [];

	forEach( sentences, function( sentence ) {
		let strippedSentence = stripHTMLTags( sentence.getSentenceText() ).toLocaleLowerCase();

		// The functionality based on sentencePart objects should be rewritten using array indices of stopwords and auxiliaries.
		let sentenceParts = [];

		if ( language === "de" || language === "nl" ) {
			sentenceParts = getPeriphrasticSentencePartsSplitOnStopwords( strippedSentence, language );
		} else {
			sentenceParts = getPeriphrasticSentencePartsDefault( strippedSentence, language );
		}

		let passive = false;
		forEach( sentenceParts, function( sentencePart ) {
			sentencePart.setPassive( isPassiveSentencePart( sentencePart.getSentencePartText(), sentencePart.getAuxiliaries(), language ) );
			passive = passive || sentencePart.isPassive();
		} );
		if ( passive ) {
			passiveSentences.push( sentence.getSentenceText() );
		}
	} );
	return {
		passiveSentences,
	};
};

/**
 * Determines the number of passive sentences in the text.
 *
 * @param {Paper} paper The paper object to get the text from.
 * @returns {Object} The total number of sentences in the text and the found passive sentences.
 */
module.exports = function( paper ) {
	let text = paper.getText();
	let locale = paper.getLocale();
	let language = getLanguage( locale );
	const sentences = getSentences( text )
		.map( function( sentence ) {
			return new Sentence( sentence );
		} );
	let totalNumberSentences = sentences.length;

	if ( morphologicalLanguages.includes( language ) ) {
		return {
			total: totalNumberSentences,
			passives: getMorphologicalPassives( sentences, language ).passiveSentences,
		};
	}
	if ( periphrasticLanguages.includes( language ) ) {
		return {
			total: totalNumberSentences,
			passives: getPeriphrasticPassives( sentences, language ).passiveSentences,
		};
	}
};
