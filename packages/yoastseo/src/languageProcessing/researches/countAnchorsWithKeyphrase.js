import { flatten, uniq } from "lodash-es";
import filterWordsFromArray from "../helpers/word/filterWordsFromArray";
import { findTopicFormsInString } from "../helpers/match/findKeywordFormsInString";
import getWords from "../helpers/word/getWords";
import matchTextWithArray from "../helpers/match/matchTextWithArray";
import parseSynonyms from "../helpers/sanitize/parseSynonyms";
import processExactMatchRequest from "../helpers/match/processExactMatchRequest";
import urlHelper from "../helpers/url/url.js";

let functionWords = [];

/**
 * Checks whether the anchor's link is a relative fragment or the same as the site url/domain.
 *
 * @param {string} anchorLink       The link anchor.
 * @param {string} siteUrlOrDomain  The site URL or domain of the paper.
 *
 * @returns {boolean} Whether the anchor's link is a relative fragment or the same as the site url/domain.
 */
function isLinkingToSelf( anchorLink, siteUrlOrDomain ) {
	// Relative fragment links always point to the page itself.
	if ( urlHelper.isRelativeFragmentURL( anchorLink ) ) {
		return true;
	}

	return urlHelper.areEqual( anchorLink, siteUrlOrDomain );
}

/**
 * Filters anchors whose url is not linking at the current site url/domain.
 *
 * @param {Array}   anchors     	  An array with all anchors from the paper.
 * @param {string}  siteUrlOrDomain   The site URL or domain of the paper.
 *
 * @returns {Array} The array of all anchors whose url is not linking at the current site url/domain.
 */
function filterAnchorsLinkingToSelf( anchors, siteUrlOrDomain ) {
	const anchorsLinkingToSelf = anchors.map( function( anchor ) {
		const anchorLink = anchor.attributes.href;
		return isLinkingToSelf( anchorLink, siteUrlOrDomain );
	} );

	return  anchors.filter( function( anchor, index ) {
		return anchorsLinkingToSelf[ index ] === false;
	} );
}

/**
 * Filters anchors with text that contains all content words of the keyphrase or synonyms.
 *
 * @param {Array}       anchors         An array with all anchors from the paper
 * @param {Object}      topicForms      The object with topicForms. It contains all forms of the keyphrase and synonyms.
 * @param {String}      locale          The locale of the paper.
 * @param {Function}    matchWordCustomHelper The helper function to match word in text.
 *
 * @returns {String[]} The array of all anchors with text that contains all content words of the keyphrase or synonyms.
 */
function filterAnchorsContainingTopic( anchors, topicForms, locale, matchWordCustomHelper ) {
	const anchorsContainingKeyphraseOrSynonyms = anchors.map( function( anchor ) {
		// Only retrieve the anchor's text. This is because we only use the anchor text for the following check.
		const anchorText = anchor.innerText();
		return findTopicFormsInString( topicForms, anchorText, true, locale, matchWordCustomHelper  ).percentWordMatches === 100;
	} );

	return anchors.filter( function( anchor, index ) {
		return anchorsContainingKeyphraseOrSynonyms[ index ] === true;
	} );
}

/**
 * Filters anchors with text that has the same content words as the keyphrase/synonyms.
 *
 * @param {Array}       anchors             An array with all anchors from the paper.
 * @param {Object}      topicForms          The object with topicForms. It contains all forms of the keyphrase and synonyms.
 * @param {String}      locale              The locale of the paper.
 * @param {Object}      customHelpers       An object containing custom helpers.
 * @param {Object[]}    exactMatchRequest   An array of objects containing the keyphrase and information whether the exact match has been requested.
 *
 * @returns {Array} The array of all anchors with text that has the same content words as the keyphrase/synonyms.
 */
function filterAnchorsContainedInTopic( anchors, topicForms, locale, customHelpers, exactMatchRequest  ) {
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
		const currentAnchorText = currentAnchor.innerText();
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

	anchors = anchors.filter( function( anchor, index ) {
		return anchorsContainedInTopic[ index ] === true;
	} );

	return anchors;
}

/**
 * Checks whether the content words of the anchor text are the same as the content words of the keyphrase or synonym.
 * Also includes different word forms if the morphology is available.
 *
 * @param {Paper}       paper       The paper to research.
 * @param {Researcher}  researcher  The researcher to use.
 *
 * @returns {number} The amount of anchor texts whose content words are the same as the keyphrase or synonyms' content words.
 */
export default function( paper, researcher ) {
	functionWords = researcher.getConfig( "functionWords" );

	// Only retrieve the anchors from the paper when the paper text is not empty.
	let anchors = ( paper.getText() !== "" ) && paper.getTree().findAll( treeNode => treeNode.name === "a" );
	/*
	 * We get the site's URL (e.g., https://yoast.com) or domain (e.g., yoast.com) from the paper.
	 * In case of WordPress, the variable is a URL. In case of Shopify, it is a domain.
	 */
	const siteUrlOrDomain = paper.getPermalink();
	const customHelpers = {
		matchWordCustomHelper: researcher.getHelper( "matchWordCustomHelper" ),
		getWordsCustomHelper: researcher.getHelper( "getWordsCustomHelper" ),
	};

	// STEP 1.
	const keyphrase = paper.getKeyword();
	/*
	 * If no keyphrase is set, return 0.
	 * This is a conscious decision where we won't assess the paper if the keyphrase is not set.
	 * This includes a case where only the synonym is set but not the keyphrase.
	 */
	if ( keyphrase === "" ) {
		return 0;
	}

	/*
	 * When the keyphrase is set, also retrieve the synonyms and save them in "topics" array.
	 * Eventually, the term topics here refers to either keyphrase or synonyms.
	 */
	const originalTopics = parseSynonyms( paper.getSynonyms() );
	originalTopics.push( keyphrase );

	// STEP 2.
	// Filter anchors with urls that are not linking to the current site url/domain.
	anchors = filterAnchorsLinkingToSelf( anchors, siteUrlOrDomain );
	// If all anchor urls are linking to the current site url/domain, return 0.
	if ( anchors.length === 0 ) {
		return 0;
	}

	const locale = paper.getLocale();
	const topicForms = researcher.getResearch( "morphology" );

	// STEP 3.
	// Filter anchors with text that contains the keyphrase/synonmys' content words.
	anchors = filterAnchorsContainingTopic( anchors, topicForms, locale, customHelpers.matchWordCustomHelper );
	// If all anchor texts do not contain the keyphrase/synonmys' content words, return 0.
	if ( anchors.length === 0 ) {
		return 0;
	}

	// STEP 4.
	// Check if exact match is requested for every topic (keyphrase or synonym).
	const isExactMatchRequested = originalTopics.map( originalTopic => processExactMatchRequest( originalTopic ) );
	// Filter anchors with text that has the same content words as the keyphrase/synonyms.
	anchors = filterAnchorsContainedInTopic( anchors, topicForms, locale, customHelpers, isExactMatchRequested );

	return anchors.length;
}

