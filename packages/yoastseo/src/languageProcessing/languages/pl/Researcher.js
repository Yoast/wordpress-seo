import matchKeywordInSubheadings from "../../researches/base/matchKeywordInSubheadings.js";
import getProminentWordsForInsights from "../../researches/base/getProminentWordsForInsights";
import getProminentWordsForInternalLinking from "../../researches/base/getProminentWordsForInternalLinking";
import getWordForms from "../../researches/_todo/getWordForms";
import findKeywordInPageTitle from "../../researches/base/findKeywordInPageTitle";
import { keyphraseDistributionResearcher as keyphraseDistribution } from "../../researches/base/keyphraseDistribution";

import AbstractResearcher from "../../AbstractResearcher";

import getLinkStatistics from "./researches/getLinkStatistics";
import passiveVoice from "./researches/getPassiveVoice.js";
import stopWordsInKeyword from "./researches/stopWordsInKeyword";
import stopWordsInUrl from "./researches/stopWordsInUrl";
import findTransitionWords from "./researches/findTransitionWords";
import functionWordsInKeyphrase from "./researches/functionWordsInKeyphrase";
import getSentenceBeginnings from "./researches/getSentenceBeginnings.js";
import getKeywordDensity from "./researches/getKeywordDensity";

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
			stopWordsInKeyword: stopWordsInKeyword,
			stopWordsInUrl: stopWordsInUrl,
			findTransitionWords: findTransitionWords,
			passiveVoice: passiveVoice,
			getSentenceBeginnings: getSentenceBeginnings,
			functionWordsInKeyphrase: functionWordsInKeyphrase,
			matchKeywordInSubheadings: matchKeywordInSubheadings,
			getLinkStatistics: getLinkStatistics,
			keyphraseDistribution: keyphraseDistribution,
			findKeywordInPageTitle: findKeywordInPageTitle,
			morphology: getWordForms,
			prominentWordsForInsights: getProminentWordsForInsights,
			prominentWordsForInternalLinking: getProminentWordsForInternalLinking,
			getKeywordDensity: getKeywordDensity,
		} );
	}
}
