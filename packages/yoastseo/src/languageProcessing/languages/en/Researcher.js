import matchKeywordInSubheadings from "../../researches/_todo/matchKeywordInSubheadings.js";
import keywordCount from "../../researches/_todo/keywordCount";
import metaDescriptionKeyword from "../../researches/_todo/metaDescriptionKeyword.js";
import keywordCountInUrl from "../../researches/_todo/keywordCountInUrl";
import relevantWords from "../../researches/_todo/relevantWords";
import getTopicDensity from "../../researches/_todo/getTopicDensity";
import topicCount from "../../researches/_todo/topicCount";
import { keyphraseDistributionResearcher } from "../../researches/_todo/keyphraseDistribution";
import getProminentWordsForInsights from "../../researches/base/getProminentWordsForInsights";
import getProminentWordsForInternalLinking from "../../researches/base/getProminentWordsForInternalLinking";
import getWordForms from "../../researches/_todo/getWordForms";
import findKeywordInPageTitle from "../../researches/base/findKeywordInPageTitle";
const keyphraseDistribution = keyphraseDistributionResearcher;

import AbstractResearcher from "../../AbstractResearcher";

import getLinkStatistics from "./researches/getLinkStatistics";
import passiveVoice from "./researches/getPassiveVoice.js";
import stopWordsInKeyword from "./researches/stopWordsInKeyword";
import stopWordsInUrl from "./researches/stopWordsInUrl";
import calculateFleschReading from "./researches/calculateFleshReading";
import findTransitionWords from "./researches/findTransitionWords";
import functionWordsInKeyphrase from "./researches/functionWordsInKeyphrase";
import getSentenceBeginnings from "./researches/getSentenceBeginnings.js";

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

		Object.assign( this.defaultResearches, {
			calculateFleschReading: calculateFleschReading,
			stopWordsInKeyword: stopWordsInKeyword,
			stopWordsInUrl: stopWordsInUrl,
			findTransitionWords: findTransitionWords,
			passiveVoice: passiveVoice,
			getSentenceBeginnings: getSentenceBeginnings,
			functionWordsInKeyphrase: functionWordsInKeyphrase,
			matchKeywordInSubheadings: matchKeywordInSubheadings,
			keywordCount: keywordCount,
			keywordCountInUrl: keywordCountInUrl,
			metaDescriptionKeyword: metaDescriptionKeyword,
			relevantWords: relevantWords,
			getTopicDensity: getTopicDensity,
			topicCount: topicCount,
			getLinkStatistics: getLinkStatistics,
			keyphraseDistribution: keyphraseDistribution,
			findKeywordInPageTitle: findKeywordInPageTitle,
			morphology: getWordForms,
			prominentWordsForInsights: getProminentWordsForInsights,
			prominentWordsForInternalLinking: getProminentWordsForInternalLinking,
		} );
	}
}
