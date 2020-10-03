import matchKeywordInSubheadings from "../../researches/_todo/matchKeywordInSubheadings.js";
import keywordCount from "../../researches/_todo/keywordCount";
import metaDescriptionKeyword from "../../researches/_todo/metaDescriptionKeyword.js";
import keywordCountInUrl from "../../researches/_todo/keywordCountInUrl";
import passiveVoice from "../../researches/_todo/getPassiveVoice.js";
import relevantWords from "../../researches/_todo/relevantWords";
import getTopicDensity from "../../researches/_todo/getTopicDensity";
import topicCount from "../../researches/_todo/topicCount";
import { keyphraseDistributionResearcher } from "../../researches/_todo/keyphraseDistribution";
import getProminentWordsForInsights from "../../researches/_todo/getProminentWordsForInsights";
import getProminentWordsForInternalLinking from "../../researches/_todo/getProminentWordsForInternalLinking";
import getWordForms from "../../researches/_todo/getWordForms";

import AbstractResearcher from "../../abstract/researcher";
import wordCountInText from "../../researches/wordCountInText.js";
import linkCount from "../../researches/countLinks.js";
import getLinks from "../../researches/getLinks.js";
import urlLength from "../../researches/urlIsTooLong.js";
import getKeywordDensity from "../../researches/getKeywordDensity.js";
import stopWordsInKeyword from "./researches/stopWordsInKeyword";
import stopWordsInUrl from "./researches/stopWordsInUrl";
import calculateFleschReading from "./researches/calculateFleshReading";
import metaDescriptionLength from "../../researches/metaDescriptionLength.js";
import imageCount from "../../researches/imageCountInText.js";
import altTagCount from "../../researches/imageAltTags.js";
import keyphraseLength from "../../researches/keyphraseLength";
import pageTitleWidth from "../../researches/pageTitleWidth.js";
import wordComplexity from "../../researches/getWordComplexity.js";
import getParagraphLength from "../../researches/getParagraphLength.js";
import countSentencesFromText from "../../researches/countSentencesFromText.js";
import countSentencesFromDescription from "../../researches/countSentencesFromDescription.js";
import getSubheadingTextLengths from "../../researches/getSubheadingTextLengths.js";
import findTransitionWords from "./researches/findTransitionWords";
import getSentenceBeginnings from "../../abstract/getSentenceBeginnings.js";
import readingTime from "../../researches/readingTime";
import functionWordsInKeyphrase from "./researches/functionWordsInKeyphrase";
import h1s from "../../researches/h1s";
const keyphraseDistribution = keyphraseDistributionResearcher;

/**
 * The researches contains all the researches
 */
export default class Researcher extends AbstractResearcher {
	/**
	 * Constructor
	 * @param {Paper} paper The Paper object that is needed within the researches.
	 * @constructor
	 */
	constructor( paper ) {
		super( paper );

		this.defaultResearches = {
			urlLength: urlLength,
			wordCountInText: wordCountInText,
			findKeywordInPageTitle: findKeywordInPageTitle,
			calculateFleschReading: calculateFleschReading,
			getLinkStatistics: getLinkStatistics,
			getLinks: getLinks,
			linkCount: linkCount,
			imageCount: imageCount,
			altTagCount: altTagCount,
			matchKeywordInSubheadings: matchKeywordInSubheadings,
			keywordCount: keywordCount,
			getKeywordDensity: getKeywordDensity,
			stopWordsInKeyword: stopWordsInKeyword,
			stopWordsInUrl: stopWordsInUrl,
			metaDescriptionLength: metaDescriptionLength,
			keyphraseLength: keyphraseLength,
			keywordCountInUrl: keywordCountInUrl,
			firstParagraph: findKeywordInFirstParagraph,
			metaDescriptionKeyword: metaDescriptionKeyword,
			pageTitleWidth: pageTitleWidth,
			wordComplexity: wordComplexity,
			getParagraphLength: getParagraphLength,
			countSentencesFromText: countSentencesFromText,
			countSentencesFromDescription: countSentencesFromDescription,
			getSubheadingTextLengths: getSubheadingTextLengths,
			findTransitionWords: findTransitionWords,
			passiveVoice: passiveVoice,
			getSentenceBeginnings: getSentenceBeginnings,
			relevantWords: relevantWords,
			readingTime: readingTime,
			getTopicDensity: getTopicDensity,
			topicCount: topicCount,
			sentences,
			keyphraseDistribution: keyphraseDistribution,
			morphology: getWordForms,
			functionWordsInKeyphrase: functionWordsInKeyphrase,
			h1s: h1s,
			prominentWordsForInsights: getProminentWordsForInsights,
			prominentWordsForInternalLinking: getProminentWordsForInternalLinking,
		};
	}
}
