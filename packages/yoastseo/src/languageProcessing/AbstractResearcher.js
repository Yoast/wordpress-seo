import { merge, isUndefined, isEmpty } from "lodash";

import InvalidTypeError from "../errors/invalidType";
import MissingArgument from "../errors/missingArgument";

// All researches in alphabetical order.
import altTagCount from "./researches/altTagCount.js";
import countSentencesFromText from "./researches/countSentencesFromText.js";
import findKeywordInFirstParagraph from "./researches/findKeywordInFirstParagraph.js";
import findKeyphraseInSEOTitle from "./researches/findKeyphraseInSEOTitle";
import findTransitionWords from "./researches/findTransitionWords";
import functionWordsInKeyphrase from "./researches/functionWordsInKeyphrase";
import getAnchorsWithKeyphrase from "./researches/getAnchorsWithKeyphrase";
import getFleschReadingScore from "./researches/getFleschReadingScore";
import getKeyphraseDensity, { getKeywordDensity } from "./researches/getKeywordDensity.js";
import getLinks from "./researches/getLinks.js";
import getLinkStatistics from "./researches/getLinkStatistics";
import getParagraphs from "./researches/getParagraphs";
import getParagraphLength from "./researches/getParagraphLength.js";
import getPassiveVoiceResult from "./researches/getPassiveVoiceResult";
import getProminentWordsForInsights from "./researches/getProminentWordsForInsights";
import getProminentWordsForInternalLinking from "./researches/getProminentWordsForInternalLinking";
import getSentenceBeginnings from "./researches/getSentenceBeginnings";
import getSubheadingTextLengths from "./researches/getSubheadingTextLengths.js";
import h1s from "./researches/h1s";
import imageCount from "./researches/imageCount.js";
import keyphraseLength from "./researches/keyphraseLength";
import getKeyphraseCount, { keywordCount } from "./researches/keywordCount";
import { keywordCountInSlug, keywordCountInUrl } from "./researches/keywordCountInUrl";
import matchKeywordInSubheadings from "./researches/matchKeywordInSubheadings";
import metaDescriptionKeyword from "./researches/metaDescriptionKeyword";
import metaDescriptionLength from "./researches/metaDescriptionLength.js";
import morphology from "./researches/getWordForms";
import pageTitleWidth from "./researches/pageTitleWidth.js";
import readingTime from "./researches/readingTime";
import sentences from "./researches/sentences";
import videoCount from "./researches/videoCount";
import wordCountInText from "./researches/wordCountInText.js";

// All helpers.
import memoizedTokenizer from "./helpers/sentence/memoizedSentenceTokenizer";

/**
 * The researcher contains all the researches, helpers, data, and config.
 */
export default class AbstractResearcher {
	/**
	 * Constructor
	 * @param {Paper} paper The Paper object that is needed within the researches.
	 *
	 * @constructor
	 */
	constructor( paper ) {
		this.paper = paper;

		// We expose the deprecated keywordCountInUrl for backwards compatibility.
		this.defaultResearches = {
			altTagCount,
			countSentencesFromText,
			findKeywordInFirstParagraph,
			findKeyphraseInSEOTitle,
			findTransitionWords,
			functionWordsInKeyphrase,
			getAnchorsWithKeyphrase,
			getFleschReadingScore,
			getKeyphraseCount,
			getKeyphraseDensity,
			getKeywordDensity,
			getLinks,
			getLinkStatistics,
			getParagraphs,
			getParagraphLength,
			getProminentWordsForInsights,
			getProminentWordsForInternalLinking,
			getSentenceBeginnings,
			getSubheadingTextLengths,
			h1s,
			imageCount,
			keyphraseLength,
			keywordCount,
			keywordCountInSlug,
			keywordCountInUrl,
			matchKeywordInSubheadings,
			metaDescriptionKeyword,
			metaDescriptionLength,
			morphology,
			pageTitleWidth,
			readingTime,
			sentences,
			wordCountInText,
			videoCount,
			getPassiveVoiceResult,
		};

		this._data = {};

		this.customResearches = {};

		this.helpers = {
			memoizedTokenizer,
		};

		this.config = {
			areHyphensWordBoundaries: true,
		};
	}

	/**
	 * Set the Paper associated with the Researcher.
	 *
	 * @param {Paper} paper The Paper to use within the Researcher.
	 *
	 * @throws {InvalidTypeError} Parameter needs to be an instance of the Paper object.
	 *
	 * @returns {void}
	 */
	setPaper( paper ) {
		this.paper = paper;
	}

	/**
	 * Add a custom research that will be available within the Researcher.
	 *
	 * @param {string}   name     A name to reference the research by.
	 * @param {function} research The function to be added to the Researcher.
	 *
	 * @throws {MissingArgument}  Research name cannot be empty.
	 * @throws {InvalidTypeError} The research requires a valid Function callback.
	 *
	 * @returns {void}
	 */
	addResearch( name, research ) {
		if ( isUndefined( name ) || isEmpty( name ) ) {
			throw new MissingArgument( "Research name cannot be empty" );
		}

		if ( ! ( research instanceof Function ) ) {
			throw new InvalidTypeError( "The research requires a Function callback." );
		}

		this.customResearches[ name ] = research;
	}

	/**
	 * Add research data to the researcher by the research name.
	 *
	 * @param {string} research The identifier of the research.
	 * @param {Object} data     The data object.
	 *
	 * @returns {void}.
	 */
	addResearchData( research, data ) {
		this._data[ research ] = data;
	}

	/**
	 * Add a custom helper that will be available within the Researcher.
	 *
	 * @param {string}   name     A name to reference the helper by.
	 * @param {function} helper   The function to be added to the Researcher.
	 *
	 * @throws {MissingArgument}  Helper name cannot be empty.
	 * @throws {InvalidTypeError} The helper requires a valid Function callback.
	 *
	 * @returns {void}
	 */
	addHelper( name, helper ) {
		if ( isUndefined( name ) || isEmpty( name ) ) {
			throw new MissingArgument( "Helper name cannot be empty" );
		}

		if ( ! ( helper instanceof Function ) ) {
			throw new InvalidTypeError( "The research requires a Function callback." );
		}

		this.helpers[ name ] = helper;
	}

	/**
	 * Add a custom configuration that will be available within the Researcher.
	 *
	 * @param {string}  name     A name to reference the helper by.
	 * @param {*}       config   The configuration to be added to the Researcher.
	 *
	 * @throws {MissingArgument}  Configuration name and the configuration itself cannot be empty.
	 *
	 * @returns {void}
	 */
	addConfig( name, config ) {
		if ( isUndefined( name ) || isEmpty( name ) ) {
			throw new MissingArgument( "Failed to add the custom researcher config. Config name cannot be empty." );
		}

		if ( isUndefined( config ) || ( isEmpty( config ) && config === Object( config ) ) ) {
			throw new MissingArgument( "Failed to add the custom researcher config. Config cannot be empty." );
		}

		this.config[ name ] = config;
	}

	/**
	 * Check whether the research is known by the Researcher.
	 *
	 * @param {string} name The name to reference the research by.
	 *
	 * @returns {boolean} Whether or not the research is known by the Researcher.
	 */
	hasResearch( name ) {
		return Object.keys( this.getAvailableResearches() ).filter(
			function( research ) {
				return research === name;
			} ).length > 0;
	}

	/**
	 * Check whether the helper is known by the Researcher.
	 *
	 * @param {string} name The name to reference the helper by.
	 *
	 * @returns {boolean} Whether or not the helper is known by the Researcher.
	 */
	hasHelper( name ) {
		return Object.keys( this.getAvailableHelpers() ).filter(
			function( helper ) {
				return helper === name;
			} ).length > 0;
	}

	/**
	 * Check whether the config is known by the Researcher.
	 *
	 * @param {string} name The name to reference the config by.
	 *
	 * @returns {boolean} Whether or not the config is known by the Researcher.
	 */
	hasConfig( name ) {
		return Object.keys( this.getAvailableConfig() ).filter(
			function( config ) {
				return config === name;
			} ).length > 0;
	}

	/**
	 * Check whether the research data is known by the Researcher.
	 *
	 * @param {string} name The name to reference the research data by.
	 *
	 * @returns {boolean} Whether or not the research data is known by the Researcher.
	 */
	hasResearchData( name ) {
		return Object.keys( this.getAvailableResearchData() ).filter(
			function( data ) {
				return data === name;
			} ).length > 0;
	}

	/**
	 * Return all available researches.
	 *
	 * @returns {Object} An object containing all available researches.
	 */
	getAvailableResearches() {
		return merge( this.defaultResearches, this.customResearches );
	}

	/**
	 * Return all available helpers.
	 *
	 * @returns {Object} An object containing all available helpers.
	 */
	getAvailableHelpers() {
		return this.helpers;
	}

	/**
	 * Return all available configuration.
	 *
	 * @returns {Object} An object containing all available configuration.
	 */
	getAvailableConfig() {
		return this.config;
	}

	/**
	 * Return all available research data.
	 *
	 * @returns {Object} An object containing all available research data.
	 */
	getAvailableResearchData() {
		return this._data;
	}

	/**
	 * Return the Research by name.
	 *
	 * @param {string} name The name to reference the research by.
	 *
	 * @returns {*} Returns the result of the research or false if research does not exist.
	 *
	 * @throws {MissingArgument} Research name cannot be empty.
	 */
	getResearch( name ) {
		if ( isUndefined( name ) || isEmpty( name ) ) {
			throw new MissingArgument( "Research name cannot be empty" );
		}

		if ( ! this.hasResearch( name ) ) {
			return false;
		}

		return this.getAvailableResearches()[ name ]( this.paper, this );
	}

	/**
	 * Return the research data from a research data provider by research name.
	 *
	 * @param {string} research The identifier of the research.
	 *
	 * @returns {*} The data provided by the provider, false if the data do not exist
	 */
	getData( research ) {
		if ( this.hasResearchData( research ) ) {
			return this._data[ research ];
		}

		return false;
	}

	/**
	 * Return language specific configuration by configuration name.
	 *
	 * @param {string} name The name of the configuration.
	 *
	 * @returns {*} The configuration, false if the configuration does not exist.
	 */
	getConfig( name ) {
		if ( this.hasConfig( name ) ) {
			return this.config[ name ];
		}

		return false;
	}

	/**
	 * Return language specific helper by helper name.
	 *
	 * @param {string} name The name of the helper.
	 *
	 * @returns {*} The helper, false if the helper does not exist.
	 */
	getHelper( name ) {
		if ( this.hasHelper( name ) ) {
			return this.helpers[ name ];
		}

		return false;
	}
}
