/** @module analyses/getLinkStatistics */

import processExactMatchRequest from "../helpers/match/processExactMatchRequest";
import filterWordsFromArray from "../helpers/word/filterWordsFromArray";
import checkNofollow from "../helpers/link/checkNofollow.js";
import getWords from "../helpers/word/getWords";
import findKeywordInUrl from "../helpers/match/findKeywordInUrl.js";
import getAnchors from "../helpers/link/getAnchorsFromText.js";
import getLinkType from "../helpers/link/getLinkType.js";
import matchTextWithArray from "../helpers/match/matchTextWithArray";
import urlHelper from "../helpers/url/url.js";

import { flatten } from "lodash-es";
import { uniq } from "lodash-es";

let functionWords = [];

/**
 * Checks whether the link is pointing at itself.
 *
 * @param {string} anchor       The link anchor.
 * @param {string} permalink    The permalink of the paper.
 *
 * @returns {boolean} Whether the anchor is pointing at itself.
 */
const linkToSelf = function( anchor, permalink ) {
	const anchorLink = urlHelper.getFromAnchorTag( anchor );

	// Relative fragment links always point to the page itself.
	if ( urlHelper.isRelativeFragmentURL( anchorLink ) ) {
		return true;
	}

	return urlHelper.areEqual( anchorLink, permalink );
};

/**
 * Filters anchors that are not pointing at itself.
 *
 * @param {Array}   anchors     An array with all anchors from the paper.
 * @param {string}  permalink   The permalink of the paper.
 *
 * @returns {Array} The array of all anchors that are not pointing at the paper itself.
 */
const filterAnchorsLinkingToSelf = function( anchors, permalink ) {
	const anchorsLinkingToSelf = anchors.map( function( anchor ) {
		return linkToSelf( anchor, permalink );
	} );

	anchors = anchors.filter( function( anchor, index ) {
		return anchorsLinkingToSelf[ index ] === false;
	} );

	return anchors;
};

/**
 * Filters anchors that contain keyphrase or synonyms.
 *
 * @param {Array}   anchors     An array with all anchors from the paper
 * @param {Object}  topicForms  The object with topicForms.
 * @param {string}  locale      The locale of the paper.
 * @param {function}    matchWordCustomHelper The helper function to match word in text.
 * @param {object}      isExactMatchRequested   An object containing the keyphrase and information whether the exact match has been requested.
 *
 * @returns {Array} The array of all anchors that contain keyphrase or synonyms.
 */
const filterAnchorsContainingTopic = function( anchors, topicForms, locale, matchWordCustomHelper, isExactMatchRequested ) {
	const anchorsContainingKeyphraseOrSynonyms = anchors.map( function( anchor ) {
		return findKeywordInUrl( anchor, topicForms, locale, matchWordCustomHelper, isExactMatchRequested );
	} );
	anchors = anchors.filter( function( anchor, index ) {
		return anchorsContainingKeyphraseOrSynonyms[ index ] === true;
	} );

	return anchors;
};

/**
 * Filters anchors that are contained within keyphrase or synonyms.
 *
 * @param {Array}  anchors    An array with all anchors from the paper.
 * @param {Object} topicForms An object containing word forms of words included in the keyphrase or a synonym.
 * @param {string} locale     The locale of the paper.
 * @param {object} customHelpers            An object containing custom helpers.
 * @param {object} isExactMatchRequested    An object containing the keyphrase and information whether the exact match has been requested.
 *
 * @returns {Array} The array of all anchors contained in the keyphrase or synonyms.
 */
const filterAnchorsContainedInTopic = function( anchors, topicForms, locale, customHelpers, isExactMatchRequested  ) {
	const matchWordCustomHelper = customHelpers.matchWordCustomHelper;
	const getWordsCustomHelper = customHelpers.getWordsCustomHelper;

	// Prepare keyphrase and synonym forms for comparison with anchors.
	const keyphraseAndSynonymsWords = [ flatten( topicForms.keyphraseForms ) ];
	const synonymsForms = topicForms.synonymsForms;
	for ( let i = 0; i < synonymsForms.length; i++ ) {
		keyphraseAndSynonymsWords.push( flatten( synonymsForms[ i ] ) );
	}

	const anchorsContainedInTopic = [];

	anchors.forEach( function( currentAnchor ) {
		// Get single words from the anchor.
		let anchorWords = uniq( getWordsCustomHelper ? getWordsCustomHelper( currentAnchor ) : getWords( currentAnchor ) );

		// Filter function words out of the anchor text.
		const filteredAnchorWords = filterWordsFromArray( anchorWords, functionWords );
		if ( filteredAnchorWords.length > 0 ) {
			anchorWords = filteredAnchorWords;
		}

		// Check if the exact match is requested and every content words in the anchor text is included in the keyphrase.
		if ( isExactMatchRequested.exactMatchRequested &&
			anchorWords.every( anchorWord => isExactMatchRequested.keyphrase.includes( anchorWord ) ) ) {
			anchorsContainedInTopic.push( true );
		}

		// Check if anchorWords are contained in the topic phrase words.
		for ( let i = 0; i < keyphraseAndSynonymsWords.length; i++ ) {
			const topicForm =  keyphraseAndSynonymsWords[ i ];
			if ( anchorWords.every( anchorWord => matchTextWithArray( anchorWord, topicForm, locale, matchWordCustomHelper ).count > 0 ) ) {
				anchorsContainedInTopic.push( true );
				break;
			}
		}
	} );

	anchors = anchors.filter( function( anchor, index ) {
		return anchorsContainedInTopic[ index ] === true;
	} );

	return anchors;
};

/**
 * Checks whether or not an anchor contains the passed keyword.
 * @param {Paper} paper The paper to research.
 * @param {Researcher} researcher The researcher to use.
 * @param {Array} anchors The array of anchors of the links found in the paper.
 * @param {string} permalink The string with a permalink of the paper.
 *
 * @returns {Object} How many anchors contained the keyphrase or synonyms, what are these anchors
 */
const keywordInAnchor = function( paper, researcher, anchors, permalink ) {
	const customHelpers = {
		matchWordCustomHelper: researcher.getHelper( "matchWordCustomHelper" ),
		getWordsCustomHelper: researcher.getHelper( "getWordsCustomHelper" ),
	};
	const result = { totalKeyword: 0, matchedAnchors: [] };

	const keyword = paper.getKeyword();

	// If no keyword is set, return empty result.
	if ( keyword === "" ) {
		return result;
	}

	// Filter out anchors that point at the paper itself.
	anchors = filterAnchorsLinkingToSelf( anchors, permalink );
	if ( anchors.length === 0 ) {
		return result;
	}

	const locale = paper.getLocale();
	const topicForms = researcher.getResearch( "morphology" );

	const isExactMatchRequested = processExactMatchRequest( keyword );

	// Check if any anchors contain keyphrase or synonyms in them.
	anchors = filterAnchorsContainingTopic( anchors, topicForms, locale, customHelpers.matchWordCustomHelper, isExactMatchRequested );
	if ( anchors.length === 0 ) {
		return result;
	}

	// Check if content words from the anchors are all within the keyphrase or the synonyms.
	anchors = filterAnchorsContainedInTopic( anchors, topicForms, locale, customHelpers, isExactMatchRequested );
	result.totalKeyword = anchors.length;
	result.matchedAnchors = anchors;

	return result;
};

/**
 * Counts the links found in the text.
 *
 * @param {Paper} paper The paper object containing text, keyword and url.
 * @param {Researcher} researcher The researcher to use for the paper.
 *
 * @returns {object} The object containing all linktypes.
 * total: the total number of links found.
 * totalNaKeyword: the total number of links if keyword is not available.
 * keyword: Object containing all the keyword related counts and matches.
 * keyword.totalKeyword: the total number of links with the keyword.
 * keyword.matchedAnchors: Array with the anchors that contain the keyword.
 * internalTotal: the total number of links that are internal.
 * internalDofollow: the internal links without a nofollow attribute.
 * internalNofollow: the internal links with a nofollow attribute.
 * externalTotal: the total number of links that are external.
 * externalDofollow: the external links without a nofollow attribute.
 * externalNofollow: the internal links with a dofollow attribute.
 * otherTotal: all links that are not HTTP or HTTPS.
 * otherDofollow: other links without a nofollow attribute.
 * otherNofollow: other links with a nofollow attribute.
 */
const countLinkTypes = function( paper, researcher ) {
	functionWords = researcher.getConfig( "functionWords" );
	const anchors = getAnchors( paper.getText() );
	const permalink = paper.getPermalink();

	const linkCount = {
		total: anchors.length,
		totalNaKeyword: 0,
		keyword: {
			totalKeyword: 0,
			matchedAnchors: [],
		},
		internalTotal: 0,
		internalDofollow: 0,
		internalNofollow: 0,
		externalTotal: 0,
		externalDofollow: 0,
		externalNofollow: 0,
		otherTotal: 0,
		otherDofollow: 0,
		otherNofollow: 0,
	};

	for ( let i = 0; i < anchors.length; i++ ) {
		const currentAnchor = anchors[ i ];

		const linkType = getLinkType( currentAnchor, permalink );
		const linkFollow = checkNofollow( currentAnchor );

		linkCount[ linkType + "Total" ]++;
		linkCount[ linkType + linkFollow ]++;
	}

	const keywordInAnchors = keywordInAnchor( paper, researcher, anchors, permalink );
	linkCount.keyword.totalKeyword = keywordInAnchors.totalKeyword;
	linkCount.keyword.matchedAnchors = keywordInAnchors.matchedAnchors;

	return linkCount;
};

export default countLinkTypes;
