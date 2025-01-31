/** @module analyses/findKeywordInFirstParagraph */
import { inRange, isEmpty } from "lodash";

import { findTopicFormsInString } from "../helpers/match/findKeywordFormsInString.js";
import { getParentNode } from "../helpers/sentence/getSentencesFromTree";
import { createShortcodeTagsRegex } from "../helpers";


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
	let paragraphs = researcher.getResearch( "getParagraphs" );
	// Filter captions from non-Classic editors.
	paragraphs = paragraphs.filter( paragraph => {
		const parentNode = getParentNode( paper, paragraph );
		return ! ( paragraph.isImplicit && parentNode && parentNode.name === "figcaption" );
	} );
	// Filter captions from Classic editor and from classic block inside Block editor.
	paragraphs = paragraphs.filter( paragraph => {
		return ! ( paragraph.childNodes && paragraph.childNodes[ 0 ] &&
			createShortcodeTagsRegex( [ "caption" ] ).test( paragraph.childNodes[ 0 ].value ) );
	} );
	const firstParagraph = paragraphs[ 0 ];

	const topicForms = researcher.getResearch( "morphology" );
	const matchWordCustomHelper = researcher.getHelper( "matchWordCustomHelper" );
	const locale = paper.getLocale();
	const startOffset = firstParagraph && firstParagraph.sourceCodeLocation.startOffset;

	const mappedBlocks = paper._attributes.wpBlocks;
	const filteredIntroductionBlock = mappedBlocks && mappedBlocks.filter( block => inRange( startOffset, block.startOffset, block.endOffset ) )[ 0 ];
	const result = {
		foundInOneSentence: false,
		foundInParagraph: false,
		keyphraseOrSynonym: "",
		introduction: firstParagraph,
		parentBlock: filteredIntroductionBlock || null,
	};

	if ( isEmpty( firstParagraph ) ) {
		return result;
	}

	const sentences = firstParagraph.sentences.map( sentence => sentence.text );
	// Use both keyphrase and synonyms to match topic words in the first paragraph.
	const useSynonyms = true;

	if ( ! isEmpty( sentences ) ) {
		const firstResultSentence = sentences
			.map( sentence => findTopicFormsInString( topicForms, sentence, useSynonyms, locale, matchWordCustomHelper ) )
			.find( resultSentence => resultSentence.percentWordMatches === 100 );

		if ( firstResultSentence ) {
			result.foundInOneSentence = true;
			result.foundInParagraph = true;
			result.keyphraseOrSynonym = firstResultSentence.keyphraseOrSynonym;
			return result;
		}

		const resultParagraph = findTopicFormsInString( topicForms, firstParagraph.innerText(), useSynonyms, locale, matchWordCustomHelper );
		if ( resultParagraph.percentWordMatches === 100 ) {
			result.foundInParagraph = true;
			result.keyphraseOrSynonym = resultParagraph.keyphraseOrSynonym;
			return result;
		}
	}

	return result;
}
