import { flatten, uniq } from "lodash";
import filterWordsFromArray from "../helpers/word/filterWordsFromArray";
import { findTopicFormsInString } from "../helpers/match/findKeywordFormsInString";
import getWords from "../helpers/word/getWords";
import matchTextWithArray from "../helpers/match/matchTextWithArray";
import parseSynonyms from "../helpers/sanitize/parseSynonyms";
import processExactMatchRequest from "../helpers/match/processExactMatchRequest";
import urlHelper from "../helpers/url/url.js";
import { WORD_BOUNDARY_WITH_HYPHEN, WORD_BOUNDARY_WITHOUT_HYPHEN } from "../../config/wordBoundariesWithoutPunctuation";

let functionWords = [];

/**
 * Checks whether the anchor's link is a relative fragment or the same as the site url/domain.
 * Relative fragment links always point to the page itself.
 *
 * @param {String} anchorLink       The link anchor.
 * @param {String} siteUrlOrDomain  The site URL or domain of the paper.
 *
 * @returns {boolean} Whether the anchor's link is a relative fragment or the same as the site url/domain.
 */
function isLinkingToSelf( anchorLink, siteUrlOrDomain ) {
	return Boolean( urlHelper.areEqual( anchorLink, siteUrlOrDomain ) || urlHelper.isRelativeFragmentURL( anchorLink ) );
}

/**
 * Gets the anchors whose url is not linking at the current site url/domain.
 *
 * @param {Array}   anchors         An array with all anchors from the paper.
 * @param {String}  siteUrlOrDomain The site URL or domain of the paper.
 *
 * @returns {Array} The array of all anchors whose url is not linking at the current site url/domain.
 */
function getAnchorsLinkingToSelf( anchors, siteUrlOrDomain ) {
	const anchorsLinkingToSelf = anchors.map( function( anchor ) {
		const anchorLink = anchor.attributes.href;
		// Return false if there is no href attribute.
		return anchorLink ? isLinkingToSelf( anchorLink, siteUrlOrDomain ) : false;
	} );

	return  anchors.filter( ( anchor, index ) => ! anchorsLinkingToSelf[ index ] );
}

/**
 * Gets the anchors with text that contains all content words of the topic (i.e. keyphrase or synonyms).
 *
 * @param {Array}       anchors         An array with all anchors from the paper
 * @param {Object}      topicForms      The object with topicForms. It contains all forms of the keyphrase and synonyms.
 * @param {String}      locale          The locale of the paper.
 * @param {Function}    matchWordCustomHelper The helper function to match word in text.
 *
 * @returns {String[]} The array of all anchors with text that contains all content words of the keyphrase or synonyms.
 */
function getAnchorsContainingTopic( anchors, topicForms, locale, matchWordCustomHelper ) {
	const anchorsContainingTopic = anchors.map( function( anchor ) {
		// Only retrieve the anchor's text. This is because we only use the anchor text for the following check.
		const anchorText = anchor.innerText();
		return findTopicFormsInString( topicForms, anchorText, true, locale, matchWordCustomHelper  ).percentWordMatches === 100;
	} );

	return anchors.filter( ( anchor, index ) => anchorsContainingTopic[ index ] );
}

/**
 * Gets the anchors with text that has the same content words as the keyphrase or synonyms.
 *
 * @param {Array}       anchors             		An array with all anchors from the paper.
 * @param {Object}      topicForms          		The object with topicForms. It contains all forms of the keyphrase and synonyms.
 * @param {string}      locale              		The locale of the paper.
 * @param {Object}      customHelpers       		An object containing custom helpers.
 * @param {Object[]}    exactMatchRequest   		An array of objects containing the keyphrase and information on whether
 * 													the exact match has been requested.
 * @param {boolean}	 	areHyphensWordBoundaries	Whether hyphens should be treated as word boundaries.
 *
 * @returns {Array} The array of all anchors with text that has the same content words as the keyphrase/synonyms.
 */
function getAnchorsWithSameTextAsTopic( anchors, topicForms, locale, customHelpers, exactMatchRequest, areHyphensWordBoundaries  ) {
	const matchWordCustomHelper = customHelpers.matchWordCustomHelper;
	const getWordsCustomHelper = customHelpers.getWordsCustomHelper;

	// Prepare keyphrase and synonym forms for comparison with anchors.
	const keyphraseAndSynonymsWords = [ flatten( topicForms.keyphraseForms ) ];
	const synonymsForms = topicForms.synonymsForms;
	synonymsForms.forEach( form => keyphraseAndSynonymsWords.push( flatten( form ) ) );

	// The variable that will save all the anchors with text that has the same content words as the keyphrase/synonyms.
	const anchorsContainedInTopic = [];

	anchors.forEach( function( currentAnchor ) {
		const currentAnchorText = currentAnchor.innerText();

		/*
        * For keyphrase matching, we want to split words on hyphens and en-dashes, except for languages where hyphens shouldn't
        * be treated as word boundaries. Currently, the latter only applies to Indonesian, where hyphens are used to create plural forms of nouns,
        * such as "buku-buku" being a plural form of "buku". We want to treat forms like "buku-buku" as one word, so we shouldn't
        * split words on hyphens in Indonesian.
        * For languages where hyphens are treated as word boundaries we pass a custom word boundary regex string to the getWords helper
        * that includes whitespaces, hyphens (u002d), and en-dashes (u2013). Otherwise, we pass a word boundary regex that only includes
        * whitespaces and en-dashes.
        */
		let anchorWords;
		if ( getWordsCustomHelper ) {
			anchorWords = uniq( getWordsCustomHelper( currentAnchorText ) );
		} else if ( areHyphensWordBoundaries ) {
			anchorWords = uniq( getWords( currentAnchorText, WORD_BOUNDARY_WITH_HYPHEN ) );
		} else {
			anchorWords = uniq( getWords( currentAnchorText, WORD_BOUNDARY_WITHOUT_HYPHEN ) );
		}

		/*
		 * Filter function words out of the anchor text.
		 * If the anchor text contains only function words, we keep them.
		 */
		const filteredAnchorWords = filterWordsFromArray( anchorWords, functionWords );
		if ( filteredAnchorWords.length > 0 ) {
			anchorWords = filteredAnchorWords;
		}

		exactMatchRequest.forEach( request => {
			/*
			 * Check a) if the exact match is requested for the keyphrase, and
			 * b) if every content word in the anchor text is included in the keyphrase or synonym.
			 */
			if ( request.exactMatchRequested &&
				anchorWords.every( anchorWord => request.keyphrase.includes( anchorWord ) ) ) {
				anchorsContainedInTopic.push( true );
			}
		} );

		// Check if every word in the anchor text is also present in the keyphrase/synonym.
		for ( let i = 0; i < keyphraseAndSynonymsWords.length; i++ ) {
			const topicForm =  keyphraseAndSynonymsWords[ i ];

			if ( anchorWords.every( anchorWord => matchTextWithArray( anchorWord, topicForm, locale, matchWordCustomHelper ).count > 0 ) ) {
				anchorsContainedInTopic.push( true );
				break;
			}
		}
	} );

	return anchors.filter( ( anchor, index ) => anchorsContainedInTopic[ index ] );
}

/**
 * Checks whether the content words of the anchor text are the same as the content words of the keyphrase or synonym.
 * Also includes different word forms if the morphology is available.
 *
 * @param {Paper}       paper       The paper to research.
 * @param {Researcher}  researcher  The researcher to use.
 *
 * @returns {Object} The amount of anchor texts whose content words are the same as the keyphrase or synonyms' content words.
 */
export default function( paper, researcher ) {
	functionWords = researcher.getConfig( "functionWords" );

	const areHyphensWordBoundaries = researcher.getConfig( "areHyphensWordBoundaries" );

	const result = {
		anchorsWithKeyphrase: [],
		anchorsWithKeyphraseCount: 0,
	};
	// STEP 1.
	// If the paper's text is empty, return empty result.
	if ( paper.getText() === "" ) {
		return result;
	}

	// STEP 2.
	const keyphrase = paper.getKeyword();
	/*
	 * If no keyphrase is set, return empty result.
	 * This is a conscious decision where we won't assess the paper if the keyphrase is not set.
	 * This includes a case where only the synonym is set but not the keyphrase.
	 */
	if ( keyphrase === "" ) {
		return result;
	}
	/*
	 * When the keyphrase is set, also retrieve the synonyms and save them in "topics" array.
	 * Eventually, the term topics here refers to either keyphrase or synonyms.
	 */
	const originalTopics = parseSynonyms( paper.getSynonyms() );
	originalTopics.push( keyphrase );

	// Retrieve the anchors.
	let anchors = paper.getTree().findAll( treeNode => treeNode.name === "a" );
	/*
	 * We get the site's URL (e.g., https://yoast.com) or domain (e.g., yoast.com) from the paper.
	 * In case of WordPress, the variable is a URL. In case of Shopify, it is a domain.
	 */
	const siteUrlOrDomain = paper.getPermalink();

	// STEP 3.
	// Get the anchors with urls that are not linking to the current site url/domain.
	anchors = getAnchorsLinkingToSelf( anchors, siteUrlOrDomain );
	// If all anchor urls are linking to the current site url/domain, return empty result.
	if ( anchors.length === 0 ) {
		return result;
	}

	const locale = paper.getLocale();
	const topicForms = researcher.getResearch( "morphology" );
	const customHelpers = {
		matchWordCustomHelper: researcher.getHelper( "matchWordCustomHelper" ),
		getWordsCustomHelper: researcher.getHelper( "getWordsCustomHelper" ),
	};

	// STEP 4.
	// Get the anchors with text that contains the keyphrase/synonyms' content words.
	anchors = getAnchorsContainingTopic( anchors, topicForms, locale, customHelpers.matchWordCustomHelper );
	// If all anchor texts do not contain the keyphrase/synonyms' content words, return empty result.
	if ( anchors.length === 0 ) {
		return result;
	}

	// STEP 5.
	// Check if exact match is requested for every topic (keyphrase or synonym).
	const isExactMatchRequested = originalTopics.map( originalTopic => processExactMatchRequest( originalTopic ) );
	// Get the anchors with text that has the same content words as the keyphrase/synonyms.
	anchors = getAnchorsWithSameTextAsTopic( anchors, topicForms, locale, customHelpers, isExactMatchRequested, areHyphensWordBoundaries );

	return {
		anchorsWithKeyphrase: anchors,
		anchorsWithKeyphraseCount: anchors.length,
	};
}

