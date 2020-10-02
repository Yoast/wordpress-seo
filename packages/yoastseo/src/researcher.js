import sentences from "./languages/legacy/researches/sentences";

import { merge } from "lodash-es";
import InvalidTypeError from "./errors/invalidType";
import MissingArgument from "./errors/missingArgument";
import { isUndefined } from "lodash-es";
import { isEmpty } from "lodash-es";

// Researches
import wordCountInText from "./languages/legacy/researches/wordCountInText.js";

import getLinkStatistics from "./languages/legacy/researches/getLinkStatistics.js";
import linkCount from "./languages/legacy/researches/countLinks.js";
import getLinks from "./languages/legacy/researches/getLinks.js";
import urlLength from "./languages/legacy/researches/urlIsTooLong.js";
import findKeywordInPageTitle from "./languages/legacy/researches/findKeywordInPageTitle.js";
import matchKeywordInSubheadings from "./languages/legacy/researches/matchKeywordInSubheadings.js";
import getKeywordDensity from "./languages/legacy/researches/getKeywordDensity.js";
import keywordCount from "./languages/legacy/researches/keywordCount";
import stopWordsInKeyword from "./languages/legacy/researches/stopWordsInKeyword";
import stopWordsInUrl from "./languages/legacy/researches/stopWordsInUrl";
import calculateFleschReading from "./languages/legacy/researches/calculateFleschReading.js";
import metaDescriptionLength from "./languages/legacy/researches/metaDescriptionLength.js";
import imageCount from "./languages/legacy/researches/imageCountInText.js";
import altTagCount from "./languages/legacy/researches/imageAltTags.js";
import keyphraseLength from "./languages/legacy/researches/keyphraseLength";
import metaDescriptionKeyword from "./languages/legacy/researches/metaDescriptionKeyword.js";
import keywordCountInUrl from "./languages/legacy/researches/keywordCountInUrl";
import findKeywordInFirstParagraph from "./languages/legacy/researches/findKeywordInFirstParagraph.js";
import pageTitleWidth from "./languages/legacy/researches/pageTitleWidth.js";
import wordComplexity from "./languages/legacy/researches/getWordComplexity.js";
import getParagraphLength from "./languages/legacy/researches/getParagraphLength.js";
import countSentencesFromText from "./languages/legacy/researches/countSentencesFromText.js";
import countSentencesFromDescription from "./languages/legacy/researches/countSentencesFromDescription.js";
import getSubheadingTextLengths from "./languages/legacy/researches/getSubheadingTextLengths.js";
import findTransitionWords from "./languages/legacy/researches/findTransitionWords.js";
import passiveVoice from "./languages/legacy/researches/getPassiveVoice.js";
import getSentenceBeginnings from "./languages/legacy/researches/getSentenceBeginnings.js";
import relevantWords from "./languages/legacy/researches/relevantWords";
import readingTime from "./languages/legacy/researches/readingTime";
import getTopicDensity from "./languages/legacy/researches/getTopicDensity";
import topicCount from "./languages/legacy/researches/topicCount";
import { keyphraseDistributionResearcher } from "./languages/legacy/researches/keyphraseDistribution";
const keyphraseDistribution = keyphraseDistributionResearcher;
import functionWordsInKeyphrase from "./languages/legacy/researches/functionWordsInKeyphrase";
import h1s from "./languages/legacy/researches/h1s";
import getProminentWordsForInsights from "./languages/legacy/researches/getProminentWordsForInsights";
import getProminentWordsForInternalLinking from "./languages/legacy/researches/getProminentWordsForInternalLinking";
import getWordForms from "./languages/legacy/researches/getWordForms";

/**
 * This contains all possible, default researches.
 * @param {Paper} paper The Paper object that is needed within the researches.
 * @constructor
 * @throws {InvalidTypeError} Parameter needs to be an instance of the Paper object.
 */
var Researcher = function( paper ) {
	this.setPaper( paper );

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

	this._data = {};

	this.customResearches = {};
};

/**
 * Set the Paper associated with the Researcher.
 * @param {Paper} paper The Paper to use within the Researcher
 * @throws {InvalidTypeError} Parameter needs to be an instance of the Paper object.
 * @returns {void}
 */
Researcher.prototype.setPaper = function( paper ) {
	this.paper = paper;
};

/**
 * Add a custom research that will be available within the Researcher.
 * @param {string} name A name to reference the research by.
 * @param {function} research The function to be added to the Researcher.
 * @throws {MissingArgument} Research name cannot be empty.
 * @throws {InvalidTypeError} The research requires a valid Function callback.
 * @returns {void}
 */
Researcher.prototype.addResearch = function( name, research ) {
	if ( isUndefined( name ) || isEmpty( name ) ) {
		throw new MissingArgument( "Research name cannot be empty" );
	}

	if ( ! ( research instanceof Function ) ) {
		throw new InvalidTypeError( "The research requires a Function callback." );
	}

	this.customResearches[ name ] = research;
};

/**
 * Check whether or not the research is known by the Researcher.
 * @param {string} name The name to reference the research by.
 * @returns {boolean} Whether or not the research is known by the Researcher
 */
Researcher.prototype.hasResearch = function( name ) {
	return Object.keys( this.getAvailableResearches() ).filter(
		function( research ) {
			return research === name;
		} ).length > 0;
};

/**
 * Return all available researches.
 * @returns {Object} An object containing all available researches.
 */
Researcher.prototype.getAvailableResearches = function() {
	return merge( this.defaultResearches, this.customResearches );
};

/**
 * Return the Research by name.
 * @param {string} name The name to reference the research by.
 *
 * @returns {*} Returns the result of the research or false if research does not exist.
 * @throws {MissingArgument} Research name cannot be empty.
 */
Researcher.prototype.getResearch = function( name ) {
	if ( isUndefined( name ) || isEmpty( name ) ) {
		throw new MissingArgument( "Research name cannot be empty" );
	}

	if ( ! this.hasResearch( name ) ) {
		return false;
	}

	return this.getAvailableResearches()[ name ]( this.paper, this );
};

/**
 * Add research data to the researcher by the research name.
 *
 * @param {string} research The identifier of the research.
 * @param {Object} data     The data object.
 *
 * @returns {void}.
 */
Researcher.prototype.addResearchData = function( research, data ) {
	this._data[ research ] = data;
};

/**
 * Return the research data from a research data provider by research name.
 *
 * @param {string} research The identifier of the research.
 *
 * @returns {*} The data provided by the provider, false if the data do not exist
 */
Researcher.prototype.getData = function( research ) {
	if ( this._data.hasOwnProperty( research ) ) {
		return this._data[ research ];
	}

	return false;
};

export default Researcher;
