import getSentences from "../helpers/sentence/getSentences.js";
import { stripFullTags as stripHTMLTags } from "../helpers/sanitize/stripHTMLTags.js";
import Sentence from "../../values/Sentence.js";

import { forEach } from "lodash-es";

// Languages that employ both morphological and periphrastic passive voice marking have not been implemented yet: "da", "nb".

/**
 * Looks for morphological passive voice.
 * Supported morphological languages: "ru", "sv", "id", "ar", "he", "tr".
 *
 * @param {Paper}      paper      The paper object.
 * @param {Researcher} researcher The researcher.
 *
 * @returns {Object} The found passive sentences.
 */
export const getMorphologicalPassives = function( paper, researcher ) {
	const isPassiveSentence = researcher.getHelper( "isPassiveSentence" );
	const text = paper.getText();
	const sentences = getSentences( text )
		.map( function( sentence ) {
			return new Sentence( sentence );
		} );
	const totalNumberSentences = sentences.length;
	const passiveSentences = [];

	forEach( sentences, function( sentence ) {
		const strippedSentence = stripHTMLTags( sentence.getSentenceText() ).toLocaleLowerCase();

		sentence.setPassive( isPassiveSentence( strippedSentence ) );

		if ( sentence.isPassive() === true ) {
			passiveSentences.push( sentence.getSentenceText() );
		}
	} );

	return {
		total: totalNumberSentences,
		passives: passiveSentences,
	};
};

/**
 * Looks for periphrastic passive voice.
 * Supported periphrastic languages: "en", "de", "nl", "fr", "es", "it", "pt", "pl".
 *
 * @param {Paper}      paper      The paper object.
 * @param {Researcher} researcher The researcher.
 *
 * @returns {Object} The found passive sentences.
 */
export const getPeriphrasticPassives = function( paper, researcher ) {
	const getSentenceParts = researcher.getHelper( "getSentenceParts" );
	const isPassiveSentencePart = researcher.getHelper( "isPassiveSentencePart" );
	const text = paper.getText();
	const sentences = getSentences( text )
		.map( function( sentence ) {
			return new Sentence( sentence );
		} );
	const totalNumberSentences = sentences.length;
	const passiveSentences = [];

	forEach( sentences, function( sentence ) {
		const strippedSentence = stripHTMLTags( sentence.getSentenceText() ).toLocaleLowerCase();

		// The functionality based on sentencePart objects should be rewritten using array indices of stopwords and auxiliaries.
		const sentenceParts = getSentenceParts( strippedSentence );

		let passive = false;
		forEach( sentenceParts, function( sentencePart ) {
			passive = passive || isPassiveSentencePart( sentencePart.getSentencePartText(), sentencePart.getAuxiliaries() );
		} );
		if ( passive ) {
			passiveSentences.push( sentence.getSentenceText() );
		}
	} );

	return {
		total: totalNumberSentences,
		passives: passiveSentences,
	};
};

/**
 * Looks for both morphological and periphrastic passive voice
 * Supported languages with both morphological and periphrastic passives: "hu".
 *
 * @param {Paper}      paper      The paper object.
 * @param {Researcher} researcher The researcher.
 *
 * @returns {Object} The found passive sentences.
 */
const getMorphologicalAndPeriphrasticPassive = function( paper, researcher ) {
	const morphologicalPassives = getMorphologicalPassives( paper, researcher );
	const periphrasticPassives = getPeriphrasticPassives( paper, researcher ).passives;

	return {
		total: morphologicalPassives.total,
		passives: periphrasticPassives.concat( morphologicalPassives.passives ),
	};
};

/**
 * Looks for passive voice.
 *
 * @param {Paper}      paper      The paper object.
 * @param {Researcher} researcher The researcher.
 *
 * @returns {Object} The found passive sentences.
 */
export default function getPassiveVoice( paper, researcher ) {
	const passiveType = researcher.getConfig( "passiveConstructionType" );

	if ( passiveType === "periphrastic" ) {
		return getPeriphrasticPassives( paper, researcher );
	}
	if ( passiveType === "morphological" ) {
		return getMorphologicalPassives( paper, researcher );
	}

	return getMorphologicalAndPeriphrasticPassive( paper, researcher );
}
