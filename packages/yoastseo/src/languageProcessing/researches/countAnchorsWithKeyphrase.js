
import { flatten, uniq } from "lodash-es";
import { findTopicFormsInString } from "../helpers/match/findKeywordFormsInString";
import matchTextWithArray from "../helpers/match/matchTextWithArray";
import processExactMatchRequest from "../helpers/match/processExactMatchRequest";
import parseSynonyms from "../helpers/sanitize/parseSynonyms";
import urlHelper from "../helpers/url/url.js";
import filterWordsFromArray from "../helpers/word/filterWordsFromArray";
import getWords from "../helpers/word/getWords";

let functionWords = [];

/**
 * Checks whether the link is pointing at itself.
 *
 * @param {string} anchorLink      	 	  The link anchor.
 * @param {string} siteUrlOrDomain    The site URL or domain of the paper.
 *
 * @returns {boolean} Whether the anchor is pointing at itself.
 */
const linkToSelf = function( anchorLink, siteUrlOrDomain ) {
	// Relative fragment links always point to the page itself.
	if ( urlHelper.isRelativeFragmentURL( anchorLink ) ) {
		return true;
	}

	return urlHelper.areEqual( anchorLink, siteUrlOrDomain );
};

/**
 * Filters anchors that are not pointing at itself.
 *
 * @param {Array}   anchors     	  An array with all anchors from the paper.
 * @param {string}  siteUrlOrDomain   The site URL or domain of the paper.
 *
 * @returns {Array} The array of all anchors that are not pointing at the paper itself.
 */
const filterAnchorsLinkingToSelf = function( anchors, siteUrlOrDomain ) {
	const anchorsLinkingToSelf = anchors.map( function( anchor ) {
		const anchorLink = anchor.attributes.href;
		return linkToSelf( anchorLink, siteUrlOrDomain );
	} );

	anchors = anchors.filter( function( anchor, index ) {
		return anchorsLinkingToSelf[ index ] === false;
	} );

	return anchors;
};

/**
 * Filters anchors that contain keyphrase or synonyms.
 *
 * @param {Array}   anchorTexts     An array with all anchors from the paper
 * @param {Object}  topicForms  The object with topicForms.
 * @param {string}  locale      The locale of the paper.
 * @param {function}    matchWordCustomHelper The helper function to match word in text.
 *
 * @returns {Array} The array of all anchors that contain keyphrase or synonyms.
 */
export const filterAnchorsContainingTopic = function( anchorTexts, topicForms, locale, matchWordCustomHelper ) {
	const anchorsContainingKeyphraseOrSynonyms = anchorTexts.map( function( anchorText ) {
		return findTopicFormsInString( topicForms, anchorText, true, locale, matchWordCustomHelper  ).percentWordMatches === 100;
	} );
	anchorTexts = anchorTexts.filter( function( anchorText, index ) {
		return anchorsContainingKeyphraseOrSynonyms[ index ] === true;
	} );

	return anchorTexts;
};

/**
 * Filters anchors that are contained within keyphrase or synonyms.
 *
 * @param {Array}       anchorTexts             An array with all anchors from the paper.
 * @param {Object}      topicForms          An object containing word forms of words included in the keyphrase or a synonym.
 * @param {string}      locale              The locale of the paper.
 * @param {Object}      customHelpers       An object containing custom helpers.
 * @param {Object[]}    exactMatchRequest   An array of objects containing the keyphrase and information whether the exact match has been requested.
 *
 * @returns {Array} The array of all anchors contained in the keyphrase or synonyms.
 */
export const filterAnchorsContainedInTopic = function( anchorTexts, topicForms, locale, customHelpers, exactMatchRequest  ) {
	const matchWordCustomHelper = customHelpers.matchWordCustomHelper;
	const getWordsCustomHelper = customHelpers.getWordsCustomHelper;

	// Prepare keyphrase and synonym forms for comparison with anchors.
	const keyphraseAndSynonymsWords = [ flatten( topicForms.keyphraseForms ) ];
	const synonymsForms = topicForms.synonymsForms;
	for ( let i = 0; i < synonymsForms.length; i++ ) {
		keyphraseAndSynonymsWords.push( flatten( synonymsForms[ i ] ) );
	}

	const anchorsContainedInTopic = [];

	anchorTexts.forEach( function( currentAnchorText ) {
		// Get single words from the anchor.
		let anchorWords = uniq( getWordsCustomHelper ? getWordsCustomHelper( currentAnchorText ) : getWords( currentAnchorText ) );

		// Filter function words out of the anchor text.
		const filteredAnchorWords = filterWordsFromArray( anchorWords, functionWords );
		if ( filteredAnchorWords.length > 0 ) {
			anchorWords = filteredAnchorWords;
		}

		exactMatchRequest.forEach( request => {
			/*
			 * Check if the exact match is requested for the keyphrase and every content words in the anchor text is included
			 * in the keyphrase or synonym.
			 */
			if ( request.exactMatchRequested &&
				anchorWords.every( anchorWord => request.keyphrase.includes( anchorWord ) ) ) {
				anchorsContainedInTopic.push( true );
			}
		} );

		// Check if anchorWords are contained in the topic phrase words.
		for ( let i = 0; i < keyphraseAndSynonymsWords.length; i++ ) {
			const topicForm =  keyphraseAndSynonymsWords[ i ];

			if ( anchorWords.every( anchorWord => matchTextWithArray( anchorWord, topicForm, locale, matchWordCustomHelper ).count > 0 ) ) {
				anchorsContainedInTopic.push( true );
				break;
			}
		}
	} );

	anchorTexts = anchorTexts.filter( function( anchorText, index ) {
		return anchorsContainedInTopic[ index ] === true;
	} );

	return anchorTexts;
};

/**
 * Checks whether the content words of the anchor text are the same as the content words of the keyphrase or synonym.
 * Also includes different word forms if the morphology is available.
 *
 * @param {Paper} paper The paper to research.
 * @param {Researcher} researcher The researcher to use.
 *
 * @returns {number} How many anchors contained the keyphrase or synonyms, what are these anchors
 */
export default function( paper, researcher ) {
	functionWords = researcher.getConfig( "functionWords" );
	let anchors = paper.getTree().findAll( treeNode => treeNode.name === "a" );
	/*
	 * We get the site's URL (e.g., https://yoast.com) or domain (e.g., yoast.com) from the paper.
	 * In case of WordPress, the variable is a URL. In case of Shopify, it is a domain.
	 */
	const siteUrlOrDomain = paper.getPermalink();
	const customHelpers = {
		matchWordCustomHelper: researcher.getHelper( "matchWordCustomHelper" ),
		getWordsCustomHelper: researcher.getHelper( "getWordsCustomHelper" ),
	};

	const keyphrase = paper.getKeyword();
	const originalTopics = parseSynonyms( paper.getSynonyms() );
	originalTopics.push( keyphrase );

	// If no keyphrase is set, return empty result.
	if ( keyphrase === "" ) {
		return 0;
	}

	// Filter out anchors that point at the paper itself.
	anchors = filterAnchorsLinkingToSelf( anchors, siteUrlOrDomain );
	if ( anchors.length === 0 ) {
		return 0;
	}

	const locale = paper.getLocale();
	const topicForms = researcher.getResearch( "morphology" );
	// Check if exact match is requested for every topic.
	const isExactMatchRequested = originalTopics.map( originalTopic => processExactMatchRequest( originalTopic ) );
	// Only retrieve the anchorText. This is because we only use the anchor text for the following checks.
	const anchorTexts = anchors.map( anchor => anchor.innerText() );
	// Check if any anchors contain keyphrase or synonyms in them.

	anchors = filterAnchorsContainingTopic( anchorTexts, topicForms, locale, customHelpers.matchWordCustomHelper );
	if ( anchors.length === 0 ) {
		return 0;
	}

	// Check if content words from the anchors are all within the keyphrase or the synonyms.
	anchors = filterAnchorsContainedInTopic( anchorTexts, topicForms, locale, customHelpers, isExactMatchRequested );

	return anchors.length;
}

