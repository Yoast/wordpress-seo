import AbstractResearcher from "../../abstract/researcher";
import wordCountInText from "../../general/wordCountInText.js";

import linkCount from "../../general/countLinks.js";
import getLinks from "../../general/getLinks.js";
import urlLength from "../../general/urlIsTooLong.js";
import matchKeywordInSubheadings from "../../researches/_todo/matchKeywordInSubheadings.js";
import getKeywordDensity from "../../general/getKeywordDensity.js";
import keywordCount from "../../researches/_todo/keywordCount";
import stopWordsInKeyword from "./researches/stopWordsInKeyword";
import stopWordsInUrl from "./stopWordsInUrl";
import calculateFleschReading from "./researches/calculateFleshReading";
import metaDescriptionLength from "../../general/metaDescriptionLength.js";
import imageCount from "../../general/imageCountInText.js";
import altTagCount from "../../general/imageAltTags.js";
import keyphraseLength from "../../general/keyphraseLength";
import metaDescriptionKeyword from "../../researches/_todo/metaDescriptionKeyword.js";
import keywordCountInUrl from "../../researches/_todo/keywordCountInUrl";
import pageTitleWidth from "../../general/pageTitleWidth.js";
import wordComplexity from "../../general/getWordComplexity.js";
import getParagraphLength from "../../general/getParagraphLength.js";
import countSentencesFromText from "../../general/countSentencesFromText.js";
import countSentencesFromDescription from "../../general/countSentencesFromDescription.js";
import getSubheadingTextLengths from "../../general/getSubheadingTextLengths.js";
import findTransitionWords from "./researches/findTransitionWords";
import passiveVoice from "../../researches/_todo/getPassiveVoice.js";
import getSentenceBeginnings from "../../abstract/getSentenceBeginnings.js";
import relevantWords from "../../researches/_todo/relevantWords";
import readingTime from "../../general/readingTime";
import getTopicDensity from "../../researches/_todo/getTopicDensity";
import topicCount from "../../researches/_todo/topicCount";
import { keyphraseDistributionResearcher } from "../../researches/_todo/keyphraseDistribution";
const keyphraseDistribution = keyphraseDistributionResearcher;
import functionWordsInKeyphrase from "./researches/functionWordsInKeyphrase";
import h1s from "../../general/h1s";
import getProminentWordsForInsights from "../../researches/_todo/getProminentWordsForInsights";
import getProminentWordsForInternalLinking from "../../researches/_todo/getProminentWordsForInternalLinking";
import getWordForms from "../../researches/_todo/getWordForms";

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
