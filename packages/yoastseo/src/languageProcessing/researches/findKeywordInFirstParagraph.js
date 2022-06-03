/** @module analyses/findKeywordInFirstParagraph */

import matchParagraphs from "../helpers/html/matchParagraphs.js";
import getSentences from "../helpers/sentence/getSentences.js";
import { findTopicFormsInString } from "../helpers/match/findKeywordFormsInString.js";
import imageInText from "../helpers/image/imageInText";
import findEmptyDivisions from "../helpers/html/findEmptyDivisions";
import getAnchorsFromText from "../helpers/link/getAnchorsFromText";
import matchStringWithRegex from "../helpers/regex/matchStringWithRegex";

import { reject } from "lodash-es";
import { isEmpty } from "lodash-es";

/**
 * Removes links from text.
 *
 * @param {string} text The text string to analyze.
 *
 * @returns {string} The text with links stripped away.
 */
function removeLinksFromText( text ) {
	const anchors = getAnchorsFromText( text );
	if ( anchors.length > 0 ) {
		anchors.forEach( function( anchor ) {
			text = text.replace( anchor, "" );
		} );
	}

	return text;
}


/**
 * Removes images from text.
 *
 * @param {string} text The text string to analyze.
 *
 * @returns {string} The text with images stripped away.
 */
function removeImagesFromText( text ) {
	const images = imageInText( text );
	const imageTags = matchStringWithRegex( text, "</img>" );

	if ( images.length > 0 ) {
		images.forEach( function( image ) {
			text = text.replace( image, "" );
		} );

		imageTags.forEach( function( imageTag ) {
			text = text.replace( imageTag, "" );
		} );
	}

	return text;
}


/**
 * Checks if the paragraph has no text.
 *
 * @param {string} text The text string to analyze.
 *
 * @returns {boolean} True if the paragraph has no text, false otherwise.
 */
function paragraphHasNoText( text ) {
	// Strip links and check if paragraph consists of links only
	text = removeLinksFromText( text );
	if ( text === "" ) {
		return true;
	}

	text = removeImagesFromText( text );
	if ( text === "" ) {
		return true;
	}

	// Remove empty divisions from the text
	const emptyDivisions = findEmptyDivisions( text );
	if ( emptyDivisions.length < 1 ) {
		return false;
	}

	emptyDivisions.forEach( function( emptyDivision ) {
		text = text.replace( emptyDivision, "" );
	} );

	return text === "";
}

/**
 * Checks if the introductory paragraph contains keyphrase or synonyms.
 * First splits the first paragraph by sentences. Finds the first paragraph which contains sentences e.g., not an image).
 * (1) Tries to find all (content) words from the keyphrase or a synonym phrase within one sentence.
 * If found all words within one sentence, returns an object with foundInOneSentence = true and keyphraseOrSynonym = "keyphrase"
 * or "synonym".
 * If it did not find all words within one sentence, goes ahead with matching the keyphrase with the entire first paragraph.
 * (2) Tries to find all (content) words from the keyphrase or a synonym phrase within the paragraph.
 * If found all words within the paragraph, returns an object with foundInOneSentence = false, foundInParagraph = true,
 * and keyphraseOrSynonym = "keyphrase" or "synonym".
 * If found not all words within the paragraph of nothing at all, returns an object with foundInOneSentence = false,
 * foundInParagraph = false, and keyphraseOrSynonym = "".
 *
 * @param {Paper} paper The text to check for paragraphs.
 * @param {Researcher} researcher The researcher to use for analysis.
 *
 * @returns {Object} Whether the keyphrase words were found in one sentence, whether the keyphrase words were found in
 * the paragraph, whether a keyphrase or a synonym phrase was matched.
 */
export default function( paper, researcher ) {
	const topicForms = researcher.getResearch( "morphology" );
	const matchWordCustomHelper = researcher.getHelper( "matchWordCustomHelper" );
	const locale = paper.getLocale();

	let paragraphs = matchParagraphs( paper.getText() );
	paragraphs = reject( paragraphs, isEmpty );
	paragraphs = reject( paragraphs, paragraphHasNoText )[ 0 ] || "";

	const result = {
		foundInOneSentence: false,
		foundInParagraph: false,
		keyphraseOrSynonym: "",
	};

	const sentences = getSentences( paragraphs );
	// Use both keyphrase and synonyms to match topic words in the first paragraph.
	const useSynonyms = true;

	if ( ! isEmpty( sentences ) ) {
		sentences.forEach( function( sentence ) {
			const resultSentence = findTopicFormsInString( topicForms, sentence, useSynonyms, locale, matchWordCustomHelper );
			if ( resultSentence.percentWordMatches === 100 ) {
				result.foundInOneSentence = true;
				result.foundInParagraph = true;
				result.keyphraseOrSynonym = resultSentence.keyphraseOrSynonym;
				return result;
			}
		} );

		const resultParagraph = findTopicFormsInString( topicForms, paragraphs, useSynonyms, locale, matchWordCustomHelper );
		if ( resultParagraph.percentWordMatches === 100 ) {
			result.foundInParagraph = true;
			result.keyphraseOrSynonym = resultParagraph.keyphraseOrSynonym;
			return result;
		}
	}

	return result;
}
