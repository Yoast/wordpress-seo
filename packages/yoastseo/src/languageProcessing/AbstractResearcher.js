import InvalidTypeError from "../errors/invalidType";
import MissingArgument from "../errors/missingArgument";

import wordCountInText from "./researches/wordCountInText.js";
import linkCount from "./researches/countLinks.js";
import getLinks from "./researches/getLinks.js";
import urlLength from "./researches/urlIsTooLong.js";
import getKeywordDensity from "./researches/base/getKeywordDensity.js";
import metaDescriptionLength from "./researches/metaDescriptionLength.js";
import metaDescriptionKeyword from "./researches/metaDescriptionKeyword";
import imageCount from "./researches/imageCountInText.js";
import altTagCount from "./researches/imageAltTags.js";
import keyphraseLength from "./researches/keyphraseLength";
import pageTitleWidth from "./researches/pageTitleWidth.js";
import wordComplexity from "./researches/getWordComplexity.js";
import getParagraphLength from "./researches/getParagraphLength.js";
import countSentencesFromText from "./researches/countSentencesFromText.js";
import countSentencesFromDescription from "./researches/countSentencesFromDescription.js";
import getSubheadingTextLengths from "./researches/getSubheadingTextLengths.js";
import readingTime from "./researches/readingTime";
import h1s from "./researches/h1s";
import sentences from "./researches/sentences";
import findKeywordInFirstParagraph from "./researches/findKeywordInFirstParagraph.js";
import keywordCount from "./researches/keywordCount";
import keywordCountInUrl from "./researches/keywordCountInUrl";

import { merge, isUndefined, isEmpty } from "lodash-es";

/**
 * The researches contains all the researches
 */
export default class AbstractResearcher {
	/**
	 * Constructor
	 * @param {Paper} paper The Paper object that is needed within the researches.
	 * @constructor
	 */
	constructor( paper ) {
		this.paper = paper;

		this.defaultResearches = {
			urlLength: urlLength,
			wordCountInText: wordCountInText,
			getLinks: getLinks,
			linkCount: linkCount,
			imageCount: imageCount,
			altTagCount: altTagCount,
			getKeywordDensity: getKeywordDensity,
			metaDescriptionLength: metaDescriptionLength,
			metaDescriptionKeyword: metaDescriptionKeyword,
			keyphraseLength: keyphraseLength,
			pageTitleWidth: pageTitleWidth,
			wordComplexity: wordComplexity,
			getParagraphLength: getParagraphLength,
			countSentencesFromText: countSentencesFromText,
			countSentencesFromDescription: countSentencesFromDescription,
			getSubheadingTextLengths: getSubheadingTextLengths,
			readingTime: readingTime,
			h1s: h1s,
			sentences: sentences,
			firstParagraph: findKeywordInFirstParagraph,
			keywordCount: keywordCount,
			keywordCountInUrl: keywordCountInUrl,
		};

		this._data = {};

		this.customResearches = {};
	}

	/**
	 * Set the Paper associated with the Researcher.
	 * @param {Paper} paper The Paper to use within the Researcher
	 * @throws {InvalidTypeError} Parameter needs to be an instance of the Paper object.
	 * @returns {void}
	 */
	setPaper( paper ) {
		this.paper = paper;
	}

	/**
	 * Add a custom research that will be available within the Researcher.
	 * @param {string} name A name to reference the research by.
	 * @param {function} research The function to be added to the Researcher.
	 * @throws {MissingArgument} Research name cannot be empty.
	 * @throws {InvalidTypeError} The research requires a valid Function callback.
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
	 * Check whether or not the research is known by the Researcher.
	 * @param {string} name The name to reference the research by.
	 * @returns {boolean} Whether or not the research is known by the Researcher
	 */
	hasResearch( name ) {
		return Object.keys( this.getAvailableResearches() ).filter(
			function( research ) {
				return research === name;
			} ).length > 0;
	}

	/**
	 * Return all available researches.
	 * @returns {Object} An object containing all available researches.
	 */
	getAvailableResearches() {
		return merge( this.defaultResearches, this.customResearches );
	}

	/**
	 * Return the Research by name.
	 * @param {string} name The name to reference the research by.
	 *
	 * @returns {*} Returns the result of the research or false if research does not exist.
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
	 * Return the research data from a research data provider by research name.
	 *
	 * @param {string} research The identifier of the research.
	 *
	 * @returns {*} The data provided by the provider, false if the data do not exist
	 */
	getData( research ) {
		if ( this._data.hasOwnProperty( research ) ) {
			return this._data[ research ];
		}

		return false;
	}
}
